# Changelog — avoiding-ai-slop

Component versions travel independently (no forced sync):
skill 5.0.0 · patterns.yaml 0.1.0 · lexicon.yaml 0.2.0 · slopcheck.py 0.4.0

## 5.0.0 — Maintenance & packaging (this release)
- Refresh protocol codified in SKILL.md (quarterly: self-test gate, add/retire
  cycle, recalibration trigger, independent version bumps)
- Packaging compliance: gerund name, dense third-person description <1024
  chars, SKILL.md <500 lines, progressive-disclosure subdirs, no nested refs,
  CLAIMS footer, zip excludes junk artifacts
- Installed to /mnt/skills/user/avoiding-ai-slop + distributable zip

## 4.0.0 — Scanner upgrades (slopcheck 0.2.0 → 0.4.0)
- Morphology: inflection-aware lemma matching (s/es/ed/ing/ly, e-drop,
  y→ies, compound space/hyphen flex) with self-test assertions;
  -ness/-ation/-istic out of scope by design
- `--calibrate`: measure DENSITY rates on known-good docs, emit
  `threshold_overrides` YAML (observed max × 1.25)
- `--overrides` and `--allow`: calibrated thresholds + per-project exemptions
- Corpus path resolution for skill layout (scripts/ + references/)
- lexicon 0.2.0: `meticulously` entry removed (lemma coverage), morphology
  note moved from policy to enforced-in-code

## 3.0.0 — Enforcement wiring
- Three operational modes defined: A generation-time constraint digest
  (patterns + top-40 only — anti-rebound), B lint-time with exit codes for
  CI, C image prompt/review
- Register-calibration contract made explicit (MSP/eng Tier 2/3 carve-outs)
- Cross-reference boundaries locked: purging-icon-slop owns icons,
  Abstrekkt/design-brief gates own brand tokens

## 2.0.0 — Spec-compliant skill baseline
- Corpus (76 pattern rules, 238-term lexicon, image pack, slopcheck 0.2.0
  with small-sample density guard + SIGPIPE survival) wrapped per
  developing-skills v2.0: frontmatter, decision tree, 3 usage examples,
  golden path, self-verification, references/, evals (3 positive +
  2 negative), 500-line rule respected

## 0.1.0 — Corpus build (pre-skill)
- Research-grounded from Wikipedia Signs of AI writing (16 watch-boxes
  extracted), Kobak arXiv 2406.07016, Juzek & Ward ACL 2025, community
  blacklists, image-practitioner lists
