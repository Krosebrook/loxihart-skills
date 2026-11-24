# Tool Mapping — Source Pattern vs. FlashFusion Reality

The source material (a set of duplicate notes on a "Claude built a marketing team in 18 minutes" video, archived 2026-07-15) describes a stack Kyle does not have connected. This file is the explicit before/after.

| Role | Source pattern tool | FlashFusion tool | Direct swap? |
|---|---|---|---|
| Copywriter | None (pure skill) | None (pure skill) | Yes — unchanged |
| Creative Director | Python Pillow (hand-rolled image composition) | Canva + Cloudinary | Better, not just equal — native brand-kit generation beats a from-scratch compositing script |
| Web Designer | Framer External Agents (site-style scanning) | Vercel (real app) + HubSpot (standalone pages) | No — split into two tools, judgment call required per task |
| Email Marketer | Customer.io | HubSpot workflows/CRM | Partial — event-based kick-out depth unverified against plan tier |
| Marketing Ops | Make.com | Zapier | Yes — cleanest 1:1 swap in the roster |
| Performance Marketer | Meta Ads + Marketing API | Google Ads (via Zapier) + PostHog | No — Google Ads only, the Meta gap is real and unresolved |

## Why each substitution was made

**Creative Director to Canva.** The source material's Pillow hack exists because Claude has no native image generation and generic image tools hallucinate brand details. Canva sidesteps both problems with native brand-kit support, so FlashFusion's tokens get applied by the platform itself instead of hand-coded into a script that has to be re-verified every time.

**Web Designer to Vercel / HubSpot split.** This is the one role with no clean equivalent. Framer's value in the source pattern is that its agents crawl the existing site to learn brand style before generating a new page — FlashFusion doesn't have that capability connected. The practical substitute: real product changes go through the actual codebase deployed via Vercel; throwaway campaign pages go through HubSpot's landing-page builder with brand tokens applied manually.

**Email Marketer to HubSpot.** HubSpot is the closest thing in the stack to a marketing-automation platform with CRM-attached workflows. The gap: whether HubSpot's workflow builder supports the same autonomous event-discovery depth the source material describes for Customer.io has not been checked against the actual plan tier.

**Marketing Ops to Zapier.** No caveats. Zapier is already live with real actions in this environment and is functionally the same category of product as Make.com.

**Performance Marketer to Google Ads (via Zapier) + PostHog.** There is no FlashFusion equivalent to a Meta connector at all. Google Ads actions cover targeting, reporting, and offline-conversion feedback for search/display; PostHog gives attribution cross-checking. If a brief specifically calls for Meta/Instagram, this mapping does not cover it.

## Known unknowns worth checking before a real launch

- HubSpot plan tier and whether it supports event-triggered workflow kick-outs.
- Whether a FlashFusion brand kit already exists in Canva, or needs to be built once first.
- Whether a Meta Ads connector should be added at all, given the gap is structural rather than a configuration issue.
