import os
import json
import logging
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings
from app.agents.tools import AgentToolsRegistry, AGENT_TOOLS_SCHEMA

logger = logging.getLogger(__name__)

class LLMProvider:
    """Abstract base class for LLM Providers."""
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        tools_schema: Optional[List[Dict[str, Any]]] = None,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        raise NotImplementedError

class GeminiProvider(LLMProvider):
    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        self.api_key = api_key
        self.model = model
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        tools_schema: Optional[List[Dict[str, Any]]] = None,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        try:
            # Build Gemini contents structure
            contents = []
            system_instruction = None

            for m in messages:
                role = m.get("role", "user")
                if role == "system":
                    system_instruction = {"parts": [{"text": m.get("content", "")}]}
                elif role == "assistant":
                    contents.append({"role": "model", "parts": [{"text": m.get("content", "")}]})
                else:
                    contents.append({"role": "user", "parts": [{"text": m.get("content", "")}]})

            payload: Dict[str, Any] = {"contents": contents}
            if system_instruction:
                payload["systemInstruction"] = system_instruction

            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(self.url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        content_obj = candidates[0].get("content", {})
                        parts = content_obj.get("parts", [])
                        text = "".join([p.get("text", "") for p in parts])
                        return {"content": text, "provider": "gemini", "is_mock": False}
        except Exception as e:
            logger.warning(f"Gemini API call failed ({e}), falling back to Intelligent Rule-Based Engine.")

        # Fallback to intelligent rule-based engine if Gemini fails or rate limits
        mock = RuleBasedAgentEngine()
        return await mock.generate_response(messages, tools_schema, user_context)

class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: str, base_url: str = "https://api.openai.com/v1", model: str = "gpt-4o"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        tools_schema: Optional[List[Dict[str, Any]]] = None,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        try:
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.3
            }
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choice = data["choices"][0]["message"]
                    return {"content": choice.get("content", ""), "provider": "openai", "is_mock": False}
        except Exception as e:
            logger.warning(f"OpenAI API call failed ({e}), falling back to Intelligent Rule-Based Engine.")

        mock = RuleBasedAgentEngine()
        return await mock.generate_response(messages, tools_schema, user_context)

class RuleBasedAgentEngine(LLMProvider):
    """
    Intelligent Rule-Based Deterministic Agent Engine.
    Executes actual agent tools, performs mathematical profile analysis,
    and returns rich structured responses when external LLM API keys are not supplied.
    """
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        tools_schema: Optional[List[Dict[str, Any]]] = None,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        user_msg = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                user_msg = m.get("content", "").lower()
                break

        profile = user_context or {
            "name": "Professional",
            "skills": {},
            "career_goals": []
        }
        skills = profile.get("skills", {})

        # If user has not configured skills yet
        if not skills:
            reply = (
                f"Hello **{profile.get('name', 'there')}**! I am your **CareerTwin AI Advisor**.\n\n"
                f"Your Digital Career Twin does not have any competencies recorded yet.\n\n"
                f"To unlock personalized readiness scores, skill gap diagnostics, and custom roadmaps, "
                f"please complete your profile onboarding or rate your initial skills in the Digital Twin settings.\n\n"
                f"In the meantime, feel free to ask me general questions about career tracks like **AI/ML Engineer**, "
                f"**Cybersecurity Engineer**, or **Cloud Architecture**!"
            )
            return {"content": reply, "tool_executed": None, "provider": "rule-based-agent", "is_mock": False}


        # Tool 1: Profile & Compatibility intent
        if any(w in user_msg for w in ["which career", "suits my", "match my", "profile", "compatible", "where am i"]):
            analysis = AgentToolsRegistry.analyze_user_profile(profile)
            top_career = analysis["career_compatibilities"][0]
            second_career = analysis["career_compatibilities"][1]
            
            tool_call = {
                "tool": "analyze_user_profile",
                "result": analysis
            }
            
            reply = (
                f"### 🎯 Digital Career Twin Analysis for **{profile.get('name', 'Student')}**\n\n"
                f"Based on your measured competencies ({len(skills)} skills logged):\n\n"
                f"1. **{top_career['career_title']}**: **{top_career['readiness_score']}% readiness**\n"
                f"2. **{second_career['career_title']}**: **{second_career['readiness_score']}% readiness**\n\n"
                f"**Top Current Strengths:**\n"
                + "\n".join([f"- **{s['skill']}**: Level {s['proficiency']}/5" for s in analysis['top_strengths']])
                + f"\n\n**Next Recommended Action:** Explore your skill gaps in **{top_career['career_title']}** or simulate what happens when boosting SQL and ML proficiencies!"
            )
            return {"content": reply, "tool_executed": tool_call, "provider": "rule-based-agent", "is_mock": True}

        # Tool 2 & 3: Why am I not ready / Skill gaps intent
        if any(w in user_msg for w in ["why am i not ready", "skill gap", "missing", "competenc"]):
            target_career = "ai-ml-engineer"
            if "cyber" in user_msg:
                target_career = "cybersecurity-engineer"
            elif "data sci" in user_msg:
                target_career = "data-scientist"

            gaps = AgentToolsRegistry.calculate_skill_gaps(skills, target_career)
            high_gaps = [g for g in gaps["skill_gaps"] if g["priority"] == "High"]
            
            tool_call = {
                "tool": "calculate_skill_gaps",
                "params": {"career_id": target_career},
                "result": gaps
            }
            
            reply = (
                f"### 🔍 Skill Gap Diagnostic: **{gaps['career_title']}**\n\n"
                f"Your measured readiness score is **{gaps['readiness_score']}%**.\n\n"
                f"**Critical High-Priority Competency Gaps Identified:**\n"
                + "\n".join([
                    f"- **{g['skill']}**: Current: `{g['user_level']}/5` ➔ Target: `{g['target_level']}/5` (Gap: `+{g['gap']}` pts, Importance: {g['importance']}/5)"
                    for g in high_gaps
                ])
                + f"\n\n**Strategic Remediation:** Bridge these gaps by tackling practical projects and focused milestone exercises."
            )
            return {"content": reply, "tool_executed": tool_call, "provider": "rule-based-agent", "is_mock": True}

        # Tool 5: Comparison intent
        if any(w in user_msg for w in ["compare", "vs", "versus"]):
            c1 = "ai-ml-engineer"
            c2 = "cybersecurity-engineer"
            r1 = AgentToolsRegistry.calculate_career_readiness(skills, c1)
            r2 = AgentToolsRegistry.calculate_career_readiness(skills, c2)
            
            tool_call = {
                "tool": "compare_career_scenarios",
                "params": {"career_id": "comparison", "scenarios": [{"name": "AI/ML", "actions": []}, {"name": "Cyber", "actions": []}]},
                "result": {"AI/ML": r1, "Cybersecurity": r2}
            }

            reply = (
                f"### ⚖️ Side-by-Side Career Evaluation\n\n"
                f"| Evaluation Metric | AI/ML Engineer | Cybersecurity Engineer |\n"
                f"| :--- | :--- | :--- |\n"
                f"| **Current Readiness** | **{r1['readiness_score']}%** | **{r2['readiness_score']}%** |\n"
                f"| **Key Shared Skill** | Python (`{skills.get('Python', 0)}/5`) | Python (`{skills.get('Python', 0)}/5`) |\n"
                f"| **Key Pivot Skill** | Machine Learning (`{skills.get('Machine Learning', 0)}/5`) | Networking (`{skills.get('Networking', 0)}/5`) & Linux (`{skills.get('Linux', 0)}/5`) |\n"
                f"| **Market Outlook** | +38% High Growth | +32% Critical Demand |\n\n"
                f"**Advisor Takeaway:** You currently have stronger mathematics and programming groundwork for **AI/ML**, but gaining networking fundamentals can rapidly accelerate your **Cybersecurity** readiness!"
            )
            return {"content": reply, "tool_executed": tool_call, "provider": "rule-based-agent", "is_mock": True}

        # Tool 6: Roadmap generation intent
        if any(w in user_msg for w in ["roadmap", "learning plan", "three-month", "month", "schedule"]):
            roadmap = AgentToolsRegistry.generate_learning_roadmap(skills, "ai-ml-engineer", target_weeks=8)
            tool_call = {
                "tool": "generate_learning_roadmap",
                "params": {"career_id": "ai-ml-engineer", "target_weeks": 8},
                "result": roadmap
            }
            reply = (
                f"### 🗺️ Adaptive Learning Roadmap: **{roadmap['career_title']}**\n\n"
                f"- **Duration:** {roadmap['target_weeks']} Weeks ({roadmap['total_estimated_hours']} total learning hours)\n"
                f"- **Current Readiness:** {roadmap['initial_readiness']}%\n"
                f"- **Projected Readiness after completion:** **{roadmap['projected_readiness']}%** (+{round(roadmap['projected_readiness'] - roadmap['initial_readiness'], 1)} pts)\n\n"
                f"**Key Weekly Milestones:**\n"
                + "\n".join([f"- **{m['title']}** ({m['estimated_hours']} hrs)" for m in roadmap['milestones'][:4]])
                + f"\n\n*Check the interactive Roadmap tab to track your task progress in real time!*"
            )
            return {"content": reply, "tool_executed": tool_call, "provider": "rule-based-agent", "is_mock": True}

        # Tool 8: Project recommendation intent
        if any(w in user_msg for w in ["project", "build", "portfolio", "recommend"]):
            projects = AgentToolsRegistry.recommend_projects(skills, "ai-ml-engineer")
            tool_call = {
                "tool": "recommend_projects",
                "params": {"career_id": "ai-ml-engineer"},
                "result": projects
            }
            projs_list = projects.get("recommended_projects", [])
            reply = (
                f"### 🚀 High-Impact Portfolio Recommendations for **{projects['career_title']}**\n\n"
                + "\n".join([
                    f"#### 📌 {p['title']} ({p['difficulty']} • ~{p['estimated_hours']} hrs)\n"
                    f"{p['description']}\n"
                    f"**Target Competencies:** {', '.join(p['skills_targeted'])}\n"
                    for p in projs_list
                ])
                + "\nBuilding these projects provides verifiable proof to evolve your Digital Career Twin!"
            )
            return {"content": reply, "tool_executed": tool_call, "provider": "rule-based-agent", "is_mock": True}

        # General mentor guidance
        analysis = AgentToolsRegistry.analyze_user_profile(profile)
        top = analysis["career_compatibilities"][0]
        reply = (
            f"Hello **{profile.get('name', 'there')}**! I am your **CareerTwin AI Agentic Mentor**.\n\n"
            f"I have direct access to your Digital Twin. Right now, your strongest career match is **{top['career_title']}** with **{top['readiness_score']}% readiness**.\n\n"
            f"Here are strategic questions you can ask me:\n"
            f"1. *Which career suits my current skills best?*\n"
            f"2. *Why am I not ready for AI/ML engineering yet?*\n"
            f"3. *Compare AI/ML Engineer vs Cybersecurity Engineer for me.*\n"
            f"4. *Generate an 8-week structured learning roadmap.*\n"
            f"5. *Which practical portfolio projects should I build next?*"
        )
        return {"content": reply, "tool_executed": None, "provider": "rule-based-agent", "is_mock": True}

def get_llm_provider() -> LLMProvider:
    """Factory to instantiate the appropriate LLM provider."""
    provider_type = settings.LLM_PROVIDER.lower()
    
    if provider_type == "gemini" or (provider_type == "auto" and settings.GEMINI_API_KEY):
        if settings.GEMINI_API_KEY:
            return GeminiProvider(api_key=settings.GEMINI_API_KEY, model=settings.LLM_MODEL)
    
    if provider_type == "openai" or (provider_type == "auto" and settings.OPENAI_API_KEY):
        if settings.OPENAI_API_KEY:
            return OpenAIProvider(
                api_key=settings.OPENAI_API_KEY,
                base_url=settings.OPENAI_BASE_URL or "https://api.openai.com/v1",
                model=settings.LLM_MODEL or "gpt-4o"
            )
            
    return RuleBasedAgentEngine()

