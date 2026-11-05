import pytest
from app.agents.tools import AgentToolsRegistry

def test_all_eight_agent_tools():
    user_skills = {"Python": 3.0, "Mathematics": 3.0, "Problem Solving": 3.0}
    user_profile = {
        "name": "Alex",
        "academic_year": "Second year",
        "institution": "National Institute of Engineering",
        "skills": user_skills,
        "interests": ["Artificial Intelligence", "Cybersecurity"],
        "career_goals": ["ai-ml-engineer", "cybersecurity-engineer"],
        "projects": []
    }

    # Tool 1: analyze_user_profile
    t1 = AgentToolsRegistry.analyze_user_profile(user_profile)
    assert t1["name"] == "Alex"
    assert len(t1["career_compatibilities"]) == 6

    # Tool 2: calculate_skill_gaps
    t2 = AgentToolsRegistry.calculate_skill_gaps(user_skills, "ai-ml-engineer")
    assert "skill_gaps" in t2
    assert t2["readiness_score"] > 0

    # Tool 3: calculate_career_readiness
    t3 = AgentToolsRegistry.calculate_career_readiness(user_skills, "cybersecurity-engineer")
    assert "readiness_score" in t3

    # Tool 4: simulate_career_path
    t4 = AgentToolsRegistry.simulate_career_path(
        user_skills,
        "ai-ml-engineer",
        [{"skill_name": "Machine Learning", "added_proficiency": 2.0}]
    )
    assert t4["readiness_delta"] > 0

    # Tool 5: compare_career_scenarios
    t5 = AgentToolsRegistry.compare_career_scenarios(
        user_skills,
        "ai-ml-engineer",
        [
            {"name": "Path A", "actions": [{"skill_name": "Python", "added_proficiency": 1.0}]},
            {"name": "Path B", "actions": [{"skill_name": "Machine Learning", "added_proficiency": 2.0}]}
        ]
    )
    assert len(t5["scenarios"]) == 2

    # Tool 6: generate_learning_roadmap
    t6 = AgentToolsRegistry.generate_learning_roadmap(user_skills, "ai-ml-engineer", target_weeks=8)
    assert len(t6["milestones"]) > 0
    assert t6["projected_readiness"] >= t6["initial_readiness"]

    # Tool 7: update_digital_twin
    t7 = AgentToolsRegistry.update_digital_twin(
        user_profile,
        completed_task={"title": "Completed PyTorch tutorial"},
        skill_boosts={"Deep Learning & PyTorch": 1.5}
    )
    assert t7["success"] is True
    assert "Deep Learning & PyTorch" in t7["updated_skills"]

    # Tool 8: recommend_projects
    t8 = AgentToolsRegistry.recommend_projects(user_skills, "ai-ml-engineer")
    assert len(t8["recommended_projects"]) > 0

