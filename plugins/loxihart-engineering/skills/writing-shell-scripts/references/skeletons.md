# Script Skeletons

Reference templates for Bash and PowerShell. Copy and fill in SCRIPT BODY section.

---

## Bash Skeleton

```bash
#!/usr/bin/env bash
# Script: <name>.sh
# Purpose: <one-line description>
# Author: Kyle Rosebrook / Loxihart
# Version: 1.0.0
# Last Modified: <date>
# Usage: ./<name>.sh [OPTIONS]
#
# Dependencies: <list any>
# Notes: <anything ops needs to know>

set -euo pipefail
IFS=$'\n\t'

# ── Constants ────────────────────────────────────────────────────────────────
readonly SCRIPT_NAME="$(basename "$0")"
readonly LOG_FILE="/var/log/loxihart/${SCRIPT_NAME%.sh}.log"
readonly TIMESTAMP="$(date +%Y%m%dT%H%M%S)"

# ── Logging ──────────────────────────────────────────────────────────────────
log()  { echo "[$(date +%H:%M:%S)] [INFO]  $*" | tee -a "$LOG_FILE"; }
warn() { echo "[$(date +%H:%M:%S)] [WARN]  $*" | tee -a "$LOG_FILE" >&2; }
err()  { echo "[$(date +%H:%M:%S)] [ERROR] $*" | tee -a "$LOG_FILE" >&2; exit 1; }

# ── Cleanup trap ─────────────────────────────────────────────────────────────
cleanup() { rm -f /tmp/"${SCRIPT_NAME}".lock; }
trap cleanup EXIT

# ── Preflight ────────────────────────────────────────────────────────────────
check_deps() {
  local deps=("$@")
  for dep in "${deps[@]}"; do
    command -v "$dep" &>/dev/null || err "Required dependency not found: $dep"
  done
}

check_root() {
  [[ $EUID -eq 0 ]] || err "This script must be run as root."
}

# ── Input validation ─────────────────────────────────────────────────────────
usage() {
  cat <<EOF
Usage: $SCRIPT_NAME [OPTIONS]
  -h, --help      Show this message
  # Add flags here
EOF
  exit 0
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -h|--help) usage ;;
      --) shift; break ;;
      -*) err "Unknown flag: $1" ;;
      *) break ;;
    esac
    shift
  done
}

# ── Main ─────────────────────────────────────────────────────────────────────
main() {
  parse_args "$@"
  mkdir -p "$(dirname "$LOG_FILE")"
  log "Starting $SCRIPT_NAME at $TIMESTAMP"

  # << SCRIPT BODY >>

  log "Completed successfully."
}

main "$@"
```

---

## PowerShell Skeleton

```powershell
#Requires -Version 5.1
<#
.SYNOPSIS
  <one-line description>
.DESCRIPTION
  <full description>
.PARAMETER ParamName
  Description of parameter
.EXAMPLE
  .\<name>.ps1 -ParamName value
.NOTES
  Author:        Kyle Rosebrook / Loxihart
  Version:       1.0.0
  Last Modified: <date>
  Requirements:  Run as Administrator (if applicable)
#>

[CmdletBinding(SupportsShouldProcess)]
param(
  [Parameter(Mandatory=$false)]
  [string]$ExampleParam = "default"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── Logging ───────────────────────────────────────────────────────────────────
$LogPath = "C:\ProgramData\Loxihart\Logs\$(($MyInvocation.MyCommand.Name).Replace('.ps1',''))_$(Get-Date -Format yyyyMMddTHHmmss).log"
New-Item -ItemType Directory -Force -Path (Split-Path $LogPath) | Out-Null

function Write-Log {
  param([string]$Message, [ValidateSet('INFO','WARN','ERROR')]$Level = 'INFO')
  $entry = "[$(Get-Date -Format HH:mm:ss)] [$Level] $Message"
  Add-Content -Path $LogPath -Value $entry
  switch ($Level) {
    'ERROR' { Write-Error $Message }
    'WARN'  { Write-Warning $Message }
    default { Write-Host $entry }
  }
}

# ── Preflight ─────────────────────────────────────────────────────────────────
function Test-Admin {
  $identity  = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# ── Main ──────────────────────────────────────────────────────────────────────
try {
  Write-Log "Starting $($MyInvocation.MyCommand.Name)"

  # << SCRIPT BODY >>

  Write-Log "Completed successfully."
}
catch {
  Write-Log "Fatal error: $_" -Level ERROR
  exit 1
}
```
