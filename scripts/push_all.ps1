cd C:\Users\ksaty\Desktop\ai-job-copilot

# Check git status
Write-Host "=== Git Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Staging all tracked modified files ===" -ForegroundColor Yellow
git add -A

Write-Host "`n=== Status after staging ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Committing ===" -ForegroundColor Yellow
git commit -m "fix: stage all modified files for production deploy"

Write-Host "`n=== Pushing ===" -ForegroundColor Yellow
git push origin main

Write-Host "`nDone! Check above for any untracked files." -ForegroundColor Green
