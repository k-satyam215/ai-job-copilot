# AI Job Copilot — Final Deploy Script
# Run this from PowerShell as: .\scripts\final_deploy.ps1

$ROOT = "C:\Users\ksaty\Desktop\ai-job-copilot"
$BACKEND_URL = "https://ai-job-copilot-backend.onrender.com"
$FRONTEND_URL = "https://ai-job-copilot-psi.vercel.app"

Write-Host "`n===================================================" -ForegroundColor Cyan
Write-Host " AI Job Copilot — Final Deploy" -ForegroundColor Cyan
Write-Host "===================================================`n" -ForegroundColor Cyan

# Step 1: Rebuild frontend with correct production API URL
Write-Host "[1/4] Building frontend with production API URL..." -ForegroundColor Yellow
$env:NEXT_PUBLIC_API_BASE = $BACKEND_URL
Set-Location "$ROOT\frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Frontend build OK" -ForegroundColor Green

# Step 2: Verify bundle does NOT contain localhost
Write-Host "`n[2/4] Verifying bundle has no localhost leak..." -ForegroundColor Yellow
$leak = Get-ChildItem "$ROOT\frontend\.next\static\chunks" -Recurse -Filter "*.js" |
    Select-String "127\.0\.0\.1" | Select-Object -First 1
if ($leak) {
    Write-Host "WARNING: localhost found in bundle — check .env.local" -ForegroundColor Red
} else {
    Write-Host "  Bundle clean — no localhost URLs" -ForegroundColor Green
}

# Step 3: Package extension
Write-Host "`n[3/4] Packaging Chrome extension..." -ForegroundColor Yellow
Set-Location $ROOT
$zipPath = "$ROOT\outputs\ai-job-copilot-extension.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$ROOT\extension\*" -DestinationPath $zipPath
Write-Host "  Extension zipped: $zipPath" -ForegroundColor Green

# Step 4: Git commit + push
Write-Host "`n[4/4] Committing and pushing to GitHub..." -ForegroundColor Yellow
Set-Location $ROOT
git add render.yaml frontend/.env.production extension/background.js extension/manifest.json outputs/ai-job-copilot-extension.zip
git add -u
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "deploy: final launch fix — correct Render backend URL [$timestamp]"
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Pushed to GitHub!" -ForegroundColor Green

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host " DEPLOY COMPLETE!" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""
Write-Host " Frontend (Vercel): $FRONTEND_URL" -ForegroundColor Cyan
Write-Host " Backend  (Render): $BACKEND_URL" -ForegroundColor Cyan
Write-Host " Health check:      $BACKEND_URL/health" -ForegroundColor Cyan
Write-Host ""
Write-Host " Render Dashboard: https://dashboard.render.com" -ForegroundColor Yellow
Write-Host " -> Check 'ai-job-copilot-backend' service is deploying" -ForegroundColor Yellow
Write-Host ""
Write-Host " After Render deploy (2-3 min), test:" -ForegroundColor Yellow
Write-Host "   curl $BACKEND_URL/health" -ForegroundColor White
Write-Host "   curl $BACKEND_URL/ready" -ForegroundColor White
Write-Host ""
Write-Host " Extension zip: outputs\ai-job-copilot-extension.zip" -ForegroundColor Cyan
Write-Host " -> Chrome -> chrome://extensions -> Load unpacked -> select 'extension' folder" -ForegroundColor White
