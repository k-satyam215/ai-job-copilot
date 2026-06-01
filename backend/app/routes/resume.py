import os
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.user import User
from app.services.resume_parser import extract_resume_text, parse_resume_with_ai
from app.utils.security import get_current_user


router = APIRouter()
settings = get_settings()
os.makedirs(settings.resume_upload_dir, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".pdf", ".txt"}:
        raise HTTPException(status_code=400, detail="Only PDF and TXT resumes are supported")

    file_path = os.path.join(settings.resume_upload_dir, f"user_{user.id}{suffix}")
    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_resume_text(file_path)
    profile = await parse_resume_with_ai(text)

    user.resume_path = file_path
    user.resume_text = text
    user.profile_json = profile
    db.commit()
    db.refresh(user)

    return {"message": "Resume parsed successfully", "file_path": file_path, "profile": profile}


@router.get("/profile")
def resume_profile(user: User = Depends(get_current_user)):
    return {"profile": user.profile_json, "resume_path": user.resume_path}
