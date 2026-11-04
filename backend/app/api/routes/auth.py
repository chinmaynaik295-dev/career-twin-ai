from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone
from app.core.security import hash_password, verify_password, create_access_token
from app.core.database import db
from app.schemas.models import UserRegister, UserLogin, Token, UserOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
async def register(payload: UserRegister):
    users_col = db.get_collection("users")
    existing = await users_col.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )

    user_doc = {
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "name": payload.name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await users_col.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Initialize default profile
    profiles_col = db.get_collection("career_profiles")
    await profiles_col.insert_one({
        "user_id": user_id,
        "name": payload.name,
        "institution": "Engineering College",
        "academic_year": "Second year",
        "degree": "Computer Science & Engineering",
        "skills": {
            "Python": 3,
            "C": 3,
            "Mathematics": 3,
            "SQL": 1,
            "Machine Learning": 1,
            "Linux": 1,
            "Networking": 1,
            "Problem Solving": 3
        },
        "soft_skills": ["Problem Solving", "Curiosity"],
        "interests": ["Artificial Intelligence", "Cybersecurity", "Software Development"],
        "career_goals": ["ai-ml-engineer", "cybersecurity-engineer"],
        "projects": [],
        "certifications": [],
        "evolution_history": [
            {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "event": "Digital Career Twin Initialized",
                "details": "Initial baseline skills mapped from student onboarding."
            }
        ]
    })

    token = create_access_token(subject=user_id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user_id,
        name=payload.name,
        email=payload.email.lower()
    )

@router.post("/login", response_model=Token)
async def login(payload: UserLogin):
    users_col = db.get_collection("users")
    user = await users_col.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    user_id = str(user["_id"])
    token = create_access_token(subject=user_id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user_id,
        name=user["name"],
        email=user["email"]
    )

@router.post("/demo", response_model=Token)
async def demo_login():
    """
    Hackathon 1-Click Guest Access.
    Instantly logs in as sample user 'Alex' with pre-configured Digital Career Twin.
    """
    user_id = "demo-user-alex"
    users_col = db.get_collection("users")
    existing = await users_col.find_one({"_id": user_id})
    if not existing:
        await users_col.insert_one({
            "_id": user_id,
            "email": "alex@careertwin.ai",
            "name": "Alex",
            "password_hash": hash_password("DemoPassword123!"),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    profiles_col = db.get_collection("career_profiles")
    prof = await profiles_col.find_one({"user_id": user_id})
    if not prof:
        await profiles_col.insert_one({
            "user_id": user_id,
            "name": "Alex",
            "institution": "National Institute of Engineering",
            "academic_year": "Second year",
            "degree": "Computer Science & Engineering",
            "skills": {
                "Python": 3,
                "C": 3,
                "Mathematics": 3,
                "SQL": 1,
                "Machine Learning": 1,
                "Linux": 1,
                "Networking": 1,
                "Problem Solving": 3
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
                    "event": "Digital Career Twin Created",
                    "details": "Baseline established for 2nd Year Engineering Student."
                }
            ]
        })

    token = create_access_token(subject=user_id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user_id,
        name="Alex",
        email="alex@careertwin.ai"
    )

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"]
    )
