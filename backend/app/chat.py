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

import requests

def call_custom_hf_chat(api_url: str, prompt: str) -> str:
    """
    Sends a prompt to a custom Hugging Face-compatible API (e.g. Colab/Ngrok)
    """
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.7,
        }
    }
    # Append /generate if not present, assuming the Colab code uses @app.post("/generate")
    if not api_url.endswith("/generate"):
        api_url = f"{api_url.rstrip('/')}/generate"
        
    print(f"Calling Custom HF API: {api_url}")
    try:
        resp = requests.post(api_url, json=payload, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        if "generated_text" in data:
            return data["generated_text"]
        # Fallback for list response
        if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
             return data[0]["generated_text"]
        return str(data)
    except Exception as e:
        print(f"Custom API Error: {e}")
        raise e

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

    # 3) Generate Response
    full_text = None
    suggested_topic = None

    # Check for custom HF API URL (e.g. Colab/Ngrok)
    hf_api_url = os.getenv("HF_API_URL")
    
    if hf_api_url and hf_api_url.strip():
        try:
            full_text = call_custom_hf_chat(hf_api_url, prompt)
        except Exception as e:
            print(f"Custom HF API failed: {e}")
            # Fallback to Gemini if custom URL fails
            pass
            
    if not full_text:
        # Fallback to Gemini
        if not client:
             raise ValueError("GEMINI_API_KEY not configured and Custom HF URL failed")

        # Format history for Gemini
        contents = []
        for m in req.messages:
            role = "user" if m.role == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": m.content}]
            })

        # Try different Gemini model names
        models_to_try = [
            "gemini-2.0-flash",
            "gemini-3.1-pro",
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro",
            "gemini-2.0-flash-exp",
            "gemini-3-flash-preview"
        ]
        
        last_error = None

        for model_name in models_to_try:
            try:
                resp = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config={
                        "system_instruction": SYSTEM_PROMPT
                    }
                )
                full_text = resp.text
                if full_text:
                    break
            except Exception as e:
                last_error = e
                continue

        if not full_text:
             raise Exception(f"All models failed. Last Gemini error: {str(last_error)}")

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
    print(f"User {user.id} requested to add topic:", body.topic_name)
    return AddToPlanResponse(message="Added to plan (stub)")

