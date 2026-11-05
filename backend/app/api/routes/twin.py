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
    evidence: Optional[str] = "Self-verified milestone completion"

@router.get("")
async def get_digital_twin(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {}

    skills = profile.get("skills", {})
    goals = profile.get("career_goals", [])

    # Calculate readiness across user's selected goals
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

    primary_goal = goals[0] if goals else None
    primary_career = get_career_by_id(primary_goal) if primary_goal else None
    primary_readiness = readiness_map.get(primary_goal, {}).get("score", 0.0) if primary_goal else 0.0

    # Missing skills for primary career if defined
    gaps_result = CareerSimulationEngine.calculate_skill_gaps(skills, primary_goal) if primary_career else {}

    simulations_count = len(await db.get_collection("simulations").find({"user_id": user_id}))

    return {
        "user_id": user_id,
        "name": profile.get("name") or current_user.get("name", "User"),
        "institution": profile.get("institution", ""),
        "academic_year": profile.get("academic_year", ""),
        "degree": profile.get("degree", ""),
        "skills": skills,
        "soft_skills": profile.get("soft_skills", []),
        "interests": profile.get("interests", []),
        "career_goals": goals,
        "primary_career": primary_career,
        "primary_readiness_score": primary_readiness,
        "readiness_by_career": readiness_map,
        "top_missing_skills": [g for g in gaps_result.get("skill_gaps", []) if g["gap"] > 0][:5],
        "projects": profile.get("projects", []),
        "certifications": profile.get("certifications", []),
        "evolution_history": profile.get("evolution_history", []),
        "simulations_count": simulations_count,
        "has_twin_configured": len(skills) > 0 or len(goals) > 0,
        "last_updated": profile.get("updated_at", profile.get("created_at", datetime.now(timezone.utc).isoformat()))
    }

@router.put("/update")
async def update_twin_progress(payload: TwinUpdatePayload, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Career profile not found. Please complete initial setup.")

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
        "details": f"Competency uplift: {', '.join([f'{k} (+{v})' for k, v in payload.skill_boosts.items()])}. Proof: {payload.evidence}",
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
        "message": "Digital Twin updated successfully with verified progress.",
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

    goals = profile.get("career_goals", [])
    primary_goal = goals[0] if goals else None
    career = get_career_by_id(primary_goal) if primary_goal else None
    current_readiness = 0.0
    if career and current_skills:
        r = CareerSimulationEngine.calculate_career_readiness(current_skills, career.get("required_skills", []))
        current_readiness = r["score"]

    return {
        "user_id": user_id,
        "name": profile.get("name") or current_user.get("name", "User"),
        "primary_career": career["title"] if career else "None configured",
        "current_readiness_score": current_readiness,
        "current_skills": current_skills,
        "evolution_timeline": history,
        "total_milestones_logged": len(history)
    }
