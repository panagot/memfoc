# MemFOC — run all verification tests
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $Root

& .\.venv\Scripts\Activate.ps1

Write-Host ""
Write-Host "=== 1/3 Pytest (store + assistants + API integration) ===" -ForegroundColor Cyan
python -m pytest tests/ -v -p no:langsmith
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "=== 2/3 Live API smoke test (requires server on :8787) ===" -ForegroundColor Cyan
try {
  Invoke-RestMethod -Uri "http://127.0.0.1:8787/api/health" -TimeoutSec 3 | Out-Null
} catch {
  Write-Host "API not running - start with: python -m demo.server.main" -ForegroundColor Yellow
  exit 1
}

python scripts\smoke_test_api.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "=== 3/3 Frontend build ===" -ForegroundColor Cyan
Set-Location "$Root\demo\web"
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "=== All checks passed ===" -ForegroundColor Green
