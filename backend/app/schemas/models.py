from pydantic import BaseModel, Field, EmailStr
from typing import Dict, List, Optional, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)

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
    created_at: Optional[str] = None

class UserSettingsUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    institution: Optional[str] = None
    degree: Optional[str] = None
    academic_year: Optional[str] = None

# --- Profile & Digital Twin Schemas ---
class ProfileCreate(BaseModel):
    name: Optional[str] = None
    institution: Optional[str] = ""
    academic_year: Optional[str] = ""
    degree: Optional[str] = ""
    skills: Dict[str, float] = Field(default_factory=dict)
    soft_skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    career_goals: List[str] = Field(default_factory=list)
    projects: List[Dict[str, Any]] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    institution: Optional[str] = None
    academic_year: Optional[str] = None
    degree: Optional[str] = None
    skills: Optional[Dict[str, float]] = None
    soft_skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_goals: Optional[List[str]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    certifications: Optional[List[str]] = None

# --- Simulation Schemas ---
class LearningAction(BaseModel):
    skill_name: str
    added_proficiency: float = Field(..., ge=0.5, le=5.0)
    hours: Optional[int] = None

class SimulationRunRequest(BaseModel):
    career_id: str
    scenario_name: str = "Strategic Simulation"
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
