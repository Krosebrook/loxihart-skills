# Search Protocol

## Source Priority Order

1. Official documentation (Anthropic, tool vendors, framework maintainers)
2. Primary research with methodology
3. Practitioner case studies with measurements
4. Aggregator summaries — only if nothing above found

## Query Rules

- Include current year for tool-specific behavior (changes frequently)
- Search for the tool name + specific claim, not the general topic
- For framework claims: verify against official docs, not tutorials
- Fetch the actual source page — don't trust the snippet

## Tagging

- `[SOURCED]` — specific claim verified from a creditable source.
  Format: source name + date minimum. URL preferred.
- `[GENERATED]` — reasoned estimate or synthesis. Include the reasoning.
  Never present as measured or empirically verified.
- `!` prefix — contradiction between sources or between the original doc
  and the corrected claim.

## When Search Fails

If a gap can't be filled with a credible source after 2–3 attempts:
- Mark [GENERATED] with explicit reasoning
- Note in GAPS footer that this claim requires domain-specific verification
- Do not fabricate precision (no invented percentages or statistics)
