$ErrorActionPreference = "Stop"

$backend = $env:BACKEND_URL
if (!$backend) { $backend = "http://127.0.0.1:8000" }

$frontend = $env:FRONTEND_URL
if (!$frontend) { $frontend = "http://127.0.0.1:3000" }

Invoke-WebRequest -UseBasicParsing "$backend/health" | Out-Null
Invoke-WebRequest -UseBasicParsing "$frontend" | Out-Null

Write-Host "Production smoke checks passed for $backend and $frontend"
