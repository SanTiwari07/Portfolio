@echo off
echo =========================================================
echo   npm Install — Sanskar Portfolio v3
echo =========================================================
echo.

cd /d "%~dp0..\portfolio"
call npm install
if %errorlevel% neq 0 (
  echo ERROR: npm install failed.
  pause
  exit /b 1
)
echo.
echo Dependencies installed successfully.
echo Run: scripts\setup.bat  to copy assets and start dev server.
