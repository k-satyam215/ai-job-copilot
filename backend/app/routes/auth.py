from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.security import create_access_token, get_current_user, hash_password, verify_password


router = APIRouter()


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


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


def public_user(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "plan": user.plan,
        "ai_credits": user.ai_credits,
        "profile": user.profile_json,
        "preferences": user.preferences_json or {},
    }


@router.post("/signup")
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": create_access_token(str(user.id)), "token_type": "bearer", "user": public_user(user)}


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": create_access_token(str(user.id)), "token_type": "bearer", "user": public_user(user)}


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
