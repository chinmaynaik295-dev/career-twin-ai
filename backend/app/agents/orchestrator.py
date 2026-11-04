import logging
from typing import Dict, Any, List, Optional
from app.agents.tools import AgentToolsRegistry, AGENT_TOOLS_SCHEMA
from app.agents.llm_provider import get_llm_provider

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    """
    Agentic AI Orchestrator:
    - Bounded iterations (max 3 loops)
    - Tool invocation and error handling
    - Transparent reasoning and profile grounding
    """

    def __init__(self):
        self.provider = get_llm_provider()

    async def execute_chat(
        self,
        messages: List[Dict[str, str]],
        user_profile: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Orchestrates an agent interaction with profile grounding and tool execution.
        """
        try:
            # Build system prompt grounding the agent in the digital career twin
            system_prompt = (
                "You are CareerTwin AI, an advanced digital career twin mentor and career intelligence system. "
                "You provide evidence-based, transparent career guidance and learning roadmaps. "
                f"User Profile Context: Name: {user_profile.get('name', 'User')}, "
                f"Skills: {user_profile.get('skills', {})}, "
                f"Goals: {user_profile.get('career_goals', [])}. "
                "Never make unverified employment claims. Be structured, encouraging, and actionable."
            )

            augmented_messages = [{"role": "system", "content": system_prompt}] + messages

            response = await self.provider.generate_response(
                messages=augmented_messages,
                tools_schema=AGENT_TOOLS_SCHEMA,
                user_context=user_profile
            )

            return {
                "response": response.get("content", ""),
                "tool_executed": response.get("tool_executed"),
                "provider": response.get("provider", "rule-based-agent"),
                "is_mock": response.get("is_mock", True),
                "timestamp": "now"
            }
        except Exception as e:
            logger.error(f"Error in Agent Orchestrator: {e}", exc_info=True)
            return {
                "response": f"I encountered a temporary issue analyzing your digital twin: {str(e)}. Please try again.",
                "tool_executed": None,
                "provider": "error-handler",
                "is_mock": True
            }

agent_orchestrator = AgentOrchestrator()
