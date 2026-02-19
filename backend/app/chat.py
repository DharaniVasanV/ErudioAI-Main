import os
import re
from typing import List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import requests

from .auth.jwt_utils import get_current_user
from .database.connection import get_db
from .models.chat import Conversation, ChatMessageDB

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL_ID = os.getenv("HF_MODEL_ID")
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}"
HF_HEADERS = {"Authorization": f"Bearer {HF_API_TOKEN}"}

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

def call_hf_chat(prompt: str) -> str:
    """
    Sends a prompt to Hugging Face Inference API and returns generated text.
    """
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.7,
        }
    }
    resp = requests.post(HF_API_URL, headers=HF_HEADERS, json=payload, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    # Text-generation models usually return a list with 'generated_text'
    if isinstance(data, list) and "generated_text" in data[0]:
        return data[0]["generated_text"]
    if isinstance(data, dict) and "generated_text" in data:
        return data["generated_text"]
    raise RuntimeError(f"Unexpected HF response format: {data}")

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

    # 3) Build plain text conversation
    conversation_text = ""
    for m in req.messages:
        role = "User" if m.role == "user" else "Assistant"
        conversation_text += f"{role}: {m.content}\n"

    prompt = SYSTEM_PROMPT + "\n\nConversation so far:\n" + conversation_text + "\nAssistant:"

    full_text = call_hf_chat(prompt)

    # 4) Extract TOPIC_NAME
    match = re.search(r"TOPIC_NAME:\s*(.+)", full_text)
    suggested_topic = match.group(1).strip() if match else None
    clean_text = re.sub(r"TOPIC_NAME:.*", "", full_text, flags=re.DOTALL).strip()

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
