from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth.google_auth import router as auth_router
from .database.connection import engine, Base
from . import chat

# Create tables (includes Conversation + ChatMessageDB)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ErudioAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {"message": "ErudioAI API is running"}
