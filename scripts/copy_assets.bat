@echo off
echo =========================================================
echo   Asset Copy Script — Sanskar Portfolio v3
echo =========================================================
echo Copies assets to portfolio/public/assets/
echo.

set ROOT=%~dp0..
set DEST=%ROOT%\portfolio\public\assets

:: Create destination directories
mkdir "%DEST%\car" 2>nul
mkdir "%DEST%\awards\techfiesta" 2>nul
mkdir "%DEST%\awards\pune-agri" 2>nul
mkdir "%DEST%\awards\vois" 2>nul

:: Copy car images + GLB model
echo Copying car assets...
xcopy /Y /Q "%ROOT%\Car Stock Image\*" "%DEST%\car\"

:: Copy award images
echo Copying TechFiesta awards...
xcopy /Y /Q "%ROOT%\Techfiesta\*" "%DEST%\awards\techfiesta\"

echo Copying Pune Agri awards...
xcopy /Y /Q "%ROOT%\Pune Agri\*" "%DEST%\awards\pune-agri\"

echo Copying VOIS awards...
xcopy /Y /Q "%ROOT%\vois\*" "%DEST%\awards\vois\"

echo.
echo Assets copied successfully to:
echo   %DEST%
