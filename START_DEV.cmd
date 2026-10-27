@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
if not exist "node_modules\vite" (
 call npm.cmd ci --no-audit --no-fund
 if errorlevel 1 (
  pause
  exit /b 1
 )
)
call npm.cmd run dev
pause
