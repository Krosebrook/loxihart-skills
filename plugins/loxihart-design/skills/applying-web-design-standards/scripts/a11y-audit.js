#!/usr/bin/env node
/**
 * a11y-audit.js — Automated WCAG 2.2 AA accessibility audit
 *
 * Usage:
 *   node scripts/a11y-audit.js https://example.com
 *   node scripts/a11y-audit.js ./index.html
 *
 * Requires: npm install axe-core puppeteer
 *
 * Runs axe-core against a URL or local file and reports violations
 * grouped by impact level (critical, serious, moderate, minor).
 */

const puppeteer = require('puppeteer');

const target = process.argv[2];

if (!target) {
  console.error('Usage: node a11y-audit.js <url-or-file>');
  process.exit(1);
}

const url = target.startsWith('http') ? target : `file://${require('path').resolve(target)}`;

async function runAudit() {
  console.log(`Running accessibility audit on ${target}...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Inject axe-core
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.2/axe.min.js',
    });

    // Run axe
    const results = await page.evaluate(async () => {
      return await axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag22aa', 'best-practice'],
        },
      });
    });

    // Group by impact
    const byImpact = { critical: [], serious: [], moderate: [], minor: [] };
    results.violations.forEach((v) => {
      const impact = v.impact || 'minor';
      byImpact[impact] = byImpact[impact] || [];
      byImpact[impact].push(v);
    });

    console.log('\n=== Accessibility Audit Results ===');
    console.log(`URL: ${target}`);
    console.log(`Violations: ${results.violations.length}`);
    console.log(`Passes: ${results.passes.length}`);
    console.log(`Incomplete: ${results.incomplete.length}\n`);

    const impactOrder = ['critical', 'serious', 'moderate', 'minor'];
    impactOrder.forEach((impact) => {
      const violations = byImpact[impact] || [];
      if (violations.length === 0) return;

      const icon = impact === 'critical' || impact === 'serious' ? '❌' : '⚠️';
      console.log(`${icon} ${impact.toUpperCase()} (${violations.length}):`);

      violations.forEach((v) => {
        console.log(`  - ${v.id}: ${v.help}`);
        console.log(`    Impact: ${v.impact} | WCAG: ${v.tags.filter(t => t.startsWith('wcag')).join(', ')}`);
        console.log(`    Affected: ${v.nodes.length} element(s)`);
        if (v.nodes[0]?.html) {
          const html = v.nodes[0].html.substring(0, 100);
          console.log(`    Example: ${html}...`);
        }
        console.log();
      });
    });

    const criticalCount = (byImpact.critical?.length || 0) + (byImpact.serious?.length || 0);
    if (criticalCount === 0 && results.violations.length === 0) {
      console.log('✅ No accessibility violations found');
    } else if (criticalCount === 0) {
      console.log(`⚠️ ${results.violations.length} minor violations found (no critical/serious)`);
    } else {
      console.log(`❌ ${criticalCount} critical/serious violations must be fixed`);
    }

    return results.violations.length === 0 ? 0 : criticalCount > 0 ? 1 : 0;
  } finally {
    await browser.close();
  }
}

runAudit()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error(`Audit failed: ${err.message}`);
    console.error('Make sure puppeteer is installed: npm install puppeteer');
    process.exit(1);
  });
