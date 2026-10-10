# Evals: writing-shell-scripts

## Should Trigger

1. "Write a PowerShell script to check if .NET 6 is installed and install it silently"
   → PASS — Routes PowerShell, idempotency check present, admin check, Loxihart log path, finally cleanup, secrets via env var. Audit gate: 12/12.

2. "Create a bash script that backs up /etc and logs the result"
   → PASS (design) — Routes Bash, set -euo pipefail, cleanup trap, /var/log/loxihart/ log path, idempotent (backup doesn't modify source).

3. "Build a PS1 deployment script for Loxihart that installs the RMM agent on Windows endpoints"
   → PASS — Full production PS1 produced. Idempotency via Get-Service check, installer URL via env var, MSI silent install, finally cleanup, log path C:\ProgramData\Loxihart\Logs\. Audit gate: 12/12.

4. "Make a shell script that rotates log files older than 30 days"
   → PASS (design) — Routes Bash, find -mtime +30 -delete is idempotent by nature, set -euo pipefail, /var/log/loxihart/ log.

5. "Write an idempotent PowerShell script that creates a local admin account if it doesn't exist"
   → PASS (design) — Routes PS1, Get-LocalUser idempotency check, $ErrorActionPreference Stop, Loxihart log path, admin check required.

## Should NOT Trigger

1. "Write a Python script to parse JSON"
   → CORRECT — Python is not in scope; skill correctly does not apply.

2. "Help me write a sales script for a demo call"
   → CORRECT — "Sales script" = verbal/spoken script, not shell. Description uses "shell script", "automation script", ".sh", ".ps1" — no match.

3. "Create an n8n workflow to send Slack alerts"
   → CORRECT — workflow-automation skill handles n8n; this skill does not.

4. "Debug this bash one-liner"
   → CORRECT — debugging a one-liner is not authoring a full script; debug-like-expert skill handles this.

## Notes

- Evals 1 and 3 were fully executed and passed the automated audit gate check.
- Evals 2, 4, 5 were design-verified (Bash environment not available to execute, but skill logic traced through).
- Negative evals confirmed by description analysis — no false positive triggers expected.
