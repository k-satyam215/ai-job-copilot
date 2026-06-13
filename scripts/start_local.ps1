# AI Job Copilot — STARTUP GUIDE (UPDATED)
# ==========================================
# Run this ONE TIME to start everything locally.
# For production, just push to GitHub — Vercel + Render auto-deploy.

$ROOT = "C:\Users\ksaty\Desktop\ai-job-copilot"

Write-Host "`n AI Job Copilot — Local Start" -ForegroundColor Cyan

# Backend
Write-Host "`n[1] Starting Backend on :8000..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList `
    "-NoExit", "-Command", `
    "cd '$ROOT\backend'; uvicorn app.main:app --reload --port 8000" `
    -WindowStyle Normal

Start-Sleep 3

# Frontend
Write-Host "[2] Starting Frontend on :3000..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList `
    "-NoExit", "-Command", `
    "cd '$ROOT\frontend'; npm run dev" `
    -WindowStyle Normal

Start-Sleep 5

Write-Host "`n Local URLs:" -ForegroundColor Green
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:   http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "  API Docs:  http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "  Health:    http://127.0.0.1:8000/health" -ForegroundColor Cyan
Write-Host "`n Production URLs:" -ForegroundColor Green
Write-Host "  Frontend:  https://ai-job-copilot-psi.vercel.app" -ForegroundColor Cyan
Write-Host "  Backend:   https://ai-job-copilot-backend.onrender.com" -ForegroundColor Cyan
Write-Host "`n Chrome Extension:" -ForegroundColor Green
Write-Host "  1. chrome://extensions -> Developer Mode ON" -ForegroundColor White
Write-Host "  2. Load Unpacked -> select: $ROOT\extension" -ForegroundColor White
Write-Host "  3. Login at localhost:3000 -> Settings -> Extension tab -> Copy Token" -ForegroundColor White
Write-Host "  4. Paste token in extension popup -> Save" -ForegroundColor White
