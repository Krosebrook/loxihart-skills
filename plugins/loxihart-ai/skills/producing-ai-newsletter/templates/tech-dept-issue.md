# Tech Department Edition Template — Weekly

Use this exact section structure for every Tech Dept weekly edition. Do not skip sections.
Every hidden gem feature must appear in its designated position.

---

## Header Block

```
> THE PROMPT
by Loxihart · Your weekly AI intelligence brief
Week [N] — [Full Date]  |  Tech Department
Tools, APIs, benchmarks, and action items for engineering and service desk.
⏱ Reading time: ~4 minutes
```

In HTML email: Eclipse background, orange `>`, green tier badge (Tech Dept).
In DOCX: "THE PROMPT" as H1, orange rule, "Tech Department" subtitle in green accent.
In Teams: `# > THE PROMPT — Week [N] | 🔧 Tech Department`

---

## 📊 Stat of the Week

Technical metric with benchmark name. Same underlying stat as other tiers but framed
for engineers. Include measurement context (what benchmark, what it measures).

**Example:**
> **Stat of the Week:** Claude Sonnet 4.6 hit 72.5% on OSWorld — the computer use
> benchmark that measures ability to operate spreadsheets, browsers, and desktop apps.
> State of the art was under 15% just 14 months ago.
> *Source: [Anthropic Blog](URL)*

## 🔁 Last Week We Said...

Technical callback. Often a deprecation deadline, migration status, or test result.

**Example:**
> **Last Week We Said...** Migrate off `gemini-3-pro-preview` before March 9. Status:
> Deadline is this Friday. If you haven't migrated, do it today — `gemini-3.1-pro-preview`
> is the replacement. Same pricing, 2x reasoning improvement.

---

## Section 1: This Week in AI Tools (~250 words)

Top 3 tool/platform changes affecting Loxihart's stack. For each:
- **What changed** (version numbers, specific features, availability)
- **Impact on Loxihart** (affects integrations, workflows, or toolchain?)
- **Action required** (test, migrate, update, or "no action needed")

Include error codes, CLI commands, and API endpoints where relevant.

**Writing rules:**
- Version numbers always included
- Deprecation dates in **bold**
- Migration paths explicit: "Switch from X to Y"
- Urgency clear: "Before [date]" or "This week"

## Section 2: Model & Benchmark Updates (~200 words)

New model releases with comparison table:

| Model | SWE-Bench | Context | Input $/1M | Output $/1M | Status |
|-------|-----------|---------|------------|-------------|--------|
| Opus 4.6 | 80.8% | 1M (beta) | $15.00 | $75.00 | Stable |
| GPT-5.2-Codex | SOTA (Pro) | 128K | TBD | TBD | NEW |
| Gemini 3.1 Pro | 77.1%* | 1M | $1.25 | $10.00 | NEW |

Footnotes for non-standard benchmarks (e.g., * = ARC-AGI-2, not SWE-Bench).
Note any model deprecations explicitly.

## Section 3: Security & Compliance (~100 words)

Vulnerabilities, patches, advisories relevant to Loxihart's toolchain. For each:
- **What** / **Severity:** Critical / High / Medium / Low / Informational
- **Loxihart Impact** / **Action:** Patch, monitor, or no action

## 💡 Did You Know?

Technical flavor — can reference benchmarks, model capabilities, ecosystem stats.

**Example:**
> **Did You Know?** MCP SDK downloads went from 100K at launch (Nov 2024) to 97M per
> month (Feb 2026). That's 970x growth in 15 months.

## Section 4: MCP & Integration Ecosystem (~100 words)

New connectors, protocol updates, breaking changes in integrations Loxihart uses:
- New MCP servers/connectors
- OAuth/auth changes
- Breaking changes in tools Loxihart uses
- New integration patterns worth testing

## Section 5: Action Items (~100 words)

Numbered list. Specific. **[URGENT]** prefix for time-sensitive items. **[NEW]** for
items introduced this week.

```
1. **[URGENT]** Migrate off X before [date]. Switch to Y. [Link to migration guide]
2. Test [tool/model] for [specific workflow]. Report results to Kyle.
3. Update [reference/config] — [old value] deprecated, use [new value].
4. **[NEW]** [Action from this week's news]. Context: [1 sentence].
```

## 💬 Shareable One-Liner

Technical, quotable. Vendor quote, benchmark milestone, or industry signal.

**Example:**
> **This week in one line:** "OpenAI's Pentagon contract includes the same safeguards
> Anthropic demanded. The dispute was political, not technical."

## Section 6: Watch Next Week (~50 words)

Upcoming releases, maintenance windows, beta programs. Forward-looking.

---

## 🎁 Free This Week  ← MANDATORY

A code snippet, API example, CLI command, or config template from this week's developments.
One per issue. Never skip. Log in continuity file to maintain variety.

**Format:** Green "FREE" badge + code block. Include copy-paste ready content.

**Example:**
> 🎁 **Free This Week:** Gemini 3.1 Pro migration one-liner. Drop this into your
> existing integration to update the model string:
>
> ```python
> # Before
> model = "gemini-3-pro-preview"
>
> # After (Gemini 3.1 Pro — same pricing, better reasoning)
> model = "gemini-3.1-pro-preview"
> ```
>
> No other changes required. Test with your existing prompts — output quality should
> improve noticeably on multi-step reasoning tasks.

**Rules:**
- Must be directly usable, not illustrative
- Include language/framework context
- Note any prerequisites or gotchas
- Test the snippet mentally before including it

---

## Sign-Off

```
— Kyle Rosebrook, Staff Engineer & AI SME
Slack: @kyle | Teams: krosebrook | Email: [EMAIL]
```

---

## Word Count Target

Weekly: ~800 words total
Monthly: ~2000 words

## Voice Checklist (self-audit before output)

- [ ] Would [PERSON]'s team find this immediately useful?
- [ ] Version numbers and deprecation dates included for every tool change?
- [ ] Benchmark table current and complete?
- [ ] Action items specific enough to execute without additional research?
- [ ] Any filler? (Remove it — these readers scan, not read)
- [ ] Security items properly severity-rated?
- [ ] Free This Week code snippet is genuinely usable, not illustrative?
- [ ] Does the header say "The Prompt by Loxihart" — not "LLM Weekly"?
