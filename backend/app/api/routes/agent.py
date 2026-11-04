from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from app.schemas.models import AgentChatRequest
from app.agents.orchestrator import agent_orchestrator
from app.api.deps import get_current_user
from app.core.database import db

router = APIRouter(prefix="/agent", tags=["AI Career Mentor"])

@router.post("/chat")
async def chat_with_agent(payload: AgentChatRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profiles_col = db.get_collection("career_profiles")
    profile = await profiles_col.find_one({"user_id": user_id}) or {
        "name": current_user.get("name", "Student"),
        "skills": {"Python": 3, "Problem Solving": 3},
        "career_goals": ["ai-ml-engineer"]
    }

    messages = [{"role": m.role, "content": m.content} for m in (payload.conversation_history or [])]
    messages.append({"role": "user", "content": payload.message})

    result = await agent_orchestrator.execute_chat(
        messages=messages,
        user_profile=profile
    )

    # Log conversation in conversations collection
    conversations_col = db.get_collection("conversations")
    await conversations_col.insert_one({
        "user_id": user_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_message": payload.message,
        "agent_response": result["response"],
        "tool_executed": result.get("tool_executed"),
        "provider": result.get("provider")
    })

    return {
        "reply": result["response"],
        "tool_executed": result.get("tool_executed"),
        "provider": result.get("provider"),
        "is_mock": result.get("is_mock"),
        "suggested_prompts": [
            "What skills am I missing for Cybersecurity?",
            "Simulate learning Python and SQL for 60 hours",
            "Which practical portfolio project should I build next?",
            "Compare AI/ML vs Data Scientist"
        ]
    }
