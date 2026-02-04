@echo off
echo ==============================================
echo   Starting Casablanca Traffic Predictor 🚗
echo ==============================================
echo.
echo Opening browser...
start http://127.0.0.1:8000
echo.
echo Starting Server...
python -m uvicorn main:app --reload
pause
