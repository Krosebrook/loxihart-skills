# Changelog

All notable changes to this marketplace are documented here. Versions follow [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-14

### Added
- Marketplace with five first-party plugins: `loxihart-ops`, `loxihart-ai`, `loxihart-engineering`, `loxihart-design`, `loxihart-business` (98 skills), plus vendored `tonone` (MIT).
- CI workflow (`.github/workflows/validate.yml`): `claude plugin validate --strict`, frontmatter and relative-link checks, gitleaks, and a hashed denylist scan.
- Fail-fast guard in `Invoke-DeploymentValidation.ps1` that refuses to run while `[CLIENT]`, `[SUBNET]` or `[HOSTNAME]` placeholders are unset; new self-tests for the guard.

### Changed
- Content was rebranded and scrubbed of client-specific details; environment-specific values are now placeholders (`[CLIENT]`, `[PERSON]`, `[HOSTNAME]`, `[SUBNET]`, ...). Repository history was rewritten accordingly.
- Client-specific service-desk files renamed to generic names (`references/client-profile.md`, `scripts/client-endpoint-check.ps1`).
- Skill descriptions now state explicit "Use when ..." triggers.

### Fixed
- Broken relative links to reference files that were never bundled (create-subagents, debug-like-expert, kyle-vibe-coding, loxihart-data-analyst, create-meta-prompts).
- Self-test regex in `Invoke-DeploymentValidation.ps1` now escapes the literal `[CLIENT]\user` value; self-test no longer crashes under StrictMode when no log file is set.

### Known future work
- Several SKILL.md bodies exceed 10 KB (for example instrumenting-production-stack, instrumenting-agent-telemetry, producing-video-content); move detail into `references/`.
- Clarify trigger boundaries between overlapping skills (ai-agents-workflow / orchestrating-ai-agents / create-subagents; instrumenting-agent-telemetry / instrumenting-production-stack).
