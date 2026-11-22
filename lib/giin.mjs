// 05 Parliament vs. the people: share of women and age of MPs (IPU Parline) vs. the population (World Bank, UN WPP via OWID).
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { get, wb, owid, safe, latest, round, save, log, ROOT, isCountry, COUNTRIES, WB_SRC, OWID_SRC } from './util.mjs';

const a2to3 = Object.fromEntries(Object.entries(COUNTRIES).map(([k, v]) => [v.a2, k]));

// Pull a number out of the many shapes a Parline attribute can take.
function numOf(v) {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return v.trim() !== '' && !isNaN(+v) ? +v : null;
  if (Array.isArray(v)) { for (let i = v.length - 1; i >= 0; i--) { const n = numOf(v[i]); if (n != null) return n; } return null; }
  if (typeof v === 'object') { for (const k of ['value', 'amount', 'number', 'mean', 'average']) if (k in v) { const n = numOf(v[k]); if (n != null) return n; } }
  return null;
}
function isoOf(item) {
  const a = item.attributes || {};
  const cands = [a.country_code, a.country?.code, a.country?.iso, a.iso_code, a.country, item.relationships?.country?.data?.id, a.parliament_code, item.id];
  for (const c of cands) {
    if (typeof c !== 'string') continue;
    const u = c.toUpperCase();
    if (u.length === 3 && isCountry(u)) return u;
    if (u.length >= 2 && a2to3[u.slice(0, 2)]) return a2to3[u.slice(0, 2)];
  }
  return null;
}

async function ipu() {
  const debug = { tried: [], sample: null, keys: [] };
  const items = [];
  for (const ent of ['chambers', 'parliaments']) {
    try {
      let url = `https://api.data.ipu.org/v1/${ent}?page%5Bsize%5D=100&page%5Bnumber%5D=1`;
      for (let page = 0; url && page < 10; page++) {
        const j = await get(url, { as: 'json', tries: 2 });
        debug.tried.push({ url, n: j?.data?.length ?? null, top: Object.keys(j || {}) });
        if (!j?.data?.length) break;
        items.push(...j.data.map(d => ({ ...d, _ent: ent })));
        if (!debug.sample) { debug.sample = JSON.stringify(j.data[0]).slice(0, 6000); debug.keys = Object.keys(j.data[0].attributes || {}); }
        url = j.links?.next ? (j.links.next.startsWith('http') ? j.links.next : `https://api.data.ipu.org${j.links.next}`) : null;
      }
      if (items.length) break;
    } catch (e) { debug.tried.push({ ent, error: e.message }); }
  }
  mkdirSync(join(ROOT, 'data/_debug'), { recursive: true });
  writeFileSync(join(ROOT, 'data/_debug/ipu.json'), JSON.stringify(debug, null, 1));
  const out = {};
  for (const it of items) {
    const iso = isoOf(it); if (!iso) continue;
    const a = it.attributes || {};
    const find = re => { for (const k of Object.keys(a)) if (re.test(k)) { const n = numOf(a[k]); if (n != null) return n; } return null; };
    const meanAge = find(/(mean|average)_?age/i);
    const under45 = find(/(45|youth).*(percent|pct|share|ratio)|(percent|pct|share).*(45|under_?4)/i);
    const salary = find(/salary|remuneration|allowance_basic/i);
    const prev = out[iso];
    // Prefer the lower/single chamber: keep the first one that has an age.
    if (!prev || (prev.meanAge == null && meanAge != null)) out[iso] = { meanAge, under45, salary };
  }
  log(`IPU: ${items.length} items, ${Object.values(out).filter(v => v.meanAge != null).length} with mean age`);
  return out;
}

export async function build() {
  const [women, femPop, medAge, ipuData] = await Promise.all([
    safe('WB women in parliament', () => wb('SG.GEN.PARL.ZS', 2015)),
    safe('WB female population', () => wb('SP.POP.TOTL.FE.ZS', 2015)),
    safe('OWID median age', () => owid('median-age', [/estimates/, /median_age/])),
    safe('IPU', ipu, {}),
  ]);
  const rows = [];
  for (const iso of new Set([...Object.keys(women), ...Object.keys(ipuData)])) {
    const w = latest(women[iso], 2018), f = latest(femPop[iso], 2018);
    const m = (medAge[iso] || []).filter(d => typeof d.y === 'number' && d.y <= new Date().getFullYear()).pop();
    const i = ipuData[iso] || {};
    if (!w && i.meanAge == null) continue;
    rows.push({ iso, women: round(w?.v, 1), womenY: w?.y ?? null, femPop: round(f?.v, 1), womenGap: w && f ? round(f.v - w.v, 1) : null, mpAge: round(i.meanAge, 1), medAge: round(m?.v, 1), ageGap: i.meanAge != null && m ? round(i.meanAge - m.v, 1) : null, under45: round(i.under45, 1) });
  }
  log(`giin: ${rows.length} countries, ${rows.filter(r => r.ageGap != null).length} with age gap`);
  if (rows.length < 50) throw new Error('too few rows');
  save('giin', {
    rows,
    sources: [
      WB_SRC('SG.GEN.PARL.ZS', 'Proportion of seats held by women in national parliaments (IPU)'),
      WB_SRC('SP.POP.TOTL.FE.ZS', 'Population, female (% of total)'),
      { name: 'IPU Parline – age of parliamentarians', url: 'https://data.ipu.org/' },
      OWID_SRC('median-age', 'Median age (UN World Population Prospects)'),
    ],
  });
}
