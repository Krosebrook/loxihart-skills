# Continuity Workflow

Triggered by: `continuity update`, or automatically at the end of every draft cycle

## Purpose

The "Last Week We Said..." callback is the newsletter's trust signal. It shows readers
that Loxihart tracks AI developments over time, not just reacting to headlines. Maintaining
continuity across sessions is what separates this from a generic AI summary.

## The Continuity Log

The continuity log is a structured document stored in the Claude Project's knowledge base.
Kyle updates it weekly by copying the auto-generated continuity block from the end of each
draft cycle. This is the single source of truth for cross-session context.

### How It Works

1. **End of each draft cycle:** Claude generates a `continuity-update.md` block
2. **Kyle's action:** Copy this block into the Project knowledge, replacing the previous version
3. **Next session:** Claude reads the continuity log from Project knowledge at the start
   of research or draft mode

This takes Kyle ~30 seconds per week and keeps him in the loop on what carries forward.

## Continuity Log Format

```markdown
# The Prompt — Continuity Log
Last updated: Week [N], [Date]

## Last Week's Key Claims
Claims made in the most recent edition that may need follow-up, correction, or callback.

### Non-Tech Edition
- [Claim text] — Source: [URL]
- [Claim text] — Source: [URL]

### Tech Dept Edition
- [Claim text] — Source: [URL]
- [Claim text] — Source: [URL]

### AI Team Edition
- [Claim text] — Source: [URL]
- [Claim text] — Source: [URL]

## Running Story Threads
Active multi-week narratives. Each thread has a status and the angle used in the most
recent edition.

### [Thread Name] (Status: Active / Watching / Resolved)
- **Started:** Week [N]
- **Last covered:** Week [N]
- **Current angle:** [1-2 sentences — how we framed this last time]
- **Key sources:** [URLs]
- **Next trigger:** [What would make this worth covering again]

### [Thread Name] ...
[Repeat for all active threads]

## Client Talking Points — Active
Talking points that are currently in circulation. These must remain consistent or be
explicitly updated with a "Correction" or "Update" note.

- **"[Client question]"** — "[Our response]" (First issued: Week [N])
- **"[Client question]"** — "[Our response]" (First issued: Week [N])

## Stats Previously Cited
Stats used in recent editions. Avoid repeating the same stat within 4 weeks unless
the number has changed.

- [Stat] — Source: [URL] — Used in: Week [N], [Tier]
- [Stat] — Source: [URL] — Used in: Week [N], [Tier]

## Corrections & Updates
If anything from a previous edition turned out to be wrong or changed, log it here.
These become "Last Week We Said... this week we now know..." callbacks.

- Week [N]: [What we said] → [What actually happened / correction]

## "Did You Know?" Facts Used
Track to avoid repetition.
- Week [N]: [Fact]
- Week [N]: [Fact]

## "I Wish a Veteran Told Me" Tips Used (Non-Tech only)
- Week [N]: [Tip]
- Week [N]: [Tip]

## "Free This Week" Deliverables Used
Track type and topic to maintain variety week to week.
- Week [N]: [Non-Tech: prompt | Tech: snippet | AI Team: framework] — Topic: [topic]
- Week [N]: [Non-Tech: prompt | Tech: snippet | AI Team: framework] — Topic: [topic]
```

## Using the Continuity Log in Drafts

### "Last Week We Said..." Callback

At the start of each edition (after the header/reading time), include a callback:

**Non-Tech example:**
> **Last Week We Said...** Claude was the #1 app in the App Store after the Pentagon
> dispute. This week: downloads have stabilized, but Anthropic reports paid subscribers
> are still growing at 3x their pre-dispute rate. The commercial impact of the safety
> stance continues to compound.

**Tech Dept example:**
> **Last Week We Said...** Migrate off `gemini-3-pro-preview` before March 9. Status:
> The deadline is in 3 days. If you haven't migrated yet, do it today. Gemini 3.1 Pro
> is the replacement — same pricing, better reasoning scores.

**AI Team example:**
> **Last Week We Said...** The supply chain designation would face legal challenge within
> weeks. Update: Anthropic retained WilmerHale. Filing expected this week. Lawfare's
> analysis remains the best public legal assessment — the designation is unprecedented
> and likely unconstitutional.

### Running Thread Continuity

When covering a story that's part of a running thread, explicitly connect it:
- "This is the third week of the Anthropic-Pentagon saga. Here's what changed..."
- "The MCP adoption story continues to accelerate..."
- "Following up on the Google Workspace pricing change we flagged two weeks ago..."

### Talking Point Consistency

Before drafting new client talking points, check the continuity log. If a previous
talking point is still active:
- Either reuse it verbatim (consistency matters)
- Or explicitly update it: "Updated from last week: previously we said X, now we say Y
  because Z changed."

Never quietly contradict a previous talking point. If the situation changed, acknowledge
the change.

## Generating the Continuity Update

At the end of every draft cycle, produce a fresh continuity block:

1. Extract all claims made across all 3 tiers with source URLs
2. Identify new or updated running story threads
3. List all client talking points issued this week
4. Note any stats used (for repetition avoidance)
5. Note any corrections to previous editions
6. Log the "Did You Know?" fact and "Veteran Tip" used

Present this block to Kyle with:
"Here's this week's continuity update. Copy it into the project knowledge to replace
the previous version. Takes 30 seconds. This ensures next week's 'Last Week We Said...'
callbacks are accurate."

## When Continuity Log Is Missing

If Kyle starts a draft session without a continuity log available:

1. Ask: "I don't see the continuity log in project knowledge. Do you have last week's
   edition I can reference, or should I draft without callbacks?"
2. If Kyle provides last week's edition, extract the continuity data inline
3. If neither is available, draft without "Last Week We Said..." but include a placeholder:
   `[CONTINUITY: No previous edition context available. Callback section skipped.]`
4. Still generate the continuity update at the end so the cycle starts fresh

## Corrections Protocol

If Kyle flags that something from a previous edition was wrong:

1. Log it in the Corrections section of the continuity log
2. In the next edition, address it transparently:
   - Non-Tech: "A quick correction from last week: we said X. The accurate picture is Y."
   - Tech Dept: "Correction: [specific technical claim] was inaccurate. The correct
     [version/date/metric] is [corrected value]."
   - AI Team: "Intel correction: [claim]. Updated assessment: [correction with source]."
3. Never silently change a position. Transparency builds trust.
