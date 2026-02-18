import os
import re
from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google import genai

from .auth.jwt_utils import get_current_user
from .database.connection import get_db
from .models.chat import Conversation, ChatMessageDB

# Gemini client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

router = APIRouter(prefix="/chat", tags=["chat"])

SYSTEM_PROMPT = """
You are ErudioAI, a friendly study assistant for school and college students.

- Explain topics briefly and clearly.
- Use simple language and bullet points.
- Stay focused on the topic the student asked about.
- After your explanation, add a final line in this exact format:
TOPIC_NAME: <short topic name>
"""


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    conversation_id: Optional[str] = None  # null/new = create new conv


class ChatResponse(BaseModel):
    reply_text: str
    suggested_topic: Optional[str] = None
    conversation_id: str


class AddToPlanRequest(BaseModel):
    topic_name: str
    conversation_id: Optional[str] = None


class AddToPlanResponse(BaseModel):
    message: str


@router.post("", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1) Find or create conversation
    conv = None
    if req.conversation_id:
        conv = (
            db.query(Conversation)
            .filter_by(id=req.conversation_id, user_id=user.id)
            .first()
        )

    if not conv:
        first_user_msg = next(
            (m.content for m in req.messages if m.role == "user"),
            "New chat",
        )
        conv = Conversation(user_id=user.id, title=first_user_msg[:40] + "...")
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # 2) Save new user messages (last one)
    last_user = req.messages[-1]
    if last_user.role == "user":
        db_msg = ChatMessageDB(
            conversation_id=conv.id,
            role="user",
            text=last_user.content,
        )
        db.add(db_msg)
        db.commit()

    # 3) Build conversation for Gemini
    user_messages = [m.content for m in req.messages if m.role == "user"]
    last_message = user_messages[-1] if user_messages else "Hello"
    
    prompt = f"{SYSTEM_PROMPT}\n\nUser: {last_message}"
    
    if not client:
        raise ValueError("GEMINI_API_KEY not configured")
    
    # Try different model names
    models = ["gemini-2.0-flash","gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
    full_text = None
    
    for model_name in models:
        try:
            resp = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            full_text = resp.text
            break
        except Exception as e:
            if model_name == models[-1]:
                raise Exception(f"All models failed. Last error: {str(e)}")
            continue

    # 4) Extract topic name
    match = re.search(r"TOPIC_NAME:\s*(.+)", full_text)
    suggested_topic = match.group(1).strip() if match else None
    clean_text = re.sub(r"TOPIC_NAME:.*", "", full_text).strip()

    # 5) Save assistant message
    db_msg = ChatMessageDB(
        conversation_id=conv.id,
        role="assistant",
        text=clean_text,
    )
    db.add(db_msg)
    db.commit()

    return ChatResponse(
        reply_text=clean_text,
        suggested_topic=suggested_topic,
        conversation_id=str(conv.id),
    )


@router.post("/add-to-plan", response_model=AddToPlanResponse)
async def add_to_plan(
    body: AddToPlanRequest,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # TODO: later create Topic + StudyBlock here
    print(f"User {user.id} requested to add topic:", body.topic_name)
    return AddToPlanResponse(message="Added to plan (stub)")
