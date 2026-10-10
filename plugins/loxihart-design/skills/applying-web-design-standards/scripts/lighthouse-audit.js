#!/usr/bin/env node
/**
 * lighthouse-audit.js — Run Lighthouse performance audit on a URL
 *
 * Usage:
 *   node scripts/lighthouse-audit.js https://example.com
 *   node scripts/lighthouse-audit.js https://example.com --mobile
 *   node scripts/lighthouse-audit.js https://example.com --json output.json
 *
 * Requires: npm install -g lighthouse
 * 
 * Checks Core Web Vitals and outputs pass/fail against targets:
 *   LCP  < 2.5s
 *   INP  < 200ms (TBT as proxy in Lighthouse; FID deprecated March 2024)
 *   CLS  < 0.1
 *   Lighthouse Performance score >= 90
 */

const { execSync } = require('child_process');
const fs = require('fs');

const url = process.argv[2];
const isMobile = process.argv.includes('--mobile');
const jsonIdx = process.argv.indexOf('--json');
const jsonOutput = jsonIdx !== -1 ? process.argv[jsonIdx + 1] : null;

if (!url) {
  console.error('Usage: node lighthouse-audit.js <url> [--mobile] [--json output.json]');
  process.exit(1);
}

const strategy = isMobile ? 'mobile' : 'desktop';
const tmpFile = `/tmp/lighthouse-${Date.now()}.json`;

console.log(`Running Lighthouse audit on ${url} (${strategy})...`);

try {
  const cmd = [
    'lighthouse', url,
    '--output=json',
    `--output-path=${tmpFile}`,
    '--quiet',
    '--chrome-flags="--headless --no-sandbox"',
    isMobile ? '' : '--preset=desktop',
  ].filter(Boolean).join(' ');

  execSync(cmd, { stdio: 'inherit' });

  const report = JSON.parse(fs.readFileSync(tmpFile, 'utf-8'));
  const categories = report.categories;
  const audits = report.audits;

  // Core Web Vitals
  const lcp = audits['largest-contentful-paint']?.numericValue / 1000;
  const tbt = audits['total-blocking-time']?.numericValue;
  const cls = audits['cumulative-layout-shift']?.numericValue;
  const perfScore = Math.round(categories.performance.score * 100);
  const a11yScore = Math.round(categories.accessibility.score * 100);
  const seoScore = Math.round(categories.seo.score * 100);

  // Targets
  const targets = {
    lcp: { value: lcp, target: 2.5, unit: 's', pass: lcp <= 2.5 },
    tbt: { value: tbt, target: 200, unit: 'ms', pass: tbt <= 200 },
    cls: { value: cls, target: 0.1, unit: '', pass: cls <= 0.1 },
    performance: { value: perfScore, target: 90, unit: '', pass: perfScore >= 90 },
    accessibility: { value: a11yScore, target: 90, unit: '', pass: a11yScore >= 90 },
    seo: { value: seoScore, target: 90, unit: '', pass: seoScore >= 90 },
  };

  console.log('\n=== Lighthouse Audit Results ===');
  console.log(`URL: ${url}`);
  console.log(`Strategy: ${strategy}\n`);

  console.log('Core Web Vitals:');
  Object.entries(targets).forEach(([key, t]) => {
    const icon = t.pass ? '✅' : '❌';
    const label = key.toUpperCase().padEnd(15);
    const value = typeof t.value === 'number' ? t.value.toFixed(2) : t.value;
    console.log(`  ${icon} ${label} ${value}${t.unit} (target: ${t.target}${t.unit})`);
  });

  const allPass = Object.values(targets).every(t => t.pass);
  console.log(`\n${allPass ? '✅ All targets met' : '❌ Some targets missed'}`);

  if (jsonOutput) {
    fs.writeFileSync(jsonOutput, JSON.stringify({ url, strategy, targets, report: report.audits }, null, 2));
    console.log(`\nFull results saved to: ${jsonOutput}`);
  }

  // Cleanup
  fs.unlinkSync(tmpFile);

  process.exit(allPass ? 0 : 1);
} catch (error) {
  console.error(`\nAudit failed: ${error.message}`);
  console.error('Make sure Lighthouse is installed: npm install -g lighthouse');
  process.exit(1);
}
