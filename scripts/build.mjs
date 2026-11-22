// Rebuild data files. Usage: node scripts/build.mjs all | <site> [<site>...]
// A site whose build fails keeps its previous data file.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, getLog, log } from '../lib/util.mjs';

export const SITES = ['jikyu', 'zei', 'yakusoku', 'enjo', 'giin', 'sumeru', 'saigai'];
const want = process.argv.slice(2);
const list = !want.length || want.includes('all') ? SITES : want.filter(s => SITES.includes(s));
const status = {};
for (const id of list) {
  const t = Date.now();
  try { const m = await import(`../lib/${id}.mjs`); await m.build(); status[id] = 'ok'; }
  catch (e) { status[id] = 'failed: ' + e.message; log(`!! ${id} failed: ${e.stack || e.message}`); }
  log(`-- ${id}: ${status[id]} (${((Date.now() - t) / 1000).toFixed(1)}s)`);
}
mkdirSync(join(ROOT, 'data/_debug'), { recursive: true });
writeFileSync(join(ROOT, 'data/_debug/build-log.json'), JSON.stringify({ at: new Date().toISOString(), status, log: getLog() }, null, 1));
const failed = Object.values(status).filter(s => s !== 'ok').length;
console.log(`done: ${list.length - failed} ok, ${failed} failed`);
