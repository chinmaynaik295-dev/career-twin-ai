import asyncio
import httpx
from app.main import app
from app.core.database import db

async def run_all():
    print("Testing database connection...")
    await db.connect()
    print("Database connected. In-memory mode:", db.is_mock)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        print("Testing /api/health...")
        h = await client.get("/api/health")
        print("Health response:", h.status_code, h.json())
        assert h.status_code == 200

        print("Testing /api/careers...")
        c = await client.get("/api/careers")
        print("Careers count:", len(c.json()))
        assert c.status_code == 200
        assert len(c.json()) == 6

        print("Testing /api/auth/register...")
        user_email = f"user_{int(asyncio.get_event_loop().time())}@enterprise.com"
        reg = await client.post("/api/auth/register", json={
            "name": "Elena Rostova",
            "email": user_email,
            "password": "SecurePassword123!"
        })
        print("Register auth status:", reg.status_code)
        assert reg.status_code == 200
        token = reg.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        print("Testing /api/profile (configuring twin)...")
        prof = await client.post("/api/profile", json={
            "name": "Elena Rostova",
            "institution": "Institute of Technology",
            "academic_year": "Final year",
            "degree": "Computer Science",
            "skills": {"Python": 4.0, "SQL": 3.0, "Machine Learning": 2.0},
            "career_goals": ["ai-ml-engineer"]
        }, headers=headers)
        assert prof.status_code == 200

        print("Testing /api/twin...")
        twin = await client.get("/api/twin", headers=headers)
        print("Twin readiness score:", twin.json()["primary_readiness_score"])
        assert twin.status_code == 200
        assert twin.json()["primary_readiness_score"] > 0

        print("Testing /api/simulation/run...")
        sim_payload = {
            "career_id": "ai-ml-engineer",
            "scenario_name": "Senior Specialization",
            "learning_actions": [{"skill_name": "Machine Learning", "added_proficiency": 2.0}]
        }
        sim = await client.post("/api/simulation/run", json=sim_payload, headers=headers)
        print("Sim result delta:", sim.json()["readiness_delta"])
        assert sim.status_code == 200

        print("Testing /api/agent/chat...")
        chat_payload = {
            "message": "Which career suits my current skills best?",
            "conversation_history": []
        }
        chat = await client.post("/api/agent/chat", json=chat_payload, headers=headers)
        print("Chat response preview:", chat.json()["reply"][:60].encode('ascii', 'ignore').decode(), "...")
        assert chat.status_code == 200

        print("\nALL BACKEND PRODUCTION INTEGRATION CHECKS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(run_all())
