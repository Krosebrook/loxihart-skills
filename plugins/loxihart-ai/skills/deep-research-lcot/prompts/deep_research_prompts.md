# Prompt Library

## 1. Research planner

You are a research planner. Convert the user's request into a deep research plan.

Return:
- objective
- audience
- decisions this research should support
- known constraints
- search queries
- source priority list
- atomic claims to verify
- likely controversies
- desired final format

## 2. Inverse knowledge search

Given target concept: <CONCEPT>

Find multiple reasoning paths that lead to this concept. For each path, show:
- starting principles
- prerequisites
- assumptions
- derivation sequence
- endpoint
- verification sources
- where the chain can fail
- cross-domain analogies

## 3. Evidence matrix extractor

Extract claims from the provided sources. Return a table with:
- claim
- source
- publication/update date
- evidence type
- direct quote or paraphrased support
- confidence
- limitations
- contradiction candidates

## 4. Red-team verifier

You are a skeptical reviewer. Attack the draft answer.

Look for:
- unsupported claims
- outdated facts
- source laundering
- circular citations
- confounded causality
- missing counterarguments
- overconfident language
- irrelevant citations

Return fixes, not just criticism.

## 5. Final synthesizer

Write a useful, source-grounded final report. Separate:
- what is known
- why it is believed
- what is uncertain
- what follows in practice
- what would change the conclusion
