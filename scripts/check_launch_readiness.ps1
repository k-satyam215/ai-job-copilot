$ErrorActionPreference = "Stop"

Write-Host "Checking AI Job Copilot launch readiness..."

$requiredFiles = @(
  ".env.example",
  "docker-compose.yml",
  "backend/Dockerfile",
  "frontend/Dockerfile",
  "docs/LAUNCH_CHECKLIST.md",
  "docs/PRIVACY_POLICY.md",
  "extension/manifest.json"
)

foreach ($file in $requiredFiles) {
  if (!(Test-Path $file)) {
    throw "Missing required launch file: $file"
  }
}

.\.venv\Scripts\python.exe -m compileall -q backend\app
Push-Location frontend
npm run build
Pop-Location

Write-Host "Launch readiness checks passed."
