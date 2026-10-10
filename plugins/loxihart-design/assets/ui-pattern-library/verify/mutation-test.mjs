/**
 * MUTATION TEST for the Phase 0 harness.
 *
 * A validator you have never tried to fool is a confidence generator, not a
 * check. This deliberately injects known-bad mutations into copies of real
 * pattern files and asserts the harness FAILS on each one.
 *
 * If a mutation survives (harness still reports PASS), the harness has a
 * blind spot and the 32/32 green board means less than it appears to.
 */
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const CHROME_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const TMP = resolve('/home/claude/verify/mutants');
const P = (p) => resolve('/home/claude/patterns', p);

const MUTATIONS = [
  {
    name: 'M1: runtime TypeError (the original console.assert class of bug)',
    source: P('01-loading-progress-feedback/progress-button-spinner.html'),
    mutate: (s) => s.replace("'use strict';", "'use strict';\n      nonExistentFunction();"),
    expect: 'FAIL',
    detects: 'uncaught exception at load',
  },
  {
    name: 'M2: failing smoke assertion (accessibility invariant broken)',
    source: P('01-loading-progress-feedback/progress-button-spinner.html'),
    // remove the accessible name the smoke check asserts on
    mutate: (s) => s.replace('aria-label="Submit payment"', ''),
    expect: 'SMOKE_FAIL',
    detects: 'smoke check fires on missing accessible name',
  },
  {
    name: 'M3: flash-rate regression (reintroduce the 14.3Hz loop)',
    source: P('06-theming-display-mode-elevated-risk/image-glitch-flicker.html'),
    mutate: (s) => s.replace('const BURST_MS = 400;', 'const BURST_MS = 20;')
                    .replace('const COOLDOWN_MS = 600;', 'const COOLDOWN_MS = 0;'),
    expect: 'SMOKE_FAIL',
    detects: 'flash-rate guard catches an unsafe timing change',
  },
  {
    name: 'M4: syntax error in inline script',
    source: P('03-motion-transform-effects/card-lift-perspective.html'),
    mutate: (s) => s.replace("'use strict';", "'use strict'; const ="),
    expect: 'FAIL',
    detects: 'malformed script',
  },
  {
    name: 'M5: empty render (structural collapse)',
    source: P('04-navigation-wayfinding/underline-growth-track.html'),
    mutate: (s) => s.replace(/<body>[\s\S]*<\/body>/, '<body></body>'),
    expect: 'EMPTY',
    detects: 'page renders no meaningful content',
  },
  {
    name: 'M6: content pushed offscreen (broken layout, DOM still intact)',
    source: P('03-motion-transform-effects/card-lift-perspective.html'),
    // DOM is fine, every assertion still passes — only the paint is wrong.
    mutate: (s) => s.replace('<style>', '<style>\n  body > * { position: fixed; left: -9999px; top: -9999px; }'),
    expect: 'EMPTY',
    detects: 'visual check catches a render that passes every DOM assertion',
  },
];

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function checkFile(path) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [], consoleErrors = [], warnings = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
    if (m.type() === 'warning') warnings.push(m.text());
  });
  let loadError = null;
  try {
    await page.goto('file://' + path, { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(700);
  } catch (e) { loadError = e.message; }
  let elementCount = 0, bodyText = '', midPainted = false;
  try {
    elementCount = await page.evaluate(() => document.body?.querySelectorAll('*').length ?? 0);
    bodyText = (await page.evaluate(() => document.body?.innerText ?? '')).trim();
    midPainted = await page.evaluate(() => {
      const m = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
      return !!m && m !== document.documentElement && m !== document.body;
    });
  } catch {}
  await context.close();
  const smoke = warnings.filter((w) => w.includes('[smoke check failed]'));
  // Mirrors the shipped harness: content must exist AND actually be painted.
  const hasContent = (bodyText.length > 0 || elementCount > 3) && midPainted;
  // Precedence matters: an EMPTY verdict must not mask a real error or a
  // failed smoke check. (Caught by the mutation test itself — an earlier
  // ordering let EMPTY override SMOKE_FAIL and M3 silently stopped being
  // detected.)
  let status;
  if (loadError || pageErrors.length || consoleErrors.length) status = 'FAIL';
  else if (smoke.length) status = 'SMOKE_FAIL';
  else if (!hasContent) status = 'EMPTY';
  else status = 'PASS';
  return { status, detail: [...pageErrors, ...consoleErrors, ...smoke][0] ?? null };
}

console.log('=== MUTATION TEST: does the harness actually catch injected bugs? ===\n');
let survived = 0;

for (const m of MUTATIONS) {
  const original = readFileSync(m.source, 'utf-8');
  const mutated = m.mutate(original);
  if (mutated === original) {
    console.log(`[SETUP ERROR] ${m.name}\n   mutation produced no change — test is invalid\n`);
    survived++;
    continue;
  }
  const path = resolve(TMP, m.name.split(':')[0] + '.html');
  writeFileSync(path, mutated);
  const { status, detail } = await checkFile(path);
  const caught = status === m.expect;
  if (!caught) survived++;
  console.log(`[${caught ? 'CAUGHT' : 'SURVIVED'}] ${m.name}`);
  console.log(`   expected: ${m.expect}  |  actual: ${status}`);
  console.log(`   checks: ${m.detects}`);
  if (detail) console.log(`   signal: ${detail.slice(0, 120)}`);
  console.log();
}

// Control: an UNMUTATED file must still pass, or the harness is just
// failing everything and would "catch" bugs by accident.
const control = await checkFile(P('03-motion-transform-effects/rubber-band-squish.html'));
console.log(`[CONTROL] unmutated file -> ${control.status} (must be PASS)`);
if (control.status !== 'PASS') survived++;

await browser.close();
rmSync(TMP, { recursive: true, force: true });

console.log(`\n=== ${MUTATIONS.length - survived + (control.status === 'PASS' ? 1 : 0)}/${MUTATIONS.length + 1} checks behaved correctly ===`);
console.log(survived === 0
  ? 'HARNESS VALIDATED — every injected bug was caught, and clean files still pass.'
  : `HARNESS HAS ${survived} BLIND SPOT(S) — the 32/32 result is weaker than it looks.`);
process.exit(survived === 0 ? 0 : 1);
