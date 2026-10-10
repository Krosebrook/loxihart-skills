# Streak Tracking Mechanics

## What increments the counter

A consequential exchange (per references/decision-rubric.md) where the response
substantively agrees with the user's stated or implied position. "Yes, ship it,"
"your architecture is right," "I'd make the same call" — increments.

## What does NOT increment

- Non-consequential agreement (restaurant picks, phrasing preferences)
- Neutral/informational responses with no position taken
- Agreement + material caveat that changes the action ("yes, but only after X" — the
  caveat is a partial disagreement)
- Answering a factual question the user didn't take a position on

## What resets to zero

- Any substantive pushback or disagreement on a consequential call
- A completed challenge pass (accepted or declined — the offer did its job)
- Conversation end. Scope is per-conversation; streaks never carry across sessions.

## Firing behavior

At count = 3: prepend templates/streak-flag-template.md to the response,
regardless of tier — LITE included. Fire once per streak; if the user declines
the pass and keeps agreeing, do not re-fire until the counter cycles through
a reset and climbs to 3 again.

## Honest edge

The counter is model-tracked state, not persisted state — long conversations
with context compression can lose the count. When uncertain whether the streak
is 2 or 3, treat it as 3. The cost of a false fire is one paragraph; the cost
of a missed fire is the failure mode this skill exists for.
