# Workflow: L0 Self-Service

<purpose>
This workflow guides end users through fixes they can perform themselves without admin rights. The goal is to resolve common issues quickly and reduce ticket volume. If the user completes all applicable steps without resolution, this workflow hands off to L1 via the escalation gate.

L0 is not a dumping ground for lazy troubleshooting. It is a structured, respectful path that empowers users to fix real problems. The steps here resolve 30-50% of P3-P5 issues without any tech involvement.
</purpose>

<required_reading>
**Before starting, you should have already read:**
1. The relevant category reference file (determined during triage)
2. `references/sla-priority-matrix.md` (to know the priority)

The category reference file contains the specific troubleshooting steps for this issue type. This workflow provides the structure — the reference provides the content.
</required_reading>

<process>

## Step 1: Set Expectations

Tell the user what is about to happen:
> "I'm going to walk you through some steps you can try right now. We'll go one at a time — after each step, tell me if it fixed the issue. If we get through all the steps and it's still not working, I'll connect you with IT support."

This matters because users who understand the process are more patient and more accurate in reporting results.

## Step 2: Quick Checks (Universal — Every Category)

Before category-specific steps, run these universal checks. They are fast, require no technical knowledge, and resolve a surprising number of issues:

1. **Restart the affected application.** Close it fully (not just minimize) and reopen.
   - Confirm: "Did you close it completely and reopen? Any change?"

2. **Check cables and connections.** If hardware is involved (headset, dock, monitor, printer), confirm everything is firmly plugged in. Try a different port if USB.
   - Confirm: "Everything plugged in securely? Tried a different port?"

3. **Restart the computer.** Not sleep, not hibernate — actual restart (Start → Power → Restart). This clears stuck services, refreshes drivers, and resets network connections.
   - Confirm: "Computer fully restarted? Is the issue still happening?"

If the issue is resolved at any point during quick checks, confirm resolution and close. Do not continue troubleshooting a resolved issue.

## Step 3: Category-Specific Self-Service Steps

Pull the L0-applicable steps from the category reference file. Present them ONE AT A TIME. After each step:

> "Did that fix it? (yes / no / not sure)"

- **Yes** → Confirm resolved. Summarize what fixed it so the user knows for next time.
- **No** → Move to the next step.
- **Not sure** → Describe exactly what to look for, then ask again.

Category reference files mark which steps are L0-safe (no admin rights needed). Only present those steps. Skip anything that requires elevated access, PowerShell, registry edits, or admin tools.

## Step 4: Fast-Track Check (P2 Only)

If this is a P2 issue (user fully blocked, no workaround) and 15 minutes have passed since starting L0 steps without resolution:

> "You've been working through these steps for 15 minutes and you're still blocked. Let me get IT support engaged now so they can help directly."

Do not continue L0 steps for a blocked user past 15 minutes. Escalate to L1.

## Step 5: L0 Exhausted — Escalation to L1

If all L0 self-service steps are completed without resolution:

> "You've completed all the steps you can do on your end. The next steps require IT support tools. I'll get this to the help desk with notes on everything you've already tried so they can skip ahead."

Before escalating, read `workflows/escalation-gate.md` and complete the handoff package:
- Document every step the user attempted and the result
- Note the category and priority classification
- Include any error messages or behaviors the user reported
- Use `templates/escalation-handoff.md` for format

Provide the user with their ticket reference and expected response time based on priority level.

</process>

<communication_guidelines>

## How to Talk to End Users

- **Plain language only.** "Right-click the speaker icon in the bottom-right corner" — not "access the system tray audio applet."
- **Exact locations.** "Click the Start button, then type 'Settings' and press Enter" — not "open Settings."
- **One action per instruction.** Do not combine "open Device Manager, expand Audio, right-click your headset, and select Update Driver" into one step. That is four steps.
- **Reassure on scary steps.** If a step involves anything that sounds destructive (restart, uninstall, clear cache), explain what it does and that it is safe: "This won't delete your files — it just clears temporary data that might be causing the problem."
- **Never blame the user.** Even if the issue is user error (unplugged cable, wrong setting), frame the fix positively: "Looks like the cable wasn't fully seated — that happens all the time. Let's make sure it's firm."

</communication_guidelines>

<success_criteria>
L0 workflow is complete when:
- [ ] Universal quick checks (restart app, check connections, restart computer) attempted
- [ ] All L0-safe category-specific steps attempted one at a time
- [ ] Each step result confirmed by the user
- [ ] Issue resolved (close with summary of fix) OR all steps exhausted
- [ ] If unresolved: escalation gate completed, handoff package created, user given ticket reference
</success_criteria>
