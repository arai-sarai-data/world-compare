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
  const out = {};
  const pickNum = (a, k) => numOf(a[k]);
  debug.fields = {};
  // Lower or single chamber first (ids like JP-LC01), then upper chambers fill gaps.
  items.sort((x, y) => (/-LC/.test(x.id) ? 0 : 1) - (/-LC/.test(y.id) ? 0 : 1));
  for (const it of items) {
    const iso = isoOf(it); if (!iso) continue;
    const a = it.attributes || {};
    if (['JP', 'US', 'FR', 'DE', 'KR'].includes(String(it.id).slice(0, 2)) && /-LC/.test(it.id)) debug.fields[it.id] = Object.fromEntries(['age_average', 'basic_salary', 'basic_salary_ppp', 'current_women_percent', 'total_younger_45_percentage', 'members_income_tax'].map(k => [k, JSON.stringify(a[k] ?? null).slice(0, 700)]));
    const rec = { meanAge: pickNum(a, 'age_average'), under45: pickNum(a, 'total_younger_45_percentage'), salaryPpp: pickNum(a, 'basic_salary_ppp'), womenPct: pickNum(a, 'current_women_percent'), chamber: it.id };
    if (!out[iso]) out[iso] = rec;
    else for (const k of ['meanAge', 'under45', 'salaryPpp']) if (out[iso][k] == null && rec[k] != null) out[iso][k] = rec[k];
  }
  writeFileSync(join(ROOT, 'data/_debug/ipu.json'), JSON.stringify(debug, null, 1));
  log(`IPU: ${items.length} items, ${Object.values(out).filter(v => v.meanAge != null).length} with mean age, ${Object.values(out).filter(v => v.salaryPpp != null).length} with salary`);
  return out;
}

export async function build() {
  const [women, femPop, medAge, gdpPpp, ipuData] = await Promise.all([
    safe('WB women in parliament', () => wb('SG.GEN.PARL.ZS', 2015)),
    safe('WB female population', () => wb('SP.POP.TOTL.FE.ZS', 2015)),
    safe('OWID median age', () => owid('median-age', [/estimates/, /median_age/])),
    safe('WB GDP per capita PPP', () => wb('NY.GDP.PCAP.PP.CD', 2018)),
    safe('IPU', ipu, {}),
  ]);
  const rows = [];
  for (const iso of new Set([...Object.keys(women), ...Object.keys(ipuData)])) {
    const w = latest(women[iso], 2018), f = latest(femPop[iso], 2018);
    const m = (medAge[iso] || []).filter(d => typeof d.y === 'number' && d.y <= new Date().getFullYear()).pop();
    const i = ipuData[iso] || {};
    if (!w && i.meanAge == null) continue;
    const g = latest(gdpPpp[iso], 2018);
    let payX = i.salaryPpp != null && g ? i.salaryPpp / g.v : null;
    if (payX != null && (payX < 0.2 || payX > 80)) payX = null;
    rows.push({ iso, women: round(w?.v, 1), womenY: w?.y ?? null, femPop: round(f?.v, 1), womenGap: w && f ? round(f.v - w.v, 1) : null, mpAge: round(i.meanAge, 1), medAge: round(m?.v, 1), ageGap: i.meanAge != null && m ? round(i.meanAge - m.v, 1) : null, under45: round(i.under45, 1), pay: round(i.salaryPpp, 0), gdp: round(g?.v, 0), payX: round(payX, 1) });
  }
  log(`giin: ${rows.length} countries, ${rows.filter(r => r.ageGap != null).length} with age gap, ${rows.filter(r => r.payX != null).length} with pay`);
  if (rows.length < 50) throw new Error('too few rows');
  save('giin', {
    rows,
    sources: [
      WB_SRC('SG.GEN.PARL.ZS', 'Proportion of seats held by women in national parliaments (IPU)'),
      WB_SRC('SP.POP.TOTL.FE.ZS', 'Population, female (% of total)'),
      { name: 'IPU Parline – average age, basic salary of MPs (PPP)', url: 'https://data.ipu.org/' },
      WB_SRC('NY.GDP.PCAP.PP.CD', 'GDP per capita, PPP (current international $)'),
      OWID_SRC('median-age', 'Median age (UN World Population Prospects)'),
    ],
  });
}
