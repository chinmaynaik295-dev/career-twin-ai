from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    name: str

class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    created_at: Optional[datetime] = None

# --- Profile & Digital Twin Schemas ---
class EducationInfo(BaseModel):
    degree: str = "B.Tech Computer Science & Engineering"
    institution: str = "National Institute of Technology"
    academic_year: str = "Second year"
    graduation_year: int = 2027

class ProfileCreate(BaseModel):
    name: str
    institution: str = "University of Engineering"
    academic_year: str = "Second year"
    degree: str = "B.Tech Computer Science"
    skills: Dict[str, float] = Field(default_factory=dict)
    soft_skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    career_goals: List[str] = Field(default_factory=lambda: ["ai-ml-engineer", "cybersecurity-engineer"])
    projects: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    institution: Optional[str] = None
    academic_year: Optional[str] = None
    skills: Optional[Dict[str, float]] = None
    soft_skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_goals: Optional[List[str]] = None
    projects: Optional[List[Dict[str, Any]]] = None

# --- Simulation Schemas ---
class LearningAction(BaseModel):
    skill_name: str
    added_proficiency: float = Field(..., ge=0.5, le=5.0)
    hours: Optional[int] = None

class SimulationRunRequest(BaseModel):
    career_id: str
    scenario_name: str = "Custom What-If Scenario"
    learning_actions: List[LearningAction]

class ScenarioComparisonItem(BaseModel):
    name: str
    actions: List[LearningAction]

class SimulationCompareRequest(BaseModel):
    career_id: str
    scenarios: List[ScenarioComparisonItem]

# --- Roadmap Schemas ---
class RoadmapGenerateRequest(BaseModel):
    career_id: str
    target_weeks: int = Field(default=8, ge=4, le=24)
    weekly_hours: int = Field(default=10, ge=2, le=40)

class TaskUpdateStatus(BaseModel):
    completed: bool
    evidence: Optional[str] = None

# --- Agent Chat Schemas ---
class ChatMessage(BaseModel):
    role: str
    content: str

class AgentChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = Field(default_factory=list)
