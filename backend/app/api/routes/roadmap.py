from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from app.schemas.models import RoadmapGenerateRequest, TaskUpdateStatus
from app.agents.tools import AgentToolsRegistry
from app.api.deps import get_current_user
from app.core.database import db

router = APIRouter(prefix="/roadmap", tags=["Personalized Learning Roadmap"])

@router.post("/generate")
async def generate_roadmap(payload: RoadmapGenerateRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {}
    skills = profile.get("skills", {})

    roadmap_data = AgentToolsRegistry.generate_learning_roadmap(
        user_skills=skills,
        career_id=payload.career_id,
        target_weeks=payload.target_weeks,
        weekly_hours=payload.weekly_hours
    )

    doc = {
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "active",
        **roadmap_data
    }

    roadmaps_col = db.get_collection("roadmaps")
    # Replace previous active roadmap for this user
    await roadmaps_col.delete_one({"user_id": user_id, "status": "active"})
    res = await roadmaps_col.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    return doc

@router.get("/current")
async def get_current_roadmap(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    roadmaps_col = db.get_collection("roadmaps")
    roadmap = await roadmaps_col.find_one({"user_id": user_id, "status": "active"})
    if not roadmap:
        return {
            "has_active_roadmap": False,
            "roadmap": None
        }

    roadmap["id"] = str(roadmap.get("_id", ""))
    roadmap["has_active_roadmap"] = True
    return roadmap

@router.put("/task/{task_id}")
async def update_task_status(task_id: str, payload: TaskUpdateStatus, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    roadmaps_col = db.get_collection("roadmaps")
    roadmap = await roadmaps_col.find_one({"user_id": user_id, "status": "active"})
    if not roadmap:
        raise HTTPException(status_code=404, detail="No active roadmap found.")

    milestones = roadmap.get("milestones", [])
    found_task = None
    target_skill = None

    for m in milestones:
        for t in m.get("tasks", []):
            if t["id"] == task_id:
                t["completed"] = payload.completed
                found_task = t
                target_skill = m.get("focus_skill")
                break
        if found_task:
            m["is_completed"] = all(t.get("completed", False) for t in m.get("tasks", []))
            break

    if not found_task:
        raise HTTPException(status_code=404, detail="Task not found in active roadmap.")

    total_tasks = sum(len(m.get("tasks", [])) for m in milestones)
    completed_tasks = sum(sum(1 for t in m.get("tasks", []) if t.get("completed", False)) for m in milestones)
    progress_pct = round((completed_tasks / max(1, total_tasks)) * 100, 1)

    roadmap["progress_percentage"] = progress_pct
    await roadmaps_col.update_one(
        {"_id": roadmap["_id"]},
        {"$set": {"milestones": milestones, "progress_percentage": progress_pct}}
    )

    # When user marks task as completed with verified evidence, update digital twin
    if payload.completed and target_skill:
        profiles_col = db.get_collection("career_profiles")
        profile = await profiles_col.find_one({"user_id": user_id}) or {}
        current_skills = profile.get("skills", {})
        
        boost = 0.3
        new_val = min(5.0, round(current_skills.get(target_skill, 0.0) + boost, 1))
        current_skills[target_skill] = new_val

        evolution_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event": f"Milestone Task Completed: {found_task['description']}",
            "details": f"Proficiency in {target_skill} increased to {new_val}/5 (+{boost}). Evidence: {payload.evidence or 'Self-verified'}"
        }

        await profiles_col.update_one(
            {"user_id": user_id},
            {
                "$set": {"skills": current_skills},
                "$push": {"evolution_history": evolution_entry}
            }
        )

    return {
        "message": "Task updated successfully.",
        "progress_percentage": progress_pct,
        "task": found_task
    }
