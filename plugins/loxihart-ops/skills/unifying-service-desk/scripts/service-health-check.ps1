# Service Health Check — Critical Services Status
# Run as Administrator
# Category: Cross-cutting (useful for any category)
# Tier: L1
# Purpose: Quick status sweep of critical Windows services.
#          Identifies stopped services that should be running.
#          Useful as a first diagnostic step for many issue categories.

#Requires -RunAsAdministrator

Write-Host "=== Service Health Check ===" -ForegroundColor Cyan
Write-Host ""

# Critical services that should always be running
$criticalServices = @(
    @{ Name = "Audiosrv";               Display = "Windows Audio" }
    @{ Name = "AudioEndpointBuilder";    Display = "Audio Endpoint Builder" }
    @{ Name = "Spooler";                Display = "Print Spooler" }
    @{ Name = "Dnscache";               Display = "DNS Client" }
    @{ Name = "Dhcp";                   Display = "DHCP Client" }
    @{ Name = "NlaSvc";                 Display = "Network Location Awareness" }
    @{ Name = "LanmanWorkstation";       Display = "Workstation (SMB)" }
    @{ Name = "LanmanServer";            Display = "Server (File Sharing)" }
    @{ Name = "W32Time";                Display = "Windows Time" }
    @{ Name = "Winmgmt";               Display = "WMI" }
    @{ Name = "EventLog";              Display = "Windows Event Log" }
    @{ Name = "Schedule";              Display = "Task Scheduler" }
    @{ Name = "wuauserv";              Display = "Windows Update" }
    @{ Name = "WinDefend";             Display = "Windows Defender" }
    @{ Name = "mpssvc";                Display = "Windows Firewall" }
    @{ Name = "BFE";                   Display = "Base Filtering Engine" }
    @{ Name = "CryptSvc";             Display = "Cryptographic Services" }
    @{ Name = "RpcSs";                Display = "Remote Procedure Call" }
    @{ Name = "SamSs";                Display = "Security Accounts Manager" }
    @{ Name = "BITS";                  Display = "Background Intelligent Transfer" }
)

$stoppedCount = 0
$runningCount = 0
$notFoundCount = 0

Write-Host ("{0,-40} {1,-12} {2}" -f "Service", "Status", "Start Type") -ForegroundColor White
Write-Host ("-" * 70)

foreach ($svc in $criticalServices) {
    $service = Get-Service -Name $svc.Name -ErrorAction SilentlyContinue
    if ($service) {
        $startType = (Get-WmiObject Win32_Service -Filter "Name='$($svc.Name)'" -ErrorAction SilentlyContinue).StartMode
        if ($service.Status -eq "Running") {
            Write-Host ("{0,-40} {1,-12} {2}" -f $svc.Display, "Running", $startType) -ForegroundColor Green
            $runningCount++
        } else {
            Write-Host ("{0,-40} {1,-12} {2}" -f $svc.Display, $service.Status, $startType) -ForegroundColor Red
            $stoppedCount++
        }
    } else {
        Write-Host ("{0,-40} {1,-12}" -f $svc.Display, "NOT FOUND") -ForegroundColor Yellow
        $notFoundCount++
    }
}

Write-Host ""
Write-Host ("-" * 70)
Write-Host "Running: $runningCount | Stopped: $stoppedCount | Not Found: $notFoundCount" -ForegroundColor $(if ($stoppedCount -gt 0) { "Red" } else { "Green" })

if ($stoppedCount -gt 0) {
    Write-Host ""
    Write-Host "STOPPED SERVICES DETECTED — these may be causing issues." -ForegroundColor Red
    Write-Host "To restart a stopped service: " -ForegroundColor Yellow
    Write-Host "  Start-Service -Name 'ServiceName'" -ForegroundColor White
    Write-Host "Or use: services.msc → right-click → Start" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "All critical services are running normally." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
