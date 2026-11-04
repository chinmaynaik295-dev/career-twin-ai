import pytest
from app.simulation.engine import CareerSimulationEngine, load_careers_catalog, get_career_by_id

def test_load_careers_catalog():
    careers = load_careers_catalog()
    assert len(careers) == 6
    career_ids = [c["id"] for c in careers]
    assert "ai-ml-engineer" in career_ids
    assert "cybersecurity-engineer" in career_ids
    assert "data-scientist" in career_ids
    assert "software-developer" in career_ids
    assert "cloud-engineer" in career_ids
    assert "data-engineer" in career_ids

def test_calculate_career_readiness_formula():
    """
    Tests exact transparent weighted formula:
    Readiness Score = (Sum of user skill proficiency * skill importance) / (Sum of required skill importance) * 20
    """
    required_skills = [
        {"name": "Python", "importance": 5, "min_proficiency": 2, "target_proficiency": 5},
        {"name": "SQL", "importance": 3, "min_proficiency": 2, "target_proficiency": 4}
    ]
    # If user has Python=5, SQL=5:
    # (5*5 + 5*3) / (5 + 3) * 20 = (25 + 15)/8 * 20 = 40/8 * 20 = 5 * 20 = 100.0%
    perfect_user = {"Python": 5.0, "SQL": 5.0}
    res = CareerSimulationEngine.calculate_career_readiness(perfect_user, required_skills)
    assert res["score"] == 100.0

    # If user has Python=2.5, SQL=2.5: (2.5*8)/8 * 20 = 50.0%
    half_user = {"Python": 2.5, "SQL": 2.5}
    res_half = CareerSimulationEngine.calculate_career_readiness(half_user, required_skills)
    assert res_half["score"] == 50.0

    # If user has no skills: 0.0%
    zero_user = {}
    res_zero = CareerSimulationEngine.calculate_career_readiness(zero_user, required_skills)
    assert res_zero["score"] == 0.0

def test_alex_demo_readiness():
    alex_skills = {
        "Python": 3, "C": 3, "Mathematics": 3, "SQL": 1,
        "Machine Learning": 1, "Linux": 1, "Networking": 1, "Problem Solving": 3
    }
    ai_career = get_career_by_id("ai-ml-engineer")
    assert ai_career is not None
    res = CareerSimulationEngine.calculate_career_readiness(alex_skills, ai_career["required_skills"])
    # Alex has some skills in Python, Math, ML, SQL, Problem Solving -> readiness score should be realistic (~35% to 65%)
    assert 30.0 <= res["score"] <= 70.0

def test_calculate_skill_gaps():
    user_skills = {"Python": 3, "Mathematics": 3}
    gaps = CareerSimulationEngine.calculate_skill_gaps(user_skills, "ai-ml-engineer")
    assert gaps["career_id"] == "ai-ml-engineer"
    assert len(gaps["skill_gaps"]) > 0
    # Machine Learning is missing in user_skills, so it must be in missing_skills
    ml_gap = next((g for g in gaps["skill_gaps"] if g["skill"] == "Machine Learning"), None)
    assert ml_gap is not None
    assert ml_gap["user_level"] == 0.0
    assert ml_gap["priority"] == "High"

def test_simulate_career_path():
    alex_skills = {"Python": 3, "Machine Learning": 1, "SQL": 1}
    learning_actions = [
        {"skill_name": "Machine Learning", "added_proficiency": 2.0},
        {"skill_name": "SQL", "added_proficiency": 2.0}
    ]
    sim = CareerSimulationEngine.simulate_career_path(
        alex_skills,
        "ai-ml-engineer",
        learning_actions,
        scenario_name="Scenario A"
    )
    assert sim["readiness_delta"] > 0
    assert sim["simulated_readiness_score"] > sim["initial_readiness_score"]
    assert sim["is_hypothetical"] is True

def test_compare_career_scenarios():
    alex_skills = {"Python": 3, "Linux": 1, "Networking": 1}
    scenarios = [
        {"name": "Scenario A: AI Path", "actions": [{"skill_name": "Machine Learning", "added_proficiency": 3.0}]},
        {"name": "Scenario B: Cyber Path", "actions": [{"skill_name": "Networking", "added_proficiency": 3.0}]}
    ]
    comparison = CareerSimulationEngine.compare_career_scenarios(alex_skills, "ai-ml-engineer", scenarios)
    assert len(comparison["scenarios"]) == 2
    assert comparison["highest_readiness_scenario"] == "Scenario A: AI Path"
