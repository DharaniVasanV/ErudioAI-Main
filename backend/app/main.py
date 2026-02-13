from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth.google_auth import router as auth_router
from .database.connection import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ErudioAI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "ErudioAI API is running"}