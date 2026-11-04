from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.simulation.engine import CareerSimulationEngine, load_careers_catalog, get_career_by_id
from app.api.deps import get_current_user
from app.core.database import db

router = APIRouter(prefix="/twin", tags=["Digital Career Twin"])

class TwinUpdatePayload(BaseModel):
    task_title: str
    skill_boosts: Dict[str, float]
    evidence: Optional[str] = "Student self-verification with project link / repository"

@router.get("")
async def get_digital_twin(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {}

    skills = profile.get("skills", {})
    goals = profile.get("career_goals", ["ai-ml-engineer", "cybersecurity-engineer"])

    # Calculate readiness across goals
    readiness_map = {}
    for gid in goals:
        career = get_career_by_id(gid)
        if career:
            res = CareerSimulationEngine.calculate_career_readiness(skills, career.get("required_skills", []))
            readiness_map[gid] = {
                "career_title": career["title"],
                "score": res["score"],
                "category": career.get("category", "")
            }

    primary_goal = goals[0] if goals else "ai-ml-engineer"
    primary_career = get_career_by_id(primary_goal)
    primary_readiness = readiness_map.get(primary_goal, {}).get("score", 0.0)

    # Missing skills for primary career
    gaps_result = CareerSimulationEngine.calculate_skill_gaps(skills, primary_goal) if primary_career else {}

    return {
        "user_id": user_id,
        "name": profile.get("name", current_user.get("name", "Student")),
        "institution": profile.get("institution", "National Institute of Engineering"),
        "academic_year": profile.get("academic_year", "Second year"),
        "degree": profile.get("degree", "B.Tech Computer Science & Engineering"),
        "skills": skills,
        "soft_skills": profile.get("soft_skills", []),
        "interests": profile.get("interests", []),
        "career_goals": goals,
        "primary_career": primary_career,
        "primary_readiness_score": primary_readiness,
        "readiness_by_career": readiness_map,
        "top_missing_skills": [g for g in gaps_result.get("skill_gaps", []) if g["gap"] > 0][:4],
        "projects": profile.get("projects", []),
        "certifications": profile.get("certifications", []),
        "evolution_history": profile.get("evolution_history", []),
        "simulations_count": len(await db.get_collection("simulations").find({"user_id": user_id})),
        "last_updated": profile.get("updated_at", datetime.now(timezone.utc).isoformat())
    }

@router.put("/update")
async def update_twin_progress(payload: TwinUpdatePayload, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    skills = dict(profile.get("skills", {}))
    improvements = {}

    for s, boost in payload.skill_boosts.items():
        old = float(skills.get(s, 0.0))
        new_val = min(5.0, round(old + boost, 1))
        skills[s] = new_val
        improvements[s] = {"previous": old, "current": new_val, "boost": boost}

    evolution_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": payload.task_title,
        "details": f"Verified skill boost: {', '.join([f'{k}: +{v}' for k, v in payload.skill_boosts.items()])}. Evidence: {payload.evidence}",
        "improvements": improvements
    }

    await profiles_col.update_one(
        {"user_id": user_id},
        {
            "$set": {"skills": skills, "updated_at": datetime.now(timezone.utc).isoformat()},
            "$push": {"evolution_history": evolution_entry}
        }
    )

    return {
        "message": "Digital Twin successfully evolved with verified progress.",
        "updated_skills": skills,
        "evolution_entry": evolution_entry
    }

@router.get("/evolution")
async def get_twin_evolution(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {}

    current_skills = profile.get("skills", {})
    history = profile.get("evolution_history", [])

    # Calculate baseline vs current readiness
    primary_goal = profile.get("career_goals", ["ai-ml-engineer"])[0]
    career = get_career_by_id(primary_goal)
    current_readiness = 0.0
    if career:
        r = CareerSimulationEngine.calculate_career_readiness(current_skills, career.get("required_skills", []))
        current_readiness = r["score"]

    return {
        "user_id": user_id,
        "name": profile.get("name"),
        "primary_career": career["title"] if career else primary_goal,
        "current_readiness_score": current_readiness,
        "current_skills": current_skills,
        "evolution_timeline": history,
        "total_milestones_logged": len(history)
    }
