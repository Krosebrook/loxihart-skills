# Shopify — Storefront Reference

## Field Constraints

| Field | Limit | Format | Required |
|-------|-------|--------|----------|
| Title | ~255 chars | Plain text | Yes |
| Description | No hard limit | HTML / Rich text editor | Yes |
| Price | Numeric | Fixed price | Yes |
| Compare-at price | Numeric | Renders as strikethrough | Optional |
| SEO title | 70 chars (recommended) | Plain text | Recommended |
| SEO description | 320 chars (recommended) | Plain text | Recommended |
| Product tags | No hard limit | Comma-separated | Recommended |
| Images | Unlimited | JPG/PNG/WebP | Min 1 |
| URL handle | Auto-generated | Lowercase, hyphens | Auto |
| Product type | Free text | Used for internal organization | Optional |
| Vendor | Free text | Brand name | Optional |

## Pricing Strategy

- Use **compare-at price** for strikethrough effect ($24.99 → $14.99)
- Create discount codes for launch campaigns
- Shopify doesn't have PWYW natively — use an app if needed
- No per-listing fees; pricing is subscription-based ($39/mo for Basic)

## SEO / Discovery

- **SEO title**: Different from product title. Optimize for Google search.
- **SEO description**: Meta description for Google. Include keywords + CTA.
- **URL handle**: Set manually for clean URLs (e.g., `/products/ai-workflow-kit`)
- **Product tags**: Used for filtering within your store, NOT indexed by Google
- **Blog posts**: Create a companion blog post linking to the product for SEO juice
- Shopify sites are indexed by Google; treat SEO like any website

## Auth / Automation Notes

- **Login**: Shopify Admin (email + password, often with 2FA)
- **Admin API**: Full product CRUD available via REST or GraphQL
  - Requires API key + access token
  - Can create products, upload images, set pricing programmatically
- **Browser automation**: Works, but API is cleaner for repeat use
- **Key dependency**: Digital delivery requires an app (see below)

## Digital Downloads Setup

Shopify does NOT natively support digital downloads. You need an app:

1. **Digital Downloads by Shopify** (free) — basic, one file per product
2. **SendOwl** — more features, variable pricing, drip delivery
3. **Sky Pilot** — advanced, supports streaming + licenses

Setup steps:
1. Install the digital downloads app
2. Create the product listing normally
3. Attach the digital file through the app's interface
4. Set "This is a digital product" (uncheck "Track quantity" and shipping)

## Known Quirks

- Must uncheck "Track quantity" for digital products
- Must uncheck "This is a physical product" in shipping section
- Compare-at price must be higher than price (validation error otherwise)
- Product images appear in Google Shopping if Shopify's Google channel is connected
- Shopify Payments not available in all countries — may need Stripe
- Draft mode exists; publish when ready

## Quick-Paste Checklist Pattern

When creating a paste guide for Shopify:
1. Product title (copy-ready)
2. Description (HTML or rich text, copy-ready)
3. Price + compare-at price
4. SEO title (≤70 chars)
5. SEO meta description (≤320 chars)
6. Product tags (comma-separated)
7. URL handle
8. Digital downloads app installation reminder
9. Product file upload (via the downloads app)
10. Uncheck shipping / quantity tracking
