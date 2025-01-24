from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import os
from .database import get_db,   engine
from .models import models, schemas
from .llm import get_llm_response
from .routes import auth, chat

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS for frontend (update origins as needed for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Root endpoint."""
    return {"message": "Welcome to the API"}

# Fake in-memory database (for testing purposes)
users_db = {}

# User registration model
class User(BaseModel):
    email: str
    password: str

# User login model
class Login(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/register")
def register_user(user: User):
    """Register a new user."""
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[user.email] = user.password
    return {"message": "User created successfully"}

@app.post("/login")
def login_user(credentials: Login):
    """Authenticate user login."""
    print(f"Received login request: {credentials.email}")
    if credentials.email not in users_db or users_db[credentials.email] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful"}

@app.post("/api/login")
def login(request: LoginRequest):
    if request.email != "test@example.com" or request.password != "test123456":
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"id": "1", "email": request.email, "token": "sampletoken"}
# Include routers for modular API structure
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
