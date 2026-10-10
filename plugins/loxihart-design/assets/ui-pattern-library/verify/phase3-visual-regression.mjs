/**
 * PHASE 3 — VISUAL REGRESSION.
 *
 * The previous visual check only detected *broken* renders (blank page,
 * nothing painted, content offscreen). It could not detect a render that
 * changed. This diffs every pattern against a committed baseline.
 *
 * THE HARD PART: these are animation patterns. Two identical runs of
 * typing-effect-reset differ by ~1900 pixels, because the typewriter is at
 * a different character each time. Naive screenshot diffing would produce
 * permanent false failures and get switched off within a week.
 *
 * SOLUTION: capture with `reducedMotion: 'reduce'` and nothing else.
 * Measured across all 32 patterns: 32/32 byte-identical between runs,
 * because every pattern here genuinely stops animating when asked.
 *
 * An earlier version also injected a stylesheet that paused animations, to
 * force determinism. That worked, but it MASKED the property that makes
 * this suite valuable: with animations force-paused, deleting a pattern's
 * `prefers-reduced-motion` block changed nothing, and the mutation test
 * proved the regression went undetected. Removing the freeze made the
 * suite strictly stronger — determinism now comes from the patterns
 * behaving correctly rather than from the harness suppressing them.
 *
 * So the baselines ARE the reduced-motion renders, and this suite really
 * does regression-test the `prefers-reduced-motion` guarantee every pattern
 * claims. Break reduced-motion handling and the diff goes red.
 *
 *   node phase3-visual-regression.mjs            # check against baselines
 *   node phase3-visual-regression.mjs --update   # re-record baselines
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { REPO_ROOT, verifyPath } from './paths.mjs';

const BASELINES = verifyPath('baselines');
const DIFFS = verifyPath('diffs');
const UPDATE = process.argv.includes('--update');

/** Per-pixel colour-distance sensitivity for pixelmatch.
 *
 *  Measured, not guessed. At the library default of 0.1, a one-shade text
 *  colour change and a removed reduced-motion block BOTH reported 0px and
 *  the mutation test caught them surviving. Tightening to 0.01:
 *    - one-shade colour change      -> 434 px
 *    - reduced-motion block removed -> 1216 px
 *  and run-to-run jitter across three runs of all 32 patterns stayed at
 *  0 px, so the sensitivity costs nothing in flakiness. */
const MATCH_THRESHOLD = 0.01;

/** Pixels allowed to differ before a pattern is considered changed.
 *  Local jitter is 0 px; this is headroom for font rasterisation differing
 *  between this machine and a CI runner. Well under the 400+ px that a
 *  real change produces. */
const PIXEL_TOLERANCE = 100;

/** Only the text caret is suppressed — it blinks on a timer the page does
 *  not control, and would otherwise be the one source of flakiness.
 *  Deliberately NOT pausing animations: see the note above. */
const CARET_CSS = `*{caret-color:transparent !important;}`;

function patternFiles() {
  const out = [];
  for (const d of readdirSync(REPO_ROOT)) {
    const dp = join(REPO_ROOT, d);
    if (!statSync(dp).isDirectory() || d === 'verify' || d.startsWith('.')) continue;
    for (const f of readdirSync(dp)) if (f.endsWith('.html')) out.push(join(dp, f));
  }
  return out.sort();
}

mkdirSync(BASELINES, { recursive: true });
rmSync(DIFFS, { recursive: true, force: true });
mkdirSync(DIFFS, { recursive: true });

const browser = await chromium.launch();
const files = patternFiles();
const results = [];

for (const path of files) {
  const name = basename(path, '.html');
  const ctx = await browser.newContext({
    viewport: { width: 1000, height: 700 },
    reducedMotion: 'reduce',
    // pin these so a different host locale/timezone can't shift a render
    locale: 'en-US',
    timezoneId: 'UTC',
  });
  const page = await ctx.newPage();
  await page.goto('file://' + path, { waitUntil: 'load' });
  await page.addStyleTag({ content: CARET_CSS });
  // Long enough for entry animations and IntersectionObserver to settle.
  await page.waitForTimeout(1100);
  const shot = await page.screenshot();
  await ctx.close();

  const baselinePath = join(BASELINES, name + '.png');
  const hadBaseline = existsSync(baselinePath);

  if (UPDATE || !hadBaseline) {
    writeFileSync(baselinePath, shot);
    results.push({ name, status: 'RECORDED', detail: hadBaseline ? 're-recorded' : 'new baseline' });
    continue;
  }

  const current = PNG.sync.read(shot);
  const baseline = PNG.sync.read(readFileSync(baselinePath));

  if (current.width !== baseline.width || current.height !== baseline.height) {
    results.push({
      name, status: 'SIZE_CHANGED',
      detail: `${baseline.width}x${baseline.height} -> ${current.width}x${current.height}`,
    });
    continue;
  }

  const diff = new PNG({ width: current.width, height: current.height });
  const changed = pixelmatch(
    baseline.data, current.data, diff.data,
    current.width, current.height, { threshold: MATCH_THRESHOLD }
  );

  if (changed > PIXEL_TOLERANCE) {
    writeFileSync(join(DIFFS, name + '.diff.png'), PNG.sync.write(diff));
    writeFileSync(join(DIFFS, name + '.current.png'), shot);
    results.push({ name, status: 'CHANGED', detail: `${changed} px differ (tolerance ${PIXEL_TOLERANCE})` });
  } else {
    results.push({ name, status: 'MATCH', detail: changed ? `${changed} px within tolerance` : '' });
  }
}

await browser.close();

const changed = results.filter((r) => r.status === 'CHANGED' || r.status === 'SIZE_CHANGED');
const recorded = results.filter((r) => r.status === 'RECORDED');
const matched = results.filter((r) => r.status === 'MATCH');

console.log('=== PHASE 3: VISUAL REGRESSION ===');
console.log(`  mode: ${UPDATE ? 'UPDATE (re-recording baselines)' : 'CHECK'}`);
if (recorded.length) console.log(`  recorded: ${recorded.length} baseline(s)`);
console.log(`  matched:  ${matched.length}/${results.length - recorded.length}`);
if (changed.length) {
  console.log(`  CHANGED:  ${changed.length}`);
  changed.forEach((c) => console.log(`     [${c.status}] ${c.name} — ${c.detail}`));
  console.log(`\n  Diff images written to verify/diffs/. Review them.`);
  console.log(`  If the change is intended: node phase3-visual-regression.mjs --update`);
}

writeFileSync(verifyPath('visual-regression-report.json'),
  JSON.stringify({ matchThreshold: MATCH_THRESHOLD, tolerance: PIXEL_TOLERANCE, results }, null, 2));

process.exit(changed.length ? 1 : 0);
