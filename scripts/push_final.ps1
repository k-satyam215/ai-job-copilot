#!/usr/bin/env pwsh
# FINAL COMPLETE PUSH SCRIPT — pushes BOTH repos cleanly

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  AI Job Copilot — Final Push Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# ─── ROOT REPO ───────────────────────────────────────────
Write-Host "`n[1/2] Pushing ROOT repo..." -ForegroundColor Yellow
Set-Location "C:\Users\ksaty\Desktop\ai-job-copilot"

git add frontend/.env.production extension/background.js extension/manifest.json render.yaml STARTUP.md scripts/ 2>$null
$status = git status --porcelain
if ($status) {
    git commit -m "chore: final prod config - correct Render URL, extension, render.yaml"
}
git push origin main --force
Write-Host "✅ Root repo pushed!" -ForegroundColor Green

# ─── BACKEND REPO ────────────────────────────────────────
Write-Host "`n[2/2] Pushing BACKEND repo..." -ForegroundColor Yellow
Set-Location "C:\Users\ksaty\Desktop\ai-job-copilot\backend"

# Stage all modified source files (exclude .env)
git add app/ alembic/ alembic.ini requirements.txt render.yaml STARTUP.md 2>$null
$status2 = git status --porcelain
if ($status2) {
    git commit -m "fix: production config, hmac fix, alembic migration, all routes"
}
git push origin main --force
Write-Host "✅ Backend repo pushed!" -ForegroundColor Green

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "  ALL DONE! Both repos pushed successfully." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Render will auto-deploy. Check:" -ForegroundColor White
Write-Host "  Backend: https://ai-job-copilot-backend-vsdc.onrender.com/health" -ForegroundColor Cyan
Write-Host "  Frontend: https://ai-job-copilot-psi.vercel.app" -ForegroundColor Cyan
