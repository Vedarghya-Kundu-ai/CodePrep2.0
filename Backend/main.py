import hashlib
import os
import random
import uuid
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
import time
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models import QuestionDB, SessionLocal, UserDB

app = FastAPI()

@app.middleware("http")
async def simple_timer(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start

    print(f"{request.url.path} -> {round(duration * 1000)} ms", flush=True)

    return response

app.add_middleware(
    CORSMiddleware,
    # Updated: include both localhost and 127.0.0.1 dev origins for frontend API calls.
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Added: request/response models for question endpoints.
class QuestionCreate(BaseModel):
    user: str
    question: str


class QuestionResponse(BaseModel):
    id: int
    user: str
    question: str

    class Config:
        from_attributes = True


# Added: sync request for creating/updating account records from frontend auth events.
class UserSyncRequest(BaseModel):
    user_id: str
    email: str
    password: Optional[str] = None
    auth_provider: str = "unknown"


class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    profile_pic: Optional[str] = None
    bio: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    x_handle: Optional[str] = None


class UserResponse(BaseModel):
    user_id: str
    email: str
    auth_provider: str
    username: str
    profile_pic: str
    bio: str
    linkedin: str
    github: str
    x_handle: str

    class Config:
        from_attributes = True


class AccountDeleteResponse(BaseModel):
    success: bool
    deleted_profile: bool
    deleted_questions: int


# Added: short helper for secure password storage with PBKDF2 + random salt.
def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120000)
    return f"{salt.hex()}:{digest.hex()}"


# Added: random default profile names for first-time users.
def generate_random_username() -> str:
    adjectives = ["swift", "silent", "bright", "quantum", "pixel", "vector", "neon"]
    nouns = ["coder", "dev", "solver", "builder", "hacker", "engineer", "thinker"]
    return f"{random.choice(adjectives)}_{random.choice(nouns)}_{random.randint(100, 999)}"


# Added: random avatar URL using deterministic seed for easy profile setup.
def generate_random_avatar_url() -> str:
    seed = uuid.uuid4().hex[:12]
    return f"https://api.dicebear.com/9.x/thumbs/svg?seed={seed}"


@app.post("/add_question", response_model=QuestionResponse)
def add_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = QuestionDB(user=question.user, question=question.question)
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


@app.get("/questions/{user}", response_model=List[QuestionResponse])
def get_questions(user: str, db: Session = Depends(get_db)):
    return db.query(QuestionDB).filter(QuestionDB.user == user).all()


@app.delete("/questions/{user}/{id}")
def delete_question(user: str, id: int, db: Session = Depends(get_db)):
    db_question = db.query(QuestionDB).filter(
        QuestionDB.user == user, QuestionDB.id == id
    ).first()
    if db_question:
        db.delete(db_question)
        db.commit()
        return {"success": True}
    return {"success": False}


# Added: creates user row once and updates provider/password hash when needed.
@app.post("/users/sync", response_model=UserResponse)
def sync_user(payload: UserSyncRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.user_id == payload.user_id).first()
    if not user:
        user = UserDB(
            user_id=payload.user_id,
            email=payload.email,
            auth_provider=payload.auth_provider,
            password_hash=hash_password(payload.password) if payload.password else None,
            username=generate_random_username(),
            profile_pic=generate_random_avatar_url(),
            bio="",
            linkedin="",
            github="",
            x_handle="",
        )
        db.add(user)
    else:
        setattr(user, "email", payload.email)
        setattr(user, "auth_provider", payload.auth_provider or user.auth_provider)
        if payload.password:
            setattr(user, "password_hash", hash_password(payload.password))

    db.commit()
    db.refresh(user)
    return user


@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Added: lets users update visible profile fields from Edit Profile UI.
@app.put("/users/{user_id}/profile", response_model=UserResponse)
def update_user_profile(user_id: str, payload: UserProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.username is not None and payload.username.strip():
        setattr(user, "username", payload.username.strip())
    if payload.profile_pic is not None and payload.profile_pic.strip():
        setattr(user, "profile_pic", payload.profile_pic.strip())
    if payload.bio is not None:
        setattr(user, "bio", payload.bio.strip())
    if payload.linkedin is not None:
        setattr(user, "linkedin", payload.linkedin.strip())
    if payload.github is not None:
        setattr(user, "github", payload.github.strip())
    if payload.x_handle is not None:
        setattr(user, "x_handle", payload.x_handle.strip())

    db.commit()
    db.refresh(user)
    return user


# Added: backend-generated random avatar/username to avoid client-side profile generation.
@app.post("/users/{user_id}/randomize", response_model=UserResponse)
def randomize_user_profile(user_id: str, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    setattr(user, "username", generate_random_username())
    setattr(user, "profile_pic", generate_random_avatar_url())
    db.commit()
    db.refresh(user)
    return user


# Added: hard-delete endpoint to remove profile + full question history for an account.
@app.delete("/users/{user_id}/full-delete", response_model=AccountDeleteResponse)
def delete_user_account_data(user_id: str, db: Session = Depends(get_db)):
    deleted_questions = db.query(QuestionDB).filter(QuestionDB.user == user_id).delete(synchronize_session=False)
    deleted_profile = db.query(UserDB).filter(UserDB.user_id == user_id).delete(synchronize_session=False) > 0
    db.commit()

    return AccountDeleteResponse(
        success=True,
        deleted_profile=deleted_profile,
        deleted_questions=deleted_questions,
    )
