# Amazon KDP — Storefront Reference

## Field Constraints

| Field | Limit | Format | Required |
|-------|-------|--------|----------|
| Title | ~200 chars | Plain text | Yes |
| Subtitle | ~200 chars | Plain text | Optional but recommended |
| Author name | ~200 chars | Plain text | Yes |
| Description | **4,000 chars** | HTML (limited tags: `<br>`, `<b>`, `<i>`, `<u>`, `<h4>`–`<h6>`, `<ol>`, `<ul>`, `<li>`, `<p>`) | Yes |
| Keywords | **7 boxes**, each ~50 chars | Plain text phrases | Yes |
| Categories | **2 max** (browse categories) | BISAC codes or KDP category picker | Yes |
| Price (eBook) | $0.99–$9.99 for 70% royalty | Numeric | Yes |
| Price (paperback) | Min based on page count | Numeric | Yes (if paperback) |
| Cover | 1600×2560px (eBook) | JPG/TIFF | Yes |
| Manuscript | EPUB, KPF, DOCX, PDF (paperback only) | File upload | Yes |
| ISBN | Auto-assigned (free) or provide own | 10 or 13 digit | Optional |

## Pricing Strategy — The 70% Royalty Tier

Amazon KDP has two royalty tiers:
- **35% royalty**: Any price from $0.99 to $200
- **70% royalty**: Prices between **$2.99 and $9.99** only

**Always price at $9.99 for the 70% tier maximum** unless there's a strategic reason not to.

Math: $9.99 × 70% = ~$6.99 per sale vs. $14.99 × 35% = ~$5.25

## SEO / Discovery

- **Title + Subtitle**: Primary ranking factors. Front-load keywords.
  - Title: Product name
  - Subtitle: Keyword-rich benefit statement
- **7 Keyword boxes**: Use phrases, not single words. Don't repeat title words.
  - Example: "AI automation templates", "Claude prompt engineering", "workflow optimization"
  - Amazon explicitly says not to repeat words already in the title
- **Categories**: Choose 2 specific categories. Can contact KDP support for additional categories.
- **A+ Content**: Available for some accounts (enhanced brand content with images)

## Manuscript Formats

| Format | eBook (Kindle) | Paperback | Hardcover |
|--------|---------------|-----------|-----------|
| EPUB | ✅ Recommended | ❌ | ❌ |
| KPF (Kindle Create) | ✅ | ❌ | ❌ |
| DOCX | ✅ (converted) | ✅ | ✅ |
| PDF | ❌ Not for eBook | ✅ Print-ready | ✅ Print-ready |

**Critical**: PDF cannot be used for Kindle eBook. Must convert to EPUB.

### PDF → EPUB Conversion Options

1. **Calibre** (free, local): `ebook-convert input.pdf output.epub`
   - Best for text-heavy content
   - May need manual cleanup for complex layouts
2. **CloudConvert** (web): Upload PDF → download EPUB
   - Good for quick conversions
   - Free tier has limits
3. **Kindle Create** (free, Amazon): Import PDF → export KPF
   - Amazon's own tool; guaranteed compatibility
   - Slower workflow but cleanest output

## Auth / Automation Notes

- **Login**: Amazon KDP account (kdp.amazon.com)
- **No product-creation API**: KDP has no public API for creating books
- **Browser automation**: Login wall always blocks; complex multi-page form
- **Recommended**: Always use paste guide
- **Review time**: KDP review takes 24–72 hours after submission

## KDP Select (Exclusivity) — Important Distinction

- **KDP Select** = enrolling your **Kindle eBook** in Kindle Unlimited
- Requires **90-day exclusivity** for the **eBook format only**
- Does NOT affect:
  - PDF sales on Gumroad, Etsy, Shopify, etc.
  - Paperback sales (even on Amazon)
  - Any other format on any other platform
- Decision: Skip KDP Select if selling PDF on other platforms (recommended for multi-storefront strategy)

## Known Quirks

- HTML description: Only specific tags allowed (see field constraints above)
- Book cover is mandatory — no default/placeholder available
- ISBN: Amazon provides a free one, but it's Amazon-exclusive
- Series metadata: Available but optional for standalone products
- KDP reports are delayed ~24–48 hours
- Price matching: Amazon may match a lower price found on other platforms
- Paperback page count affects minimum price

## Quick-Paste Checklist Pattern

When creating a paste guide for KDP:
1. Title (copy-ready)
2. Subtitle (copy-ready)
3. Author name
4. Description (HTML formatted, copy-ready block)
5. Keywords (all 7, listed individually)
6. Categories (2 BISAC paths)
7. Price ($9.99 for 70% tier)
8. Manuscript upload (EPUB for eBook, PDF for paperback)
9. Cover upload (1600×2560px)
10. KDP Select decision (enroll or skip)
11. Rights and publishing territory (usually "All territories")
