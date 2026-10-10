# Print Spooler Fix
# Run as Administrator
# Category: Print / Scan
# Tier: L1
# Purpose: Stops the Print Spooler, clears the print queue files,
#          and restarts the spooler. Resolves stuck print queues
#          and most spooler deadlock issues.

#Requires -RunAsAdministrator

Write-Host "=== Print Spooler Fix ===" -ForegroundColor Cyan

# Stop Print Spooler
Write-Host "Stopping Print Spooler service..." -ForegroundColor Yellow
try {
    Stop-Service -Name "Spooler" -Force -ErrorAction Stop
    Write-Host "  [OK] Print Spooler stopped" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Failed to stop Print Spooler: $_" -ForegroundColor Red
    Write-Host "  Attempting force kill..." -ForegroundColor Yellow
    taskkill /F /IM spoolsv.exe 2>$null
    Start-Sleep -Seconds 2
}

# Clear print queue files
$spoolPath = "$env:SystemRoot\System32\spool\PRINTERS"
Write-Host "Clearing print queue files from $spoolPath..." -ForegroundColor Yellow
$fileCount = (Get-ChildItem -Path $spoolPath -ErrorAction SilentlyContinue | Measure-Object).Count
if ($fileCount -gt 0) {
    try {
        Remove-Item -Path "$spoolPath\*" -Force -ErrorAction Stop
        Write-Host "  [OK] Cleared $fileCount queued print job(s)" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] Failed to clear some files: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  [OK] Print queue was already empty" -ForegroundColor Green
}

# Start Print Spooler
Start-Sleep -Seconds 2
Write-Host "Starting Print Spooler service..." -ForegroundColor Yellow
try {
    Start-Service -Name "Spooler" -ErrorAction Stop
    Write-Host "  [OK] Print Spooler started" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Failed to start Print Spooler: $_" -ForegroundColor Red
    Write-Host "  Try manually: services.msc → Print Spooler → Start" -ForegroundColor Yellow
}

# Verify
$service = Get-Service -Name "Spooler"
Write-Host ""
Write-Host "Print Spooler status: $($service.Status)" -ForegroundColor $(if ($service.Status -eq "Running") { "Green" } else { "Red" })
Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
Write-Host "Ask the user to try printing again." -ForegroundColor White
