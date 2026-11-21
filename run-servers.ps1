# KA Group of Publications - One-Click Launcher

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       KA GROUP OF PUBLICATIONS - QUICK LAUNCHER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Backend (Port 5000) and Frontend (Port 5173)..." -ForegroundColor Yellow

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Launch Backend
Start-Process cmd.exe -ArgumentList "/k cd /d `"$rootDir\backend`" && npm run dev"

# Launch Frontend
Start-Process cmd.exe -ArgumentList "/k cd /d `"$rootDir\frontend`" && npm run dev"

Start-Sleep -Seconds 2

# Open in default browser
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Website successfully opened at http://localhost:5173" -ForegroundColor Green
Write-Host "Backend API available at http://localhost:5000" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
