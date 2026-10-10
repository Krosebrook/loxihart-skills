# Gumroad — Storefront Reference

## Field Constraints

| Field | Limit | Format | Required |
|-------|-------|--------|----------|
| Product name | ~200 chars | Plain text | Yes |
| Description | No hard limit | Markdown (rendered) | Yes |
| Price | Numeric | PWYW: set minimum + suggested | Yes |
| Tags | 10 max | Comma-separated | Recommended |
| Cover image | 1280×720px recommended | JPG/PNG | Recommended |
| Product file | 5GB max | Any (PDF, ZIP, etc.) | Yes |
| URL slug | Custom | Lowercase, hyphens | Auto-generated |

## Pricing Strategy

**PWYW outperforms fixed by ~260%** (Gumroad's own data).

- Set **minimum** at your floor price (e.g., $12)
- Set **suggested** at your anchor price (e.g., $19)
- Buyers often pay above minimum when given the option
- Some sellers use $0+ for lead generation, but this isn't ideal for premium products

## SEO / Discovery

- Gumroad Discover surfaces products based on: tags, sales velocity, ratings
- Front-load product name with primary keyword
- Use all 10 tag slots — mix broad ("AI workflow") and specific ("Claude prompt templates")
- Description is indexed for search; include natural keyword density in first 2 paragraphs

## Auth / Automation Notes

- **Login**: Email + password (no 2FA by default, but some accounts have it)
- **Automation**: Gumroad has no public product-creation API for sellers
- **Browser automation**: Works until login wall; use paste guide after auth
- **Manual finish typical**: Upload product file, set thumbnail, toggle "Published"

## Known Quirks

- Rich text editor renders Markdown but the preview sometimes strips formatting
- Custom URL slugs can't be changed after first sale
- "Suggested price" only appears if PWYW is enabled
- Refund policy is set account-wide, not per-product
- Gumroad takes 10% flat fee (no monthly subscription on free plan)

## Quick-Paste Checklist Pattern

When creating a paste guide for Gumroad:
1. Product name (copy-ready)
2. Description (Markdown, copy-ready block)
3. Price settings (minimum + suggested)
4. Tags (comma-separated, copy-ready)
5. Cover image instructions
6. Product file upload reminder
7. Final: toggle Published
