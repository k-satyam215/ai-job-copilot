cd C:\Users\ksaty\Desktop\ai-job-copilot

git add render.yaml frontend/.env.production extension/background.js extension/manifest.json STARTUP.md scripts/final_deploy.ps1 scripts/start_local.ps1
git add -u
git commit -m "fix: correct Render backend URL to ai-job-copilot-backend.onrender.com, add alembic to build, update extension URLs"
git push origin main

Write-Host ""
Write-Host "PUSHED! Now:" -ForegroundColor Green
Write-Host "1. Go to https://dashboard.render.com -> Create 'ai-job-copilot-backend' service" -ForegroundColor Yellow
Write-Host "2. Go to https://vercel.com -> Set NEXT_PUBLIC_API_BASE env var" -ForegroundColor Yellow
Write-Host "3. Run: cd backend && alembic upgrade head   (creates Neon tables)" -ForegroundColor Yellow
