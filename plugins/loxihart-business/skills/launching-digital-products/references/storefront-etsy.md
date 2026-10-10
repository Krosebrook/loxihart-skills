# Etsy — Storefront Reference

## Field Constraints

| Field | Limit | Format | Required |
|-------|-------|--------|----------|
| Title | **140 chars** (strict) | Plain text | Yes |
| Description | 10,000 chars | Plain text (line breaks preserved, no Markdown/HTML) | Yes |
| Tags | **13 max** | Individual strings, 20 chars each | Yes |
| Price | Numeric | Fixed price (Etsy has no PWYW) | Yes |
| Sale price | Numeric | Set via "Sales and coupons" section | Optional |
| Listing images | 10 max | JPG/PNG, 2000×2000px recommended | Min 1 |
| Digital files | 5 per listing, 20MB each | Any format | Yes (digital) |
| Category | Etsy taxonomy | Must select from tree | Yes |
| Sections | Store sections | Optional grouping | Optional |

## Pricing Strategy

- Digital download sweet spot: **$12–$17**
- Show a sale price (original $24.99, sale $14.99) — Etsy renders the strikethrough
- Free shipping isn't relevant for digital, but Etsy's algorithm favors "free shipping" listings
- Renewal fee: $0.20 per listing (auto-renews every 4 months or after sale)
- Transaction fee: 6.5% + payment processing (~3%)

## SEO / Discovery

- **Title**: Front-load with exact-match keywords. Etsy search is literal.
  - Pattern: `[Primary Keyword] [Secondary Keyword] [Product Type] [Modifier]`
  - Example: `AI Workflow Kit Notion Templates Claude Prompts Digital Download`
- **Tags**: Use all 13. Mix long-tail phrases and single keywords.
  - Tags are multi-word phrases (up to 20 chars each), NOT single words
  - Don't repeat words already in the title (Etsy combines title + tags for ranking)
- **Description**: First 160 chars appear in search preview. Front-load value prop.
- **Category**: More specific = better. Don't use generic top-level categories.

## Auth / Automation Notes

- **Login**: Email + password, often with 2FA (email code or authenticator)
- **No seller API for listing creation** — must use browser or Etsy's own tools
- **Browser automation**: Etsy's listing form is multi-step with lots of dropdowns
- **Recommended**: Use paste guide; the form is too complex for reliable automation

## Known Quirks

- 140-char title is HARD enforced — Etsy truncates silently if you exceed
- "Digital download" must be selected as listing type BEFORE filling other fields
- Digital files can only be attached after the listing type is set
- Etsy's rich text is an illusion — descriptions are plain text with newlines
- Star Seller badge requires responding to messages within 24h
- Etsy Ads: minimum daily budget is $1.00; auto-bid by default

## Quick-Paste Checklist Pattern

When creating a paste guide for Etsy:
1. Title (exactly ≤140 chars, pre-counted)
2. Description (plain text block, copy-ready)
3. Price (e.g., $14.99)
4. Sale setup instructions (original price, sale percentage, duration)
5. Tags (all 13, listed individually, each ≤20 chars)
6. Category path (e.g., Digital Prints > Templates > Productivity)
7. Digital file upload instructions
8. Listing images checklist
