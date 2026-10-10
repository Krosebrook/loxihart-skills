<required_reading>
**Read these reference files NOW before proceeding:**
1. references/doc-type-defaults.md — determines which optional sections to include
2. references/template-structure.md — field specs for each section
</required_reading>

<process>

## Step 1: Confirm Doc Type

If not already established from SKILL.md intake, confirm which doc type. Map to one of: SOP, Reference Guide, Troubleshooting Guide, Runbook, Onboarding Guide, Process Document, Custom.

## Step 2: Collect Metadata

Ask for all metadata in a single prompt. Use smart defaults where possible.

**Ask the user:**
- Document title
- Loxihart department name (e.g., Security, Engineering, IT Operations, HR)
- Category of guide (e.g., "Vanta Reference", "AWS Deployment", "New Hire Setup")
- Target audience (e.g., All Staff, Engineers, Managers)
- Support email for Contact Us section

**Auto-populate (don't ask):**
- Created date: current month and year
- Version: 1.0.0

## Step 3: Present Section Plan

Load `references/doc-type-defaults.md` for the selected doc type.

Present to the user:
"Based on [doc type], here's your section plan:"

**Always included:**
- Cover Page, Important Links, Contact Us, Table of Contents, Primary Content, Version History

**Smart-defaulted optional sections:**
- List each with YES/NO based on doc type defaults

**Ask:** "Want to add or remove any sections before we collect content?"

Wait for confirmation before proceeding.

## Step 4: Collect Content — Section by Section

Work through sections conversationally. Don't try to collect everything at once.

### 4a. Intro Paragraph
Ask: "Give me a 1-2 paragraph overview: What does this document cover? What problem does it solve? Who should use it?"

If user gives brief notes, expand into proper intro prose.

### 4b. Important Links
Ask: "Any relevant links to include? (external docs, internal wiki, tool docs, vendor portals)"

Collect as text + URL pairs.

### 4c. Primary Content
This varies by doc type. Ask questions appropriate to the type:

**For all doc types, after collecting section content, ask:**
- "Would you like short descriptions under any TOC entries? These appear as italic subtitles beneath the section name in the Table of Contents. Example: 'Before You Start' → *Quick checks to try before diving into detailed troubleshooting*"

Set `toc_description` on any section/subsection that the user wants described. Most entries won't need one — only use for sections where context helps the reader navigate.

**SOP:**
- "Walk me through the process step-by-step. I'll organize it into phases with expected results."
- "Any commands, code samples, or configs to include?"
- "Where should I add warning, info, or best practice callouts?"

**Reference Guide:**
- "What are the main topics to cover?"
- "For each topic, what does the reader need to know?"
- "Any technical specs, configurations, or code examples?"

**Troubleshooting Guide:**
- "What are the common problems and their symptoms?"
- "For each problem, what's the diagnosis and fix?"
- "What triggers escalation?"

**Runbook:**
- "What triggers this runbook? (incident type, deploy, etc.)"
- "Walk me through the operational steps."
- "What are the rollback procedures?"

**Onboarding Guide:**
- "What's the sequence of setup tasks?"
- "What access, tools, and credentials does the new person need?"
- "Any day 1 / week 1 / month 1 milestones?"

**Process Document:**
- "What triggers the process?"
- "Walk me through the workflow end-to-end."
- "Where are the handoff points between teams?"

### 4d. Optional Sections (only if included in plan)

Collect each based on what was included in Step 3:

- **Decision Tree:** "What's the starting question? Walk me through each decision path."
- **Prerequisites:** "What access, tools, credentials, or training is needed before starting?"
- **Validation:** "How does someone confirm they completed this correctly?"
- **Escalation:** "What conditions trigger escalation? Who handles each level? Priority?"
- **RACI:** "What are the key tasks and roles? Who is R, A, C, I for each?"
- **Appendices:** "Any supplementary material? (command refs, code samples, glossaries)"
- **Assumptions:** "Any assumptions, limitations, or environment-specific notes?"

## Step 5: Confirm Before Generation

Present a summary of what will be generated:

"Here's what I'll generate:"
- Title: [title]
- Department: Loxihart [department]
- Category: [category]
- Doc Type: [type]
- Sections: [list all sections]
- Callouts: [count of warning/info/bestpractice]
- Tables: [count]

**Ask:** "Ready to generate, or want to adjust anything?"

## Step 6: Generate the .docx

Build a JSON config object from all collected data and pass it to the generation script.

**JSON config structure:**
```json
{
  "metadata": {
    "title": "...",
    "department": "...",
    "category": "...",
    "created_date": "Month YYYY",
    "support_email": "...",
    "audience": "..."
  },
  "important_links": [
    {"text": "...", "url": "..."}
  ],
  "sections": [
    {
      "title": "Section Title",
      "toc_description": "Optional short description shown in TOC under this entry",
      "subsections": [
        {
          "title": "Subsection Title",
          "toc_description": "Optional short description for TOC",
          "content": "Body text...",
          "callouts": [{"type": "warning", "text": "..."}],
          "steps": [
            {"action": "...", "expected_result": "..."}
          ],
          "code_blocks": [{"code": "...", "language": "bash"}],
          "tables": [
            {
              "headers": ["Col 1", "Col 2"],
              "rows": [["val1", "val2"]]
            }
          ]
        }
      ]
    }
  ],
  "decision_tree": null,
  "prerequisites": [],
  "verification_items": [],
  "escalation_matrix": [],
  "raci": null,
  "version_history": [
    {"version": "1.0.0", "date": "YYYY-MM-DD", "author": "...", "changes": "Initial publication"}
  ],
  "appendices": [],
  "assumptions": []
}
```

**Generation steps:**
1. Write the JSON config to a temp file
2. Read the generation script from `scripts/generate-kb-docx.js`
3. Ensure `docx` npm package is installed (`npm install -g docx`)
4. Run: `node scripts/generate-kb-docx.js config.json output.docx`
5. Copy to `/mnt/user-data/outputs/[filename].docx`
6. Present to user

**Important:** The script path is relative to the skill directory. Resolve the absolute path before running. The logo and icon images are at `templates/media/logo.jpg` (falls back to `.png`), `templates/media/warning-icon.png`, `templates/media/bestpractice-icon.png`.

## Step 7: Deliver

Present the .docx file to the user. Summarize:
- Filename
- Page count estimate
- Sections included
- Any callouts or notes about content that may need review

**TOC Note:** The generated document includes a pre-populated Table of Contents with estimated page numbers and optional descriptions (H1 bold with dot leaders → page number, H2+ italic and indented). Page numbers are estimates based on section count — tell the user: "Open in Word → select all (Ctrl+A) → press F9 to update page numbers to actuals."

</process>

<success_criteria>
- .docx file generated with exact Loxihart brand styling
- All collected content placed in correct template sections
- Callout boxes use correct colors, borders, and icons
- Tables use Loxihart header style (#00405F) with alt row shading
- Header has logo + department/category
- Footer has copyright, CONFIDENTIAL, page numbers
- TOC generated from heading structure
- Version history table populated
- File validates without errors
</success_criteria>
