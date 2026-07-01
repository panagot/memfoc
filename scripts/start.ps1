$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $Root

if (-not (Test-Path ".venv")) {
  python -m venv .venv
}

& .\.venv\Scripts\Activate.ps1
pip install -e ".[demo]" | Out-Null

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root'; .\.venv\Scripts\Activate.ps1; python -m demo.server.main"
Start-Sleep -Seconds 2

Set-Location "$Root\demo\web"
if (-not (Test-Path "node_modules")) {
  npm install
}
npm run dev
