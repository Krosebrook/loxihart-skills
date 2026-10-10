# Template: Known Error Entry

<purpose>
Use this template to document a new known error pattern for inclusion in `references/root-cause-patterns.md`. A known error qualifies when the same root cause has been identified in 3+ separate incidents.
</purpose>

<template>

## Pattern [N]: [Descriptive Name]

**Signature:** [How does this pattern present? What do the tickets look like? What symptoms do users report? Be specific enough that L1 can recognize it.]

**Root cause:** [What is actually causing the failure? Be specific — not "a service failed" but "the Print Spooler service enters a deadlock state when a network printer's SNMP agent returns a malformed response during status polling."]

**Detection:** [How to confirm this is the pattern and not something else. What diagnostic steps differentiate this from similar-looking issues?]

**Fix:** [Step-by-step resolution. Include the tier level required. Reference specific scripts if applicable.]

**Prevention:** [What change would prevent this from recurring? Has the change been implemented? If not, is there an L4 recommendation pending?]

**History:**
- First observed: [Date, Ticket #]
- Occurrences: [Count]
- Last occurrence: [Date, Ticket #]
- Status: [Active — no permanent fix / Mitigated — workaround in place / Resolved — permanent fix implemented]

</template>

<submission_process>

1. Fill out the template above
2. Add the entry to `references/root-cause-patterns.md` in the `<patterns>` section
3. Number it sequentially (next available Pattern number)
4. Notify L1/L2 teams that a new known error has been documented
5. If a permanent fix has not been implemented, flag for L3/L4 review

</submission_process>
