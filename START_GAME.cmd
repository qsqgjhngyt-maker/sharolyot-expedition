@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Для запуска нужен Node.js 24.
 echo Установите его с https://nodejs.org/ и запустите этот файл снова.
 goto failed
)
if not exist "dist\index.html" (
 echo Первый запуск исходников: установка бесплатных зависимостей и сборка.
 call npm.cmd ci --no-audit --no-fund
 if errorlevel 1 goto failed
 call npm.cmd run build
 if errorlevel 1 goto failed
)
node server.mjs --open
if errorlevel 1 goto failed
exit /b 0
:failed
pause
exit /b 1
