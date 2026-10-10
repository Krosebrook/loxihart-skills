# TikTok Shop — Storefront Reference

## Field Constraints

| Field | Limit | Format | Required |
|-------|-------|--------|----------|
| Product name | ~255 chars | Plain text | Yes |
| Description | 10,000 chars | Plain text (some HTML in some regions) | Yes |
| Price | Numeric | Fixed | Yes |
| Original price | Numeric | Strikethrough display | Recommended |
| Category | TikTok taxonomy | Must select; some require approval | Yes |
| Attributes | Category-dependent | Varies (format, language, etc.) | Category-dependent |
| Images | 9 max | JPG/PNG, white background preferred | Min 1 |
| Product file | N/A (digital delivery varies) | Usually external link or fulfillment | Depends |

## Pricing Strategy

- TikTok Shop skews younger and more price-sensitive
- **Competitive pricing**: $12.99 works for digital products
- Show original price ($19.99) for urgency / strikethrough
- TikTok Shop commissions: 1%–5% depending on category and program
- Flash deals and coupons available through Seller Center

## SEO / Discovery

- TikTok Shop discovery is primarily **video-driven**, not search-driven
- Product name keywords matter for in-app search
- Category selection affects which audiences see the product
- **Description keywords**: Include them, but video content drives sales
- Attributes (format, language, etc.) help with filtering

## Auth / Automation Notes

- **Login**: TikTok Seller Center (separate from TikTok app account)
- **Seller Center URL**: https://seller-us.tiktok.com/ (US)
- **No public product-creation API** for individual sellers (API is for large merchants)
- **Browser automation**: Login wall always blocks; use paste guide
- **Category approval**: Digital products may require category approval
  - Apply through Seller Center > Category Management
  - Fallback: Use bio link to route to Gumroad/direct site

## Digital Product Challenges

TikTok Shop is primarily designed for physical goods. Digital product selling:

1. **Category**: Look for "Digital Goods" or "E-books" in the category tree
2. **Fulfillment**: May need to set up "No shipping required" or use electronic delivery
3. **File delivery**: TikTok doesn't host files — you may need to:
   - Use order confirmation to send a download link
   - Integrate with a fulfillment service
   - Manually send links via TikTok message after purchase
4. **Region-dependent**: Digital product categories aren't available in all markets

## Known Quirks

- Seller Center is a completely separate login from TikTok social account
- Digital product category may not be visible — may require application
- Product images have strict guidelines (white background, no text overlays in some categories)
- Listing review can take 24–48 hours
- Some features (coupons, flash deals) require minimum seller tier
- TikTok Shop affiliate program: creators can promote your product for commission

## Quick-Paste Checklist Pattern

When creating a paste guide for TikTok Shop:
1. Product name (copy-ready)
2. Description (plain text, copy-ready)
3. Price + original price
4. Category path (exact path to navigate)
5. Attributes (format, language, etc.)
6. Product images checklist
7. Fulfillment / delivery method setup
8. Note: Mention category approval if needed
