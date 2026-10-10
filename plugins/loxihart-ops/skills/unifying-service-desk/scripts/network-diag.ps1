# Network Diagnostic Battery
# Run as Administrator (some commands require elevation)
# Category: Network / Connectivity
# Tier: L1
# Purpose: Collects comprehensive network diagnostic data in one pass.
#          Output should be captured and attached to the ticket.

#Requires -RunAsAdministrator

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$outputFile = "$env:TEMP\network-diag-$timestamp.txt"

function Write-Section($title) {
    $separator = "=" * 60
    "`n$separator" | Tee-Object -FilePath $outputFile -Append
    "  $title" | Tee-Object -FilePath $outputFile -Append
    "$separator`n" | Tee-Object -FilePath $outputFile -Append
}

Write-Host "=== Network Diagnostic Battery ===" -ForegroundColor Cyan
Write-Host "Output will be saved to: $outputFile" -ForegroundColor Yellow
Write-Host ""

# IP Configuration
Write-Section "IP Configuration (ipconfig /all)"
ipconfig /all | Tee-Object -FilePath $outputFile -Append

# DNS Resolution - Internal
Write-Section "DNS Resolution - Internal Domain"
try {
    $internalDomain = (Get-WmiObject Win32_ComputerSystem).Domain
    nslookup $internalDomain 2>&1 | Tee-Object -FilePath $outputFile -Append
} catch {
    "Could not determine internal domain: $_" | Tee-Object -FilePath $outputFile -Append
}

# DNS Resolution - External
Write-Section "DNS Resolution - External (google.com)"
nslookup google.com 2>&1 | Tee-Object -FilePath $outputFile -Append

# Gateway Ping
Write-Section "Gateway Ping"
$gateway = (Get-NetRoute -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue | Select-Object -First 1).NextHop
if ($gateway) {
    "Gateway: $gateway" | Tee-Object -FilePath $outputFile -Append
    ping $gateway -n 4 | Tee-Object -FilePath $outputFile -Append
} else {
    "No default gateway found" | Tee-Object -FilePath $outputFile -Append
}

# Internet Ping (bypasses DNS)
Write-Section "Internet Ping - 8.8.8.8 (bypasses DNS)"
ping 8.8.8.8 -n 4 | Tee-Object -FilePath $outputFile -Append

# DNS Ping (tests DNS resolution + connectivity)
Write-Section "Internet Ping - google.com (tests DNS + connectivity)"
ping google.com -n 4 | Tee-Object -FilePath $outputFile -Append

# Traceroute to 8.8.8.8
Write-Section "Traceroute to 8.8.8.8"
tracert -d -w 1000 -h 15 8.8.8.8 2>&1 | Tee-Object -FilePath $outputFile -Append

# Active Connections
Write-Section "Active Network Connections (listening ports)"
netstat -an | Select-String "LISTENING" | Tee-Object -FilePath $outputFile -Append

# Wi-Fi Info (if applicable)
Write-Section "Wi-Fi Interface Details"
try {
    netsh wlan show interfaces 2>&1 | Tee-Object -FilePath $outputFile -Append
} catch {
    "No Wi-Fi interface found or service not running" | Tee-Object -FilePath $outputFile -Append
}

# DNS Cache Flush
Write-Section "DNS Cache Flush"
ipconfig /flushdns | Tee-Object -FilePath $outputFile -Append

# DHCP Lease Renew
Write-Section "DHCP Lease Release/Renew"
Write-Host "  Releasing DHCP lease..." -ForegroundColor Yellow
ipconfig /release 2>&1 | Tee-Object -FilePath $outputFile -Append
Start-Sleep -Seconds 2
Write-Host "  Renewing DHCP lease..." -ForegroundColor Yellow
ipconfig /renew 2>&1 | Tee-Object -FilePath $outputFile -Append

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
Write-Host "Full output saved to: $outputFile" -ForegroundColor Green
Write-Host "Attach this file to the ticket." -ForegroundColor White
