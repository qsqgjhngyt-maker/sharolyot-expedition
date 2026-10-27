@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Для запуска нужен Node.js 24 LTS.
 echo Установите его с https://nodejs.org/ и запустите этот файл снова.
 pause
 exit /b 1
)
if not exist "dist\index.html" (
 echo Не найдена готовая сборка dist. Восстановите её командой npm.cmd run build.
 pause
 exit /b 1
)
node server.mjs --open
if errorlevel 1 pause
