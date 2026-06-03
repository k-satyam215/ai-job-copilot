from __future__ import annotations

import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.user import User
from app.services.billing import PLAN_LIMITS
from app.services.notifier import send_email, send_telegram, send_whatsapp
from app.utils.security import create_access_token, get_current_user, hash_password, verify_password

router = APIRouter()
settings = get_settings()
RESET_TOKEN_TTL_MINUTES = 60


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class PreferencesRequest(BaseModel):
    phone: str | None = None
    current_ctc: str | None = None
    expected_ctc: str | None = None
    notice_period: str | None = None
    location: str | None = None
    relocation: str | None = None
    linkedin: str | None = None
    portfolio: str | None = None
    work_authorization: str | None = None
    telegram_chat_id: str | None = None
    whatsapp_phone: str | None = None
    job_roles: list[str] | None = None
    preferred_locations: list[str] | None = None
    skills_to_highlight: list[str] | None = None


def public_user(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "plan": user.plan,
        "ai_credits": user.ai_credits,
        "is_verified": user.is_verified,
        "profile": user.profile_json,
        "preferences": user.preferences_json or {},
    }


def _send_verification_email(user: User) -> None:
    # FIX: Use FRONTEND_ORIGIN from settings instead of hardcoded localhost
    frontend_origin = settings.frontend_origin.rstrip("/")
    verify_url = f"{frontend_origin}/verify-email?token={user.verification_token}"
    html = (
        f"<h2>Welcome to AI Job Copilot, {user.full_name}!</h2>"
        f"<p>Please verify your email to activate your account:</p>"
        f"<p><a href='{verify_url}' style='padding:10px 20px;background:#4f8aff;color:white;"
        f"border-radius:6px;text-decoration:none'>Verify Email</a></p>"
        f"<p>This link expires in 24 hours.</p>"
    )
    send_email(user.email, "Verify your AI Job Copilot account", html)


@router.post("/signup")
def signup(payload: SignupRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    verification_token = secrets.token_urlsafe(32)
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
        is_verified=False,
        verification_token=verification_token,
        ai_credits=PLAN_LIMITS["free"]["ai_credits"],
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    background_tasks.add_task(_send_verification_email, user)

    return {
        "access_token": create_access_token(str(user.id)),
        "token_type": "bearer",
        "user": public_user(user),
        "message": "Account created. Check your email to verify your account.",
    }


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    user.is_verified = True
    user.verification_token = None
    user.verified_at = datetime.utcnow()
    db.commit()
    return {"message": "Email verified successfully! You can now log in."}


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "access_token": create_access_token(str(user.id)),
        "token_type": "bearer",
        "user": public_user(user),
    }


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires_at = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_TTL_MINUTES)
        db.commit()
        # FIX: Use FRONTEND_ORIGIN from settings
        frontend_origin = settings.frontend_origin.rstrip("/")
        reset_url = f"{frontend_origin}/reset-password?token={reset_token}"
        html = (
            f"<h2>Password Reset Request</h2>"
            f"<p>Click the link below to reset your AI Job Copilot password. "
            f"This link expires in {RESET_TOKEN_TTL_MINUTES} minutes.</p>"
            f"<p><a href='{reset_url}' style='padding:10px 20px;background:#4f8aff;color:white;"
            f"border-radius:6px;text-decoration:none'>Reset Password</a></p>"
            f"<p>If you did not request this, ignore this email.</p>"
        )
        background_tasks.add_task(send_email, user.email, "Reset your AI Job Copilot password", html)
    return {"message": "If an account exists for that email, a reset link has been sent."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == payload.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    if user.reset_token_expires_at and datetime.utcnow() > user.reset_token_expires_at:
        raise HTTPException(status_code=400, detail="Reset token has expired. Request a new one.")
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    user.hashed_password = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expires_at = None
    db.commit()
    return {"message": "Password reset successfully. You can now log in with your new password."}


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return public_user(user)


@router.put("/preferences")
def update_preferences(
    payload: PreferencesRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    preferences = user.preferences_json or {}
    for key, value in payload.model_dump(exclude_none=True).items():
        if key == "phone":
            user.phone = value
        else:
            preferences[key] = value
    user.preferences_json = preferences
    db.commit()
    db.refresh(user)
    return public_user(user)


@router.delete("/account")
def delete_account(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db.delete(user)
    db.commit()
    return {"message": "Account deleted successfully"}


@router.post("/test-notifications")
async def test_notifications(user: User = Depends(get_current_user)):
    preferences = user.preferences_json or {}
    message = "AI Job Copilot notification test: your career copilot is ready."
    return {
        "email": send_email(user.email, "AI Job Copilot notification test", f"<p>{message}</p>"),
        "telegram": await send_telegram(preferences.get("telegram_chat_id", ""), message),
        "whatsapp": await send_whatsapp(preferences.get("whatsapp_phone", ""), message),
    }
