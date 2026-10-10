# Templating & Verification

## Why content-first

Draft all buildable posts as ONE markdown manuscript (full prose, per-post
footers) before any HTML. This lets Kyle correct the *voice* once, in one place,
before the work locks into N files. Kyle's pattern is drafts-get-corrected — HTML
first wastes that correction. Exception: an explicit "ship" with a spec already
approved templates directly.

## Parallel templating pattern

Templating is mechanical once prose is locked. Parallelize with one subagent per
post (`general-purpose` agent). Each reads the ONE reference essay for the exact
CSS/structure and reproduces the provided prose character-for-character. This held
zero voice/CSS drift across 10 files in one session.

Subagent prompt skeleton:
```
MECHANICAL HTML templating for a real publication. Read <reference essay .html>
for the exact template (doctype, <head>, full <style>, .masthead, .essay-footer).
Copy it VERBATIM. Reproduce the provided prose CHARACTER FOR CHARACTER — do not
rewrite, improve, shorten, or add. Do NOT include any editorial note (cut-form,
[NEEDS MATERIAL], review scaffolding). Set:
  <title>, .series-badge (Essay NN — <Act>), .essay-meta (date / topic / ~words),
  <h1>, .deck, body (<p> paragraphs, <h2> section heads, final italic line as
  <div class="pull">), .claims (Claims: tag-s [SOURCED] / tag-g [GENERATED]),
  .claims (Gaps).
Use <code> for literal code tokens. Write to /home/claude/<file>.html.
Reply only with the path and a one-line confirmation.
```

## Reuse = renumber (not rewrite)

If an existing shipped essay covers a slot, produce a correctly-numbered copy with
ONLY the badge + footer meta changed. Example:
- `Essay <span>07 of 08</span> — Foundation Series` → `Essay <span>06</span> — The Systems`
- footer `Essay 7/8 · Foundation Series` → `Essay 06 · The Systems`

Project docs (Projects tool) are FULL-REPLACE only — there is no `str_replace`.
Reproduce the doc from a FRESH `project_read` and change only the target strings,
so you don't drift the 200 lines you're not touching.

## Verification (run before every delivery)

`scripts/verify-series.sh <dir-or-files>` runs the forbidden-term scan and prints
context for every hit. It exits non-zero if any hit needs human resolution.

Substring false positives are expected and must be resolved, not assumed:
- `spect` matches inside "inspection", "prospect", "respect".
- `percentile` matches inside a Gaps line that *names* what's excluded
  ("no percentile, eval, scan...").
- `leverage` matches inside a quoted banned-words list.

Always print `.{20}<term>.{20}` context and confirm each is benign. A clean scan
is necessary, not sufficient — it catches terms, not tone or a novel-worded leak.

## Template integrity (per file, after the scan)

- `<title>` matches the post title.
- Badge number matches the arc position (watch renumbered reuse files).
- No editorial/review note leaked into published copy.
- Footer meta reads `Essay NN · <Act>`.
- Line/byte count is in the same ballpark as the reference essay (a wildly short
  file means a truncated write).
