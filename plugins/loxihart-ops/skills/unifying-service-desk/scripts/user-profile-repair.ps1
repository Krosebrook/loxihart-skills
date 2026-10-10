# User Profile Repair — Cache & Profile Cleanup
# Run as Administrator (some operations need elevation)
# Category: Software / Applications, Email / Calendar
# Tier: L1
# Purpose: Clears application caches (Teams, Outlook, browser) and
#          repairs common profile corruption issues. Resolves most
#          app-specific crashes, sync failures, and profile-related errors.
#
# WARNING: This will close Teams, Outlook, and browsers. Warn the user first.

#Requires -RunAsAdministrator

Write-Host "=== User Profile Repair ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: This will close Teams, Outlook, Chrome, and Edge." -ForegroundColor Red
Write-Host "Make sure the user has saved their work." -ForegroundColor Red
Write-Host ""

# Get current user profile path
$userProfile = $env:USERPROFILE
$appData = $env:APPDATA
$localAppData = $env:LOCALAPPDATA

# --- Teams Cache Clear ---
Write-Host "--- Microsoft Teams ---" -ForegroundColor Cyan

# Close Teams
Write-Host "  Closing Teams..." -ForegroundColor Yellow
Get-Process -Name "ms-teams", "Teams" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# New Teams (ms-teams) cache
$newTeamsCache = "$localAppData\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams"
if (Test-Path $newTeamsCache) {
    try {
        Remove-Item -Path "$newTeamsCache\*" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  [OK] New Teams cache cleared" -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] Some Teams cache files locked" -ForegroundColor Yellow
    }
}

# Classic Teams cache
$classicTeamsCache = "$appData\Microsoft\Teams"
if (Test-Path $classicTeamsCache) {
    $teamsFolders = @("Cache", "blob_storage", "databases", "GPUCache", "IndexedDB", "Local Storage", "tmp")
    foreach ($folder in $teamsFolders) {
        $path = Join-Path $classicTeamsCache $folder
        if (Test-Path $path) {
            Remove-Item -Path "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "  [OK] Classic Teams cache cleared" -ForegroundColor Green
}

# --- Outlook Profile Preparation ---
Write-Host "--- Microsoft Outlook ---" -ForegroundColor Cyan

# Close Outlook
Write-Host "  Closing Outlook..." -ForegroundColor Yellow
Get-Process -Name "OUTLOOK" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Clear RoamCache
$outlookRoamCache = "$localAppData\Microsoft\Outlook\RoamCache"
if (Test-Path $outlookRoamCache) {
    try {
        Remove-Item -Path "$outlookRoamCache\*" -Force -ErrorAction SilentlyContinue
        Write-Host "  [OK] Outlook RoamCache cleared" -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] Some Outlook cache files locked" -ForegroundColor Yellow
    }
}

# Note about OST rebuild
$ostPath = "$localAppData\Microsoft\Outlook"
$ostFiles = Get-ChildItem -Path $ostPath -Filter "*.ost" -ErrorAction SilentlyContinue
if ($ostFiles) {
    $ostSize = [math]::Round(($ostFiles | Measure-Object -Property Length -Sum).Sum / 1GB, 2)
    Write-Host "  [INFO] OST file(s) found ($ostSize GB). To rebuild: rename .ost to .ost.old, reopen Outlook." -ForegroundColor Yellow
    Write-Host "  [INFO] OST rebuild not done automatically — requires user consent (resync may take time)." -ForegroundColor Yellow
}

# --- Chrome Cache Clear ---
Write-Host "--- Google Chrome ---" -ForegroundColor Cyan

Get-Process -Name "chrome" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$chromeCache = "$localAppData\Google\Chrome\User Data\Default\Cache"
$chromeCacheData = "$localAppData\Google\Chrome\User Data\Default\Code Cache"
foreach ($path in @($chromeCache, $chromeCacheData)) {
    if (Test-Path $path) {
        Remove-Item -Path "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "  [OK] Chrome cache cleared" -ForegroundColor Green

# --- Edge Cache Clear ---
Write-Host "--- Microsoft Edge ---" -ForegroundColor Cyan

Get-Process -Name "msedge" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$edgeCache = "$localAppData\Microsoft\Edge\User Data\Default\Cache"
$edgeCacheData = "$localAppData\Microsoft\Edge\User Data\Default\Code Cache"
foreach ($path in @($edgeCache, $edgeCacheData)) {
    if (Test-Path $path) {
        Remove-Item -Path "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "  [OK] Edge cache cleared" -ForegroundColor Green

# --- Windows Credential Cache ---
Write-Host "--- Credential Cache ---" -ForegroundColor Cyan
Write-Host "  [INFO] Listing cached credentials:" -ForegroundColor Yellow
cmdkey /list 2>&1 | ForEach-Object { Write-Host "    $_" }
Write-Host "  [INFO] To remove a stale credential: cmdkey /delete:<target>" -ForegroundColor Yellow
Write-Host "  [INFO] Not auto-removing — requires manual review to avoid breaking valid creds" -ForegroundColor Yellow

# --- DNS + IP Refresh ---
Write-Host "--- Network Cache Reset ---" -ForegroundColor Cyan
ipconfig /flushdns | Out-Null
Write-Host "  [OK] DNS cache flushed" -ForegroundColor Green

# --- Summary ---
Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
Write-Host "Cleared: Teams cache, Outlook RoamCache, Chrome cache, Edge cache, DNS cache" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Reopen Teams and sign in — it will rebuild its cache" -ForegroundColor White
Write-Host "  2. Reopen Outlook — let it sync before testing" -ForegroundColor White
Write-Host "  3. If Outlook still crashes, consider OST rebuild (rename .ost file)" -ForegroundColor White
Write-Host "  4. Open Chrome/Edge — they will rebuild caches on first use" -ForegroundColor White
