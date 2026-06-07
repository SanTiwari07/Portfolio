# integrate-game.ps1
# Run from: D:\Projects\Sanskar Portfolio v3\portfolio
# Run as: powershell -ExecutionPolicy Bypass -File integrate-game.ps1

$portfolioDir = "D:\Projects\Sanskar Portfolio v3\portfolio"
$gameDir = "D:\Projects\Sanskar Portfolio v3\Game"

Write-Host "=== Step 1: Installing npm dependencies ===" -ForegroundColor Cyan
Set-Location $portfolioDir
# Install required dependencies for the game
npm install zustand@3.7.0 "@react-three/cannon" "@supabase/supabase-js@1.35.7" leva react-colorful use-asset lodash-es inter-ui
npm install -D three-stdlib "@types/lodash-es"

Write-Host "`n=== Step 2: Creating public/game asset directories ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "$portfolioDir\public\game\models" | Out-Null
New-Item -ItemType Directory -Force -Path "$portfolioDir\public\game\sounds" | Out-Null
New-Item -ItemType Directory -Force -Path "$portfolioDir\public\game\textures" | Out-Null
New-Item -ItemType Directory -Force -Path "$portfolioDir\public\game\images" | Out-Null

Write-Host "=== Step 3: Copying models ===" -ForegroundColor Cyan
Copy-Item "$gameDir\public\models\*" "$portfolioDir\public\game\models\" -Force

Write-Host "=== Step 4: Copying sounds ===" -ForegroundColor Cyan
Copy-Item "$gameDir\public\sounds\*" "$portfolioDir\public\game\sounds\" -Force

Write-Host "=== Step 5: Copying textures ===" -ForegroundColor Cyan
Copy-Item "$gameDir\public\textures\*" "$portfolioDir\public\game\textures\" -Force

Write-Host "=== Step 6: Copying images ===" -ForegroundColor Cyan
if (Test-Path "$gameDir\public\images") {
    Copy-Item "$gameDir\public\images\*" "$portfolioDir\public\game\images\" -Force
}

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Now run the dev server: npm run dev" -ForegroundColor Yellow
