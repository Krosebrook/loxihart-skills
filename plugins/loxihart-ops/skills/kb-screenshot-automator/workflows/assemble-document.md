# Workflow — Assemble Document (Modes A + B)

## Inputs

- The source document (.docx or .pdf) containing placeholder markers
- Screenshots: from the capture workflow (Mode A) or user-uploaded (Mode B)

## Steps

1. **Match screenshots to placeholders** by the naming convention in
   `references/screenshot-standards.md` — section slug + zero-padded step
   number. Matching is by name, never by upload order.
2. **Validate the match set** before touching the document:
   - Placeholders with no matching file → list them, ask whether to leave the
     placeholder text or proceed with gaps
   - Files matching no placeholder → list as unused, don't embed
   - Mode B files that don't follow the convention → propose a mapping table
     (filename → step) and get confirmation before assembly
3. **Assemble.** Read `/mnt/skills/public/docx/SKILL.md` first, then produce a
   .docx (PDF input also outputs .docx — PDF assembly is lossy): replace each
   placeholder with its image, sized to content width, caption `Step N`
   preserved from the source text. Keep all non-placeholder content untouched.
4. **QA pass:** every intended placeholder resolved or explicitly waived;
   images render in order; no credential/PII pixels visible (see redaction
   rule in screenshot-standards) — if found, mask and re-embed.
5. **Deliver** the final .docx plus the individually numbered PNGs alongside
   it, and a one-line summary: `{N} of {M} placeholders populated`.
