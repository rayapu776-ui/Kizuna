# Launch both Backend and Frontend in separate concurrent PowerShell windows
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  Starting Kizuna (絆) Full-Stack Application in Development Mode" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting Kizuna Backend on http://127.0.0.1:8000...' -ForegroundColor Cyan; $env:PYTHONPATH='.'; .\backend\venv\Scripts\python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting Kizuna Frontend on http://localhost:5173...' -ForegroundColor Green; cd frontend; npm run dev"

Write-Host ""
Write-Host "Services started:" -ForegroundColor Yellow
Write-Host "  -> Backend API:  http://127.0.0.1:8000 (Swagger docs: http://127.0.0.1:8000/docs)" -ForegroundColor White
Write-Host "  -> Frontend App: http://localhost:5173" -ForegroundColor White
Write-Host ""

