/**
 * PHASE 1 HARNESS — multi-engine, a11y-tree, visual, and axe.
 *
 * Closes:
 *   Gap 1  multi-engine  — Chromium + Firefox + WebKit, not one engine
 *   Gap 2  screen reader — computed accessibility TREE (role/name/state as an
 *                          AT actually consumes it), not just attribute presence
 *   Gap 3  visual        — screenshots + geometry sanity, catches a scrambled
 *                          render that still passes every DOM assertion
 *   Phase1 axe-core      — real automated WCAG rule scan
 *
 * Run:  PLAYWRIGHT_BROWSERS_PATH=/home/claude/pw-browsers node phase1-harness.mjs
 */
import { chromium, firefox, webkit } from 'playwright';
import { readdirSync, statSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const ROOT = resolve('/home/claude/patterns');
const OUT = resolve('/home/claude/verify/artifacts');
const AXE = readFileSync(resolve('/home/claude/verify/node_modules/axe-core/axe.min.js'), 'utf-8');
mkdirSync(OUT, { recursive: true });

function patternFiles() {
  const out = [];
  for (const d of readdirSync(ROOT)) {
    const dp = join(ROOT, d);
    if (!statSync(dp).isDirectory() || d === 'verify') continue;
    for (const f of readdirSync(dp)) if (f.endsWith('.html')) out.push({ dir: d, file: f, path: join(dp, f) });
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

const ENGINES = [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]];
const files = patternFiles();
const report = { engines: {}, axe: [], a11yTree: [], visual: [] };

// ─────────────────────────────────────────────────────────────
// GAP 1 — every pattern, every engine
// ─────────────────────────────────────────────────────────────
console.log('=== GAP 1: MULTI-ENGINE LOAD ===');
for (const [engineName, engine] of ENGINES) {
  const browser = await engine.launch();
  const results = [];
  for (const f of files) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const errs = [], smoke = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errs.push(m.text());
      if (m.type() === 'warning' && m.text().includes('[smoke check failed]')) smoke.push(m.text());
    });
    let loadErr = null;
    try {
      await page.goto('file://' + f.path, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(700);
    } catch (e) { loadErr = e.message; }
    const elements = await page.evaluate(() => document.body?.querySelectorAll('*').length ?? 0)
      .catch(() => 0);
    results.push({
      file: f.dir + '/' + f.file,
      status: (loadErr || errs.length) ? 'FAIL' : smoke.length ? 'SMOKE_FAIL' : 'PASS',
      errs: errs.slice(0, 2), smoke: smoke.slice(0, 2), elements, loadErr,
    });
    await ctx.close();
  }
  await browser.close();
  const pass = results.filter((r) => r.status === 'PASS').length;
  report.engines[engineName] = results;
  console.log(`  ${engineName.padEnd(9)} ${pass}/${results.length} pass`);
  results.filter((r) => r.status !== 'PASS').forEach((r) =>
    console.log(`     [${r.status}] ${r.file} :: ${(r.errs[0] || r.smoke[0] || r.loadErr || '').slice(0, 110)}`));
}

// ─────────────────────────────────────────────────────────────
// GAP 2 — computed accessibility tree (what an AT actually gets)
// ─────────────────────────────────────────────────────────────
console.log('\n=== GAP 2: ACCESSIBILITY TREE (computed role + name) ===');
{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Accessibility.enable');
  let unnamed = 0, checked = 0;

  for (const f of files) {
    await page.goto('file://' + f.path, { waitUntil: 'load' });
    await page.waitForTimeout(400);

    // The real computed accessibility tree — what an AT consumes, not what
    // the DOM attributes merely claim.
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');

    const INTERACTIVE = new Set(['button', 'link', 'textbox', 'checkbox', 'slider', 'combobox', 'switch']);
    const problems = [];
    const roles = {};
    for (const n of nodes) {
      if (n.ignored) continue;
      const role = n.role?.value;
      const name = (n.name?.value || '').trim();
      if (!role) continue;
      roles[role] = (roles[role] || 0) + 1;
      if (INTERACTIVE.has(role) && !name) problems.push(`${role} with no accessible name`);
    }

    checked++;
    if (problems.length) {
      unnamed++;
      console.log(`  [NAME GAP] ${f.dir}/${f.file}: ${[...new Set(problems)].slice(0, 3).join('; ')}`);
    }
    report.a11yTree.push({ file: f.dir + '/' + f.file, problems, roles });
  }
  console.log(`  ${checked - unnamed}/${checked} files expose a name on every interactive node`);
  await browser.close();
}

// ─────────────────────────────────────────────────────────────
// PHASE 1 — axe-core automated WCAG scan
// ─────────────────────────────────────────────────────────────
console.log('\n=== PHASE 1: AXE-CORE WCAG SCAN ===');
{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let clean = 0;
  for (const f of files) {
    await page.goto('file://' + f.path, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    await page.addScriptTag({ content: AXE });
    const res = await page.evaluate(async () =>
      await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      })
    );
    const violations = res.violations.map((v) => ({
      id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help,
    }));
    if (!violations.length) clean++;
    else console.log(`  [AXE] ${f.dir}/${f.file}: ` +
      violations.map((v) => `${v.id}(${v.impact}x${v.nodes})`).join(', '));
    report.axe.push({ file: f.dir + '/' + f.file, violations });
  }
  console.log(`  ${clean}/${files.length} files with zero axe violations`);
  await browser.close();
}

// ─────────────────────────────────────────────────────────────
// GAP 3 — visual: screenshot + geometry sanity
// ─────────────────────────────────────────────────────────────
console.log('\n=== GAP 3: VISUAL / GEOMETRY ===');
{
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  let suspicious = 0;
  for (const f of files) {
    await page.goto('file://' + f.path, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    const shot = await page.screenshot();
    writeFileSync(join(OUT, f.file.replace('.html', '.png')), shot);

    const geo = await page.evaluate(() => {
      const vw = innerWidth, vh = innerHeight;
      let offscreen = 0, zeroSize = 0, visible = 0;
      for (const el of document.body.querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) { zeroSize++; continue; }
        visible++;
        // fully outside the viewport in a way that suggests broken layout
        if (r.right < -50 || r.left > vw + 50 || r.bottom < -50 || r.top > vh + 400) offscreen++;
      }
      // is anything actually painted in the middle of the page?
      const mid = document.elementFromPoint(vw / 2, vh / 2);
      return { visible, zeroSize, offscreen, midPainted: !!mid && mid !== document.documentElement };
    });

    // A uniform screenshot = blank render. Cheap check: unique byte sample.
    const sample = new Set();
    for (let i = 0; i < shot.length; i += Math.max(1, Math.floor(shot.length / 500))) sample.add(shot[i]);
    const flat = sample.size < 8;

    // Broken-render detection. Element COUNT alone is a bad signal: a
    // single-button demo legitimately has one visible element, and flagging
    // that produced 4 false positives on files whose screenshots were
    // verified correct by eye. Require corroboration instead — a low count
    // only matters if the paint also looks wrong.
    const flags = [];
    const paintWrong = flat || !geo.midPainted;
    if (flat) flags.push('near-uniform screenshot (blank render)');
    if (!geo.midPainted) flags.push('nothing painted at viewport centre');
    if (geo.offscreen > 3) flags.push(`${geo.offscreen} elements far offscreen`);
    if (geo.visible === 0) flags.push('zero visible elements');
    if (geo.visible < 3 && paintWrong) flags.push(`only ${geo.visible} visible elements AND paint looks wrong`);

    if (flags.length) { suspicious++; console.log(`  [VISUAL] ${f.dir}/${f.file}: ${flags.join('; ')}`); }
    report.visual.push({ file: f.dir + '/' + f.file, ...geo, flat, flags });
  }
  console.log(`  ${files.length - suspicious}/${files.length} render plausibly; screenshots in verify/artifacts/`);
  await browser.close();
}

writeFileSync(resolve('/home/claude/verify/phase1-report.json'), JSON.stringify(report, null, 2));
console.log('\nreport -> verify/phase1-report.json');
