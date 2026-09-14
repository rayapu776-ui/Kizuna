# PowerShell script to launch Kizuna Backend server
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Starting Kizuna (絆) Backend API Service..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

$env:PYTHONPATH = "."
.\backend\venv\Scripts\python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

