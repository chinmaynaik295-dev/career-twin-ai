from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from app.simulation.engine import load_careers_catalog, get_career_by_id, CareerSimulationEngine
from app.api.deps import get_current_user
from app.core.database import db

router = APIRouter(tags=["Careers"])

class CareerAnalyzeRequest(BaseModel):
    career_id: str

class CareerCompareRequest(BaseModel):
    career_id_1: str
    career_id_2: str

@router.get("/careers")
async def list_careers():
    """Returns the 6 comprehensive career tracks."""
    return load_careers_catalog()

@router.get("/careers/{career_id}")
async def get_career_detail(career_id: str):
    career = get_career_by_id(career_id)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")
    return career

@router.post("/career/analyze")
async def analyze_career_gap(payload: CareerAnalyzeRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {}
    skills = profile.get("skills", {})

    career = get_career_by_id(payload.career_id)
    if not career:
        raise HTTPException(status_code=404, detail=f"Career '{payload.career_id}' not found.")

    analysis = CareerSimulationEngine.calculate_skill_gaps(skills, payload.career_id)
    return analysis

@router.post("/career/compare")
async def compare_careers(payload: CareerCompareRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {}
    skills = profile.get("skills", {})

    c1 = get_career_by_id(payload.career_id_1)
    c2 = get_career_by_id(payload.career_id_2)

    if not c1 or not c2:
        raise HTTPException(status_code=404, detail="One or both career paths not found.")

    r1 = CareerSimulationEngine.calculate_career_readiness(skills, c1.get("required_skills", []))
    r2 = CareerSimulationEngine.calculate_career_readiness(skills, c2.get("required_skills", []))

    gaps1 = CareerSimulationEngine.calculate_skill_gaps(skills, payload.career_id_1)
    gaps2 = CareerSimulationEngine.calculate_skill_gaps(skills, payload.career_id_2)

    return {
        "career_1": {
            "career": c1,
            "readiness_score": r1["score"],
            "skill_gaps": gaps1["skill_gaps"],
            "missing_count": gaps1["missing_skills_count"]
        },
        "career_2": {
            "career": c2,
            "readiness_score": r2["score"],
            "skill_gaps": gaps2["skill_gaps"],
            "missing_count": gaps2["missing_skills_count"]
        },
        "higher_readiness_career": c1["title"] if r1["score"] >= r2["score"] else c2["title"],
        "score_difference": round(abs(r1["score"] - r2["score"]), 1)
    }
