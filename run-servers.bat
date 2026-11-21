@echo off
title KA Group of Publications - Launcher
color 0B

echo ==========================================================
echo        KA GROUP OF PUBLICATIONS - QUICK LAUNCHER
echo ==========================================================
echo.
echo Starting MongoDB, Backend (Port 5000) and Frontend (Port 5173)...
echo.

cd /d "%~dp0"

:: Ensure MongoDB Service is running
net start MongoDB 2>nul

:: Start Backend Express Server in separate window
start "KA Publications - Backend Server" cmd /k "cd backend && npm run dev 2>nul || node src/server.js"

:: Start Frontend Vite Server in separate window
start "KA Publications - Frontend App" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are launching...
echo Opening browser in 2 seconds...
timeout /t 2 /nobreak >nul

:: Open browser automatically
start http://localhost:5173

echo.
echo ==========================================================
echo  [DONE] Website running at: http://localhost:5173
echo  Backend running at: http://localhost:5000
echo ==========================================================
exit
