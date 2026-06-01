$ErrorActionPreference = "Stop"

$outputDir = "outputs"
$zipPath = Join-Path $outputDir "ai-job-copilot-extension.zip"
if (!(Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir | Out-Null
}
if (Test-Path $zipPath) {
  Remove-Item $zipPath
}

Compress-Archive -Path "extension\*" -DestinationPath $zipPath
Write-Host "Extension package created: $zipPath"
