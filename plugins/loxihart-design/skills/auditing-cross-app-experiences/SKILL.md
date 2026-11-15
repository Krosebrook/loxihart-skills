---
name: auditing-cross-app-experiences
description: Audit, shape, redesign, animate, harden, test, and ship an existing application or frontend with evidence-bound UX, accessibility, performance, security, and release checks. Invoke for all requests to improve a site's design, usability, motion, responsiveness, mobile experience, onboarding, dashboard, 3D game view, or production readiness. Preserve existing product intent and release holds.
---

# Cross-App Experience & Release Review

Scope: apply per project, never blanket-copy one brand/style to unrelated apps. This skill is a reusable workflow for app-specific work; installing it does not modify existing source files or qualify a release.

## Discover: G-01 to G-05
1. Identify project, latest committed SHA, current deployment SHA if available, core personas, user success flow, app type, existing brand, platform, owners, constraints and status. Read project code, tests, README, security settings, design tokens and any applicable Notion doctrine. Record source links and dates.
2. Choose UX mode: **Persuade** (landing/marketing), **Operate** (product/dashboard), **Read** (docs), **Experience** (creative/game). Existing brand and user needs override generic aesthetic presets. Establish baseline desktop and mobile screenshots before edits.
3. **Shape before code:** map user journeys, navigation hierarchy, empty/error/loading states, feedback and disclosure boundaries, keyboard path, mobile touch targets, layout responsiveness, measurable usability problems and top ten user complaints. Classify each finding with severity, confidence and observed evidence. Prioritize the smallest cohesive change set; perform a removal test for UI chrome.
4. For multiplayer/Unity/3D rooms, first determine whether an actual Unity project/editor and asset pipeline exist. Never assume a web app is Unity. Treat paid asset generation, model conversion, geometry export and runtime publication as distinct approval gates.
5. Check prior project release holds. Do not erase or override them based on a design-only PASS.

## Forge: R-01 to R-09
- R-01 Design system: reuse the app's real tokens, components and brand assets; one existing component system per project. Do not introduce generic AI-style purple gradients, fabricated testimonials, stock hero claims, repeated three-card layouts or decorative icons.
- R-02 Accessibility: target WCAG 2.2 AA; semantic landmarks, correct headings and form labels, keyboard/focus/escape behavior, contrast, visible errors, touch-target adequacy and reduced-motion compliance.
- R-03 Responsive: test 320/375/768/1024/1440 widths, portrait and landscape where relevant, dynamic viewport, long content, zoom, text scale, RTL as applicable; fix actual overflow and clipping.
- R-04 Motion: only where it supports navigation, feedback, identity or storytelling. For Persuade/Experience surfaces, GSAP + ScrollTrigger may be appropriate after dependency verification and device budget. Operate surfaces must favor task completion and restrained microinteraction. Always provide static or reduced-motion fallbacks, avoid scroll-jacking, and clean up listeners/contexts.
- R-05 State: deterministic navigation, typed inputs, skeletons/spinners with no misleading wait claims, empty/error/retry cases, idempotent mutation feedback, preserved user data and logical focus.
- R-06 Security: examine authn/authz, data access rules/RLS, untrusted input, secrets in frontend bundles, CSP, CORS, upload and redirect boundaries. No secrets in client code or audit reports; fail closed. Handle minors and voice/content capture with explicit consent and privacy review.
- R-07 Performance: measure before adjusting. Validate Core Web Vitals and bundle/image costs on relevant devices; lazy-load noncritical modules and assets; limit GPU and scroll work; instrument regressions.
- R-08 Engineering: strict typing matching project conventions, no fake data in production, error handling, unit/integration tests, and real E2E flows. Do not introduce dependencies unless available and justified.
- R-09 Release: candidate SHA + actual CI logs/tests + approval + production artifact/revision identity + post-deploy smoke. Source-level tests or an AI-agent success message are NOT production acceptance.

## Execute: ADR-/P-/V-
1. Make bounded changes on a draft/feature branch where available, without publishing, merging, deleting data or changing production configuration. For each, identify ADR, work package P and measurable outcome O.
2. Test strongest available real checks. Report exact commands/results, runtime screenshots, auth boundaries, keyboard/a11y checks, responsive results and any missing capability. Do not call unexecuted checks PASS.
3. Record change diff, commit SHA, rollback path, independent reviewer requirement, before/after evidence, release verdict **GO/HOLD**, and next verification gate. A HOLD can only become GO on fresh, candidate-bound evidence.
4. No silent writes to unrelated apps. Obtain explicit approval before paid credits, live deployments, merges, publishing, production schema changes, destructive actions or security-setting changes.

## Persona review
- End-user advocate: task completion, language clarity, frustration, discoverability.
- Design director: identity, hierarchy, token consistency, anti-template judgment.
- Security/release engineer: auth, privacy, reproducible evidence, integrity, rollback.

## Output contract
For each app report: app URL; platform; timestamp/SHA; UX mode; observed findings (evidence/confidence); planned and actual edits kept separate; tests performed/not performed; risk; HOLD/GO; next 2-3 concrete actions. No claims of completed improvement without a verified code change and test receipt.

## Linked governance sources (read before treating rules as brand-canonical)
- Notion design doctrine (legacy FlashFusion scope): https://app.notion.com/p/3c9ea14fb167811a8bf2cb0c8bbd4a60
- Notion design governance reference: https://app.notion.com/p/3feea14fb16781e1b0a5ebb2120dd695
- Cross-app verification registry (50 selected provider surfaces): https://app.notion.com/p/419ea14fb16781278781fffd658b98a1

Never apply a legacy brand system to a different product without examining that product's current tokens, identity, and documented migration authority.
