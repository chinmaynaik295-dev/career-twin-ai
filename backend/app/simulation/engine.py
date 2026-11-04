from typing import Dict, List, Any, Optional
import json
from pathlib import Path

CAREERS_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "careers_data.json"

def load_careers_catalog() -> List[Dict[str, Any]]:
    """Loads structured career paths from the JSON dataset."""
    if CAREERS_DATA_PATH.exists():
        with open(CAREERS_DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def get_career_by_id(career_id: str) -> Optional[Dict[str, Any]]:
    careers = load_careers_catalog()
    for c in careers:
        if c["id"] == career_id:
            return c
    return None

class CareerSimulationEngine:
    """
    Deterministic Career Simulation Engine.
    Implements transparent mathematical evaluation without arbitrary black-box claims.
    """

    @staticmethod
    def calculate_career_readiness(
        user_skills: Dict[str, float | int],
        career_required_skills: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Calculates career readiness score using the transparent formula:
        Readiness Score = (Sum of user skill proficiency * skill importance) / (Sum of required skill importance) * 20
        Scale: 0 - 100%
        """
        if not career_required_skills:
            return {"score": 0.0, "total_weight": 0, "achieved_weight": 0.0}

        weighted_achieved_sum = 0.0
        total_importance_sum = 0.0

        skill_breakdown = []

        # Normalize skill keys to case-insensitive lookup
        normalized_user_skills = {k.strip().lower(): float(v) for k, v in user_skills.items()}

        for req in career_required_skills:
            skill_name = req["name"]
            importance = float(req.get("importance", 3))
            target_prof = float(req.get("target_proficiency", 4))
            min_prof = float(req.get("min_proficiency", 2))

            # Retrieve user level (0 to 5)
            user_prof = min(5.0, max(0.0, normalized_user_skills.get(skill_name.strip().lower(), 0.0)))
            
            weighted_achieved_sum += user_prof * importance
            total_importance_sum += importance

            skill_breakdown.append({
                "skill": skill_name,
                "category": req.get("category", "technical"),
                "importance": importance,
                "user_proficiency": user_prof,
                "target_proficiency": target_prof,
                "min_proficiency": min_prof,
                "meets_minimum": user_prof >= min_prof,
                "meets_target": user_prof >= target_prof,
            })

        if total_importance_sum > 0:
            raw_score = (weighted_achieved_sum / total_importance_sum) * 20.0
            score = round(min(100.0, max(0.0, raw_score)), 1)
        else:
            score = 0.0

        return {
            "score": score,
            "weighted_achieved": round(weighted_achieved_sum, 2),
            "total_importance": round(total_importance_sum, 2),
            "skill_breakdown": skill_breakdown
        }

    @staticmethod
    def calculate_skill_gaps(
        user_skills: Dict[str, float | int],
        career_id: str
    ) -> Dict[str, Any]:
        """Compares user's current proficiencies against target career competencies."""
        career = get_career_by_id(career_id)
        if not career:
            raise ValueError(f"Career with id '{career_id}' not found.")

        normalized_user = {k.strip().lower(): float(v) for k, v in user_skills.items()}
        required = career.get("required_skills", [])

        existing_skills = []
        missing_skills = []
        gaps = []

        for req in required:
            name = req["name"]
            user_level = normalized_user.get(name.strip().lower(), 0.0)
            target_level = float(req.get("target_proficiency", 4))
            min_level = float(req.get("min_proficiency", 2))
            importance = int(req.get("importance", 3))
            
            gap_size = max(0.0, target_level - user_level)

            if gap_size >= 2.0 and importance >= 4:
                priority = "High"
            elif gap_size > 0.0:
                priority = "Medium"
            else:
                priority = "Low"

            gap_item = {
                "skill": name,
                "category": req.get("category", "technical"),
                "user_level": user_level,
                "target_level": target_level,
                "min_level": min_level,
                "gap": round(gap_size, 1),
                "importance": importance,
                "priority": priority,
                "description": req.get("description", ""),
                "suggested_action": f"Elevate proficiency from {user_level} to {target_level} (+{round(gap_size, 1)} pts)"
            }

            gaps.append(gap_item)
            if user_level > 0:
                existing_skills.append(gap_item)
            else:
                missing_skills.append(gap_item)

        # Sort gaps by priority: High first, then highest importance, then largest gap
        priority_rank = {"High": 3, "Medium": 2, "Low": 1}
        gaps.sort(key=lambda x: (priority_rank[x["priority"]], x["importance"], x["gap"]), reverse=True)

        readiness = CareerSimulationEngine.calculate_career_readiness(user_skills, required)

        return {
            "career_id": career["id"],
            "career_title": career["title"],
            "readiness_score": readiness["score"],
            "total_competencies": len(required),
            "existing_skills_count": len(existing_skills),
            "missing_skills_count": len(missing_skills),
            "skill_gaps": gaps,
            "existing_skills": existing_skills,
            "missing_skills": missing_skills,
        }

    @staticmethod
    def simulate_career_path(
        user_skills: Dict[str, float | int],
        career_id: str,
        learning_actions: List[Dict[str, Any]],  # [{"skill_name": "...", "added_proficiency": 2, "hours": 30}]
        scenario_name: str = "Hypothetical Scenario"
    ) -> Dict[str, Any]:
        """
        Simulates what-if outcomes when acquiring or boosting skills.
        Distinguishes clearly between measured current state and projected simulation.
        """
        career = get_career_by_id(career_id)
        if not career:
            raise ValueError(f"Career '{career_id}' not found.")

        initial_readiness = CareerSimulationEngine.calculate_career_readiness(
            user_skills, career.get("required_skills", [])
        )

        simulated_skills = dict(user_skills)
        improved_details = []
        total_estimated_hours = 0

        for action in learning_actions:
            skill = action.get("skill_name")
            added = float(action.get("added_proficiency", 1.0))
            raw_hours = action.get("hours")
            hours = int(raw_hours) if raw_hours is not None else int(added * 18)  # deterministic 18 hrs per level

            total_estimated_hours += hours

            prev_level = float(simulated_skills.get(skill, 0.0))
            new_level = min(5.0, prev_level + added)
            simulated_skills[skill] = new_level

            improved_details.append({
                "skill": skill,
                "previous_level": prev_level,
                "simulated_level": new_level,
                "gain": round(new_level - prev_level, 1),
                "estimated_hours": hours
            })

        simulated_readiness = CareerSimulationEngine.calculate_career_readiness(
            simulated_skills, career.get("required_skills", [])
        )

        score_delta = round(simulated_readiness["score"] - initial_readiness["score"], 1)

        # Remaining gaps in simulated state
        simulated_gaps = CareerSimulationEngine.calculate_skill_gaps(simulated_skills, career_id)

        # Recommend next high-impact action
        high_priority_gaps = [g for g in simulated_gaps["skill_gaps"] if g["priority"] == "High"]
        if high_priority_gaps:
            next_step = f"Focus on {high_priority_gaps[0]['skill']} to bridge the remaining high-priority readiness gap."
        elif simulated_readiness["score"] >= 80:
            next_step = f"Readiness exceeds 80%! Build practical capstone portfolio projects for {career['title']}."
        else:
            next_step = "Continue structured practice on remaining medium-priority competencies."

        return {
            "scenario_name": scenario_name,
            "career_id": career_id,
            "career_title": career["title"],
            "initial_readiness_score": initial_readiness["score"],
            "simulated_readiness_score": simulated_readiness["score"],
            "readiness_delta": score_delta,
            "total_estimated_learning_hours": total_estimated_hours,
            "skills_improved": improved_details,
            "remaining_gaps_count": len([g for g in simulated_gaps["skill_gaps"] if g["gap"] > 0]),
            "remaining_high_priority_gaps": len(high_priority_gaps),
            "recommended_next_action": next_step,
            "is_hypothetical": True,
            "disclaimer": "This projection is a deterministic learning simulation for strategic planning and does not guarantee employment."
        }

    @staticmethod
    def compare_career_scenarios(
        user_skills: Dict[str, float | int],
        career_id: str,
        scenarios: List[Dict[str, Any]]  # [{"name": "A", "actions": [...]}, {"name": "B", "actions": [...]}]
    ) -> Dict[str, Any]:
        """Compares multiple what-if career learning strategies side-by-side."""
        results = []
        for sc in scenarios:
            name = sc.get("name", "Scenario")
            actions = sc.get("actions", [])
            sim = CareerSimulationEngine.simulate_career_path(user_skills, career_id, actions, scenario_name=name)
            results.append(sim)

        # Find best ROI scenario (highest readiness gain per hour)
        best_gain = -1
        best_scenario = None
        for r in results:
            if r["readiness_delta"] > best_gain:
                best_gain = r["readiness_delta"]
                best_scenario = r["scenario_name"]

        return {
            "career_id": career_id,
            "scenarios_evaluated": len(results),
            "scenarios": results,
            "highest_readiness_scenario": best_scenario,
            "comparison_summary": f"{best_scenario} yields the highest readiness uplift (+{best_gain} pts)."
        }
