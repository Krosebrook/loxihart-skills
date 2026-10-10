# Loxihart KB Article Template Structure

Complete section registry extracted from Loxihart-ReferenceGuideTemplate-2026.docx. Every generated article must follow this structure in order.

## Official Loxihart Brand Palette

| Color Name | Hex | Usage |
|---|---|---|
| Orange (Meteor) | #E2690E | H2 headings, warning box border/text |
| Light Blue (Deep Space) | #5391AA | Info box borders |
| Dark Blue (Eclipse) | #00405F | Titles, table headers |
| Dark Navy | #0E2841 | H1, H3+ headings |
| Warning Fill | #FFEBDE | Warning box background |
| Info Fill | #F5FBFF | Info box background |
| Info Text | #043854 | Info box text |
| Note Border | #DDDDDD | Best practice box top/bottom |
| Table Alt Row | #F2F2F2 | Alternating table row shading |
| Table Border | #D9D9D9 | Table cell borders |
| Confidential | #C00000 | Footer CONFIDENTIAL text |

## Document Structure (in order)

### 1. Cover Page (Required)

**Title Block:**
- Title text: Bold, #00405F, 20pt, bottom border rule
- Subtitle: Italic, #808080, 10pt — "Created by Loxihart [Department] Team; [Month Year]"
- Intro paragraph: Body text summarizing what the document covers
- Callout legend: Italic text explaining warning (⚠), info (ⓘ), and best practice (★) icons

**Fields to collect:**
- `title` — Document title
- `department` — Loxihart department name (e.g., "Security", "Engineering", "IT Operations")
- `created_date` — Month and year (e.g., "February 2026")
- `intro_paragraph` — 1-2 paragraph overview of document scope

### 2. Important Links (Required)

Bullet list of relevant links. Collect as array of `{text, url}` pairs.

**Fields to collect:**
- `important_links[]` — Array of link objects with display text and URL

### 3. Contact Us (Required)

Single line: "You can reach the Loxihart [Department] Support Team by emailing [email]."

**Fields to collect:**
- `support_email` — Department support email address

### 4. Table of Contents (Required, Auto-generated)

Generated from heading structure. No user input needed.

**TOC Styling:**
- TOC title: Uses H1 style (Roboto Condensed Medium, #0E2841, 24pt)
- H1-level entries: **Bold**, Rubik 11pt, dot leader to page number
- H2+ level entries: *Italic*, Rubik 11pt, indented (360 DXA per level), dot leader to page number

**Paragraph Defaults (applied to body text globally):**
- Alignment: Left
- Indentation: Left 0, Right 0, Special: none
- Spacing: Before 0, After 0 (except where explicitly set)
- Line spacing: Multiple at 1.15 (276 twips)

**List Hierarchy (all items 11pt/22 half-pts):**

Unordered bullets (5 levels): • → ○ → ▪ → • → ○
- Level 0: • (U+2022), indent 720 DXA
- Level 1: ○ (U+25CB), indent 1440 DXA
- Level 2: ▪ (U+25AA), indent 2160 DXA
- Level 3: • (U+2022), indent 2880 DXA
- Level 4: ○ (U+25CB), indent 3600 DXA

Numbered lists (5 levels): 1. → a. → i. → 1. → a.
- Level 0: Decimal (1.), indent 720 DXA
- Level 1: Lower letter (a.), indent 1440 DXA
- Level 2: Lower roman (i.), indent 2160 DXA
- Level 3: Decimal (1.), indent 2880 DXA
- Level 4: Lower letter (a.), indent 3600 DXA

**Numbering resets per section** — each new H2 subsection with steps starts at 1.

### 5. Primary Content Sections (Required)

Main body organized under H1 headings with H2/H3 subsections. Structure varies by doc type.

**Heading hierarchy follows Loxihart brand:**
- H1: Section titles (Roboto Condensed Medium, #0E2841, 24pt)
- H2: Subsection titles (Roboto Condensed Medium, #E2690E, 20pt)
- H3+: Sub-subsections (Roboto Condensed, #0E2841, 18pt descending)

**Content elements available:**
- Body text (Rubik, 11pt)
- Numbered lists (1, a, i, 1, a nesting)
- Unordered bullet lists (5 nesting levels)
- Code blocks (monospace, background shading)
- Warning callout boxes (⚠, orange theme)
- Info callout boxes (ⓘ, blue theme)
- Best practice callout boxes (★, gray borders)
- Tables (dark header #00405F, alt row #F2F2F2)
- Images (centered, shadow recommended)

**Fields to collect:**
- `sections[]` — Array of section objects, each containing:
  - `title` — H1 section title
  - `subsections[]` — Array of subsection objects with:
    - `title` — H2 subsection title
    - `content` — Body text, steps, lists, callouts, tables
    - `callouts[]` — Optional array of `{type: "warning"|"info"|"bestpractice", text}`
    - `steps[]` — Optional numbered steps with expected results
    - `tables[]` — Optional tables with headers and rows
    - `code_blocks[]` — Optional code/command examples

### 6. Decision Tree (Optional)

Text-based decision flow: START → decision points → outcomes.

**Fields to collect:**
- `decision_tree.start` — Starting condition/question
- `decision_tree.paths[]` — Array of `{condition, yes_path, no_path}` or `{condition, outcomes[]}`

### 7. Requirements & Prerequisites (Optional)

Checklist of items needed before beginning.

**Fields to collect:**
- `prerequisites[]` — Array of requirement strings (access, tools, credentials, training)

### 8. Validation & Verification Checklist (Optional)

Checklist to confirm completion.

**Fields to collect:**
- `verification_items[]` — Array of verification check strings

### 9. Escalation & Exception Handling (Optional)

Table: Condition → Action/Escalate To → Priority/Timeline

**Fields to collect:**
- `escalation_matrix[]` — Array of `{condition, action, priority}`

### 10. RACI Matrix (Optional)

Table: Task → R/A/C/I per role

**Fields to collect:**
- `raci.roles[]` — Array of role names
- `raci.tasks[]` — Array of `{task, assignments: {role: "R"|"A"|"C"|"I"}}`

### 11. Version History Table (Optional but common)

Table: Version → Date → Author → Changes

Auto-populated with:
- Version 1.0.0, current date, department name, "Initial publication"

### 12. Appendices (Optional)

Appendix A, B, etc. with supplementary content.

**Fields to collect:**
- `appendices[]` — Array of `{title, content}`

### 13. Assumptions & Limitations (Optional)

Bullet list of assumptions, known limitations, environment-specific details.

**Fields to collect:**
- `assumptions[]` — Array of `{label, description}` (e.g., "Known Limitation: ...")

## Callout Box Specifications

### Warning Box
```
Border: single, size 4, color #E2690E (all sides), space 6
Background: #FFEBDE
Icon: ⚠ (Segoe UI Symbol font), color #E2690E
Text: Rubik Medium, 10pt, color #E2690E
Indent: left 187, right 274
```

### Info Box
```
Border: single, size 4, color #5391AA (all sides), space 6
Background: #F5FBFF
Icon: ⓘ (MS Mincho font), color #043854
Text: Rubik Medium, 10pt, color #043854
Indent: left 180, right 270
```

### Best Practice Box (NoteBox style)
```
Border: top/bottom only, single, size 4, color #DDDDDD
No background fill
Uses numbered list with star/ribbon bullet icon
Text: Rubik, 11pt (inherits Normal)
Indent: left 810, hanging 810
```

## Table Specifications

### Default Table
```
Header row: fill #00405F, Rubik 11pt (white text implied by dark background)
Body rows: no fill (white)
Alt body rows: fill #F2F2F2
Borders: #D9D9D9, single, size 4
Cell margins: top/bottom 29 DXA
Width: full content width (10502 DXA for US Letter with template margins)
```

### Header/Footer Layout

**Header (borderless table, 2 columns):**
- Left cell: Loxihart logo image (783771 EMU wide × 522514 EMU tall)
- Right cell: "Loxihart [Department]" (bold) + "[Category]" (normal), right-aligned

**Footer (borderless table, 3 columns):**
- Left: "Copyright © Loxihart Inc. [Year]" + "All Rights Reserved." (10pt)
- Center: "CONFIDENTIAL" (bold, #C00000)
- Right: "Page | [#]" (10pt, right-aligned, PAGE field)
