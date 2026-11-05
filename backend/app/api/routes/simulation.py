from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
from app.schemas.models import SimulationRunRequest, SimulationCompareRequest
from app.simulation.engine import CareerSimulationEngine, get_career_by_id
from app.api.deps import get_current_user
from app.core.database import db

router = APIRouter(prefix="/simulation", tags=["Career Simulation Lab"])

@router.post("/run")
async def run_simulation(payload: SimulationRunRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {}
    skills = profile.get("skills", {})

    actions_dicts = [a.model_dump() for a in payload.learning_actions]
    result = CareerSimulationEngine.simulate_career_path(
        user_skills=skills,
        career_id=payload.career_id,
        learning_actions=actions_dicts,
        scenario_name=payload.scenario_name
    )

    # Save to simulations collection
    sim_doc = {
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        **result
    }
    simulations_col = db.get_collection("simulations")
    insert_res = await simulations_col.insert_one(sim_doc)
    result["id"] = str(insert_res.inserted_id)

    return result

@router.post("/compare")
async def compare_scenarios(payload: SimulationCompareRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {}
    skills = profile.get("skills", {})

    scenarios_dicts = []
    for sc in payload.scenarios:
        scenarios_dicts.append({
            "name": sc.name,
            "actions": [a.model_dump() for a in sc.actions]
        })

    comparison = CareerSimulationEngine.compare_career_scenarios(
        user_skills=skills,
        career_id=payload.career_id,
        scenarios=scenarios_dicts
    )
    return comparison

@router.get("/history")
async def get_simulation_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    simulations_col = db.get_collection("simulations")
    items = await simulations_col.find({"user_id": user_id}, sort=[("created_at", -1)])
    for item in items:
        item["id"] = str(item.get("_id", ""))
    return items

@router.get("/{simulation_id}")
async def get_simulation_by_id(simulation_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    simulations_col = db.get_collection("simulations")
    item = await simulations_col.find_one({"_id": simulation_id, "user_id": user_id})
    if not item:
        raise HTTPException(status_code=404, detail="Simulation record not found.")
    item["id"] = str(item.get("_id", ""))
    return item

