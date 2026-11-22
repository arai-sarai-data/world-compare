// Shared data helpers: fetching with retries, CSV parsing, World Bank / OWID / ILO readers, output.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const COUNTRIES = JSON.parse(readFileSync(join(ROOT, 'assets/countries.json'), 'utf8'));
export const isCountry = iso => !!COUNTRIES[iso];
const LOG = [];
export const log = (...a) => { const s = a.join(' '); LOG.push(s); console.log(s); };
export const getLog = () => LOG;

export async function get(url, { tries = 3, as = 'text', timeout = 120000 } = {}) {
  if (process.env.OFFLINE && !/githubusercontent\.com/.test(url)) throw new Error('offline');
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeout);
      const r = await fetch(url, { signal: ctl.signal, headers: { 'User-Agent': 'world-compare (+https://github.com/arai-sarai-data/world-compare)', 'Accept-Encoding': 'gzip' } });
      clearTimeout(t);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      if (as === 'json') return await r.json();
      if (as === 'buf') return Buffer.from(await r.arrayBuffer());
      return await r.text();
    } catch (e) { last = e; await new Promise(r => setTimeout(r, 3000 * (i + 1))); }
  }
  throw new Error(`${url}: ${last?.message}`);
}

export function csv(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f.replace(/\r$/, '')); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f.length || row.length) { row.push(f.replace(/\r$/, '')); rows.push(row); }
  const head = rows.shift().map(h => h.replace(/^﻿/, ''));
  return rows.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

export const num = v => (v === '' || v == null || Number.isNaN(+v)) ? null : +v;

// World Bank indicator -> { ISO3: [{y, v}] } sorted by year
const wbCache = {};
export async function wb(ind, from = 2000) {
  if (wbCache[ind]) return wbCache[ind];
  const out = {};
  let page = 1, pages = 1;
  do {
    const j = await get(`https://api.worldbank.org/v2/country/all/indicator/${ind}?format=json&per_page=2000&date=${from}:2030&page=${page}`, { as: 'json', tries: 6 });
    if (!Array.isArray(j) || !j[1]) throw new Error(`World Bank ${ind}: empty ${JSON.stringify(j).slice(0, 200)}`);
    pages = j[0].pages;
    for (const d of j[1]) {
      const iso = d.countryiso3code; if (!isCountry(iso) || d.value == null) continue;
      (out[iso] ||= []).push({ y: +d.date, v: +d.value });
    }
  } while (++page <= pages);
  for (const k in out) out[k].sort((a, b) => a.y - b.y);
  log(`WB ${ind}: ${Object.keys(out).length} countries`);
  return (wbCache[ind] = out);
}
// Try a source; on failure log and return fallback.
export async function safe(label, fn, fallback = {}) {
  try { return await fn(); } catch (e) { log(`FAILED ${label}: ${e.message}`); return fallback; }
}

// OWID grapher CSV -> { ISO3: [{y, v}] } using the column picked by `col` (string or regexp) or the first value column.
export async function owid(slug, col = null) {
  const text = await get(`https://ourworldindata.org/grapher/${slug}.csv?v=1&csvType=full&useColumnShortNames=true`);
  const rows = csv(text);
  const keys = Object.keys(rows[0] || {});
  const timeKey = keys.includes('year') ? 'year' : keys.includes('month') ? 'month' : keys.includes('day') ? 'day' : null;
  const vals = keys.filter(k => !['entity', 'code', 'year', 'month', 'day'].includes(k) && !k.endsWith('__annotations'));
  const pats = col == null ? [] : Array.isArray(col) ? col : [col];
  const key = !pats.length ? vals[0] : pats.map(p => typeof p === 'string' ? (vals.includes(p) ? p : null) : vals.find(k => p.test(k))).find(Boolean);
  if (!key) throw new Error(`OWID ${slug}: no column (${vals.join(',')})`);
  const out = {};
  for (const r of rows) {
    const iso = r.code, v = num(r[key]); if (!isCountry(iso) || v == null) continue;
    (out[iso] ||= []).push({ y: timeKey === 'year' ? +r.year : r[timeKey], v });
  }
  log(`OWID ${slug} [${key}]: ${Object.keys(out).length} countries`);
  return out;
}

// ILOSTAT bulk CSV for one indicator. filter(row) keeps rows. Returns raw rows.
export async function ilo(id, filter = () => true) {
  const urls = [
    `https://rplumber.ilo.org/data/indicator/?id=${id}&lang=en&type=code&format=.csv.gz`,
    `https://rplumber.ilo.org/data/indicator/?id=${id}&lang=en&type=code&format=.csv`,
    `https://rplumber.ilo.org/files/website/bulk/indicator/${id}.csv.gz`,
  ];
  let lastErr;
  for (const u of urls) {
    try {
      const buf = await get(u, { as: 'buf', tries: 2, timeout: 180000 });
      const text = (buf[0] === 0x1f && buf[1] === 0x8b) ? gunzipSync(buf).toString('utf8') : buf.toString('utf8');
      if (!text.startsWith('ref_area') && !text.replace(/^﻿/, '').startsWith('"ref_area"') && !/^﻿?"?ref_area/.test(text)) throw new Error('unexpected format: ' + text.slice(0, 80).replace(/\s+/g, ' '));
      const all = csv(text);
      if (process.env.ILO_PEEK) for (const c of process.env.ILO_PEEK.split(',')) { const rs = all.filter(r => r.ref_area === c); log(`ILO ${id} peek ${c}: ${rs.length} rows; ${[...new Set(rs.map(r => [r.sex, r.classif1, r.classif2].join('/')))].slice(0, 12).join(' ')} ; years ${[...new Set(rs.map(r => r.time))].slice(-5).join(' ')}`); }
      const rows = all.filter(filter);
      if (!rows.length) { const cnt = k => [...new Set(all.slice(0, 20000).map(r => r[k]))].slice(0, 15).join(' '); log(`ILO ${id}: 0 rows after filter. sex: ${cnt('sex')} | classif1: ${cnt('classif1')} | classif2: ${cnt('classif2')}`); }
      log(`ILO ${id} via ${u.split('?')[0]}: ${rows.length} rows`);
      return rows;
    } catch (e) { lastErr = e; log(`ILO try ${u}: ${e.message}`); }
  }
  throw lastErr;
}

export const latest = (series, minYear = 0) => { if (!series) return null; for (let i = series.length - 1; i >= 0; i--) if (series[i].y >= minYear) return series[i]; return null; };
export const lastOf = (map, iso, minYear = 0) => latest(map?.[iso], minYear);
export function mean(series, from, to) {
  const s = (series || []).filter(d => d.y >= from && d.y <= to); if (!s.length) return null;
  return s.reduce((a, d) => a + d.v, 0) / s.length;
}
export const round = (v, d = 2) => v == null || !isFinite(v) ? null : Math.round(v * 10 ** d) / 10 ** d;

export function readRaw(file) { return readFileSync(join(ROOT, 'raw', file), 'utf8'); }

export function save(id, obj) {
  if (!obj.rows || obj.rows.length < 20) throw new Error(`${id}: only ${obj.rows?.length ?? 0} rows, keeping previous file`);
  const dir = join(ROOT, 'data'); if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const out = { updated: new Date().toISOString().slice(0, 10), ...obj };
  writeFileSync(join(dir, `${id}.json`), JSON.stringify(out));
  log(`saved data/${id}.json (${out.rows?.length ?? '?'} rows)`);
}
export function previous(id) {
  const f = join(ROOT, 'data', `${id}.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
}

export const WB_SRC = (ind, label) => ({ name: `World Bank – ${label} (${ind})`, url: `https://data.worldbank.org/indicator/${ind}` });
export const OWID_SRC = (slug, label) => ({ name: `Our World in Data – ${label}`, url: `https://ourworldindata.org/grapher/${slug}` });
