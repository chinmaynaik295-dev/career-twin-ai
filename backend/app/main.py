from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from datetime import datetime, timezone

from app.core.config import settings
from app.core.database import db
from app.core.security import hash_password
from app.api.routes import auth, profile, careers, simulation, roadmap, agent, twin

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("careertwin")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect DB & Seed Alex demo profile
    await db.connect()
    
    # Ensure Alex (Sample Demo User) exists
    users_col = db.get_collection("users")
    profiles_col = db.get_collection("career_profiles")
    alex_user = await users_col.find_one({"email": "alex@careertwin.ai"})
    if not alex_user:
        user_res = await users_col.insert_one({
            "_id": "demo-user-alex",
            "email": "alex@careertwin.ai",
            "name": "Alex",
            "password_hash": hash_password("DemoPassword123!"),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        await profiles_col.insert_one({
            "user_id": "demo-user-alex",
            "name": "Alex",
            "institution": "National Institute of Engineering",
            "academic_year": "Second year",
            "degree": "Computer Science & Engineering",
            "skills": {
                "Python": 3.0,
                "C": 3.0,
                "Mathematics": 3.0,
                "SQL": 1.0,
                "Machine Learning": 1.0,
                "Linux": 1.0,
                "Networking": 1.0,
                "Problem Solving": 3.0
            },
            "soft_skills": ["Problem Solving", "Analytical Thinking", "Continuous Learning"],
            "interests": ["Artificial Intelligence", "Cybersecurity", "Software Development"],
            "career_goals": ["ai-ml-engineer", "cybersecurity-engineer"],
            "projects": [
                {
                    "title": "Sorting Algorithm Visualizer",
                    "description": "Interactive CLI and graphics program in C and Python demonstrating quicksort, mergesort, and complexity graphs.",
                    "skills_used": ["C", "Python", "Problem Solving"]
                }
            ],
            "certifications": ["Intro to Python & Data Structures"],
            "evolution_history": [
                {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "event": "Digital Career Twin Initialized",
                    "details": "Alex's baseline profile established for 2nd Year Engineering."
                }
            ]
        })
        logger.info("Demo User 'Alex' seeded successfully.")

    yield
    # Shutdown

app = FastAPI(
    title="CareerTwin AI API",
    description="Agentic AI Digital Career Twin & Career Simulation Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(careers.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(roadmap.router, prefix=settings.API_V1_STR)
app.include_router(agent.router, prefix=settings.API_V1_STR)
app.include_router(twin.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "CareerTwin AI Core",
        "version": "1.0.0",
        "database_mode": "mock_demo" if db.is_mock else "mongodb_atlas",
        "llm_provider": settings.LLM_PROVIDER
    }
