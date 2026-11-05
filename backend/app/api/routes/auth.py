from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone
import secrets
from app.core.security import hash_password, verify_password, create_access_token
from app.core.database import db
from app.schemas.models import (
    UserRegister, UserLogin, Token, UserOut,
    ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
async def register(payload: UserRegister):
    users_col = db.get_collection("users")
    existing = await users_col.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_doc = {
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "name": payload.name.strip(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await users_col.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Initialize empty career profile for the registered user
    profiles_col = db.get_collection("career_profiles")
    await profiles_col.insert_one({
        "user_id": user_id,
        "name": payload.name.strip(),
        "institution": "",
        "academic_year": "",
        "degree": "",
        "skills": {},
        "soft_skills": [],
        "interests": [],
        "career_goals": [],
        "projects": [],
        "certifications": [],
        "evolution_history": [
            {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "event": "Account Created",
                "details": "Profile initialized."
            }
        ]
    })

    token = create_access_token(subject=user_id)
    return Token(
        access_token=token,
        token_type="bearer",
        user_id=user_id,
        name=payload.name.strip(),
        email=payload.email.lower()
    )

@router.post("/login", response_model=Token)
async def login(payload: UserLogin):
    users_col = db.get_collection("users")
    user = await users_col.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
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

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    users_col = db.get_collection("users")
    user = await users_col.find_one({"email": payload.email.lower()})
    
    # Always return a generic success message to prevent user enumeration
    if user:
        reset_token = secrets.token_urlsafe(32)
        await users_col.update_one(
            {"_id": user["_id"]},
            {"$set": {"reset_token": reset_token, "reset_requested_at": datetime.now(timezone.utc).isoformat()}}
        )

    return {
        "message": "If an account with that email exists, password reset instructions have been sent."
    }

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    users_col = db.get_collection("users")
    user = await users_col.find_one({"reset_token": payload.token})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )

    new_hash = hash_password(payload.new_password)
    await users_col.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": new_hash}, "$unset": {"reset_token": "", "reset_requested_at": ""}}
    )
    return {"message": "Password has been reset successfully. You may now log in with your new password."}

@router.put("/change-password")
async def change_password(payload: ChangePasswordRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    users_col = db.get_collection("users")
    user = await users_col.find_one({"_id": user_id})
    if not user or not verify_password(payload.current_password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed."
        )

    new_hash = hash_password(payload.new_password)
    await users_col.update_one(
        {"_id": user_id},
        {"$set": {"password_hash": new_hash}}
    )
    return {"message": "Password updated successfully."}

@router.delete("/account")
async def delete_account(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    await db.get_collection("users").delete_one({"_id": user_id})
    await db.get_collection("career_profiles").delete_one({"user_id": user_id})
    await db.get_collection("simulations").delete_one({"user_id": user_id})
    await db.get_collection("roadmaps").delete_one({"user_id": user_id})
    await db.get_collection("conversations").delete_one({"user_id": user_id})
    return {"message": "Your account and all associated data have been permanently deleted."}

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        created_at=current_user.get("created_at")
    )
