<#
.SYNOPSIS
    [CLIENT] endpoint environment verification.
.DESCRIPTION
    Validates domain join, Kaseya, Bitdefender, AnyConnect, Chrome, Office,
    Bitwarden. Run on new deployments or environment-level issues.
    Complements [CLIENT]-New_Computer_Deployment_v2_0.docx and
    [CLIENT]_Standard_EndUser_Setup_Guide_v2_0.docx.
.NOTES
    Environment: [CLIENT] Windows endpoints
    Tier: L1 (read-only)
    [COMPLIANCE FRAMEWORK]: No credential or access actions
#>

$results = @()
Write-Host "=== [CLIENT] Endpoint Check ===" -ForegroundColor Cyan
Write-Host "Host: $env:COMPUTERNAME | User: $env:USERNAME | $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

$cs = Get-CimInstance Win32_ComputerSystem
$msg = if ($cs.PartOfDomain -and $cs.Domain -eq "[HOSTNAME]") { "PASS: Domain [HOSTNAME]" }
       elseif ($cs.PartOfDomain) { "WARN: Domain $($cs.Domain)" } else { "FAIL: Not joined" }
Write-Host "  $msg"; $results += $msg

$os = Get-CimInstance Win32_OperatingSystem
Write-Host "  INFO: $($os.Caption) Build $($os.BuildNumber)"; $results += "OS: $($os.Caption) $($os.BuildNumber)"

foreach ($pair in @(@("Kaseya Agent","Kaseya"),@("EPSecurityService","Bitdefender"),@("vpnagent","AnyConnect"))) {
    $svc = Get-Service -Name $pair[0] -EA SilentlyContinue
    $msg = if ($svc -and $svc.Status -eq "Running") { "PASS: $($pair[1]) running" }
           elseif ($svc) { "WARN: $($pair[1]) $($svc.Status)" }
           else { "WARN: $($pair[1]) not found" }
    Write-Host "  $msg"; $results += $msg
}

$chr = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" -EA SilentlyContinue
$msg = if ($chr) { "PASS: Chrome installed" } else { "FAIL: Chrome missing (Kixie broken)" }
Write-Host "  $msg"; $results += $msg

$ol = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\OUTLOOK.EXE" -EA SilentlyContinue
$msg = if ($ol) { "PASS: Outlook installed" } else { "WARN: Outlook missing" }
Write-Host "  $msg"; $results += $msg

$bw = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*" -EA SilentlyContinue |
    Where-Object { $_.DisplayName -match "Bitwarden" }
$msg = if ($bw) { "PASS: Bitwarden installed" } else { "WARN: Bitwarden missing" }
Write-Host "  $msg"; $results += $msg

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
$results | ForEach-Object { Write-Host "  $_" }
