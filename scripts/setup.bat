@echo off
echo =========================================================
echo   Sanskar Tiwari Portfolio v3 - Full Setup
echo =========================================================
echo.
echo Run this script ONCE from the project root:
echo   d:\Projects\Sanskar Portfolio v3\
echo.

:: Step 1 — Install npm dependencies
echo [1/3] Installing npm dependencies in portfolio/...
cd /d "%~dp0..\portfolio"
if %errorlevel% neq 0 (
  echo ERROR: Could not navigate to portfolio/ folder.
  pause
  exit /b 1
)
call npm install
if %errorlevel% neq 0 (
  echo ERROR: npm install failed.
  pause
  exit /b 1
)
echo Done.
echo.

:: Step 2 — Copy assets
echo [2/3] Copying assets to portfolio/public/assets/...
cd /d "%~dp0.."
call scripts\copy_assets.bat
echo Done.
echo.

:: Step 3 — Launch dev server
echo [3/3] Starting dev server...
echo      Open: http://localhost:3000
echo.
cd /d "%~dp0..\portfolio"
npm run dev
