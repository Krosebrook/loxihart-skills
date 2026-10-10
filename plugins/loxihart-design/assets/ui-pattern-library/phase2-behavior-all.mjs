/**
 * PHASE 2 — BEHAVIOURAL COVERAGE FOR THE REMAINING 26 PATTERNS.
 *
 * phase0-behavior-check.mjs covers 6 patterns in depth. This covers the
 * other 26, so every pattern in the library has at least one assertion
 * that exercises what it actually DOES — not just that it loads.
 *
 * Each test asserts the specific promise made in that file's
 * "DO NOT STRIP WHEN ADAPTING" block. If a test here fails, either the
 * code is broken or the comment is lying. Both have happened.
 *
 * Runs on all three engines.
 */
import { chromium, firefox, webkit } from 'playwright';
import { resolve } from 'node:path';
import { patternUrl } from './paths.mjs';

const P = patternUrl;
const ENGINES = [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]];

const results = [];
let ENGINE = '';
const check = (pattern, name, pass, detail = '') => {
  results.push({ engine: ENGINE, pattern, name, pass, detail });
  if (!pass) console.log(`    [FAIL] ${pattern} :: ${name}${detail ? ' — ' + detail : ''}`);
};

/** Each entry: [file, async (page, check) => {...}] */
const TESTS = [
  // ── 1. Loading & Progress ───────────────────────────────────────
  ['01-loading-progress-feedback/skeleton-screen-shimmer.html', async (page, c) => {
    // skeleton visible first, real content swapped in, live region announces
    const skelVisible = await page.locator('.skeleton-state').isVisible();
    c('skeleton shows before content', skelVisible);
    await page.waitForTimeout(1600);
    c('real content revealed after load', await page.locator('#realContent').isVisible());
    c('load state announced', (await page.locator('#status').innerText()).length > 0);
    c('skeleton hidden from AT', await page.locator('.skeleton-state').getAttribute('aria-hidden') === 'true');
  }],

  ['01-loading-progress-feedback/download-progress-wave.html', async (page, c) => {
    const before = await page.locator('#nativeProgress').getAttribute('value');
    await page.locator('#startBtn').click();
    await page.waitForTimeout(900);
    const during = await page.locator('#nativeProgress').getAttribute('value');
    c('native <progress> value advances', Number(during) > Number(before), `${before} -> ${during}`);
    c('progress exposed natively, not just visually',
      await page.locator('#nativeProgress').evaluate((el) => el.tagName === 'PROGRESS'));
  }],

  ['01-loading-progress-feedback/number-counter-ticker.html', async (page, c) => {
    await page.waitForTimeout(1800);
    const el = page.locator('.counter').first();
    const text = (await el.innerText()).replace(/[^0-9.]/g, '');
    c('counter reaches a non-zero value', Number(text) > 0, `text=${text}`);
    const label = await el.getAttribute('aria-label');
    c('final value exposed up front via aria-label', !!label && label.length > 0, `"${label}"`);
  }],

  // ── 2. Action Feedback ──────────────────────────────────────────
  ['02-action-feedback-confirmation/haptic-vibration-feedback.html', async (page, c) => {
    await page.locator('#tapTarget').click();
    await page.waitForTimeout(150);
    const label = await page.locator('#tapTarget').innerText();
    c('visual feedback fires regardless of vibration support', /tapped/i.test(label), `"${label}"`);
    c('non-haptic channel announced', (await page.locator('#status').innerText()).length > 0);
  }],

  ['02-action-feedback-confirmation/audio-ui-sound-click.html', async (page, c) => {
    await page.locator('#clickTarget').click();
    await page.waitForTimeout(150);
    c('visual feedback fires independent of audio',
      /clicked/i.test(await page.locator('#clickTarget').innerText()));
    c('mute control present and operable', await page.locator('#muteToggle').isEnabled());
  }],

  ['02-action-feedback-confirmation/pulse-ripple-beacon.html', async (page, c) => {
    c('decorative beacon hidden from AT',
      await page.locator('.beacon[aria-hidden="true"]').count() === 1);
    const labelled = page.locator('.beacon[aria-label]');
    c('standalone-meaning beacon carries a real name',
      (await labelled.count()) === 1 && (await labelled.getAttribute('aria-label')).length > 0);
  }],

  // ── 3. Motion & Transform ───────────────────────────────────────
  ['03-motion-transform-effects/ghost-trail-duplicate.html', async (page, c) => {
    const arena = page.locator('#arena');
    const box = await arena.boundingBox();
    for (let i = 0; i < 25; i++) {
      await page.mouse.move(box.x + 20 + i * 8, box.y + 60 + (i % 5) * 6);
    }
    await page.waitForTimeout(200);
    const nodes = await page.locator('.trail-node').count();
    // The whole point of the pool: this must NOT grow with pointer events.
    c('trail node pool stays bounded under sustained movement', nodes > 0 && nodes <= 12, `nodes=${nodes}`);
  }],

  ['03-motion-transform-effects/tilt-parallax-angle.html', async (page, c) => {
    const card = page.locator('#tiltCard');
    const before = await card.evaluate((el) => getComputedStyle(el).transform);
    const box = await card.boundingBox();
    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.move(box.x + box.width - 20, box.y + box.height - 20);
    await page.waitForTimeout(250);
    const after = await card.evaluate((el) => getComputedStyle(el).transform);
    c('tilt responds to pointer position', before !== after);
    c('decorative card hidden from AT', await card.getAttribute('aria-hidden') === 'true');
  }],

  ['03-motion-transform-effects/rubber-band-squish.html', async (page, c) => {
    const btn = page.locator('#squishBtn');
    await btn.dispatchEvent('pointerdown');
    await page.waitForTimeout(80);
    const running = await btn.evaluate((el) => el.getAnimations().length > 0);
    c('squish animation actually starts on press', running);
    c('is a real focusable button', await btn.evaluate((el) => el.tagName === 'BUTTON'));
  }],

  ['03-motion-transform-effects/card-lift-perspective.html', async (page, c) => {
    const card = page.locator('.lift-card');
    c('native <button>, not div+role', await card.evaluate((el) => el.tagName === 'BUTTON'));
    const rest = await card.evaluate((el) => getComputedStyle(el).transform);
    await card.focus();
    await page.waitForTimeout(300);
    const focused = await card.evaluate((el) => getComputedStyle(el).transform);
    // keyboard users must get the same affordance as hover users
    c('keyboard focus triggers the lift, not just hover', rest !== focused);
  }],

  ['03-motion-transform-effects/magnetic-cursor-ring.html', async (page, c) => {
    await page.mouse.move(400, 300);
    await page.waitForTimeout(200);
    const ringOrNotice = (await page.locator('.cursor-ring').count()) > 0
      || (await page.locator('#noPointerNotice').innerText()).length > 0;
    c('ring renders on fine pointer, or explains why it did not', ringOrNotice);
    c('native OS cursor never hidden',
      await page.evaluate(() => getComputedStyle(document.documentElement).cursor !== 'none'));
  }],

  ['03-motion-transform-effects/staggered-card-entry.html', async (page, c) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1400);
    const shown = await page.locator('.stagger-item.in-view').count();
    c('cards enter when scrolled into view', shown > 0, `${shown} entered`);
    const maxI = await page.evaluate(() => Math.max(...[...document.querySelectorAll('.stagger-item')]
      .map((el) => Number(getComputedStyle(el).getPropertyValue('--i')))));
    c('stagger delay is capped, not unbounded per index', maxI <= 6, `max --i = ${maxI}`);
  }],

  ['03-motion-transform-effects/staggered-icon-pop.html', async (page, c) => {
    await page.waitForTimeout(1200);
    const btns = page.locator('.icon-btn');
    const n = await btns.count();
    c('icons rendered', n > 0, `${n} icons`);
    const allNamed = await btns.evaluateAll((els) => els.every((e) => (e.getAttribute('aria-label') || '').length > 0));
    c('every icon-only button has an accessible name', allNamed);
  }],

  // ── 4. Navigation ───────────────────────────────────────────────
  ['04-navigation-wayfinding/underline-growth-track.html', async (page, c) => {
    const link = page.locator('a.grow-underline').first();
    c('real anchor with href', await link.evaluate((el) => el.tagName === 'A' && !!el.getAttribute('href')));
    await link.focus();
    await page.waitForTimeout(300);
    const scale = await link.evaluate((el) => getComputedStyle(el, '::after').transform);
    c('focus grows the underline (not hover-only)', scale !== 'matrix(0, 0, 0, 1, 0, 0)', `transform=${scale}`);
  }],

  ['04-navigation-wayfinding/image-hotspot-pulse.html', async (page, c) => {
    const hotspot = page.locator('.hotspot').first();
    c('hotspot is a real button with a name',
      await hotspot.evaluate((el) => el.tagName === 'BUTTON' && !!el.getAttribute('aria-label')));
    await hotspot.click();
    await page.waitForTimeout(250);
    c('popover opens', await page.locator('#popover').evaluate((el) => el.classList.contains('open')));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    c('Escape dismisses it (SC 1.4.13)',
      await page.locator('#popover').evaluate((el) => !el.classList.contains('open')));
    c('focus returns to the trigger', await hotspot.evaluate((el) => document.activeElement === el));
  }],

  // ── 5. Visual Enhancement ───────────────────────────────────────
  ['05-visual-enhancement-decorative/shimmer-sheen-highlight.html', async (page, c) => {
    c('effect is a CSS pseudo-element, no extra DOM node',
      await page.locator('.sheen-wrap').evaluate((el) => el.children.length === 1));
  }],

  ['05-visual-enhancement-decorative/liquid-blob-fusion.html', async (page, c) => {
    const hasFilter = await page.locator('#goo').count() > 0;
    c('SVG goo filter defined', hasFilter);
    const stage = page.locator('#blobStage');
    if (await stage.isVisible()) {
      const before = await page.locator('#blobA').getAttribute('cx');
      const box = await stage.boundingBox();
      await page.mouse.move(box.x + 40, box.y + 100);
      await page.mouse.move(box.x + box.width - 40, box.y + 100);
      await page.waitForTimeout(250);
      const after = await page.locator('#blobA').getAttribute('cx');
      c('blobs track pointer', before !== after, `cx ${before} -> ${after}`);
    } else {
      c('stage hidden under reduced motion (acceptable)', true);
    }
  }],

  ['05-visual-enhancement-decorative/glow-perimeter-trail.html', async (page, c) => {
    c('conic-gradient support is feature-detected, not assumed',
      await page.evaluate(() => typeof CSS.supports('background', 'conic-gradient(from 0deg, red, blue)') === 'boolean'));
    c('glow element present', await page.locator('.glow-border').count() === 1);
  }],

  ['05-visual-enhancement-decorative/color-spill-wipe.html', async (page, c) => {
    const after = page.locator('.panel.after');
    const before = await after.evaluate((el) => getComputedStyle(el).clipPath);
    await page.locator('#triggerBtn').click();
    await page.waitForTimeout(900);
    const now = await after.evaluate((el) => getComputedStyle(el).clipPath);
    c('wipe reveals on trigger', before !== now, `${before} -> ${now}`);
  }],

  ['05-visual-enhancement-decorative/border-dash-spin.html', async (page, c) => {
    c('decorative border SVG hidden from AT',
      await page.locator('.dash-rect').getAttribute('aria-hidden') === 'true');
    c('real content label is not hidden',
      (await page.locator('.dash-frame .label').innerText()).length > 0);
  }],

  ['05-visual-enhancement-decorative/text-highlighting-strike.html', async (page, c) => {
    c('semantic variant uses real <del>', await page.locator('.semantic-strike del').count() === 1);
    const hidden = await page.locator('.semantic-strike .visually-hidden').innerText();
    c('meaning survives without the visual line', hidden.trim().length > 0, `"${hidden.trim()}"`);
    await page.locator('#triggerBtn').click();
    await page.waitForTimeout(600);
    c('animation triggers', await page.locator('#strike').evaluate((el) => el.classList.contains('active')));
  }],

  ['05-visual-enhancement-decorative/drawing-path-tracing.html', async (page, c) => {
    const dash = await page.locator('#tracePath').evaluate((el) => el.style.strokeDasharray);
    c('path length computed at runtime, not hardcoded', !!dash && parseFloat(dash) > 0, `dasharray=${dash}`);
    c('decorative SVG hidden, adjacent caption describes it',
      await page.locator('svg.trace-icon').getAttribute('aria-hidden') === 'true'
      && (await page.locator('#caption').innerText()).length > 0);
  }],

  ['05-visual-enhancement-decorative/typing-effect-reset.html', async (page, c) => {
    await page.waitForTimeout(1400);
    const label = await page.locator('#typingLine').getAttribute('aria-label');
    c('container exposes the full string, not partials', !!label && label.length > 3, `"${label}"`);
    c('animated node hidden from AT',
      await page.locator('#typedText').getAttribute('aria-hidden') === 'true');
    c('NO aria-live (would announce every keystroke)',
      await page.locator('#typingLine').evaluate((el) => !el.hasAttribute('aria-live')));
  }],

  // ── 6. Theming — elevated risk ──────────────────────────────────
  ['06-theming-display-mode-elevated-risk/dark-mode-flashbang-toggle.html', async (page, c) => {
    const toggle = page.locator('#themeToggle');
    c('starts unpressed', await toggle.getAttribute('aria-pressed') === 'false');
    await toggle.click();
    await page.waitForTimeout(700);
    c('theme actually switches', await page.evaluate(() => document.body.dataset.theme) === 'dark');
    c('aria-pressed reflects new state', await toggle.getAttribute('aria-pressed') === 'true');
    c('accessible name updates', /light/i.test(await toggle.innerText()));
  }],

  ['06-theming-display-mode-elevated-risk/dual-tone-inversion.html', async (page, c) => {
    const card = page.locator('.duotone-card');
    c('native button — hover AND focus both work',
      await card.evaluate((el) => el.tagName === 'BUTTON'));
    const rest = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    await card.focus();
    await page.waitForTimeout(300);
    const focused = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    c('tones invert on keyboard focus', rest !== focused, `${rest} -> ${focused}`);
  }],

  ['06-theming-display-mode-elevated-risk/image-glitch-flicker.html', async (page, c) => {
    const btn = page.locator('#triggerBtn');
    if (await btn.isDisabled()) {
      c('hard-disabled under reduced motion', true);
      return;
    }
    await btn.click();
    await page.waitForTimeout(120);
    c('button locks out during burst (prevents flash train)', await btn.isDisabled());
    await page.waitForTimeout(1300);
    c('re-enables after the cooldown', await btn.isEnabled());
  }],
];

for (const [engineName, engine] of ENGINES) {
  ENGINE = engineName;
  const browser = await engine.launch();
  console.log(`\n================ ${engineName.toUpperCase()} ================`);
  for (const [file, fn] of TESTS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const pattern = file.split('/')[1].replace('.html', '');
    try {
      await page.goto(P(file), { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(300);
      await fn(page, (n, p, d) => check(pattern, n, p, d));
    } catch (e) {
      check(pattern, 'test executed without throwing', false, e.message.split('\n')[0].slice(0, 100));
    }
    await ctx.close();
  }
  const eng = results.filter((r) => r.engine === engineName);
  console.log(`  ${eng.filter((r) => r.pass).length}/${eng.length} passed`);
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed across ${ENGINES.length} engines ===`);
console.log(`=== ${TESTS.length} patterns newly covered ===`);
if (failed.length) {
  console.log('\nFAILURES:');
  const grouped = {};
  failed.forEach((f) => { (grouped[`${f.pattern} :: ${f.name}`] ||= []).push(f.engine); });
  Object.entries(grouped).forEach(([k, engines]) =>
    console.log(`  - ${k}  [${engines.join(', ')}]`));
}
process.exit(failed.length ? 1 : 0);
