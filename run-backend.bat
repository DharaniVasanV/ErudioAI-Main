@echo off
echo Starting ErudioAI Backend Server...
echo.
echo Backend will be accessible at:
echo - Web: http://localhost:8000
echo - Android Emulator: http://10.0.2.2:8000
echo.
cd backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000