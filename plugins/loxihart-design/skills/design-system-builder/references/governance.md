# Governance Reference

## Table of Contents
- Contribution Workflow
- Component Checklist
- Versioning Strategy
- Release Automation
- Quality Gates

---

## Contribution Workflow

### 1. Proposal
- Create RFC (Request for Comments) in GitHub Discussions
- Describe use case, API design, visual mockups
- Get feedback from design system team

### 2. Design Review
- Present in weekly design system sync
- Review accessibility, API consistency, performance
- Approve or request changes

### 3. Implementation
- Fork repo, create feature branch
- Follow component checklist (below)
- Submit PR with tests, docs, Storybook stories

### 4. Code Review
- 2 approvals required (1 design, 1 engineering)
- Automated checks pass (lint, test, a11y, bundle size)

### 5. Release
- Merged to main, auto-released via semantic versioning
- Announced in #design-system Slack channel
- Added to changelog

---

## Component Checklist

Before submitting a PR for any new or modified component:

- [ ] TypeScript types exported
- [ ] Props documented with JSDoc
- [ ] All variants implemented (variants, sizes, states)
- [ ] Accessibility tested (keyboard, screen reader, WCAG 2.2 AA)
- [ ] Unit tests (>80% coverage)
- [ ] Storybook stories (all variants + states)
- [ ] Visual regression tests (Chromatic)
- [ ] Performance tested (<10KB gzipped)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Backwards compatible (no breaking changes without major version bump)

---

## Versioning Strategy

**Semantic versioning (semver):**

| Change Type | Version Bump | Example |
|-------------|-------------|---------|
| Breaking changes (removed props, API changes) | Major (1.0.0 → 2.0.0) | Removing `color` prop from Button |
| New features (new components, new props) | Minor (1.0.0 → 1.1.0) | Adding Card component |
| Bug fixes (no API changes) | Patch (1.0.0 → 1.0.1) | Fixing focus ring on Safari |

**Commit conventions (Conventional Commits):**
```
feat(button): add loading state         → minor bump
fix(input): resolve focus issue         → patch bump
docs(card): update usage examples       → no bump
BREAKING CHANGE: remove deprecated prop → major bump
```

---

## Release Automation

**Using semantic-release:**

```json
{
  "name": "@company/design-system",
  "scripts": {
    "release": "semantic-release"
  },
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/github"
    ]
  }
}
```

**What this automates:**
1. Analyzes commit messages since last release
2. Determines version bump (major/minor/patch)
3. Generates changelog
4. Publishes to npm
5. Creates GitHub release with notes

**Run:** `npm run release` (or trigger via CI on merge to main)

**Required environment variables for CI/CD:**
```bash
# npm publish token (never hardcoded — use CI secrets)
NPM_TOKEN=npm_xxxxx                    # via process.env.NPM_TOKEN
GITHUB_TOKEN=ghp_xxxxx                 # via process.env.GITHUB_TOKEN

# Set in GitHub Actions secrets, not in code
# Settings → Secrets → Actions → New repository secret
```

---

## Quality Gates

### Pre-v1.0 Release Checklist

- [ ] 20+ components documented
- [ ] Design tokens implemented (color, spacing, typography, border-radius, shadow)
- [ ] Storybook deployed to public URL
- [ ] Accessibility audited (WCAG 2.2 AA)
- [ ] 80%+ test coverage
- [ ] Visual regression tests running (Chromatic)
- [ ] Bundle size <100KB gzipped
- [ ] Documentation site live (getting started, principles, component docs)
- [ ] Contribution guide published
- [ ] Versioning strategy defined and automated
- [ ] 2+ consuming products actively using the system

### Ongoing Health Metrics

| Metric | Target | Check Frequency |
|--------|--------|-----------------|
| Test coverage | >80% | Every PR |
| Bundle size | <100KB | Every PR |
| A11y violations | 0 critical | Every PR |
| Storybook coverage | 100% of components | Weekly |
| Consumer adoption | Increasing | Monthly |
| Open issues | <20 | Weekly |

### Team Structures

**Small team (1-3 people):**
- One person owns design + engineering
- Async reviews via GitHub PRs
- Monthly sync with product stakeholders

**Medium team (4-8 people):**
- Dedicated design lead + engineering lead
- Weekly sync meeting
- Bi-weekly office hours for consumers

**Large team (8+ people):**
- Full design system team with PM
- Governance board for breaking changes
- Quarterly roadmap planning
- Dedicated documentation writer
