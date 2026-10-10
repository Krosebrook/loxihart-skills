/**
 * PHASE 0 — Load verification for the 32-pattern library.
 *
 * Loads every pattern file in real headless Chromium and records:
 *   - uncaught exceptions (pageerror)
 *   - console.error / console.warn output
 *   - failed network requests (excluding the known-external placeholder images)
 *   - whether the documented smoke checks actually ran
 *
 * This is the check that was MISSING when the library was first delivered.
 * Static grep + `node --check` cannot catch a runtime TypeError; this can.
 */
import { chromium } from 'playwright';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { REPO_ROOT, verifyPath } from './paths.mjs';

const PATTERNS_ROOT = REPO_ROOT;
const REPORT_PATH = verifyPath('phase0-report.json');

function findPatternFiles(root) {
  const out = [];
  for (const dir of readdirSync(root)) {
    const dirPath = join(root, dir);
    if (!statSync(dirPath).isDirectory()) continue;
    for (const file of readdirSync(dirPath)) {
      if (file.endsWith('.html')) out.push({ category: dir, file, path: join(dirPath, file) });
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

const results = [];
// Let Playwright resolve its own matching browser build. An earlier
// version pinned executablePath to an absolute path from the authoring
// machine — portable-looking locally, broken for everyone else.
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

for (const pattern of findPatternFiles(PATTERNS_ROOT)) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const pageErrors = [];
  const consoleErrors = [];
  const consoleWarnings = [];
  const failedRequests = [];

  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error') consoleErrors.push(msg.text());
    if (type === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('requestfailed', (req) => {
    // placehold.co is an intentional external demo asset; offline container
    // failures against it are expected and not a defect in the pattern.
    if (!req.url().includes('placehold.co')) failedRequests.push(req.url());
  });

  let loadError = null;
  try {
    await page.goto('file://' + pattern.path, { waitUntil: 'load', timeout: 15000 });
    // Give rAF loops / IntersectionObserver / timers a beat to actually run.
    await page.waitForTimeout(900);
  } catch (err) {
    loadError = err.message;
  }

  // Did the page produce a DOM at all, and does it have visible content?
  let bodyText = '';
  let elementCount = 0;
  try {
    bodyText = (await page.evaluate(() => document.body?.innerText ?? '')).trim();
    elementCount = await page.evaluate(() => document.body?.querySelectorAll('*').length ?? 0);
  } catch { /* page may be unusable; captured via loadError */ }

  const smokeFailures = consoleWarnings.filter((w) => w.includes('[smoke check failed]'));

  results.push({
    category: pattern.category,
    file: pattern.file,
    loadError,
    pageErrors,
    consoleErrors,
    smokeFailures,
    otherWarnings: consoleWarnings.filter((w) => !w.includes('[smoke check failed]')),
    failedRequests,
    elementCount,
    hasContent: bodyText.length > 0 || elementCount > 3,
    status:
      loadError || pageErrors.length || consoleErrors.length
        ? 'FAIL'
        : smokeFailures.length
          ? 'SMOKE_FAIL'
          : 'PASS',
  });

  await context.close();
}

await browser.close();

const summary = {
  total: results.length,
  pass: results.filter((r) => r.status === 'PASS').length,
  smokeFail: results.filter((r) => r.status === 'SMOKE_FAIL').length,
  fail: results.filter((r) => r.status === 'FAIL').length,
  emptyRender: results.filter((r) => !r.hasContent).length,
};

writeFileSync(REPORT_PATH, JSON.stringify({ summary, results }, null, 2));

console.log('=== PHASE 0 LOAD VERIFICATION ===');
console.log(JSON.stringify(summary, null, 2));
console.log();
for (const r of results) {
  if (r.status === 'PASS' && r.hasContent) continue;
  console.log(`[${r.status}] ${r.category}/${r.file}`);
  if (r.loadError) console.log('   loadError:', r.loadError);
  r.pageErrors.forEach((e) => console.log('   pageerror:', e));
  r.consoleErrors.forEach((e) => console.log('   console.error:', e.slice(0, 200)));
  r.smokeFailures.forEach((e) => console.log('   SMOKE:', e.slice(0, 200)));
  if (!r.hasContent) console.log('   WARNING: rendered no meaningful content (elements=' + r.elementCount + ')');
  r.failedRequests.slice(0, 3).forEach((u) => console.log('   failedRequest:', u));
}
