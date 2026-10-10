# Draft Workflow

Triggered by: `draft week [N]`, `draft [tier]`, `special edition [topic]`

## Prerequisites

Before drafting, you need:
1. **A research brief** — either from the research workflow or pasted by Kyle
2. **Continuity context** — either from the project knowledge continuity log or provided by Kyle
3. **Edition type confirmation** — weekly, monthly, or special

If any prerequisite is missing, ask for it before proceeding.

## Step 1: Confirm Parameters

```
Drafting: Week [N] [Weekly/Monthly/Special]
Date: [publication date, typically Monday]
Tiers requested: [All 3 / specific tier]
Research brief: [Available / Need to research first]
Continuity log: [Available / Need from Kyle]
Output formats requested: [HTML / DOCX / Teams / All]
```

## Step 2: Content Selection Per Tier

Using the research brief and the Content Routing Matrix (in SKILL.md), select stories
for each tier independently. This is the critical step — each tier is a separate
editorial decision.

For each tier, identify:
- **Lead story** (highest relevance score for that tier)
- **Supporting stories** (2-4 depending on tier and edition type)
- **Stat of the Week** (same stat across all 3 tiers, but framed differently)
- **Shareable one-liner** (can differ per tier)
- **"Last Week We Said..." callback** (from continuity log)
- **"Did You Know?" fact** (same across tiers or tier-specific)
- **"I Wish a Veteran Told Me" tip** (Non-Tech tier ONLY)

## Step 3: Draft Each Tier

Read the appropriate template before drafting:
- `templates/non-tech-issue.md` for Tier 1
- `templates/tech-dept-issue.md` for Tier 2
- `templates/ai-team-issue.md` for Tier 3

Follow the template section structure exactly. Every section, every hidden gem feature,
in the correct position. Do not skip sections even if content is thin — note it instead.

### Tier-Specific Writing Rules

**Non-Tech (Tier 1):**
- No acronyms without definition. First use: "Model Context Protocol (MCP) — a standard
  way for AI tools to connect to business systems." After that, "MCP" is fine.
- Every statistic in plain English: not "$730B valuation" alone, but "$730 billion — roughly
  the combined value of Nike, Starbucks, and Goldman Sachs."
- No benchmark names (SWE-Bench, GPQA, etc.) — translate to outcomes: "performs better at
  coding tasks" or "answers expert-level questions more accurately."
- Analogies encouraged. The Q1 examples used: "similar to email or cloud storage a decade ago,"
  "think of it as vibe working."
- Client talking points are Q&A format: `"If a client asks X..." — "Here's what to say..."`
- Sign-off: "Questions? Reach out to Kyle Rosebrook. This newsletter is designed to keep
  everyone informed without the jargon. If something was unclear, that is my fault — let
  me know and I will fix it for next week."

**Tech Dept (Tier 2):**
- Benchmark tables required for any model comparison. Use the established table format:
  `Model | SWE-Bench | Context | Input $/1M | Status`
- Version numbers, deprecation dates, and migration paths are expected.
- Action items are numbered and specific: "1. Migrate off X before [date]. Switch to Y."
- Error codes and API endpoints are welcome.
- Code references and CLI commands OK.
- Deprecation warnings in **bold**.
- Sign-off: "— Kyle Rosebrook, Staff Engineer & AI SME" with contact info.

**AI Team (Tier 3):**
- InVelo positioning angles on every major story. "For InVelo, this means..."
- Competitive intel framing: vendor strategy reads, not just feature announcements.
- Market data with hard numbers and sources.
- Strategic implications made explicit — don't leave the reader to infer.
- HumanX talking points when relevant.
- Architecture pattern observations.
- Pricing analysis with per-token cost comparisons.
- Sign-off: "— Kyle Rosebrook / Staff Engineer & AI SME | InVelo Lead | Loxihart Inc."

## Step 4: Apply Hidden Gem Features

Before presenting any draft, verify ALL hidden gems are present. See `references/brand-guide.md`
for exact specs. Checklist:

- [ ] Reading time estimate (top of issue, right after date/tier line)
- [ ] Stat of the Week callout box
- [ ] "Last Week We Said..." continuity callback (top of body or after lead)
- [ ] Shareable one-liner quote (boxed/highlighted, designed to be copy-pasted for Slack/email)
- [ ] Source citations with clickable URLs (every claim)
- [ ] Visual header/banner concept (described in text for docx, HTML for email)
- [ ] "Did You Know?" short fact
- [ ] "I Wish a Veteran Told Me" beginner tip (Non-Tech tier ONLY)
- [ ] "Free This Week" deliverable (ALL tiers — prompt / code snippet / framework tied to lead story)

## Step 5: Format Output

Kyle may request one or more output formats. Default to all three if not specified.

### HTML Email Format

Outlook/Gmail compatible. Requirements:
- Inline CSS only (no `<style>` blocks — Outlook strips them)
- Table-based layout for Outlook rendering
- MSO conditional comments for Outlook-specific fixes
- Brand colors: Orange `#E2690E`, Light Blue `#5391AA`, Dark Blue `#00405F`
- Max width: 600px
- Web-safe fonts: Arial, Helvetica, sans-serif
- All links with `target="_blank"`
- Alt text on any images
- Preheader text for email clients

Structure:
```html
<!-- Preheader -->
<!-- Banner/Header (brand colors, tier name, week number, date) -->
<!-- Reading Time + Stat of the Week -->
<!-- Last Week We Said... -->
<!-- Main Content Sections -->
<!-- Hidden Gem Features (Did You Know, Quote, Veteran Tip) -->
<!-- Footer (Kyle contact, feedback link) -->
```

Save as: `ThePrompt_Wk[N]_[Tier].html`

### Word .docx Format

Use the docx skill (`/mnt/skills/public/docx/SKILL.md`) to generate a properly formatted
Word document. Key requirements:
- Header: "THE PROMPT" (or monthly equivalent)
- Subheader: "Week [N] — [Date] | [Tier Name]"
- Loxihart brand colors for headings and accent elements
- Tables for benchmark comparisons (Tech Dept and AI Team)
- Callout boxes for Stat of the Week, Client Talking Points, hidden gems
- Page numbers in footer
- Kyle's contact info in footer

Save as: `ThePrompt_Wk[N]_[Tier].docx`

### Microsoft Teams Post Format

Teams-compatible markdown. Requirements:
- Use Teams markdown syntax (bold, italic, headers, bullet lists)
- No HTML — Teams strips it
- Tables using markdown pipe syntax (Teams renders these)
- Adaptive Card format NOT required (standard message)
- Break into sections with `---` dividers
- Keep under 28KB (Teams message size limit)
- Emoji sparingly for visual scanning: 📊 for stats, ⚠️ for warnings, 🔗 for links

Save as: `ThePrompt_Wk[N]_[Tier]_Teams.md`

## Step 6: Generate Continuity Update

After completing all drafts, automatically generate the continuity update block.
See `workflows/continuity.md` for format. Present it to Kyle with instructions:
"Copy this continuity block into your project knowledge to replace the previous one.
It captures this week's key claims, threads, and talking points for next week's
'Last Week We Said...' callback."

## Step 7: Present to Kyle

Present all outputs with:
1. A quick summary of what was drafted
2. Any flags (unverified claims, thin sections, editorial judgment calls)
3. The continuity update block
4. Ask: "Ready for review. Anything to adjust before I produce the final formatted files?"

## Special Edition Handling

For breaking news or event coverage (e.g., HumanX, Google I/O):

- Use the same 3-tier structure but with adjusted sections
- Lead with the event/breaking news in all 3 tiers
- Non-Tech: "What happened and what it means for you" (tighter, 300-400 words)
- Tech Dept: "Technical implications and action items" (500-600 words)
- AI Team: "Full strategic analysis" (800-1000 words)
- Label clearly: "SPECIAL EDITION" in header
- Include a note: "Regular weekly edition will publish on [next Monday]"

## Monthly Edition Handling

Monthly editions are significantly longer and follow expanded blueprints:

- Non-Tech Monthly: ~1200 words with Executive Summary, Month in Review, Competitive
  Landscape (non-technical), Client Conversation Guide, What's Coming, Loxihart Action Items
- Tech Dept Monthly: ~2000 words with TL;DR, Full Model Landscape table, Platform & Tool
  Changes by vendor, Security Digest, MCP & Integrations, Infrastructure Implications,
  Action Items by Team, Watch Next Month
- AI Team Monthly: ~3000 words with TL;DR, Full Model Landscape + analysis, Anthropic
  Deep-Dive, Competitor Intelligence, Enterprise Market Data, Agentic AI & Architecture,
  Strategic Implications for Loxihart, Action Items, Radar & Watch List

Confirm edition type before drafting: "This is Week [N] — is this a standard weekly or
the monthly edition?"
