<#
.SYNOPSIS
    Kixie PowerCall diagnostics for [CLIENT] endpoints.
.DESCRIPTION
    Checks Chrome, Kixie extension, network connectivity, DNS, audio devices.
    Run at L1 before escalating Kixie issues. Attach output to ticket.
.NOTES
    Environment: [CLIENT] Windows endpoints (Chrome + Kixie PowerCall)
    Tier: L1 (read-only)
    KB: KB-[CLIENT]-KIXIE-VM-001 (voicemail setup — not diagnostics)
#>

$results = @()
Write-Host "=== Kixie Diagnostics ===" -ForegroundColor Cyan

# 1. Chrome
$chrome = Get-Process chrome -ErrorAction SilentlyContinue
$msg = if ($chrome) { "PASS: Chrome running ($($chrome.Count) processes)" } else { "FAIL: Chrome NOT running" }
Write-Host "  $msg"; $results += $msg

# 2. Kixie extension
$found = $false
$extPath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default\Extensions"
if (Test-Path $extPath) {
    Get-ChildItem $extPath -Directory -EA SilentlyContinue | ForEach-Object {
        Get-ChildItem $_.FullName -Recurse -Filter "manifest.json" -EA SilentlyContinue | ForEach-Object {
            if ((Get-Content $_.FullName -Raw -EA SilentlyContinue) -match "kixie") { $found = $true }
        }
    }
}
$msg = if ($found) { "PASS: Kixie extension found" } else { "WARN: Kixie extension not found" }
Write-Host "  $msg"; $results += $msg

# 3. Network
foreach ($h in @("app.kixie.com","api.kixie.com")) {
    $t = Test-NetConnection -ComputerName $h -Port 443 -WarningAction SilentlyContinue
    $msg = if ($t.TcpTestSucceeded) { "PASS: ${h}:443 reachable" } else { "FAIL: ${h}:443 unreachable" }
    Write-Host "  $msg"; $results += $msg
}

# 4. DNS
try { $dns = Resolve-DnsName "app.kixie.com" -EA Stop; $msg = "PASS: resolves to $($dns[0].IPAddress)" }
catch { $msg = "FAIL: DNS resolution failed" }
Write-Host "  $msg"; $results += $msg

# 5. Audio
$audio = Get-CimInstance Win32_SoundDevice -EA SilentlyContinue
$msg = if ($audio) { "PASS: $($audio.Count) audio device(s)" } else { "FAIL: No audio devices" }
Write-Host "  $msg"; $results += $msg

# Summary
$fails = ($results | Where-Object { $_ -match "^FAIL" }).Count
Write-Host "`n=== Summary: $($results.Count) checks, $fails failures ===" -ForegroundColor Cyan
Write-Host "=== Paste into ticket ===" -ForegroundColor Yellow
$results | ForEach-Object { Write-Host "  $_" }
