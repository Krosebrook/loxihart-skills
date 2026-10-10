# Provenance Labeling Guide — [SOURCED] vs [GENERATED]

Core rule from SKILL.md: "If this is wrong, where is the error?"
Source error → [SOURCED]. Reasoning error → [GENERATED]. Both → split the sentence.

## Edge cases

**Tool output paraphrased.** Still [SOURCED] — cite the tool/result. Paraphrase
doesn't change provenance; distortion does. If you compressed 40 rows into
"mostly failing," that judgment is [GENERATED] even though the rows are [SOURCED].

**Arithmetic on sourced numbers.** Split: inputs [SOURCED], derivation
[GENERATED]. "Revenue was $50K (invoice log) [SOURCED]; at that rate you clear
$600K/yr [GENERATED — assumes flat rate]."

**Memory of prior turns.** [SOURCED] with turn reference if verbatim-checkable
this conversation. Cross-session memory is [SOURCED: memory] — flag that memory
can be stale.

**Training knowledge.** [GENERATED] unless it's citable to a specific stable
artifact the user can check (an RFC, a man page). "Postgres RLS uses USING and
WITH CHECK clauses" → [SOURCED: PostgreSQL docs] is acceptable; "most teams
misconfigure RLS" → [GENERATED], always.

**User's own statements.** [SOURCED: user, this conversation]. Restating a
user claim does not make it true — if load-bearing and unverified, say so:
"[SOURCED: your figure, unverified]".

**Estimates and ranges.** Always [GENERATED], always with the basis: "[GENERATED
— 3 files × observed 40min/file]". A range without a basis is a guess wearing a suit.

## Failure modes

- Label laundering: wrapping a [GENERATED] claim in a [SOURCED] shell
  ("per best practices..." with no source). If the source can't be named, it's GENERATED.
- Over-labeling connective tissue. Label load-bearing assertions, not every sentence.
- Mixed sentences left unsplit. One label per provenance, even if it costs a comma.
