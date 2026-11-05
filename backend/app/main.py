from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import db
from app.api.routes import auth, profile, careers, simulation, roadmap, agent, twin

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("careertwin")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to database (MongoDB Atlas or resilient In-Memory store)
    await db.connect()
    logger.info("CareerTwin AI Backend Services initialized successfully.")
    yield
    # Shutdown

app = FastAPI(
    title="CareerTwin AI API",
    description="Career Intelligence & Digital Career Twin Platform API",
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
        "service": "CareerTwin AI Platform",
        "version": "1.0.0",
        "database": "mongodb_atlas" if not db.is_mock else "local_resilient_store",
        "llm_provider": settings.LLM_PROVIDER
    }
