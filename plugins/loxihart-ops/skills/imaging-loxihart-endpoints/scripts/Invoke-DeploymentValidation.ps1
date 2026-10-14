#Requires -Version 5.1
<#
.SYNOPSIS
    Validates a completed Loxihart/[CLIENT] endpoint deployment against the gate exit
    criteria in the Computer Imaging & Deployment Reference Guide v3.1.

.DESCRIPTION
    Read-only. Performs no configuration changes. Machine-checks the exit
    criteria for Gate 1 (inferred), Gates 5-9, emits a structured result object,
    and generates a paste-ready ticket completion note.

    Exit codes:
      0  no FAIL results
      1  one or more FAIL results
      2  fatal error before validation could run

    Statuses:
      PASS    criterion met
      FAIL    criterion not met, blocks closure
      WARN    inconclusive, human confirmation required, does not block
      MANUAL  cannot be checked from this host, must be verified by a person
      SKIP    not applicable to this run

.PARAMETER ExpectedHostname
    Hostname the device should have, per the naming convention
    abs-nb-lox-NNN (lowercase; case-insensitive on Windows; 14 chars).

.PARAMETER AuthorizedUser
    DOMAIN\username of the principal authorized for RDP in the service ticket.
    Omit when Gate 6 was intentionally blocked; Gate 6 checks then report SKIP.

.PARAMETER Ticket
    Service ticket reference, recorded in output and the generated note.

.PARAMETER ExpectedDomain
    NetBIOS or DNS domain the device should have joined.

.PARAMETER ProductionSubnetPrefix
    Address prefix expected after VLAN migration to ports 25-48.

.PARAMETER DomainControllerFqdn
    Domain controller used for the internal reachability check.

.PARAMETER RequiredSoftware
    Display-name substrings that must appear in the installed software list.

.PARAMETER OutputPath
    Optional. Appends the result object as one JSON line. Safe for batch runs.

.PARAMETER LogPath
    Optional. Appends timestamped log lines.

.PARAMETER SkipConnectivity
    Skips the three network reachability checks. Use on an isolated bench.

.PARAMETER SelfTest
    Runs the internal assertion suite against the pure functions and exits.
    Does not touch the machine. Runs anywhere, including non-domain hosts.

.EXAMPLE
    .\Invoke-DeploymentValidation.ps1 -ExpectedHostname 'abs-nb-lox-045' -AuthorizedUser '[CLIENT]\jdoe' -Ticket 'SD-104882'

.EXAMPLE
    .\Invoke-DeploymentValidation.ps1 -SelfTest

.NOTES
    Run elevated. Get-Tpm, BitLocker cmdlets, and Confirm-SecureBootUEFI all
    require administrator rights and return misleading results without them.
#>
[CmdletBinding(DefaultParameterSetName = 'Validate')]
param(
    [Parameter(Mandatory = $true, ParameterSetName = 'Validate')]
    [ValidatePattern('(?i)^abs-nb-lox-\d{3}$')]
    [string] $ExpectedHostname,

    [Parameter(ParameterSetName = 'Validate')]
    [ValidatePattern('^[A-Za-z0-9._-]+\\[A-Za-z0-9._-]+$')]
    [string] $AuthorizedUser,

    [Parameter(ParameterSetName = 'Validate')]
    [ValidateNotNullOrEmpty()]
    [string] $Ticket = 'UNKNOWN',

    [Parameter(ParameterSetName = 'Validate')]
    [ValidateNotNullOrEmpty()]
    [string] $ExpectedDomain = '[CLIENT]',

    [Parameter(ParameterSetName = 'Validate')]
    [ValidatePattern('^\d{1,3}\.\d{1,3}\.$')]
    [string] $ProductionSubnetPrefix = '[SUBNET]',

    [Parameter(ParameterSetName = 'Validate')]
    [ValidateNotNullOrEmpty()]
    [string] $DomainControllerFqdn = '[HOSTNAME]',

    [Parameter(ParameterSetName = 'Validate')]
    [string[]] $RequiredSoftware = @('Bitdefender', 'Dell Command', 'OpenVPN', 'Microsoft 365'),

    [Parameter(ParameterSetName = 'Validate')]
    [string] $OutputPath,

    [Parameter(ParameterSetName = 'Validate')]
    [string] $LogPath,

    [Parameter(ParameterSetName = 'Validate')]
    [switch] $SkipConnectivity,

    [Parameter(Mandatory = $true, ParameterSetName = 'SelfTest')]
    [switch] $SelfTest
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$script:LogFile = $null

# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------

function Write-Log {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][string] $Message,
        [ValidateSet('INFO', 'WARN', 'ERROR')][string] $Level = 'INFO'
    )
    $line = '{0} [{1}] {2}' -f (Get-Date -Format 'yyyy-MM-ddTHH:mm:sszzz'), $Level, $Message
    Write-Verbose $line
    if ($script:LogFile) {
        try { Add-Content -Path $script:LogFile -Value $line -Encoding UTF8 }
        catch { Write-Warning ('Log write failed: {0}' -f $_.Exception.Message) }
    }
}

function Get-PropSafe {
    <# StrictMode-safe property read. Returns $null when absent. #>
    [CmdletBinding()]
    param(
        [Parameter()] $InputObject,
        [Parameter(Mandatory)][string] $Name
    )
    if ($null -eq $InputObject) { return $null }
    $prop = $InputObject.PSObject.Properties[$Name]
    if ($null -eq $prop) { return $null }
    return $prop.Value
}

function New-CheckResult {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][int] $Gate,
        [Parameter(Mandatory)][string] $Id,
        [Parameter(Mandatory)][string] $Name,
        [Parameter(Mandatory)][ValidateSet('PASS', 'FAIL', 'WARN', 'MANUAL', 'SKIP')][string] $Status,
        [string] $Expected = '',
        [string] $Actual = '',
        [string] $Detail = ''
    )
    [pscustomobject]@{
        Gate     = $Gate
        Id       = $Id
        Name     = $Name
        Status   = $Status
        Expected = $Expected
        Actual   = $Actual
        Detail   = $Detail
    }
}

function Invoke-Check {
    <# Runs a check scriptblock; converts any thrown error into a FAIL result. #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][int] $Gate,
        [Parameter(Mandatory)][string] $Id,
        [Parameter(Mandatory)][string] $Name,
        [Parameter(Mandatory)][scriptblock] $Body
    )
    try {
        $result = & $Body
        Write-Log ('{0} {1} -> {2}' -f $Id, $Name, (Get-PropSafe $result 'Status'))
        return $result
    }
    catch {
        Write-Log ('{0} {1} threw: {2}' -f $Id, $Name, $_.Exception.Message) -Level 'ERROR'
        return New-CheckResult -Gate $Gate -Id $Id -Name $Name -Status 'FAIL' `
            -Expected 'check completes' -Actual 'error' -Detail $_.Exception.Message
    }
}

function Test-HostnameConvention {
    [CmdletBinding()]
    param([Parameter(Mandatory)][AllowEmptyString()][string] $Name)
    return [bool]($Name -match '(?i)^abs-nb-lox-\d{3}$')
}

function Get-OverallStatus {
    [CmdletBinding()]
    param([Parameter(Mandatory)][AllowEmptyCollection()][array] $Results)
    if (@($Results | Where-Object { $_.Status -eq 'FAIL' }).Count -gt 0) { return 'FAIL' }
    if (@($Results | Where-Object { $_.Status -in @('WARN', 'MANUAL') }).Count -gt 0) { return 'REVIEW' }
    return 'PASS'
}

function Get-InstalledSoftware {
    [CmdletBinding()]
    param()
    # Registry enumeration, deliberately not Win32_Product: querying that WMI
    # class triggers an MSI consistency check and reconfiguration of every
    # installed package.
    $paths = @(
        'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
        'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
    )
    $items = Get-ItemProperty -Path $paths -ErrorAction SilentlyContinue
    $names = foreach ($item in $items) {
        $dn = Get-PropSafe $item 'DisplayName'
        if (-not [string]::IsNullOrWhiteSpace($dn)) { $dn }
    }
    return @($names | Sort-Object -Unique)
}

function New-CompletionNote {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][hashtable] $Facts,
        [Parameter(Mandatory)][AllowEmptyCollection()][array] $Results
    )
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.AppendLine('============================================')
    [void]$sb.AppendLine('IMAGING COMPLETION SUMMARY')
    [void]$sb.AppendLine('============================================')
    [void]$sb.AppendLine(('Ticket:        {0}' -f $Facts.Ticket))
    [void]$sb.AppendLine(('Device Name:   {0}' -f $Facts.Hostname))
    [void]$sb.AppendLine(('Serial Number: {0}' -f $Facts.Serial))
    [void]$sb.AppendLine(('Model:         {0}' -f $Facts.Model))
    [void]$sb.AppendLine('SOP Version:   3.1')
    [void]$sb.AppendLine(('Technician:    {0}' -f $Facts.Technician))
    [void]$sb.AppendLine(('Completed:     {0}' -f $Facts.Timestamp))
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('VALIDATED CHECKS:')
    foreach ($r in $Results) {
        $mark = switch ($r.Status) {
            'PASS'   { '[X]' }
            'FAIL'   { '[!]' }
            'WARN'   { '[?]' }
            'MANUAL' { '[M]' }
            default  { '[-]' }
        }
        [void]$sb.AppendLine(('  {0} G{1} {2} - {3}' -f $mark, $r.Gate, $r.Name, $r.Status))
    }
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('REMOTE ACCESS:')
    if ([string]::IsNullOrWhiteSpace($Facts.AuthorizedUser)) {
        [void]$sb.AppendLine('  NOT ENABLED - no authorized user supplied for validation.')
        [void]$sb.AppendLine('  Confirm whether Gate 6 was intentionally blocked.')
    }
    else {
        [void]$sb.AppendLine(('  Domain Account: {0}' -f $Facts.AuthorizedUser))
    }
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine('NETWORK:')
    [void]$sb.AppendLine(('  IP Address:           {0}' -f $Facts.IPv4))
    [void]$sb.AppendLine('  Imaging VLAN Port:    [record manually]')
    [void]$sb.AppendLine('  Production VLAN Port: [record manually]')
    [void]$sb.AppendLine('')
    $failing = @($Results | Where-Object { $_.Status -eq 'FAIL' })
    $review  = @($Results | Where-Object { $_.Status -in @('WARN', 'MANUAL') })
    [void]$sb.AppendLine(('VALIDATION:        {0}' -f $Facts.Overall))
    if ($failing.Count -gt 0) {
        [void]$sb.AppendLine('BLOCKING FAILURES:')
        foreach ($f in $failing) {
            [void]$sb.AppendLine(('  - {0}: expected {1}, got {2}' -f $f.Name, $f.Expected, $f.Actual))
        }
    }
    if ($review.Count -gt 0) {
        [void]$sb.AppendLine('REQUIRES HUMAN CONFIRMATION:')
        foreach ($w in $review) {
            [void]$sb.AppendLine(('  - {0}: {1}' -f $w.Name, $w.Detail))
        }
    }
    $ready = if ($failing.Count -eq 0) { 'Yes' } else { 'No' }
    [void]$sb.AppendLine(('READY FOR CLOSURE: {0}' -f $ready))
    [void]$sb.AppendLine('============================================')
    return $sb.ToString()
}

function Get-UnsetPlaceholder {
    <# Returns the names of parameters whose value still contains a [PLACEHOLDER] token. #>
    [CmdletBinding()]
    param([Parameter(Mandatory)][hashtable] $Values)
    foreach ($key in ($Values.Keys | Sort-Object)) {
        if ([string]$Values[$key] -match '\[[A-Z][A-Z _]*\]') { $key }
    }
}

# ----------------------------------------------------------------------------
# Self test
# ----------------------------------------------------------------------------

function Invoke-SelfTest {
    [CmdletBinding()]
    param()
    $failures = New-Object System.Collections.ArrayList

    function Assert-That {
        param([string] $Label, [bool] $Condition)
        if ($Condition) { Write-Host ('  PASS  {0}' -f $Label) }
        else { Write-Host ('  FAIL  {0}' -f $Label); [void]$failures.Add($Label) }
    }

    Write-Host 'Self test: pure functions'

    Assert-That 'hostname accepts canonical' (Test-HostnameConvention 'abs-nb-lox-045')
    Assert-That 'hostname accepts uppercase' (Test-HostnameConvention 'ABS-NB-LOX-001')
    Assert-That 'hostname accepts mixed case'(Test-HostnameConvention 'Abs-Nb-Lox-999')
    Assert-That 'hostname rejects 2 digits'  (-not (Test-HostnameConvention 'abs-nb-lox-45'))
    Assert-That 'hostname rejects bad prefix'(-not (Test-HostnameConvention 'lox-nb-abs-045'))
    Assert-That 'hostname rejects empty'     (-not (Test-HostnameConvention ''))
    Assert-That 'hostname rejects suffix'    (-not (Test-HostnameConvention 'abs-nb-lox-045X'))

    $pass = @(New-CheckResult -Gate 5 -Id 'T1' -Name 'a' -Status 'PASS')
    $warn = @($pass) + @(New-CheckResult -Gate 7 -Id 'T2' -Name 'b' -Status 'MANUAL')
    $fail = @($warn) + @(New-CheckResult -Gate 6 -Id 'T3' -Name 'c' -Status 'FAIL')

    Assert-That 'overall PASS'   ((Get-OverallStatus -Results $pass) -eq 'PASS')
    Assert-That 'overall REVIEW' ((Get-OverallStatus -Results $warn) -eq 'REVIEW')
    Assert-That 'overall FAIL'   ((Get-OverallStatus -Results $fail) -eq 'FAIL')
    Assert-That 'overall empty'  ((Get-OverallStatus -Results @()) -eq 'PASS')

    Assert-That 'PropSafe null'    ($null -eq (Get-PropSafe $null 'Anything'))
    Assert-That 'PropSafe missing' ($null -eq (Get-PropSafe ([pscustomobject]@{ A = 1 }) 'B'))
    Assert-That 'PropSafe present' (1 -eq (Get-PropSafe ([pscustomobject]@{ A = 1 }) 'A'))

    $facts = @{
        Ticket = 'SD-1'; Hostname = 'abs-nb-lox-045'; Serial = 'ABC'; Model = 'M'
        Technician = 'tech'; Timestamp = 'now'; AuthorizedUser = ''; IPv4 = '[SUBNET]'
        Overall = 'FAIL'
    }
    $note = New-CompletionNote -Facts $facts -Results $fail
    Assert-That 'note has header'      ($note -match 'IMAGING COMPLETION SUMMARY')
    Assert-That 'note blocks closure'  ($note -match 'READY FOR CLOSURE: No')
    Assert-That 'note flags no RDP'    ($note -match 'NOT ENABLED')

    $facts2 = $facts.Clone()
    $facts2.AuthorizedUser = '[CLIENT]\jdoe'
    $facts2.Overall = 'PASS'
    $note2 = New-CompletionNote -Facts $facts2 -Results $pass
    Assert-That 'clean note closes'    ($note2 -match 'READY FOR CLOSURE: Yes')
    Assert-That 'clean note names user'($note2 -match [regex]::Escape('[CLIENT]\jdoe'))
    Assert-That 'note rejects other user'(-not ('[CLIENT]\jsmith' -match [regex]::Escape('[CLIENT]\jdoe')))

    $unset = @(Get-UnsetPlaceholder -Values @{ ExpectedDomain = '[CLIENT]'; ProductionSubnetPrefix = '[SUBNET]'; DomainControllerFqdn = '[HOSTNAME]' })
    Assert-That 'guard flags all placeholders' ($unset.Count -eq 3)
    $set = @(Get-UnsetPlaceholder -Values @{ ExpectedDomain = 'corp'; ProductionSubnetPrefix = '192.168.'; DomainControllerFqdn = 'dc01.corp.example' })
    Assert-That 'guard passes configured values' ($set.Count -eq 0)

    $errResult = Invoke-Check -Gate 9 -Id 'T4' -Name 'thrower' -Body { throw 'boom' }
    Assert-That 'Invoke-Check traps'   ($errResult.Status -eq 'FAIL' -and $errResult.Detail -eq 'boom')

    Write-Host ''
    if ($failures.Count -eq 0) { Write-Host 'Self test: 0 failures'; return 0 }
    Write-Host ('Self test: {0} failure(s)' -f $failures.Count)
    return 1
}

# ----------------------------------------------------------------------------
# Entry
# ----------------------------------------------------------------------------

if ($PSCmdlet.ParameterSetName -eq 'SelfTest') {
    exit (Invoke-SelfTest)
}

# Fail fast: refuse to run while client-specific placeholders are still unset.
$unsetPlaceholders = @(Get-UnsetPlaceholder -Values @{
    ExpectedDomain         = $ExpectedDomain
    ProductionSubnetPrefix = $ProductionSubnetPrefix
    DomainControllerFqdn   = $DomainControllerFqdn
})
if ($unsetPlaceholders.Count -gt 0) {
    Write-Error -ErrorAction Continue ('Refusing to run: placeholder values are still unset for {0}. Pass real values (for example -ExpectedDomain <domain> -ProductionSubnetPrefix ''192.168.'' -DomainControllerFqdn <dc fqdn>) or set the defaults for this client before use.' -f ($unsetPlaceholders -join ', '))
    exit 2
}

$script:LogFile = $null
if ($PSBoundParameters.ContainsKey('LogPath') -and -not [string]::IsNullOrWhiteSpace($LogPath)) {
    $script:LogFile = $LogPath
}

try {
    $identity  = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Warning 'Not running elevated. TPM, BitLocker, and Secure Boot checks will be unreliable.'
    }
}
catch {
    Write-Warning ('Could not determine elevation: {0}' -f $_.Exception.Message)
}

Write-Log ('Validation start ticket={0} expected={1}' -f $Ticket, $ExpectedHostname)

# Vendor-aware baseline. 'Dell Command' is only expected on Dell hardware; on
# HP or Lenovo it would produce a false FAIL. Only applied when the caller did
# not explicitly supply -RequiredSoftware.
if (-not $PSBoundParameters.ContainsKey('RequiredSoftware')) {
    try {
        $vendorModel = [string](Get-PropSafe (Get-CimInstance -ClassName Win32_ComputerSystem) 'Manufacturer')
        if ($vendorModel -notmatch 'Dell') {
            $RequiredSoftware = @($RequiredSoftware | Where-Object { $_ -ne 'Dell Command' })
            Write-Log ('Non-Dell manufacturer "{0}" detected; Dell Command removed from baseline.' -f $vendorModel) -Level 'WARN'
        }
    }
    catch {
        Write-Log ('Manufacturer lookup failed, keeping default baseline: {0}' -f $_.Exception.Message) -Level 'WARN'
    }
}

$results = New-Object System.Collections.ArrayList

# --- Gate 5: identity -------------------------------------------------------

[void]$results.Add((Invoke-Check -Gate 5 -Id 'G5-HOSTNAME' -Name 'Hostname convention' -Body {
    $actual = $env:COMPUTERNAME
    if ($actual -eq $ExpectedHostname -and (Test-HostnameConvention $actual)) {
        New-CheckResult -Gate 5 -Id 'G5-HOSTNAME' -Name 'Hostname convention' -Status 'PASS' -Expected $ExpectedHostname -Actual $actual
    }
    else {
        New-CheckResult -Gate 5 -Id 'G5-HOSTNAME' -Name 'Hostname convention' -Status 'FAIL' -Expected $ExpectedHostname -Actual $actual -Detail 'Rename and restart before closure.'
    }
}))

[void]$results.Add((Invoke-Check -Gate 5 -Id 'G5-DOMAIN' -Name 'Domain join' -Body {
    $cs       = Get-CimInstance -ClassName Win32_ComputerSystem
    $joined   = [bool](Get-PropSafe $cs 'PartOfDomain')
    $domain   = [string](Get-PropSafe $cs 'Domain')
    if ($joined -and $domain -like ('{0}*' -f $ExpectedDomain)) {
        New-CheckResult -Gate 5 -Id 'G5-DOMAIN' -Name 'Domain join' -Status 'PASS' -Expected $ExpectedDomain -Actual $domain
    }
    else {
        New-CheckResult -Gate 5 -Id 'G5-DOMAIN' -Name 'Domain join' -Status 'FAIL' -Expected $ExpectedDomain -Actual $domain -Detail 'Not joined, or joined to an unexpected domain.'
    }
}))

# --- Gate 1: storage mode and TPM, inferred post-image ----------------------

[void]$results.Add((Invoke-Check -Gate 1 -Id 'G1-STORAGE' -Name 'Storage bus mode' -Body {
    $disks = @(Get-PhysicalDisk | Where-Object { (Get-PropSafe $_ 'BusType') })
    $bus   = @($disks | ForEach-Object { [string](Get-PropSafe $_ 'BusType') } | Sort-Object -Unique)
    $joined = ($bus -join ',')
    if ($bus -contains 'RAID') {
        New-CheckResult -Gate 1 -Id 'G1-STORAGE' -Name 'Storage bus mode' -Status 'FAIL' -Expected 'NVMe or SATA' -Actual $joined -Detail 'RAID/RST still active. Image is on a controller mode the SOP prohibits.'
    }
    elseif ($bus -contains 'NVMe' -or $bus -contains 'SATA') {
        New-CheckResult -Gate 1 -Id 'G1-STORAGE' -Name 'Storage bus mode' -Status 'PASS' -Expected 'NVMe or SATA' -Actual $joined
    }
    else {
        New-CheckResult -Gate 1 -Id 'G1-STORAGE' -Name 'Storage bus mode' -Status 'WARN' -Expected 'NVMe or SATA' -Actual $joined -Detail 'Inconclusive bus type. Settle with the Gate 1 BIOS photo.'
    }
}))

[void]$results.Add((Invoke-Check -Gate 1 -Id 'G1-TPM' -Name 'TPM 2.0 ready' -Body {
    $tpm     = Get-Tpm
    $present = [bool](Get-PropSafe $tpm 'TpmPresent')
    $ready   = [bool](Get-PropSafe $tpm 'TpmReady')
    $spec    = ''
    try {
        $wmiTpm = Get-CimInstance -Namespace 'root/cimv2/Security/MicrosoftTpm' -ClassName 'Win32_Tpm'
        $spec   = [string](Get-PropSafe $wmiTpm 'SpecVersion')
    }
    catch { $spec = 'unknown' }
    $actual = 'Present={0}; Ready={1}; Spec={2}' -f $present, $ready, $spec
    if ($present -and $ready -and $spec -match '(^|[^0-9])2\.0') {
        New-CheckResult -Gate 1 -Id 'G1-TPM' -Name 'TPM 2.0 ready' -Status 'PASS' -Expected 'present, ready, spec 2.0' -Actual $actual
    }
    elseif ($present -and $ready) {
        New-CheckResult -Gate 1 -Id 'G1-TPM' -Name 'TPM 2.0 ready' -Status 'WARN' -Expected 'present, ready, spec 2.0' -Actual $actual -Detail 'TPM usable but spec version not confirmed as 2.0.'
    }
    else {
        New-CheckResult -Gate 1 -Id 'G1-TPM' -Name 'TPM 2.0 ready' -Status 'FAIL' -Expected 'present, ready, spec 2.0' -Actual $actual -Detail 'BitLocker will not bind without a ready TPM. Do not clear it.'
    }
}))

# --- Gate 6: remote access --------------------------------------------------

if ([string]::IsNullOrWhiteSpace($AuthorizedUser)) {
    [void]$results.Add((New-CheckResult -Gate 6 -Id 'G6-RDP' -Name 'Remote access' -Status 'SKIP' -Expected 'authorized user supplied' -Actual 'none' -Detail 'No -AuthorizedUser given. Confirm Gate 6 was intentionally blocked and RDP is off.'))
}
else {
    [void]$results.Add((Invoke-Check -Gate 6 -Id 'G6-RDPENABLED' -Name 'RDP enabled' -Body {
        $key   = 'HKLM:\System\CurrentControlSet\Control\Terminal Server'
        $value = (Get-ItemProperty -Path $key -Name 'fDenyTSConnections').fDenyTSConnections
        if ($value -eq 0) {
            New-CheckResult -Gate 6 -Id 'G6-RDPENABLED' -Name 'RDP enabled' -Status 'PASS' -Expected 'fDenyTSConnections=0' -Actual ('fDenyTSConnections={0}' -f $value)
        }
        else {
            New-CheckResult -Gate 6 -Id 'G6-RDPENABLED' -Name 'RDP enabled' -Status 'FAIL' -Expected 'fDenyTSConnections=0' -Actual ('fDenyTSConnections={0}' -f $value) -Detail 'Remote Desktop is denied at the registry.'
        }
    }))

    [void]$results.Add((Invoke-Check -Gate 6 -Id 'G6-FIREWALL' -Name 'RDP firewall rules' -Body {
        $rules    = @(Get-NetFirewallRule -DisplayGroup 'Remote Desktop')
        $disabled = @($rules | Where-Object { [string](Get-PropSafe $_ 'Enabled') -ne 'True' })
        if ($rules.Count -eq 0) {
            New-CheckResult -Gate 6 -Id 'G6-FIREWALL' -Name 'RDP firewall rules' -Status 'FAIL' -Expected 'group present and enabled' -Actual 'no rules found' -Detail 'Remote Desktop firewall group is missing.'
        }
        elseif ($disabled.Count -eq 0) {
            New-CheckResult -Gate 6 -Id 'G6-FIREWALL' -Name 'RDP firewall rules' -Status 'PASS' -Expected 'all enabled' -Actual ('{0}/{0} enabled' -f $rules.Count)
        }
        else {
            New-CheckResult -Gate 6 -Id 'G6-FIREWALL' -Name 'RDP firewall rules' -Status 'FAIL' -Expected 'all enabled' -Actual ('{0} of {1} disabled' -f $disabled.Count, $rules.Count) -Detail ($disabled.Name -join '; ')
        }
    }))

    [void]$results.Add((Invoke-Check -Gate 6 -Id 'G6-MEMBER' -Name 'RDP authorized user' -Body {
        $members = @(Get-LocalGroupMember -Group 'Remote Desktop Users')
        $names   = @($members | ForEach-Object { [string](Get-PropSafe $_ 'Name') })
        $match   = @($names | Where-Object { $_ -ieq $AuthorizedUser })
        $extra   = @($names | Where-Object { $_ -ine $AuthorizedUser })
        if ($match.Count -eq 0) {
            New-CheckResult -Gate 6 -Id 'G6-MEMBER' -Name 'RDP authorized user' -Status 'FAIL' -Expected $AuthorizedUser -Actual ($names -join '; ') -Detail 'Authorized principal is not a member.'
        }
        elseif ($extra.Count -gt 0) {
            New-CheckResult -Gate 6 -Id 'G6-MEMBER' -Name 'RDP authorized user' -Status 'WARN' -Expected ('only {0}' -f $AuthorizedUser) -Actual ($names -join '; ') -Detail 'Additional members present. Confirm each is authorized or remove.'
        }
        else {
            New-CheckResult -Gate 6 -Id 'G6-MEMBER' -Name 'RDP authorized user' -Status 'PASS' -Expected $AuthorizedUser -Actual ($names -join '; ')
        }
    }))
}

# --- Gate 7: security baseline ---------------------------------------------

[void]$results.Add((Invoke-Check -Gate 7 -Id 'G7-BITLOCKER' -Name 'BitLocker protection' -Body {
    $status     = 'unknown'
    $protectors = @()
    $usedCmdlet = $false
    try {
        $vol        = Get-BitLockerVolume -MountPoint 'C:'
        $status     = [string](Get-PropSafe $vol 'ProtectionStatus')
        $protectors = @((Get-PropSafe $vol 'KeyProtector') | ForEach-Object { [string](Get-PropSafe $_ 'KeyProtectorType') })
        $usedCmdlet = $true
    }
    catch {
        $raw = & manage-bde.exe -status C: 2>&1 | Out-String
        if ($raw -match 'Protection\s+Status:\s+Protection\s+(On|Off)') { $status = $Matches[1] }
        $rawProt = & manage-bde.exe -protectors -get C: 2>&1 | Out-String
        if ($rawProt -match 'Numerical Password') { $protectors += 'RecoveryPassword' }
        if ($rawProt -match 'TPM')                { $protectors += 'Tpm' }
    }
    $hasRecovery = @($protectors | Where-Object { $_ -match 'RecoveryPassword' }).Count -gt 0
    $actual = 'Status={0}; Protectors={1}; Source={2}' -f $status, ($protectors -join ','), $(if ($usedCmdlet) { 'cmdlet' } else { 'manage-bde' })
    if ($status -match 'On' -and $hasRecovery) {
        New-CheckResult -Gate 7 -Id 'G7-BITLOCKER' -Name 'BitLocker protection' -Status 'PASS' -Expected 'Protection On with RecoveryPassword protector' -Actual $actual
    }
    elseif ($status -match 'On') {
        New-CheckResult -Gate 7 -Id 'G7-BITLOCKER' -Name 'BitLocker protection' -Status 'FAIL' -Expected 'Protection On with RecoveryPassword protector' -Actual $actual -Detail 'Encrypted with no recovery password protector. Nothing to escrow.'
    }
    else {
        New-CheckResult -Gate 7 -Id 'G7-BITLOCKER' -Name 'BitLocker protection' -Status 'FAIL' -Expected 'Protection On' -Actual $actual -Detail 'Volume is not protected.'
    }
}))

[void]$results.Add((Invoke-Check -Gate 7 -Id 'G7-ESCROW' -Name 'BitLocker AD escrow' -Body {
    $adAvailable = [bool](Get-Module -ListAvailable -Name 'ActiveDirectory')
    if (-not $adAvailable) {
        return New-CheckResult -Gate 7 -Id 'G7-ESCROW' -Name 'BitLocker AD escrow' -Status 'MANUAL' -Expected 'recovery key present on AD computer object' -Actual 'ActiveDirectory module not installed' -Detail 'Verify in ADUC: computer object -> BitLocker Recovery tab. This gate is not waivable.'
    }
    Import-Module ActiveDirectory -ErrorAction Stop
    $computer = Get-ADComputer -Identity $env:COMPUTERNAME -ErrorAction Stop
    $keys = @(Get-ADObject -Filter 'objectClass -eq "msFVE-RecoveryInformation"' -SearchBase $computer.DistinguishedName -ErrorAction Stop)
    if ($keys.Count -gt 0) {
        New-CheckResult -Gate 7 -Id 'G7-ESCROW' -Name 'BitLocker AD escrow' -Status 'PASS' -Expected 'at least one recovery object' -Actual ('{0} found' -f $keys.Count)
    }
    else {
        New-CheckResult -Gate 7 -Id 'G7-ESCROW' -Name 'BitLocker AD escrow' -Status 'FAIL' -Expected 'at least one recovery object' -Actual '0 found' -Detail 'Escrow missing. Escalate to L3 before closure. Hard stop 6.'
    }
}))

[void]$results.Add((Invoke-Check -Gate 7 -Id 'G7-BASELINE' -Name 'Baseline software' -Body {
    $installed = Get-InstalledSoftware
    $missing   = New-Object System.Collections.ArrayList
    foreach ($required in $RequiredSoftware) {
        $hit = @($installed | Where-Object { $_ -like ('*{0}*' -f $required) })
        if ($hit.Count -eq 0) { [void]$missing.Add($required) }
    }
    if ($missing.Count -eq 0) {
        New-CheckResult -Gate 7 -Id 'G7-BASELINE' -Name 'Baseline software' -Status 'PASS' -Expected ($RequiredSoftware -join ', ') -Actual 'all present'
    }
    else {
        New-CheckResult -Gate 7 -Id 'G7-BASELINE' -Name 'Baseline software' -Status 'FAIL' -Expected ($RequiredSoftware -join ', ') -Actual ('missing: {0}' -f ($missing -join ', ')) -Detail 'Redeploy through the normal channel and re-run.'
    }
}))

[void]$results.Add((Invoke-Check -Gate 7 -Id 'G7-SECUREBOOT' -Name 'Secure Boot' -Body {
    try {
        $on = [bool](Confirm-SecureBootUEFI)
        if ($on) {
            New-CheckResult -Gate 7 -Id 'G7-SECUREBOOT' -Name 'Secure Boot' -Status 'PASS' -Expected 'enabled' -Actual 'enabled'
        }
        else {
            New-CheckResult -Gate 7 -Id 'G7-SECUREBOOT' -Name 'Secure Boot' -Status 'FAIL' -Expected 'enabled' -Actual 'disabled' -Detail 'If disabled for imaging it must be re-enabled before handoff.'
        }
    }
    catch {
        New-CheckResult -Gate 7 -Id 'G7-SECUREBOOT' -Name 'Secure Boot' -Status 'WARN' -Expected 'enabled' -Actual 'not determinable' -Detail ('Legacy BIOS or insufficient rights: {0}' -f $_.Exception.Message)
    }
}))

# --- Gate 8: production network --------------------------------------------

$primaryIPv4 = 'unknown'
[void]$results.Add((Invoke-Check -Gate 8 -Id 'G8-ADDRESS' -Name 'Production address' -Body {
    $addresses = @(Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
        Where-Object { [string](Get-PropSafe $_ 'IPAddress') -notlike '127.*' } |
        ForEach-Object { [string](Get-PropSafe $_ 'IPAddress') })
    $match = @($addresses | Where-Object { $_.StartsWith($ProductionSubnetPrefix) })
    if ($match.Count -gt 0) { $script:primaryIPv4 = $match[0] }
    elseif ($addresses.Count -gt 0) { $script:primaryIPv4 = $addresses[0] }
    if ($match.Count -gt 0) {
        New-CheckResult -Gate 8 -Id 'G8-ADDRESS' -Name 'Production address' -Status 'PASS' -Expected ('{0}x.x' -f $ProductionSubnetPrefix) -Actual ($match -join ', ')
    }
    else {
        New-CheckResult -Gate 8 -Id 'G8-ADDRESS' -Name 'Production address' -Status 'FAIL' -Expected ('{0}x.x' -f $ProductionSubnetPrefix) -Actual ($addresses -join ', ') -Detail 'Still on the imaging VLAN, or the production port is not mapped.'
    }
}))

if ($SkipConnectivity) {
    [void]$results.Add((New-CheckResult -Gate 8 -Id 'G8-INTERNET' -Name 'Internet reachability' -Status 'SKIP' -Detail '-SkipConnectivity specified.'))
    [void]$results.Add((New-CheckResult -Gate 8 -Id 'G8-DC' -Name 'Domain controller reachability' -Status 'SKIP' -Detail '-SkipConnectivity specified.'))
}
else {
    [void]$results.Add((Invoke-Check -Gate 8 -Id 'G8-INTERNET' -Name 'Internet reachability' -Body {
        $ok = [bool](Test-Connection -ComputerName '8.8.8.8' -Count 2 -Quiet -ErrorAction SilentlyContinue)
        if ($ok) {
            New-CheckResult -Gate 8 -Id 'G8-INTERNET' -Name 'Internet reachability' -Status 'PASS' -Expected 'reply from 8.8.8.8' -Actual 'reply received'
        }
        else {
            New-CheckResult -Gate 8 -Id 'G8-INTERNET' -Name 'Internet reachability' -Status 'FAIL' -Expected 'reply from 8.8.8.8' -Actual 'no reply' -Detail 'ICMP may be filtered; confirm with a browser before escalating.'
        }
    }))

    [void]$results.Add((Invoke-Check -Gate 8 -Id 'G8-DC' -Name 'Domain controller reachability' -Body {
        $ok = [bool](Test-Connection -ComputerName $DomainControllerFqdn -Count 2 -Quiet -ErrorAction SilentlyContinue)
        if ($ok) {
            New-CheckResult -Gate 8 -Id 'G8-DC' -Name 'Domain controller reachability' -Status 'PASS' -Expected ('reply from {0}' -f $DomainControllerFqdn) -Actual 'reply received'
        }
        else {
            New-CheckResult -Gate 8 -Id 'G8-DC' -Name 'Domain controller reachability' -Status 'FAIL' -Expected ('reply from {0}' -f $DomainControllerFqdn) -Actual 'no reply' -Detail 'Internet without internal reachability breaks GPO and logon scripts.'
        }
    }))
}

# --- Assemble ---------------------------------------------------------------

$resultArray = @($results)
$overall     = Get-OverallStatus -Results $resultArray

$serial = 'unknown'
$model  = 'unknown'
try {
    $serial = [string](Get-PropSafe (Get-CimInstance -ClassName Win32_BIOS) 'SerialNumber')
    $model  = [string](Get-PropSafe (Get-CimInstance -ClassName Win32_ComputerSystem) 'Model')
}
catch {
    Write-Log ('Could not read hardware facts: {0}' -f $_.Exception.Message) -Level 'WARN'
}

$facts = @{
    Ticket         = $Ticket
    Hostname       = $env:COMPUTERNAME
    Serial         = $serial
    Model          = $model
    Technician     = ('{0}\{1}' -f $env:USERDOMAIN, $env:USERNAME)
    Timestamp      = (Get-Date -Format 'yyyy-MM-dd HH:mm K')
    AuthorizedUser = $AuthorizedUser
    IPv4           = $primaryIPv4
    Overall        = $overall
}

$note = New-CompletionNote -Facts $facts -Results $resultArray

$report = [pscustomobject]@{
    schemaVersion  = '1.0'
    generatedAt    = (Get-Date -Format 'o')
    ticket         = $Ticket
    hostname       = $facts.Hostname
    expectedHost   = $ExpectedHostname
    serial         = $facts.Serial
    model          = $facts.Model
    technician     = $facts.Technician
    authorizedUser = $AuthorizedUser
    ipv4           = $facts.IPv4
    overall        = $overall
    failCount      = @($resultArray | Where-Object { $_.Status -eq 'FAIL' }).Count
    reviewCount    = @($resultArray | Where-Object { $_.Status -in @('WARN', 'MANUAL') }).Count
    checks         = $resultArray
    completionNote = $note
}

if ($PSBoundParameters.ContainsKey('OutputPath') -and -not [string]::IsNullOrWhiteSpace($OutputPath)) {
    try {
        $dir = Split-Path -Path $OutputPath -Parent
        if ($dir -and -not (Test-Path -Path $dir)) { New-Item -Path $dir -ItemType Directory -Force | Out-Null }
        Add-Content -Path $OutputPath -Value ($report | ConvertTo-Json -Depth 6 -Compress) -Encoding UTF8
        Write-Log ('Report appended to {0}' -f $OutputPath)
    }
    catch {
        Write-Warning ('Could not write report to {0}: {1}' -f $OutputPath, $_.Exception.Message)
    }
}

foreach ($r in $resultArray) {
    '{0,-6} G{1} {2,-32} {3}' -f $r.Status, $r.Gate, $r.Name, $r.Actual | Write-Host
}
Write-Host ''
Write-Host $note

Write-Log ('Validation end overall={0} fail={1} review={2}' -f $overall, $report.failCount, $report.reviewCount)

Write-Output $report

if ($report.failCount -gt 0) { exit 1 }
exit 0
