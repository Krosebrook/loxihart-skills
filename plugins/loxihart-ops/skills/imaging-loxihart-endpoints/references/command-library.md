# Command Library

Consolidated from *Computer Imaging & Deployment Reference Guide v3.1* Appendix A, with gate context added.

Run everything elevated unless noted. Commands marked **read-only** are safe to run on a production endpoint at any time; the rest change state.

---

## Network — read-only

```cmd
ipconfig /all                       :: full adapter detail
netstat -an                         :: all connections, numeric
netstat -b                          :: with owning process
tracert 8.8.8.8                     :: path to external
nslookup [HOSTNAME]     :: forward resolution
nslookup -type=SRV _ldap._tcp.[HOSTNAME]   :: locate domain controllers
ping 8.8.8.8                        :: external reachability
ping [HOSTNAME]                 :: internal reachability
ping -t [SUBNET]                 :: continuous; Ctrl+C to stop
```

```powershell
Test-NetConnection -ComputerName <host> -Port 3389    # RDP reachability
Test-NetConnection -ComputerName [HOSTNAME] -Port 445   # deployment share
Get-NetAdapter                                         # real interface aliases
```

`Get-NetAdapter` first, always, before any command that takes `-InterfaceAlias`. On USB adapters the alias is rarely `Ethernet`.

## Network — state-changing

```cmd
ipconfig /flushdns
ipconfig /registerdns
ipconfig /release
ipconfig /renew
```

```powershell
Set-DnsClientServerAddress -InterfaceAlias '<alias>' -ServerAddresses '[SUBNET]','[SUBNET]'
```

## WinPE only

```cmd
wpeutil InitializeNetwork           :: start the WinPE network stack
X:\Deploy\Scripts\LiteTouch.vbs     :: launch the deployment wizard manually
```

---

## System information — read-only

```cmd
systeminfo
systeminfo | findstr /B /C:"Domain"
hostname
whoami /user /groups
```

```powershell
(Get-CimInstance Win32_ComputerSystem).PartOfDomain
(Get-CimInstance Win32_ComputerSystem).Domain
Get-PhysicalDisk | Select-Object FriendlyName, BusType, MediaType, Size
```

`Get-PhysicalDisk` BusType is the post-image proxy for BIOS storage mode. `RAID` means RST is still on. `NVMe` or `SATA` is what you want. `Unspecified` happens on some controllers and is inconclusive — fall back to the Gate 1 photo.

**Do not** use `Get-CimInstance Win32_Product` to enumerate installed software. Querying that class triggers a consistency check and reconfiguration of every installed MSI, which is slow and can restart services. Read the uninstall registry keys instead:

```powershell
$paths = @(
  'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
  'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
Get-ItemProperty -Path $paths -ErrorAction SilentlyContinue |
  Where-Object DisplayName |
  Select-Object DisplayName, DisplayVersion, Publisher |
  Sort-Object DisplayName
```

---

## Domain

```cmd
netdom join %COMPUTERNAME% /domain:[CLIENT] /userd:[CLIENT]\Loxihart-Admin /passwordd:*
nltest /dsgetdc:[CLIENT]
```

```powershell
Add-Computer -DomainName '[CLIENT]' -Credential (Get-Credential) -Restart
Rename-Computer -NewName 'abs-nb-lox-045' -Force
w32tm /resync /force
```

`/passwordd:*` prompts rather than accepting the password on the command line. Use the prompt form — a password typed as an argument lands in the console history and, on some configurations, in process-creation event logs.

---

## Remote access

```powershell
# enable
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' `
                 -Name 'fDenyTSConnections' -Value 0
Add-LocalGroupMember -Group 'Remote Desktop Users' -Member '[CLIENT]\<username>'
Enable-NetFirewallRule -DisplayGroup 'Remote Desktop'

# verify — read-only
Get-LocalGroupMember -Group 'Remote Desktop Users'
Get-NetFirewallRule -DisplayGroup 'Remote Desktop' | Select-Object Name, Enabled
Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' |
  Select-Object fDenyTSConnections
```

`fDenyTSConnections = 0` means RDP is allowed. It is inverted; reading it as a boolean the intuitive way gets it backwards.

---

## BitLocker and TPM

```cmd
manage-bde -status                          :: read-only
manage-bde -on C: -RecoveryPassword         :: enables encryption
tpm.msc                                     :: TPM console
```

```powershell
Get-Tpm                                                    # read-only
Get-BitLockerVolume -MountPoint 'C:'                       # read-only
(Get-BitLockerVolume -MountPoint 'C:').KeyProtector        # protector types
```

A healthy protected volume shows `Protection Status: Protection On`, an `XTS-AES` encryption method, and key protectors including both `Tpm` and `RecoveryPassword`.

A `RecoveryPassword` protector on the endpoint is **not** escrow. Escrow is the key existing in Active Directory against the computer object.

---

## Group Policy

```cmd
gpupdate /force
gpresult /r
```

Run `gpupdate /force` then `gpresult /r` after domain join to confirm the endpoint is actually receiving policy — including the BitLocker escrow policy. A machine in the wrong OU joins successfully and silently receives none of it.

---

## Repair — use deliberately

```cmd
chkdsk C: /f /r                                 :: schedules on reboot, hours on large disks
sfc /scannow
DISM /Online /Cleanup-Image /RestoreHealth      :: needs network or a source
```

On a fresh image these are almost never the right answer. If a newly imaged machine needs `sfc` or `DISM`, the image or the hardware is the problem — reimage or escalate rather than repairing a build that is minutes old.
