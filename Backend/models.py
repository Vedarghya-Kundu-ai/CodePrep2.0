from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./questions.db"  # stored in project root

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class QuestionDB(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String, index=True)      # Firebase email or UID
    question = Column(String, index=True)


# Added: user profile/auth metadata table for account features.
class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    auth_provider = Column(String, default="unknown", nullable=False)
    password_hash = Column(String, nullable=True)
    username = Column(String, nullable=False)
    profile_pic = Column(String, nullable=False)
    bio = Column(String, default="", nullable=False)
    linkedin = Column(String, default="", nullable=False)
    github = Column(String, default="", nullable=False)
    x_handle = Column(String, default="", nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)
