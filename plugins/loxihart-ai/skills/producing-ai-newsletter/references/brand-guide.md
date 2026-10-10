# Brand Guide — The Prompt Newsletter

## Newsletter Identity

| Field | Value |
|-------|-------|
| **Name** | The Prompt |
| **Tagline** | by Loxihart · Your weekly AI intelligence brief |
| **Visual signature** | `> THE PROMPT█` — terminal prompt `>` + blinking block cursor |
| **Design concept** | Terminal/code aesthetic. The `>` is the universal "something is about to happen in AI" symbol. The blinking cursor signals the next output is coming — this is it. |

## Loxihart Brand Colors

| Color | Name | Hex | Usage |
|-------|------|-----|-------|
| 🟠 Orange | Meteor | `#E2690E` | Primary accent, `>` cursor, callout borders, Stat of the Week box, left/top border bar |
| 🔵 Light Blue | Deep Space | `#5391AA` | Secondary accent, links, Did You Know box, section dividers, tier badges |
| 🔷 Dark Blue | Eclipse | `#00405F` | Header background, headings, sign-off block, model table headers |
| ⬜ White | — | `#FFFFFF` | Body background, title text on dark backgrounds |
| ⬛ Dark Gray | — | `#333333` | Body text |
| 🔲 Light Gray | — | `#F5F5F5` | Alternating table rows, quote background boxes |
| ⬛ Dark BG | — | `#001624` | Bottom bar background in header, reading time badge background |

## Typography

- **Headings:** Arial Bold (web-safe fallback for all email clients)
- **Body:** Arial, Helvetica, sans-serif
- **Monospace (code/CLI/terminal elements):** Courier New, monospace (all tiers — the terminal aesthetic is part of the brand)
- **Size:** Body 14px, Headings 18–24px, Callout boxes 13px
- **Newsletter title display:** ALL CAPS, heavyweight font, letterSpacing 2–3px

## Newsletter Header Format

### Visual Design Spec (all formats)

The header uses a terminal prompt metaphor:

```
[orange left bar] > THE PROMPT█  [blinking cursor]
                  ─────────────────────────────────
                  by Loxihart • Your weekly AI intelligence brief

                  WEEK [N]  ·  [DATE]

                  [ALL STAFF] [TECH DEPT] [AI TEAM]    ⏱ 3 MIN READ
```

Key elements:
- **`>`** in Meteor orange (`#E2690E`) — terminal prompt symbol, left of title
- **`THE PROMPT`** in white, bold, all-caps
- **Blinking cursor block** (`█`) after title — orange, CSS animation in HTML/React
- **Orange underline** below the full title line
- **Diagonal brand stripes** on right side — Eclipse/Deep Space gradient
- **Circuit node** decoration top-right — orange center node, Deep Space satellite nodes
- **Ghost terminal text** (decorative, right zone): `$ claude --model opus-4.6 / Analyzing sources... / ✓ Week N ready`
- **Tier badges** — pill shapes, color-coded: All Staff = Deep Space, Tech Dept = green, AI Team = orange
- **Reading time badge** — Eclipse background, Meteor orange border and text
- **Bottom bar** — Dark BG with `loxihart.com · Our Purpose is Your Business`

### Tier-Specific Subtitles

| Tier | Subtitle |
|------|----------|
| Non-Tech (All Staff) | What happened in AI this week — and what it means for Loxihart Inc. |
| Tech Department | Tools, APIs, benchmarks, and action items for engineering and service desk. |
| AI Team | Competitive intelligence, architecture patterns, and strategic positioning for Loxihart's AI practice. |

### Per-Format Header Implementation

**HTML email:** Full-width banner. Eclipse background. Inline CSS only (no `<style>` blocks — Outlook strips them). Static version of the header (no animation). Max-width 600px.

**DOCX:** Text-based header. "THE PROMPT" as H1 in Eclipse dark blue, orange horizontal rule below, subtitle in Deep Space, tier identifier as styled paragraph. No images required.

**Teams post:** No visual banner (Teams strips styling). Use: `# > THE PROMPT — Week [N]` as the opening line. Follow with bold tier indicator and reading time.

**SharePoint / React:** Use the full animated React component with blinking cursor and typewriter terminal effect.

## Hidden Gem Features — Full Specification

These 9 features appear in EVERY issue. They are non-negotiable. They are what make
The Prompt feel crafted, not automated. The "Free This Week" section is the highest-retention
feature — it turns the newsletter from a read into a tool.

### 1. Reading Time Estimate ⏱
- **Position:** Immediately after the date/tier line in the header block
- **Format:** `⏱ Reading time: ~[N] minutes`
- **Calculation:** ~250 words per minute
- **Non-Tech:** ~2 min | **Tech Dept:** ~4 min | **AI Team:** ~5 min (weekly)

### 2. Stat of the Week 📊
- **Position:** First content element after header, before "Last Week We Said..."
- **Format:** Callout box with Meteor orange (`#E2690E`) left border
- **Content:** One compelling statistic. Number + plain-English context + source URL.
- **Framing per tier:**
  - Non-Tech: Plain English with comparison ("roughly the value of...")
  - Tech Dept: Technical metric with benchmark name
  - AI Team: Strategic context with InVelo implication
- **Rules:** Same stat can be used across tiers with different framing. Do not repeat a
  stat within 4 weeks (track in continuity log).

### 3. "Last Week We Said..." Callback 🔁
- **Position:** After Stat of the Week, before main content sections
- **Format:** Indented block with Deep Space (`#5391AA`) left border
- **Content:** 2–3 sentences. Reference a specific claim or prediction from the previous
  edition. Connect to this week's developments. Must include the update or status.
- **Source:** Continuity log (`workflows/continuity.md`)
- **If no previous edition:** Skip and note `[First edition — no callback]`

### 4. Shareable One-Liner Quote 💬
- **Position:** Flexible — after the most impactful section or between sections 2 and 3
- **Format:** Boxed with Light Gray (`#F5F5F5`) background, slightly larger font. Designed
  to be copy-pasted into Slack, email, Teams, or LinkedIn.
- **Content:** A single standalone quotable sentence. Works without context.
- **Tone per tier:**
  - Non-Tech: Accessible, conversational
  - Tech Dept: Technical precision
  - AI Team: Strategic depth — suitable for Kyle's LinkedIn

### 5. Source Citations with Clickable Links 🔗
- **Format:** Inline hyperlinks in body text. For contentious claims: `(Source: [Publication](URL), [Date])`
- **Rules:** Every factual claim needs a source. No exceptions. Internal Loxihart knowledge:
  note `(Source: Loxihart internal)`.
- **HTML:** `<a>` tags with `target="_blank"`
- **DOCX:** Hyperlinked text
- **Teams:** `[text](URL)` markdown

### 6. Visual Header/Banner 🎨
- See full spec in "Newsletter Header Format" section above.
- The header is the brand. Consistent across all formats, adapted to each medium's constraints.

### 7. "Did You Know?" Short Fact 💡
- **Position:** Between sections (flexible — natural break point)
- **Format:** Small callout box with Deep Space (`#5391AA`) accent
- **Content:** 1–2 sentences. Surprising, curious AI fact. Does not need to be this week's
  news — general AI facts, historical context, or counterintuitive data points all work.
- **Tone:** Light, interesting. Not critical information — a palate cleanser.
- **Tracking:** Log in continuity file to avoid repetition.

### 8. "I Wish a Veteran Told Me" Beginner Tip 🎓
- **Position:** Near end of edition, before sign-off
- **Format:** Callout box with Meteor orange (`#E2690E`) accent, friendly tone
- **Content:** A practical, specific tip for using AI tools. Friendly advice from someone
  who's been there. Voice: "When [situation], try [specific action]. It saves [time/effort]
  because [reason]."
- **Tier:** **NON-TECH EDITION ONLY.** Do not include in Tech Dept or AI Team.
- **Tracking:** Log in continuity file to avoid repetition.

### 9. Free This Week 🎁  ← NEW
- **Position:** After "Did You Know?" — before sign-off in all tiers
- **Format:** Distinct callout box. Green "FREE" badge. Copyable prompt box for Non-Tech,
  code block for Tech/AI Team.
- **Content:** A ready-to-use deliverable tied to the week's top story. One per issue.
  - **Non-Tech:** A copy-paste AI prompt for a real work task related to the week's news.
    Example: "Paste this into Claude to summarize your next vendor contract in plain English."
  - **Tech Dept:** A code snippet, API example, or CLI command from the week's developments.
    Example: Gemini 3.1 Pro migration one-liner, or a new MCP server config snippet.
  - **AI Team:** A strategic analysis template, framework, or prompt tied to the week's
    story. Example: "Use this prompt to generate a vendor risk assessment for your clients."
- **Why this matters:** This section turns The Prompt from a read into a tool. People will
  forward the issue specifically to share the Free This Week deliverable. It is the
  highest-retention feature in the newsletter. Never skip it.
- **Tracking:** Log each deliverable type in continuity file to maintain variety.

## Email-Specific HTML Patterns

### Outlook Compatibility
```html
<!--[if mso]>
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0">
<tr><td>
<![endif]-->
  <!-- Content here -->
<!--[if mso]>
</td></tr></table>
<![endif]-->
```

### Callout Box Pattern (Stat of the Week / Free This Week)
```html
<table width="100%" cellpadding="12" cellspacing="0" border="0"
       style="border-left: 4px solid #E2690E; background-color: #F5F5F5; margin: 16px 0;">
  <tr>
    <td style="font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
      <strong>Stat of the Week:</strong> [content]
    </td>
  </tr>
</table>
```

### Free This Week Box
```html
<table width="100%" cellpadding="12" cellspacing="0" border="0"
       style="border-left: 4px solid #3da05a; background-color: #f0fff4; margin: 16px 0;">
  <tr>
    <td style="font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
      <span style="background:#3da05a;color:#fff;padding:2px 8px;border-radius:3px;
                   font-size:11px;font-family:monospace;">FREE</span>&nbsp;
      <strong>This Week:</strong> [prompt / code snippet / framework]
    </td>
  </tr>
</table>
```

### Link Style
```html
<a href="URL" target="_blank"
   style="color: #5391AA; text-decoration: underline;">Link Text</a>
```

## DOCX Style Guide

- **Title style:** 24pt, Eclipse dark blue (`#00405F`), Arial Bold
- **Heading 1:** 18pt, Eclipse dark blue, Arial Bold
- **Heading 2:** 14pt, Meteor orange (`#E2690E`), Arial Bold
- **Body:** 11pt, Dark Gray (`#333333`), Arial
- **Callout boxes:** Table cells with colored left borders (no native callout in docx)
- **Tables:** Header row in Eclipse background with white text. Alternating Light Gray rows.
- **Horizontal rules:** Meteor orange (`#E2690E`) line between major sections
- **Footer:** "Kyle Rosebrook | Staff Engineer & AI SME | Loxihart Inc." + page number

## Voice Reference — Kyle's Newsletter Voice

Extracted from Q1 Catch-Up and Week 10 example editions:

**Non-Tech voice:**
- First person plural for Loxihart ("Our Claude-first strategy...")
- Direct address to reader ("Here is the bottom line")
- Explains without condescending ("Think of it as...")
- Takes ownership of clarity ("If something was unclear, that is my fault")
- Confident but not arrogant ("We're well-positioned because...")

**Tech Dept voice:**
- Terse, scannable, implementation-focused
- Version numbers and dates always included
- "ACTION REQUIRED" in caps for urgent deprecations
- Error codes mentioned when relevant
- Tables preferred over prose for comparisons

**AI Team voice:**
- "The strategic read:" as a framing device
- "For InVelo, this means..." as a recurring pattern
- Opinionated analysis ("Brilliant execution." "This is overwhelmingly positive for us.")
- Market data with hard numbers
- Competitive framing ("OpenAI is betting that..." / "Anthropic's counter is that...")
- Named action items with clear ownership
