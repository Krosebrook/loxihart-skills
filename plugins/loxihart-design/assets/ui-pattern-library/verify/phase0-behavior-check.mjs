/**
 * PHASE 0b — BEHAVIORAL verification of load-bearing accessibility claims.
 *
 * The load check proves nothing throws. It does not prove the patterns work.
 * These tests drive the specific claims made in writing in each file's
 * "DO NOT STRIP WHEN ADAPTING" block — the SC 2.5.1 keyboard alternatives,
 * the state machines, the ARIA wiring. A false claim here is worse than a
 * visual bug: it's a documented promise that doesn't hold.
 */
import { chromium, firefox, webkit } from 'playwright';
import { resolve } from 'node:path';

const P = (p) => 'file://' + resolve('/home/claude/patterns', p);

// Run the whole suite on every engine. The caret fix in particular is a
// browser-behaviour workaround; asserting it in one engine proves nothing
// about the others.
const ENGINES = [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]];
let browser;
const results = [];
let ENGINE = '';
const check = (name, pass, detail = '') => {
  results.push({ engine: ENGINE, name, pass, detail });
  console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`);
};

async function withPage(path, fn) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(path, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  try { await fn(page); } finally { await ctx.close(); }
}

for (const [engineName, engine] of ENGINES) {
  ENGINE = engineName;
  browser = await engine.launch();
  console.log('\n================ ' + engineName.toUpperCase() + ' ================');

// ---------------------------------------------------------------
console.log('\n### Slide-to-Unlock — SC 2.5.1 keyboard alternative claim');
await withPage(P('04-navigation-wayfinding/slide-to-unlock-fader.html'), async (page) => {
  const handle = page.locator('#handle');
  await handle.focus();
  check('handle is focusable', await handle.evaluate((el) => document.activeElement === el));

  const before = await handle.getAttribute('aria-valuenow');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(120);
  const after = await handle.getAttribute('aria-valuenow');
  check('ArrowRight advances the slider', Number(after) > Number(before), `${before} -> ${after}`);

  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(120);
  const back = await handle.getAttribute('aria-valuenow');
  check('ArrowLeft reverses it', Number(back) < Number(after), `${after} -> ${back}`);

  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const label = await page.locator('#trackLabel').innerText();
  check('Enter commits without any drag', label.includes('Confirmed'), `label="${label}"`);
});

// ---------------------------------------------------------------
console.log('\n### Scratch-Card — SC 2.5.1 non-drag reveal claim');
await withPage(P('05-visual-enhancement-decorative/scratch-card-reveal.html'), async (page) => {
  const btn = page.locator('#revealBtn');
  check('reveal button is a real focusable button', await btn.evaluate((el) => el.tagName === 'BUTTON'));
  const opacityBefore = await page.locator('#scratchCanvas').evaluate((el) => getComputedStyle(el).opacity);
  await btn.click();
  await page.waitForTimeout(500);
  const opacityAfter = await page.locator('#scratchCanvas').evaluate((el) => getComputedStyle(el).opacity);
  check('button reveals content without dragging',
    Number(opacityAfter) < Number(opacityBefore), `opacity ${opacityBefore} -> ${opacityAfter}`);
});

// ---------------------------------------------------------------
console.log('\n### Progress Button Spinner — state machine + aria-busy');
await withPage(P('01-loading-progress-feedback/progress-button-spinner.html'), async (page) => {
  const btn = page.locator('#submitBtn');
  await btn.click();
  await page.waitForTimeout(150);
  check('enters loading state', await btn.getAttribute('data-state') === 'loading');
  check('aria-busy set during load', await btn.getAttribute('aria-busy') === 'true');
  check('disabled during load (prevents double-submit)', await btn.isDisabled());
  const live = await page.locator('#status').innerText();
  check('live region announced', live.length > 0, `"${live}"`);

  await page.waitForTimeout(2000);
  const settled = await btn.getAttribute('data-state');
  check('resolves to a terminal state', ['success', 'error', 'idle'].includes(settled), `state=${settled}`);
  check('aria-busy cleared after resolve', await btn.getAttribute('aria-busy') === null);
});

// ---------------------------------------------------------------
console.log('\n### Password Peek — type toggle + caret preservation');
await withPage(P('02-action-feedback-confirmation/password-peek-toggle.html'), async (page) => {
  const input = page.locator('#pw');
  const toggle = page.locator('#peekToggle');
  check('starts masked', await input.getAttribute('type') === 'password');
  // Realistic flow: user focuses the field and positions the caret mid-string,
  // THEN reaches for the peek toggle.
  await input.click();
  await input.evaluate((el) => { el.focus(); el.setSelectionRange(4, 4); });
  await input.dispatchEvent('select');
  await toggle.click();
  await page.waitForTimeout(120);
  check('toggles to plaintext', await input.getAttribute('type') === 'text');
  check('aria-pressed reflects state', await toggle.getAttribute('aria-pressed') === 'true');
  const caret = await input.evaluate((el) => el.selectionStart);
  check('caret position preserved across type switch', caret === 4, `selectionStart=${caret}`);
  const label = await toggle.getAttribute('aria-label');
  check('accessible name updates', /hide/i.test(label), `"${label}"`);
});

// ---------------------------------------------------------------
console.log('\n### Hover/Click Zoom — keyboard path to the same capability');
await withPage(P('03-motion-transform-effects/hover-click-zoom-bounds.html'), async (page) => {
  const btn = page.locator('#fullSizeBtn');
  await btn.focus();
  check('full-size button reachable by keyboard', await btn.evaluate((el) => document.activeElement === el));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const open = await page.locator('#fullSizeDialog').evaluate((el) => el.open);
  check('Enter opens the zoomed view (no pointer required)', open === true);
});

// ---------------------------------------------------------------
console.log('\n### Copy-to-Clipboard — error path when permission denied');
await withPage(P('02-action-feedback-confirmation/copy-to-clipboard-banner.html'), async (page) => {
  // file:// has no clipboard permission — exercises the catch branch
  await page.locator('#copyBtn').click();
  await page.waitForTimeout(400);
  const banner = page.locator('#banner');
  const visible = await banner.evaluate((el) => el.classList.contains('visible'));
  const text = await banner.innerText();
  check('user gets feedback either way (no silent failure)', visible && text.length > 0, `"${text}"`);
});

  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n=== ${results.length - failed.length}/${results.length} behavioral checks passed ===`);
if (failed.length) {
  console.log('\nFAILURES:');
  failed.forEach((f) => console.log(`  - [${f.engine}] ${f.name} ${f.detail}`));
}
process.exit(failed.length ? 1 : 0);
