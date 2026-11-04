from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone
from app.core.database import db
from app.schemas.models import ProfileCreate, ProfileUpdate
from app.api.deps import get_current_user
from app.simulation.engine import CareerSimulationEngine, load_careers_catalog, get_career_by_id

router = APIRouter(prefix="/profile", tags=["Profile & Digital Twin"])

@router.get("/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id})
    if not profile:
        # Generate default profile for this user
        profile = {
            "user_id": user_id,
            "name": current_user.get("name", "Student"),
            "institution": "University of Engineering",
            "academic_year": "Second year",
            "degree": "B.Tech Computer Science",
            "skills": {"Python": 3, "Problem Solving": 3},
            "soft_skills": ["Problem Solving"],
            "interests": ["Artificial Intelligence"],
            "career_goals": ["ai-ml-engineer"],
            "projects": [],
            "certifications": [],
            "evolution_history": []
        }
        await profiles_col.insert_one(profile)

    # Compute live career readiness metrics across goals
    skills = profile.get("skills", {})
    goals = profile.get("career_goals", ["ai-ml-engineer"])
    readiness_by_career = {}
    for gid in goals:
        career = get_career_by_id(gid)
        if career:
            res = CareerSimulationEngine.calculate_career_readiness(skills, career.get("required_skills", []))
            readiness_by_career[gid] = res["score"]

    profile["readiness_by_career"] = readiness_by_career
    profile["primary_readiness_score"] = readiness_by_career.get(goals[0], 0.0) if goals else 0.0
    return profile

@router.post("")
async def create_or_replace_profile(payload: ProfileCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    
    doc = {
        "user_id": user_id,
        "name": payload.name,
        "institution": payload.institution,
        "academic_year": payload.academic_year,
        "degree": payload.degree,
        "skills": payload.skills,
        "soft_skills": payload.soft_skills,
        "interests": payload.interests,
        "career_goals": payload.career_goals,
        "projects": payload.projects,
        "certifications": payload.certifications,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "evolution_history": [
            {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "event": "Onboarding Complete — Twin Initialized",
                "details": f"Twin initialized with {len(payload.skills)} skills and {len(payload.career_goals)} career goals."
            }
        ]
    }
    await profiles_col.update_one({"user_id": user_id}, {"$set": doc}, upsert=True)
    return {"message": "Digital Twin created successfully.", "profile": doc}

@router.put("/me")
async def update_profile(payload: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await profiles_col.update_one({"user_id": user_id}, {"$set": update_data})
    updated = await profiles_col.find_one({"user_id": user_id})
    return {"message": "Profile updated successfully.", "profile": updated}
