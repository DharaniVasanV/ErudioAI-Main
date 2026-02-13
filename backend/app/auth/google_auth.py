from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel
from datetime import datetime
import os
from dotenv import load_dotenv

from ..database.connection import get_db
from ..models.user import User
from .jwt_utils import create_access_token

load_dotenv()

router = APIRouter()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

class GoogleTokenRequest(BaseModel):
    token: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/auth/google", response_model=AuthResponse)
async def google_login(request: GoogleTokenRequest, db: Session = Depends(get_db)):
    try:
        # Verify Google token
        idinfo = id_token.verify_oauth2_token(
            request.token, requests.Request(), GOOGLE_CLIENT_ID
        )
        
        google_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']
        avatar_url = idinfo.get('picture')
        
        # Check if user exists
        user = db.query(User).filter(User.google_id == google_id).first()
        
        if user:
            # Update last login
            user.last_login_at = datetime.utcnow()
        else:
            # Create new user
            user = User(
                google_id=google_id,
                email=email,
                name=name,
                avatar_url=avatar_url
            )
            db.add(user)
        
        db.commit()
        db.refresh(user)
        
        # Create JWT token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": str(user.id),
                "email": user.email,
                "name": user.name,
                "avatar_url": user.avatar_url
            }
        )
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")