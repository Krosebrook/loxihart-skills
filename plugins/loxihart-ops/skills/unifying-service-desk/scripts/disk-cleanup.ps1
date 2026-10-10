# Disk Cleanup — Reclaim Space
# Run as Administrator
# Category: Performance
# Tier: L1
# Purpose: Clears temp files, Windows Update cache, error reports,
#          thumbnail cache, and other safe-to-delete system files.
#          Typically reclaims 1-10 GB depending on system age.

#Requires -RunAsAdministrator

Write-Host "=== Disk Cleanup ===" -ForegroundColor Cyan
$totalReclaimed = 0

function Get-FolderSize($path) {
    if (Test-Path $path) {
        return (Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
                Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue).Sum / 1MB
    }
    return 0
}

function Clear-Folder($path, $name) {
    if (Test-Path $path) {
        $sizeBefore = Get-FolderSize $path
        try {
            Get-ChildItem -Path $path -Recurse -Force -ErrorAction SilentlyContinue |
                Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
            $sizeAfter = Get-FolderSize $path
            $freed = [math]::Round($sizeBefore - $sizeAfter, 1)
            if ($freed -gt 0) {
                Write-Host "  [OK] $name — freed ${freed} MB" -ForegroundColor Green
                return $freed
            } else {
                Write-Host "  [OK] $name — already clean" -ForegroundColor Green
            }
        } catch {
            Write-Host "  [WARN] $name — some files locked: $_" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  [SKIP] $name — path not found" -ForegroundColor Gray
    }
    return 0
}

# Show current disk space
$disk = Get-WmiObject Win32_LogicalDisk -Filter "DeviceID='C:'"
$freeGB = [math]::Round($disk.FreeSpace / 1GB, 1)
$totalGB = [math]::Round($disk.Size / 1GB, 1)
$usedPct = [math]::Round((1 - $disk.FreeSpace / $disk.Size) * 100, 0)
Write-Host "Current C: drive — $freeGB GB free of $totalGB GB ($usedPct% used)" -ForegroundColor Yellow
Write-Host ""

# Windows Temp
Write-Host "Cleaning system temporary files..." -ForegroundColor Yellow
$totalReclaimed += Clear-Folder "$env:SystemRoot\Temp" "Windows Temp"

# User Temp
$totalReclaimed += Clear-Folder "$env:TEMP" "User Temp"

# Windows Update Cache
Write-Host "Cleaning Windows Update cache..." -ForegroundColor Yellow
Stop-Service -Name "wuauserv" -Force -ErrorAction SilentlyContinue
$totalReclaimed += Clear-Folder "$env:SystemRoot\SoftwareDistribution\Download" "Windows Update Downloads"
Start-Service -Name "wuauserv" -ErrorAction SilentlyContinue

# Windows Error Reports
$totalReclaimed += Clear-Folder "$env:LOCALAPPDATA\CrashDumps" "Crash Dumps"
$totalReclaimed += Clear-Folder "$env:ProgramData\Microsoft\Windows\WER" "Windows Error Reports"

# Thumbnail Cache
$totalReclaimed += Clear-Folder "$env:LOCALAPPDATA\Microsoft\Windows\Explorer" "Thumbnail Cache"

# Recycle Bin
Write-Host "Emptying Recycle Bin..." -ForegroundColor Yellow
try {
    Clear-RecycleBin -Force -ErrorAction Stop
    Write-Host "  [OK] Recycle Bin emptied" -ForegroundColor Green
} catch {
    Write-Host "  [WARN] Could not empty Recycle Bin: $_" -ForegroundColor Yellow
}

# Delivery Optimization Cache
$totalReclaimed += Clear-Folder "$env:SystemRoot\ServiceProfiles\NetworkService\AppData\Local\Microsoft\Windows\DeliveryOptimization\Cache" "Delivery Optimization Cache"

# Final Report
Write-Host ""
$disk2 = Get-WmiObject Win32_LogicalDisk -Filter "DeviceID='C:'"
$freeGB2 = [math]::Round($disk2.FreeSpace / 1GB, 1)
$usedPct2 = [math]::Round((1 - $disk2.FreeSpace / $disk2.Size) * 100, 0)
$actualFreed = [math]::Round($freeGB2 - $freeGB, 1)

Write-Host "=== Complete ===" -ForegroundColor Cyan
Write-Host "C: drive now — $freeGB2 GB free ($usedPct2% used)" -ForegroundColor Green
Write-Host "Total space reclaimed: ~${actualFreed} GB" -ForegroundColor Green
