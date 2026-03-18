from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv
import os


# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Construct the SQLAlchemy connection string
DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

# Create the SQLAlchemy engine
# If using Transaction Pooler or Session Pooler, we want to ensure we disable SQLAlchemy client side pooling -
# https://docs.sqlalchemy.org/en/20/core/pooling.html#switching-pool-implementations
engine = create_engine(DATABASE_URL, poolclass=NullPool)

# Test the connection

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

try:
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"Failed to connect: {e}")

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
