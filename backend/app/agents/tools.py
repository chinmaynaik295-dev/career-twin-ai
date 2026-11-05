from typing import Dict, Any, List, Optional
import json
from app.simulation.engine import CareerSimulationEngine, load_careers_catalog, get_career_by_id

class AgentToolsRegistry:
    """
    Implements the 8 core agentic tools for CareerTwin AI.
    All calculations are deterministic and explainable.
    """

    @staticmethod
    def analyze_user_profile(user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Tool 1: analyze_user_profile
        Deeply inspects user education, interests, skills, projects, and career goals.
        """
        skills = user_profile.get("skills", {})
        interests = user_profile.get("interests", [])
        career_goals = user_profile.get("career_goals", [])
        projects = user_profile.get("projects", [])
        education = user_profile.get("education", {})

        top_skills = sorted(skills.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Calculate compatibility against all 6 career tracks
        careers = load_careers_catalog()
        career_matches = []
        for c in careers:
            readiness = CareerSimulationEngine.calculate_career_readiness(skills, c.get("required_skills", []))
            career_matches.append({
                "career_id": c["id"],
                "career_title": c["title"],
                "readiness_score": readiness["score"],
                "category": c["category"]
            })
        career_matches.sort(key=lambda x: x["readiness_score"], reverse=True)

        return {
            "name": user_profile.get("name", "Student"),
            "academic_year": user_profile.get("academic_year", "Not specified"),
            "institution": user_profile.get("institution", "Not specified"),
            "education": education,
            "total_skills_logged": len(skills),
            "top_strengths": [{"skill": s[0], "proficiency": s[1]} for s in top_skills],
            "interests": interests,
            "target_career_goals": career_goals,
            "completed_projects_count": len(projects),
            "career_compatibilities": career_matches,
            "top_matching_career": career_matches[0] if career_matches else None
        }

    @staticmethod
    def calculate_skill_gaps(user_skills: Dict[str, float | int], career_id: str) -> Dict[str, Any]:
        """
        Tool 2: calculate_skill_gaps
        Compares current proficiency with career requirements.
        """
        return CareerSimulationEngine.calculate_skill_gaps(user_skills, career_id)

    @staticmethod
    def calculate_career_readiness(user_skills: Dict[str, float | int], career_id: str) -> Dict[str, Any]:
        """
        Tool 3: calculate_career_readiness
        Calculates a transparent readiness score using weighted importance.
        """
        career = get_career_by_id(career_id)
        if not career:
            return {"error": f"Career {career_id} not found"}
        
        res = CareerSimulationEngine.calculate_career_readiness(user_skills, career.get("required_skills", []))
        return {
            "career_id": career_id,
            "career_title": career["title"],
            "readiness_score": res["score"],
            "weighted_points_earned": res["weighted_achieved"],
            "total_weight": res["total_importance"]
        }

    @staticmethod
    def simulate_career_path(
        user_skills: Dict[str, float | int],
        career_id: str,
        learning_actions: List[Dict[str, Any]],
        scenario_name: str = "Simulated Scenario"
    ) -> Dict[str, Any]:
        """
        Tool 4: simulate_career_path
        Runs hypothetical career-development scenarios and projects readiness uplift.
        """
        return CareerSimulationEngine.simulate_career_path(user_skills, career_id, learning_actions, scenario_name)

    @staticmethod
    def compare_career_scenarios(
        user_skills: Dict[str, float | int],
        career_id: str,
        scenarios: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Tool 5: compare_career_scenarios
        Compares alternative learning decisions side-by-side.
        """
        return CareerSimulationEngine.compare_career_scenarios(user_skills, career_id, scenarios)

    @staticmethod
    def generate_learning_roadmap(
        user_skills: Dict[str, float | int],
        career_id: str,
        target_weeks: int = 8,
        weekly_hours: int = 10
    ) -> Dict[str, Any]:
        """
        Tool 6: generate_learning_roadmap
        Generates an adaptive, week-by-week learning roadmap prioritizing high-gap competencies.
        """
        gaps_result = CareerSimulationEngine.calculate_skill_gaps(user_skills, career_id)
        career = get_career_by_id(career_id)

        # Filter skills that have gaps > 0
        skills_to_learn = [g for g in gaps_result["skill_gaps"] if g["gap"] > 0]
        
        weekly_milestones = []
        milestone_count = min(target_weeks, max(4, len(skills_to_learn) * 2))
        
        for w in range(1, milestone_count + 1):
            if skills_to_learn:
                # Distribute skill targets across milestones
                focus_idx = (w - 1) % len(skills_to_learn)
                focus_skill = skills_to_learn[focus_idx]
                skill_name = focus_skill["skill"]
                current_val = focus_skill["user_level"]
                target_val = focus_skill["target_level"]
                
                title = f"Week {w}: Master Foundations & Practical Applications of {skill_name}"
                tasks = [
                    {"id": f"w{w}_t1", "description": f"Study core architecture & best practices for {skill_name}", "completed": False, "hours": 4},
                    {"id": f"w{w}_t2", "description": f"Complete hands-on coding exercises targeting level {min(5.0, current_val + 1.0)}", "completed": False, "hours": 3},
                    {"id": f"w{w}_t3", "description": f"Integrate {skill_name} into mini-project module", "completed": False, "hours": 3}
                ]
            else:
                title = f"Week {w}: Capstone Optimization & Production Readiness"
                tasks = [
                    {"id": f"w{w}_t1", "description": "Write automated unit and integration tests", "completed": False, "hours": 4},
                    {"id": f"w{w}_t2", "description": "Benchmark throughput, security posture, and documentation", "completed": False, "hours": 4}
                ]
            
            weekly_milestones.append({
                "week_number": w,
                "title": title,
                "focus_skill": skills_to_learn[focus_idx]["skill"] if skills_to_learn else "Capstone Integration",
                "estimated_hours": weekly_hours,
                "tasks": tasks,
                "is_completed": False
            })

        return {
            "career_id": career_id,
            "career_title": career["title"] if career else career_id,
            "target_weeks": milestone_count,
            "total_estimated_hours": milestone_count * weekly_hours,
            "initial_readiness": gaps_result["readiness_score"],
            "projected_readiness": min(100.0, gaps_result["readiness_score"] + min(40.0, len(skills_to_learn) * 8.5)),
            "milestones": weekly_milestones
        }

    @staticmethod
    def update_digital_twin(
        current_profile: Dict[str, Any],
        completed_task: Dict[str, Any],
        skill_boosts: Dict[str, float]
    ) -> Dict[str, Any]:
        """
        Tool 7: update_digital_twin
        Updates the digital twin only after user-confirmed verified milestone progress.
        """
        skills = dict(current_profile.get("skills", {}))
        evolution_log = list(current_profile.get("evolution_history", []))

        updated_skills = {}
        for skill, boost in skill_boosts.items():
            prev = float(skills.get(skill, 0.0))
            new_val = min(5.0, round(prev + boost, 1))
            skills[skill] = new_val
            updated_skills[skill] = {"before": prev, "after": new_val, "boost": boost}

        evolution_entry = {
            "timestamp": "now",
            "task_title": completed_task.get("title", "Milestone Completed"),
            "skills_improved": updated_skills,
            "evidence": completed_task.get("evidence", "Verified self-completion with proof"),
        }
        evolution_log.append(evolution_entry)

        # Recalculate primary career readiness
        primary_goal = current_profile.get("career_goals", ["ai-ml-engineer"])[0]
        career = get_career_by_id(primary_goal) or get_career_by_id("ai-ml-engineer")
        new_readiness = CareerSimulationEngine.calculate_career_readiness(
            skills, career.get("required_skills", []) if career else []
        )

        return {
            "success": True,
            "updated_skills": skills,
            "new_readiness_score": new_readiness["score"],
            "evolution_entry": evolution_entry,
            "total_milestones_logged": len(evolution_log)
        }

    @staticmethod
    def recommend_projects(user_skills: Dict[str, float | int], career_id: str) -> Dict[str, Any]:
        """
        Tool 8: recommend_projects
        Suggests practical projects specifically tailored to bridge current skill gaps.
        """
        career = get_career_by_id(career_id)
        if not career:
            return {"error": f"Career '{career_id}' not found"}

        gaps = CareerSimulationEngine.calculate_skill_gaps(user_skills, career_id)
        high_gaps = {g["skill"].lower() for g in gaps["skill_gaps"] if g["gap"] > 0}

        recommended = []
        for proj in career.get("recommended_projects", []):
            matching_gap_skills = [s for s in proj.get("skills_targeted", []) if s.lower() in high_gaps]
            relevance_score = len(matching_gap_skills) * 2 + (1 if proj["difficulty"] == "Intermediate" else 2)
            
            recommended.append({
                "project_id": proj.get("id"),
                "title": proj.get("title"),
                "description": proj.get("description"),
                "difficulty": proj.get("difficulty"),
                "estimated_hours": proj.get("estimated_hours"),
                "skills_targeted": proj.get("skills_targeted"),
                "relevance_score": relevance_score,
                "addresses_gaps": matching_gap_skills
            })

        recommended.sort(key=lambda x: x["relevance_score"], reverse=True)
        return {
            "career_id": career_id,
            "career_title": career["title"],
            "recommended_projects": recommended
        }


# Tool Definitions for LLM Function Calling Schema
AGENT_TOOLS_SCHEMA = [
    {
        "name": "analyze_user_profile",
        "description": "Analyzes the user's digital career twin, education, strengths, and returns match scores across all careers.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    },
    {
        "name": "calculate_skill_gaps",
        "description": "Compares user's current proficiencies with target career requirements to compute gaps and priorities.",
        "parameters": {
            "type": "object",
            "properties": {
                "career_id": {
                    "type": "string",
                    "description": "Career ID (e.g., 'ai-ml-engineer', 'cybersecurity-engineer', 'data-scientist', 'software-developer', 'cloud-engineer', 'data-engineer')"
                }
            },
            "required": ["career_id"]
        }
    },
    {
        "name": "calculate_career_readiness",
        "description": "Calculates the exact weighted career readiness score (0-100%) for a target career.",
        "parameters": {
            "type": "object",
            "properties": {
                "career_id": {
                    "type": "string",
                    "description": "Career ID to calculate readiness for."
                }
            },
            "required": ["career_id"]
        }
    },
    {
        "name": "simulate_career_path",
        "description": "Runs a hypothetical What-If simulation when learning new skills or boosting proficiencies.",
        "parameters": {
            "type": "object",
            "properties": {
                "career_id": {"type": "string", "description": "Target career ID"},
                "learning_actions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "skill_name": {"type": "string"},
                            "added_proficiency": {"type": "number"}
                        },
                        "required": ["skill_name", "added_proficiency"]
                    },
                    "description": "List of skills and proficiency points added"
                },
                "scenario_name": {"type": "string", "description": "Name of the scenario"}
            },
            "required": ["career_id", "learning_actions"]
        }
    },
    {
        "name": "compare_career_scenarios",
        "description": "Compares multiple hypothetical learning scenarios side-by-side (e.g. learning Python/ML vs Linux/Cyber).",
        "parameters": {
            "type": "object",
            "properties": {
                "career_id": {"type": "string", "description": "Target career ID"},
                "scenarios": {
                    "type": "array",
                    "description": "List of scenarios each with name and actions",
                    "items": {"type": "object"}
                }
            },
            "required": ["career_id", "scenarios"]
        }
    },
    {
        "name": "generate_learning_roadmap",
        "description": "Generates a structured week-by-week learning roadmap targeting skill gaps.",
        "parameters": {
            "type": "object",
            "properties": {
                "career_id": {"type": "string", "description": "Target career ID"},
                "target_weeks": {"type": "integer", "description": "Roadmap duration in weeks (default 8)"}
            },
            "required": ["career_id"]
        }
    },
    {
        "name": "update_digital_twin",
        "description": "Updates the digital career twin after a user completes a milestone or provides evidence.",
        "parameters": {
            "type": "object",
            "properties": {
                "task_title": {"type": "string", "description": "Milestone title"},
                "skill_boosts": {"type": "object", "description": "Map of skill name to boosted proficiency"}
            },
            "required": ["task_title", "skill_boosts"]
        }
    },
    {
        "name": "recommend_projects",
        "description": "Recommends practical portfolio projects targeting the user's specific skill gaps.",
        "parameters": {
            "type": "object",
            "properties": {
                "career_id": {"type": "string", "description": "Target career ID"}
            },
            "required": ["career_id"]
        }
    }
]

