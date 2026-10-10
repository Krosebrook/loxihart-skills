# README Template for Shell Scripts

Copy this template for every script delivered. Fill in all sections — no placeholders.

---

```markdown
# <script-name>.(sh|ps1)

> <One-line description of what this script does.>

---

## Overview

What this script does, why it exists, and what problem it solves in plain English.
Include any context about when/how it was built (e.g., "Deployed via Loxihart RMM to all Windows endpoints").

---

## Requirements

| Requirement   | Details                          |
|---------------|----------------------------------|
| OS            | Windows 10+ / Ubuntu 20.04+      |
| Shell         | PowerShell 5.1+ / Bash 4+        |
| Privileges    | Administrator / root required    |
| Dependencies  | List all external tools called   |

---

## Usage

### PowerShell
```powershell
.\<script-name>.ps1 [-ParamName value] [-WhatIf]
```

### Bash
```bash
chmod +x <script-name>.sh
./<script-name>.sh [--flag value]
```

---

## Parameters

| Flag / Param   | Type    | Default    | Required | Description              |
|----------------|---------|------------|----------|--------------------------|
| `-ParamName`   | string  | `"value"`  | No       | What this parameter does |

---

## Environment Variables

| Variable       | Required | Description                        |
|----------------|----------|------------------------------------|
| `VAR_NAME`     | Yes      | What it holds — never hardcode this |

---

## Behavior

Step-by-step of what the script does, in plain English. One step per bullet.

1. Checks if running as Administrator / root
2. Creates log directory if it doesn't exist
3. [Step 3...]
4. [Step 4...]
5. Logs completion and exits 0

---

## Error Handling

| Exit Code | Meaning                              |
|-----------|--------------------------------------|
| 0         | Success                              |
| 1         | Fatal error — check log for details  |

On failure, the script logs the error with full context and exits non-zero.
It does NOT silently continue past failures.

---

## Logging

**Windows:** `C:\ProgramData\Loxihart\Logs\<script-name>_<timestamp>.log`
**Linux:** `/var/log/loxihart/<script-name>.log`

Log format: `[HH:MM:SS] [LEVEL] message`

---

## Idempotency

Is it safe to run this script twice on the same machine? **YES / NO**

If YES — describe what state it checks before acting:
> Example: "Checks if service X exists before installing. If already installed, logs and exits 0."

If NO — describe why and what to check before re-running.

---

## Rollback

How to undo what this script does:

```powershell
# Example rollback steps
```

If rollback is not applicable, state why explicitly.

---

## Best Practices Applied

- `set -euo pipefail` / `$ErrorActionPreference = "Stop"` — fails fast, no silent errors
- Secrets via environment variables only — nothing hardcoded
- Preflight dependency + privilege check before any changes
- Timestamped structured logs to persistent Loxihart log path
- Idempotent by default — safe to re-run without side effects
- Cleanup trap / try-finally — no orphaned temp files or locks

---

## Known Limitations

List any edge cases, untested environments, or deliberate omissions.
If none, write "None identified."

---

## Changelog

| Version | Date       | Author         | Notes           |
|---------|------------|----------------|-----------------|
| 1.0.0   | YYYY-MM-DD | Kyle Rosebrook | Initial release |
```
