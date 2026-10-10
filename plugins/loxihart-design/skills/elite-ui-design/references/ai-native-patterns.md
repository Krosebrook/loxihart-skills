# AI-Native Design Patterns

Use this reference during Phase 2 (Information Architecture), Phase 5
(Interaction Model), Phase 8 (Screens), and Phase 9 (Anti-Slop Audit).

This document covers UX patterns specific to AI-powered products: streaming
content, agent workflows, multimodal output, prompt composition, trust/
explainability, real-time data, and cost-aware interfaces.

If the product involves AI-generated content, autonomous agents, model routing,
or any form of LLM interaction — this reference is mandatory, not optional.

---

## 1. Streaming Content UX

AI responses arrive token-by-token, not all at once. The interface must handle
this gracefully.

### Text Streaming

**Display pattern:** Tokens appear in a flowing block. The container grows
vertically as content arrives. Never pre-allocate a fixed-height container —
it creates either clipped content or empty space.

**Cursor/caret:** Show a blinking cursor or subtle pulse at the insertion point
during streaming. This signals "still generating" without a spinner. Remove the
cursor when generation completes.

**Scroll behavior:** Auto-scroll to follow new content IF the user is already
at the bottom. If the user has scrolled up to read earlier content, do NOT
auto-scroll — this hijacks their reading position. Show a "jump to latest"
affordance instead.

**Interruption:** Users must be able to stop generation mid-stream. A visible
"Stop" button that appears during generation, disappears when done. Keyboard
shortcut: Escape. Stopped content remains visible (partial output is often useful).

**Skeleton / pre-stream:** Before the first token arrives (model cold start,
queue wait), show a minimal skeleton or pulsing indicator — not a spinner.
Communicate "thinking" vs. "generating" if the distinction matters.

### Code Streaming

Code blocks need special handling:
- Detect code fences as they arrive and switch to monospace rendering mid-stream
- Syntax highlighting applies progressively (or on completion to avoid flicker)
- "Copy" button appears only after the code block is complete
- Line numbers render after completion (not during streaming — they shift too much)

### Image Generation Streaming

Some models support progressive image generation (low-res → high-res):
- Show a blurred placeholder at the target aspect ratio immediately
- Progressive reveal: low-res → medium-res → final, with a smooth crossfade
- Never show a spinner in the image space — show the evolving image itself
- Completion indicator: subtle border or checkmark when final resolution is ready

If progressive rendering is not available:
- Reserve space at the correct aspect ratio (prevent layout shift)
- Show a skeleton with a pulsing gradient at the target dimensions
- Crossfade from skeleton to final image on completion

---

## 2. Agent / Autonomous Workflow UX

Agents act on the user's behalf over extended durations. This fundamentally
changes the interaction model from request/response to delegation/supervision.

### Agent Status Visibility

The user must always know:
1. **Is the agent working?** (active / idle / paused / failed)
2. **What is it doing right now?** (current step in plain language)
3. **How far along is it?** (progress — steps completed / total, or time estimate)
4. **What has it done so far?** (audit trail of completed actions)

**Status patterns:**
- **Inline status bar:** For short tasks (<30s). Shows current action + progress.
- **Activity feed / log:** For multi-step tasks. Timestamped list of actions taken.
  Collapsible for power users. Summary view for casual users.
- **Background task indicator:** For long-running tasks. Persistent badge or
  notification dot. Tappable to see detail. Must survive page navigation.

### Approval Gates

When an agent needs human confirmation before proceeding:

- **Clear framing:** "I'm about to [action]. This will [consequence]."
- **Decision UI:** Approve / Reject / Modify — not just "OK"
- **Context:** Show what the agent has done so far and what it plans to do next
- **Timeout behavior:** If the user doesn't respond, does the agent wait
  indefinitely, retry later, or cancel? Make this visible.
- **Batch approvals:** If multiple decisions queue up, let users approve/reject
  in batch, not one at a time

### Audit Trail

Every agent action should be:
- **Logged:** Timestamped record of what happened
- **Reversible where possible:** Undo for non-destructive actions
- **Explainable:** Why the agent chose this action (link to decision logic)
- **Filterable:** By action type, time range, outcome (success/failure)

The audit trail is not a debug log — it's a first-class UI surface.
Design it with the same care as any other screen.

### Delegation UI

How users assign tasks to agents:

- **Natural language input** with structured parameter extraction
  (user types freely, system extracts constraints)
- **Constraint specification:** Budget limits, time bounds, scope restrictions,
  approval requirements — exposed progressively (Tier B/C in progressive disclosure)
- **Template/preset patterns:** Saved delegation configurations for repeated tasks
- **Preview:** "Here's what I'll do" summary before execution begins

### Agent Failure Recovery

Agents fail differently than traditional features:

- **Partial completion:** The agent did 7 of 10 steps. Show what's done, what's
  not, and offer: retry remaining / undo completed / complete manually.
- **Ambiguity:** The agent isn't sure what to do. Surface the decision to the
  user with context, not a generic error.
- **External dependency failure:** An API the agent called is down. Show which
  step failed, what it was trying to do, and offer retry with backoff indicator.
- **Cost overrun:** The agent is about to exceed budget. Pause and ask.

---

## 3. Multimodal Output Design

Modern AI produces text, images, code, structured data, audio, and video —
sometimes in a single response.

### Mixed-Media Response Layout

When a response contains multiple content types:

**Inline flow:** Text wraps around images and code blocks naturally (like a
well-typeset document). This is the default for conversational interfaces.

**Segmented blocks:** Each content type gets its own container with clear
visual boundaries. Better for tool-like interfaces where outputs are discrete.

**Tabbed output:** When the same generation produces multiple formats (e.g.,
chart + data table + insight text). Tabs let users access each format without
scrolling.

### Per-Content-Type Patterns

**Text output:**
- Markdown rendering with proper heading hierarchy
- Collapsible sections for long outputs
- "Copy" at the response level and per-section

**Image output:**
- Lightbox on click (zoom to full resolution)
- Download button (original resolution, not compressed preview)
- Regenerate affordance with parameter adjustment
- If multiple images: gallery grid with selection, not a carousel

**Code output:**
- Syntax-highlighted with language detection
- Copy button (top-right of code block, not below)
- "Run" button if execution environment is available
- Line numbers for reference
- Diff view if this is a modification of existing code

**Structured data output (JSON, tables):**
- Formatted/pretty-printed by default
- Toggle between formatted and raw view
- Sortable/filterable table rendering for tabular data
- Download as CSV/JSON

**Audio output:**
- Inline player with waveform visualization
- Playback speed control
- Download button
- Transcript toggle (if available)

### Regeneration and Variation

For any generated output:
- **Regenerate:** Same prompt, new output. Show both (don't replace).
- **Modify:** Adjust parameters and regenerate. Show what changed.
- **Compare:** Side-by-side or diff view between generations.
- **History:** Access previous generations without losing current.

---

## 4. Prompt / Input Design for AI Interactions

Traditional form design assumes structured input. AI interactions often start
with unstructured natural language. Both patterns need to coexist.

### Prompt Composition UX

**Simple prompt:** Single text input with send button. Adequate for
conversational AI. Not adequate for complex tool interactions.

**Structured prompt:** Natural language input + visible parameter controls:
- Model selection (dropdown or segmented control)
- Temperature / creativity slider (if user-facing)
- Output format selector (text / code / image / structured)
- Context attachments (files, URLs, previous outputs)
- System prompt / persona selector (if applicable)

**Progressive complexity:** Start with simple prompt. Reveal structured
controls on demand (Tier B/C). Power users access full parameter control.
New users never see it unless they ask.

### Context Window Indicators

For products where context size matters (like a model router):
- **Token count:** Show current context usage (e.g., "2.4K / 128K tokens")
- **Visual progress bar:** Fills as context grows, changes color near limits
- **Context composition:** What's in the context? (system prompt: 500 tokens,
  conversation: 1.2K tokens, attached files: 700 tokens)
- **Pruning indicators:** When older messages are being dropped, show it.
  Users should never be surprised that context was lost.

### Template / Preset Systems

For repeated prompt patterns:
- Save prompt as template with variable placeholders
- Quick-access to recent/favorite templates
- Template sharing between users (if collaborative)
- Parameter presets (model + settings combinations)

---

## 5. Trust and Explainability in AI Interfaces

Users need to calibrate their trust in AI output. The interface must help.

### Confidence Indicators

When the AI has variable confidence in its output:
- **High confidence:** No special indicator needed (default state)
- **Medium confidence:** Subtle indicator — muted text, "approximate" label,
  or a small uncertainty icon
- **Low confidence:** Explicit flag — "I'm not sure about this" with
  explanation of why

Never show numerical confidence scores to non-technical users.
Translate to meaningful language or visual treatment.

### Source Attribution and Provenance

For generated content that references sources:
- **Inline citations:** Linked references within the generated text
- **Source panel:** Collapsible sidebar or footer showing all sources
- **Freshness indicators:** When was the source data last updated?
- **Verification affordance:** "Verify this" link to original source

For AI-generated content with no source (purely generative):
- Label it clearly: "AI-generated" or "Suggested" — not presented as fact
- Editing affordance: User can modify before accepting
- Provenance metadata: Which model generated this, when, with what parameters

### Human-in-the-Loop Signals

When the AI makes decisions that affect the user:
- **Decision visibility:** Show what decision was made and why
- **Override affordance:** Let the user change the AI's decision
- **Feedback loop:** "Was this helpful?" or thumbs up/down — but only if
  the feedback actually trains something. Don't collect feedback theater.

### Hallucination / Error Awareness

- Never present AI output as authoritative without caveat
- For factual claims: link to verification sources
- For generated code: show test results or validation status
- For decisions: show the decision criteria and alternatives considered
- For summaries: link to full source material

---

## 6. Real-Time and Streaming Data Patterns

For products with live data feeds, model health monitoring, or real-time metrics.

### Live Data Updates

**Update strategies:**
- **Replace in place:** Value changes, element stays. Use a brief highlight
  animation (flash the background for 300ms) to signal the change.
- **Append and scroll:** New items added to a list. Auto-scroll only if user
  is at the bottom (same rule as text streaming).
- **Aggregate and batch:** Updates arrive rapidly. Batch UI updates to max
  2–3 per second to prevent visual noise.

**Stale data indicators:**
- Show "last updated" timestamp on any data that could be stale
- Visual degradation: Reduce opacity or add a "stale" badge after a threshold
- Connection status: Show WebSocket/SSE connection health. If disconnected,
  show it prominently — don't let users make decisions on stale data.

### Optimistic UI

Show the expected result before server confirmation:
- User clicks "approve" → UI immediately shows "approved" state
- If server confirms → nothing changes (already in correct state)
- If server rejects → revert with explanation of why

Rules:
- Only for low-risk, high-frequency actions
- Never for destructive or irreversible actions
- Always show a brief "saving" indicator (subtle, not blocking)
- Revert must be smooth (crossfade back, not a jarring snap)

### Connection Status

For apps dependent on real-time connections:
- **Connected:** No indicator needed (connected is the default assumption)
- **Reconnecting:** Subtle banner or indicator — "Reconnecting..."
- **Disconnected:** Prominent banner — "You're offline. Data may be outdated."
  with manual reconnect button
- **Degraded:** Partial connectivity — "Some features may be slower than usual"

---

## 7. Cost and Performance Awareness

AI features have real costs (API calls, compute time, token usage). If users
bear these costs or need to understand them, design for transparency.

### Cost Visibility

**Per-interaction cost:**
- Show estimated cost before execution (especially for expensive operations)
- Show actual cost after completion
- Running total for the session/period

**Cost presentation:**
- Exact values for power users / API consumers ($0.0023 per request)
- Abstracted units for consumer users (credits, tokens, usage meter)
- Budget visualization: progress bar toward limit, with color change at 80%/90%

### Latency Awareness

Different AI operations have different expected latencies. Set expectations:

| Operation | Expected Latency | UI Treatment |
|-----------|-----------------|-------------|
| Text completion | 0.5–3s | Streaming (show tokens as they arrive) |
| Image generation | 3–30s | Progress indicator with estimate |
| Agent task | 10s–10min+ | Background task with status feed |
| Embedding / search | 100–500ms | Inline spinner, skeleton |
| Model switching | 200ms–2s | Brief transition state |

Always show elapsed time for operations over 3 seconds.
Never show a spinner with no time context for operations over 10 seconds.

### Rate Limit UX

When the user hits rate limits:
- **Explain:** "You've reached the limit for [resource]. Resets in [time]."
- **Countdown:** Show when they can resume
- **Alternatives:** Suggest a different model, cached results, or queue for later
- **Prevention:** Show remaining quota before they hit the limit

### Fallback Behavior

When the AI provider is degraded or down:
- **Graceful degradation:** Show cached/stale results with a freshness indicator
- **Alternative routing:** If multiple providers exist (Flash-n-Frame's core
  value), show which provider is active and why a switch happened
- **Manual override:** Let the user choose a specific provider if auto-routing
  is making choices they disagree with

---

## 8. Data Density for Information-Rich Interfaces

Dashboards, monitoring tools, and routing interfaces need to display high
volumes of data without overwhelming users.

### Density Strategies

**Sparklines and inline indicators:** Show trend without a full chart.
A 60×16px sparkline next to a metric communicates direction and volatility
in zero additional vertical space.

**Progressive data reveal:**
- **Level 0:** Summary metric (single number + trend indicator)
- **Level 1:** Click/hover for a mini chart or breakdown
- **Level 2:** Drill into full detail view with filtering and export

**Data tables for dense data:**
- Fixed header on scroll
- Column resizing and reordering
- Inline actions (not row-level menus for primary actions)
- Keyboard navigation (arrow keys between cells)
- Density toggle: compact / comfortable / spacious

**Information scent:** Every summary metric should visually signal whether
it needs attention. Use color sparingly — a single red indicator among gray
metrics draws the eye. If everything is colored, nothing stands out.

### Dashboard Composition

Avoid the "4 stat cards → chart → table" template. Instead:

1. **Lead with the single most important metric** — large, prominent, with trend
2. **Group related metrics** — not by type (all numbers together) but by
   decision context (metrics I need together to make a specific decision)
3. **Time controls are global** — one time range selector affects all data,
   not per-widget date pickers
4. **Actionable, not decorative** — every metric links to a drill-down or
   action. If you can't act on it, question whether it belongs on the dashboard.
5. **Anomaly-first layout** — surface what's unusual before what's normal.
   A dashboard that only shows green is useless. Prioritize deviations.

---

## Quick Reference: AI Interaction State Machine

Every AI-powered interaction follows this state lifecycle:

```
IDLE
  → user submits input
VALIDATING
  → input rejected → ERROR (show why, preserve input)
  → input accepted
QUEUED (optional, for busy systems)
  → show position in queue + estimate
PROCESSING
  → show "thinking" indicator
  → for agents: show current step
STREAMING (for text/image)
  → tokens/pixels arriving
  → user can interrupt (Stop button)
COMPLETE
  → show final output
  → show cost/latency metadata
  → offer: copy, regenerate, modify, save
FAILED
  → show what went wrong
  → offer: retry, modify input, contact support
  → preserve all user input
```

Design for every state. If a state is missing from your interaction model,
users will encounter a blank screen or a frozen UI at that moment.
