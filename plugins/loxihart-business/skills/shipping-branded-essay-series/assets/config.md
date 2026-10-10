# Config — shipping-branded-essay-series

User/project-specific context. The skill reads this on activation. If a value is
unset, ask (AskUserQuestion) or ask directly — never hardcode these in SKILL.md.

```yaml
# Which brand this series is. Loads the matching block in
# references/brand-template-contract.md.
active_brand: load-bearing        # load-bearing | flashfusion

# The ONE shipped essay every subagent copies the template from.
# Must be an existing, correct, shipped page for the active brand.
reference_essay_path: /home/claude/lb-essay-01-benchmark-that-wasnt.html

# Where finished essays get saved back (Projects tool namespace).
project_store_path: claude/

# Act names for the series badges (Load-Bearing default).
act_names:
  I: "Under Load"
  II: "The Systems"
  III: "The Builder"

# Canonical accent token. Shipped essays currently use #c9a96e; the Abstrekkt
# brand doc says brass #C8A86A. Set the one you are standardizing on, then do a
# single global reconcile pass — never per-file near-misses.
canonical_accent: "#c9a96e"       # or "#C8A86A" once reconciled

# Filenaming convention for new arc-numbered essays.
filename_pattern: "lb-essay-{NN}-{slug}.html"
```

If `active_brand: flashfusion`, confirm the FlashFusion display/body fonts and
masthead/badge before running — they are UNCONFIRMED in the template contract.
