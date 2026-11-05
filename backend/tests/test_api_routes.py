import pytest
import httpx
from app.main import app
from app.core.database import db

@pytest.fixture(autouse=True)
async def setup_database():
    await db.connect()
    yield

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert "CareerTwin" in data["service"]

@pytest.mark.asyncio
async def test_careers_endpoint():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/careers")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 6
        assert any(c["id"] == "ai-ml-engineer" for c in data)

@pytest.mark.asyncio
async def test_auth_registration_and_workflow():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # Register new real user
        reg_payload = {
            "name": "Sarah Connor",
            "email": "sarah.connor@example.com",
            "password": "ProductionPassword123!"
        }
        reg_res = await client.post("/api/auth/register", json=reg_payload)
        assert reg_res.status_code == 200
        token_data = reg_res.json()
        assert "access_token" in token_data
        assert token_data["name"] == "Sarah Connor"
        token = token_data["access_token"]

        headers = {"Authorization": f"Bearer {token}"}
        
        # Access user me
        me_res = await client.get("/api/auth/me", headers=headers)
        assert me_res.status_code == 200
        assert me_res.json()["name"] == "Sarah Connor"

        # Update real profile / onboarding
        profile_payload = {
            "name": "Sarah Connor",
            "institution": "Tech University",
            "degree": "B.S. Computer Engineering",
            "academic_year": "Final year",
            "skills": {"Python": 3.5, "SQL": 2.5, "Machine Learning": 2.0},
            "career_goals": ["ai-ml-engineer", "data-scientist"]
        }
        prof_res = await client.post("/api/profile", json=profile_payload, headers=headers)
        assert prof_res.status_code == 200

        # Access digital twin
        twin_res = await client.get("/api/twin", headers=headers)
        assert twin_res.status_code == 200
        twin_data = twin_res.json()
        assert "skills" in twin_data
        assert twin_data["primary_readiness_score"] > 0

        # Run simulation
        sim_payload = {
            "career_id": "ai-ml-engineer",
            "scenario_name": "ML Deepening",
            "learning_actions": [
                {"skill_name": "Machine Learning", "added_proficiency": 2.0}
            ]
        }
        sim_res = await client.post("/api/simulation/run", json=sim_payload, headers=headers)
        assert sim_res.status_code == 200
        sim_data = sim_res.json()
        assert sim_data["readiness_delta"] > 0

        # Agent chat
        chat_payload = {
            "message": "Which career suits my current skills best?",
            "conversation_history": []
        }
        chat_res = await client.post("/api/agent/chat", json=chat_payload, headers=headers)
        assert chat_res.status_code == 200
        assert "reply" in chat_res.json()
