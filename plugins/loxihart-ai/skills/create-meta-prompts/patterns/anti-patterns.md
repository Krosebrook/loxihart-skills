# Anti-Patterns — Create Meta-Prompts

- Generating a prompt without completing the intake gate
- Combining Do + Research into one prompt — they have different output shapes
- Running parallel prompts that have dependencies on each other
- Skipping SUMMARY.md requirement in generated prompts — makes human review impossible
- Not running chain detection before creating a plan prompt (plan needs research context)
- Generic one-liner in SUMMARY.md ("Research completed") — must be substantive
- Auto-committing after execution — user controls git, always
- Treating Refine mode like a new Research — Refine builds on existing output, doesn't start over
