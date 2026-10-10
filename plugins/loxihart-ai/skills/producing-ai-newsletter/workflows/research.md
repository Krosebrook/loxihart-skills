# Research Workflow

Triggered by: `research week [N]` or `research [topic]`

## Purpose

Produce a structured research brief that feeds all 3 tier drafts. One research pass,
three outputs. This prevents duplicate work and ensures consistency across editions.

## Step 1: Loxihart Weekly Intake (ALWAYS FIRST)

Before running any web searches, collect internal Loxihart context. This is Category 5 content
— it cannot be researched externally. It must come from Kyle.

Present this intake block to Kyle and wait for responses before proceeding:

---

**The Prompt — Week [N] Intake**
*Answer what applies, skip what doesn't. 2 minutes.*

1. **Tool deployments** — Did any new AI tool go live for Loxihart staff or a client this week? *(Claude, Copilot, HubSpot AI, anything)*
2. **Client conversations** — Any client ask about AI, express concern, or push back on something? *(Even a hallway comment counts)*
3. **InVelo** — Any new engagements, proposals sent, wins, losses, or pricing conversations?
4. **HumanX** — Any prep, talking point updates, or agenda changes?
5. **Team adoption** — Anyone on the team using AI in a new way, or notably not using it?
6. **Internal builds** — Did you or anyone ship a skill, workflow, prompt, or automation this week?
7. **Blockers or concerns** — Anything Loxihart leadership is worried about re: AI that staff should know?
8. **Corrections** — Anything from last week's issue that turned out wrong or needs updating?

---

After Kyle responds:
- Log all answers as Category 5 content in the research brief
- If a correction was flagged (#8), note it for the continuity update and "Last Week We Said..." callback
- If all 8 are skipped: note `[No internal Loxihart updates this week]` and proceed to Step 2

## Step 2: Determine Scope

Before searching, establish the research window:

- **Weekly edition:** Past 7 days (Monday to Sunday)
- **Monthly edition:** Past 30 days
- **Special edition:** Specific event or breaking news (no time window — depth over breadth)

Confirm with Kyle: "Researching Week [N] ([date range]). Standard weekly scope, or
anything specific you want me to prioritize?"

## Step 3: Execute Research Sweep

Run 8-12 web searches across all 6 content categories. Use targeted, specific queries —
not broad sweeps. Rotate query patterns to avoid search engine repetition.

### Search Strategy by Category

**1. AI Tools & Product Releases (2-3 searches)**
- `[vendor] release [month] [year]` for Anthropic, OpenAI, Google
- `Claude update`, `GPT new model`, `Gemini release`
- Check vendor blogs directly via web_fetch when possible:
  - `https://www.anthropic.com/news`
  - `https://openai.com/blog`
  - `https://blog.google/technology/ai/`

**2. AI Strategy & Business Impact (1-2 searches)**
- `enterprise AI adoption [month] [year]`
- `AI market data funding [week]`
- Look for: adoption metrics, market sizing, analyst reports, CEO statements

**3. Security & AI Risk (1-2 searches)**
- `AI security vulnerability [month] [year]`
- `LLM security advisory`
- `AI model safety research`
- Look for: CVEs, model jailbreaks, data breaches, safety research publications

**4. Policy & Geopolitical Risk (1-2 searches)**
- `AI regulation policy [month] [year]`
- `AI government [country/region]`
- Look for: legislation, executive orders, international agreements, sanctions, trade policy

**5. Internal Loxihart AI Initiatives (0-1 searches)**
- This comes from Kyle, not from web search
- Ask: "Any internal Loxihart updates to include this week? Tool deployments, client wins, team news?"

**6. Future Watch — 90-180 Day Signals (1-2 searches)**
- `AI roadmap upcoming release [quarter] [year]`
- `AI conference upcoming`
- Look for: beta announcements, roadmap leaks, conference schedules, patent filings

### Source Quality Hierarchy

Prioritize in this order:
1. **Vendor primary sources** — Official blogs, changelogs, documentation
2. **Established tech press** — The Verge, Ars Technica, TechCrunch, Wired, MIT Tech Review
3. **Financial/business press** — Bloomberg, Reuters, WSJ, FT (for funding, M&A, market data)
4. **Research/policy outlets** — Lawfare, RAND, academic papers, NIST
5. **Developer community** — GitHub announcements, Hacker News threads (for signal, not sourcing)
6. **Social media** — X/Twitter posts from verified vendor accounts (treat as leads, verify elsewhere)

**Never source from:** AI-generated content farms, SEO aggregator sites, unattributed blog posts,
Reddit comments (unless quoting a verified employee).

## Step 4: Produce Research Brief

Output a structured brief in this format:

```
# Research Brief — Week [N] ([Date Range])
Compiled: [timestamp]
Sources consulted: [count]

## Breaking / Time-Sensitive
[Flag anything that requires immediate attention or special edition consideration]

## Stories

### [Story ID]: [Headline]
- **Summary:** 1-2 sentences. What happened.
- **Source:** [URL] ([Publication], [Date])
- **Category:** [one of the 6 categories]
- **Tier Relevance:**
  - Non-Tech: [1-3 score] — [1-line angle or "Skip"]
  - Tech Dept: [1-3 score] — [1-line angle or "Skip"]
  - AI Team: [1-3 score] — [1-line angle or "Skip"]
- **Loxihart Impact:** [1 sentence on what this means for Loxihart specifically]
- **InVelo Angle:** [1 sentence, or "N/A"]
- **Continuity:** [Links to previous coverage, or "New thread"]

[Repeat for 8-15 stories, ordered by relevance score sum]

## Stat Candidates
[3-5 compelling statistics from the research for "Stat of the Week" selection]

## Quote Candidates
[2-3 notable quotes that could serve as the "Shareable One-Liner"]

## Gaps & Flags
- [Categories with thin coverage this week]
- [Stories where sourcing is weak — needs Kyle verification]
- [Any claims Claude cannot fully verify]
```

### Relevance Scoring

- **3 = Lead story candidate.** High impact for this tier. Likely to generate reader action or client conversations.
- **2 = Include.** Relevant, worth covering, but not the lead.
- **1 = Mention or skip.** Low relevance for this tier, but may appear as a brief note.
- **Skip** = Not relevant for this tier at all.

## Step 5: Present to Kyle

After producing the brief:

1. Present the brief with a summary: "Found [N] stories across [N] categories. Top 3 for
   each tier: [list]. [N] breaking items flagged. Any stories you want to add, cut, or
   reprioritize?"

2. Ask about internal Loxihart updates (Category 5).

3. Ask about continuity: "Do you have last week's continuity log, or should I work from
   what's in the project knowledge?"

4. Wait for Kyle's sign-off before moving to draft mode.

## Edge Cases

- **Slow news week:** If fewer than 6 stories meet relevance threshold, note this and
  suggest a "deep dive" format focusing on 2-3 stories with more analysis instead of
  breadth. The newsletter should never feel padded.

- **Breaking news mid-week:** If major news breaks between research and draft, flag it:
  "Breaking: [headline]. This changes the Week [N] lead. Want me to re-research or
  incorporate into current brief?"

- **Conflicting sources:** If sources disagree on facts (e.g., funding amounts, benchmark
  scores), note all versions with sources and let Kyle decide which to use.
