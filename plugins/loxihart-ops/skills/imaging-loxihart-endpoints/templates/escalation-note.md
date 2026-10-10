# Escalation Note

Internal note. Written the moment a gate fails or a hard stop is hit, not at the end of the shift.

The purpose is to make the next tier's first action a fix rather than a question.

---

```
============================================
IMAGING ESCALATION - GATE [N] [GATE NAME]
============================================
Ticket:        [SD-XXXXXX]
Escalating to: [L2 | L3 | L4]
Raised by:     [username] at [YYYY-MM-DD HH:MM CT]
Severity:      [Blocked | Degraded | Hard Stop]

DEVICE
  Model:   [Dell Latitude 5540]
  Serial:  [XXXXXXX]
  Hostname:[LOX-NB-CLT-XXX or "not yet named"]

FAILURE
  Gate:     [N] - [gate name]
  Symptom:  [exact error text, verbatim]
  Phase:    [where in the gate it died]
  First occurred: [YYYY-MM-DD HH:MM CT]
  Reproducible:   [Yes - N of N attempts | No | Once]

CONFIRMED STATE
  BIOS storage mode:  [AHCI | NVMe | RAID | RST | VMD | not reached]
  TPM:                [Enabled/Activated | Not enabled | Unknown]
  Secure Boot:        [Enabled | Temporarily disabled | Unknown]
  Network adapter:    [make/model - Intel? Y/N]
  VLAN port:          [NN, range 1-24 or 25-48]
  WinPE address:      [x.x.x.x | none]
  MDT reachable:      [Yes | No | Not tested]
  Domain joined:      [Yes | No | N/A]

ATTEMPTED, IN ORDER
  1. [action] -> [result]
  2. [action] -> [result]
  3. [action] -> [result]

EVIDENCE ATTACHED
  - [error screenshot]
  - [BIOS photo]
  - [console output]
  - [run-state JSON]

RUN STATE
  Gates passed:  [0,1,2]
  Gate blocked:  [3]
  Gates pending: [4,5,6,7,8,9]

ASK
  [One sentence: what you need this tier to do.]
============================================
```

---

## Rules

**Verbatim error text.** Paraphrased errors cost a round trip. `0x80004005` and "something about the disk" are not the same information, and the second one is worth nothing.

**Attempted actions in order, with results.** "Tried everything" tells the next tier nothing and guarantees they repeat your work. Three numbered lines with outcomes tells them exactly where to start.

**One-sentence ask.** "Please inject the storage driver for the Latitude 5540 into the WinPE boot image" gets acted on. "Please advise" gets queued.

**Confirmed state means confirmed.** Do not fill in BIOS storage mode from memory of what you set. If you did not look, write `Unknown`. A wrong "confirmed" value sends L2 down the wrong path and costs more than an honest blank.

## Hard stop escalations

If a hard stop was hit, set Severity to `Hard Stop` and add:

```
HARD STOP TRIGGERED
  Rule:    [1-6]
  Trigger: [what was about to happen]
  Action:  Run halted. No further gates attempted.
```

Hard stops route to **L4** regardless of which gate they occurred in. They are policy events, not technical ones, and the tier that resolves them is the tier that owns the policy.

## Where escalations are recorded

Append to the run-state file so a resumed run carries its own history:

```json
"escalations": [
  {
    "gate": 3,
    "tier": "L2",
    "at": "2026-07-24T14:22:00-05:00",
    "symptom": "PXE timeout after IPv4 selection, Intel adapter, port 14",
    "resolved": false
  }
]
```
