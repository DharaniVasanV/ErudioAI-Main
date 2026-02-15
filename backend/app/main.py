from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth.google_auth import router as auth_router
from .database.connection import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ErudioAI API", version="1.0.0")

# CORS middleware - Allow Android emulator
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://10.0.2.2:5173",
        "https://localhost",
        "capacitor://localhost",
        "ionic://localhost",
        "http://localhost",
        "https://erudioai.netlify.app",
        "https://*.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "ErudioAI API is running"}