@echo off
title CNN Visualizer - Backend Server
color 0A
echo.
echo ========================================
echo   🧠 CNN Feature Visualizer - Backend
echo ========================================
echo.
echo [1/3] Installing Python dependencies...
pip install -r requirements.txt
echo.
echo [2/3] Dependencies installed successfully!
echo.
echo [3/3] Starting Flask server...
echo.
echo 🚀 Server starting at: http://127.0.0.1:5000
echo 📊 Upload endpoint: http://127.0.0.1:5000/upload-image
echo 💚 Health check: http://127.0.0.1:5000/health
echo.
echo ⚠️  Keep this window open while using the app
echo ⚠️  Press Ctrl+C to stop the server
echo.
python app.py
echo.
echo Server stopped. Press any key to exit...
pause >nul
