// Sanity checks on data files; exits 1 when a file is missing or clearly broken.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../lib/util.mjs';

const MIN = { jikyu: 40, zei: 80, yakusoku: 100, enjo: 150, giin: 100, sumeru: 150, saigai: 100 };
let bad = 0;
for (const [id, min] of Object.entries(MIN)) {
  const f = join(ROOT, 'data', id + '.json');
  if (!existsSync(f)) { console.log(`MISSING ${id}`); bad++; continue; }
  const d = JSON.parse(readFileSync(f, 'utf8'));
  const n = d.rows?.length ?? 0;
  const ok = n >= min && d.sources?.length;
  console.log(`${ok ? 'ok  ' : 'BAD '} ${id}: ${n} rows (min ${min}), updated ${d.updated}`);
  if (!ok) bad++;
}
process.exit(bad ? 1 : 0);
