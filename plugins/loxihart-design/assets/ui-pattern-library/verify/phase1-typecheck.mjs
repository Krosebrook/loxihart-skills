/**
 * PHASE 1 — TYPE-CHECK of every inline <script> block.
 *
 * Adapted from the approach salvaged out of the uploaded package's
 * validate_typescript.py, which was the single best asset in it: extract
 * code blocks, compile under --strict, fail on any error.
 *
 * Adapted, not copied. Two differences that matter:
 *   - Source is inline <script> in HTML, not fenced ```ts blocks in markdown.
 *   - The code is plain JS, so it runs under checkJs with noImplicitAny OFF.
 *     Full --strict on untyped JS produces a wall of implicit-any noise that
 *     says nothing about correctness. What we want here is the class of bug
 *     `node --check` cannot see: typos on real DOM APIs, calling things that
 *     don't exist, wrong arity, misused built-ins.
 *
 * NOTE on the uploaded package's failure mode: its validator passed 100/100
 * precisely because a generic controller renamed 100 times type-checks 100
 * times. Type-checking proves code is well-formed. It does not prove the
 * code does what its filename claims. That is what the behavioural suite is
 * for. Both, or neither is worth much.
 */
import { readdirSync, statSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = resolve('/home/claude/patterns');
const TMP = resolve('/home/claude/verify/.tscheck');
const TSC = resolve('/home/claude/verify/node_modules/typescript/bin/tsc');

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const files = [];
for (const d of readdirSync(ROOT)) {
  const dp = join(ROOT, d);
  if (!statSync(dp).isDirectory() || d === 'verify') continue;
  for (const f of readdirSync(dp)) if (f.endsWith('.html')) files.push(join(dp, f));
}
files.sort();

let extracted = 0;
const generated = [];
for (const path of files) {
  const html = readFileSync(path, 'utf-8');
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!blocks.length) { console.log(`  [no script] ${basename(path)}`); continue; }
  const out = join(TMP, basename(path).replace('.html', '.js'));
  writeFileSync(out, `// extracted from ${path}\n` + blocks.join('\n\n'));
  generated.push(out);
  extracted++;
}

const FLAGS = [
  '--noEmit', '--allowJs', '--checkJs',
  '--target', 'ES2022', '--module', 'ES2022',
  '--lib', 'ES2022,DOM,DOM.Iterable',
  '--strictNullChecks', 'false',
  '--noImplicitAny', 'false',
  '--pretty', 'false',
];

let errors = [];
try {
  execFileSync('node', [TSC, ...FLAGS, ...generated], { encoding: 'utf-8', stdio: 'pipe' });
} catch (e) {
  errors = (e.stdout + (e.stderr || '')).split('\n').filter((l) => l.trim() && l.includes('error'));
}

console.log('=== PHASE 1: TYPE-CHECK OF INLINE SCRIPTS ===');
console.log(`  files with script blocks: ${extracted}/${files.length}`);
console.log(`  compiler: TypeScript ${execFileSync('node', [TSC, '--version'], { encoding: 'utf-8' }).trim().replace('Version ', '')}`);
console.log(`  errors: ${errors.length}`);
errors.slice(0, 25).forEach((l) => console.log('   ' + l.slice(0, 170)));

writeFileSync(resolve('/home/claude/verify/typecheck-report.json'),
  JSON.stringify({ filesChecked: extracted, errorCount: errors.length, errors }, null, 2));

rmSync(TMP, { recursive: true, force: true });
process.exit(errors.length ? 1 : 0);
