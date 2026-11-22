// 06 Where could I live? Visa rules for every passport (Passport Index dataset) + cost, safety, internet, climate.
import { get, csv, wb, owid, safe, latest, round, save, log, readRaw, isCountry, WB_SRC, OWID_SRC } from './util.mjs';

const PASSPORT = 'https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-tidy-iso3.csv';
const code = req => {
  const r = String(req).trim().toLowerCase();
  if (r === '-1') return '-';
  if (/^\d+$/.test(r) || r === 'visa free') return 'F';
  if (r === 'visa on arrival') return 'A';
  if (r === 'e-visa' || r === 'eta') return 'E';
  if (r === 'no admission') return 'X';
  return 'V';
};

export async function build() {
  const pText = await safe('Passport Index (GitHub)', () => get(PASSPORT), null) || readRaw('passport.csv');
  const prs = csv(pText).filter(r => isCountry(r.Passport) && isCountry(r.Destination));
  const list = [...new Set(prs.flatMap(r => [r.Passport, r.Destination]))].sort();
  const idx = Object.fromEntries(list.map((c, i) => [c, i]));
  const m = {}, days = {};
  for (const r of prs) {
    (m[r.Passport] ||= Array(list.length).fill('?'))[idx[r.Destination]] = code(r.Requirement);
    if (/^\d+$/.test(r.Requirement.trim())) (days[r.Passport] ||= {})[r.Destination] = +r.Requirement;
  }
  const visa = { list, m: Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v.join('')])), days };
  log(`sumeru: passports ${Object.keys(m).length} x ${list.length}`);

  const [ppp, fx, hom, net, life, temp] = await Promise.all([
    safe('WB PPP', () => wb('PA.NUS.PRVT.PP', 2015)),
    safe('WB FX', () => wb('PA.NUS.FCRF', 2015)),
    safe('WB homicide', () => wb('VC.IHR.PSRC.P5', 2012)),
    safe('WB internet', () => wb('IT.NET.USER.ZS', 2015)),
    safe('WB life', () => wb('SP.DYN.LE00.IN', 2015)),
    safe('OWID temperature', () => owid('average-monthly-surface-temperature', /temperature/)),
  ]);
  const thisYear = new Date().getUTCFullYear();
  const rows = [];
  for (const iso of list) {
    // Price level: PPP factor / exchange rate in the same year, relative to the US (=100).
    let price = null, priceY = null;
    for (let i = (ppp[iso] || []).length - 1; i >= 0 && price == null; i--) {
      const p = ppp[iso][i], f = fx[iso]?.find(d => d.y === p.y);
      if (f && f.v > 0) { price = p.v / f.v * 100; priceY = p.y; }
    }
    let t = null, tMin = null, tMax = null;
    const ts = (temp[iso] || []).filter(d => { const y = +String(d.y).slice(0, 4); return y >= thisYear - 11 && y < thisYear - 1; });
    if (ts.length >= 60) {
      const byM = {};
      for (const d of ts) (byM[String(d.y).slice(5, 7)] ||= []).push(d.v);
      const mm = Object.values(byM).map(a => a.reduce((s, v) => s + v, 0) / a.length);
      t = mm.reduce((s, v) => s + v, 0) / mm.length; tMin = Math.min(...mm); tMax = Math.max(...mm);
    }
    const h = latest(hom[iso], 2012), n = latest(net[iso], 2015), l = latest(life[iso], 2015);
    rows.push({ iso, price: round(price, 0), priceY, hom: round(h?.v, 1), homY: h?.y ?? null, net: round(n?.v, 0), life: round(l?.v, 1), t: round(t, 1), tMin: round(tMin, 1), tMax: round(tMax, 1) });
  }
  log(`sumeru: ${rows.filter(r => r.price != null).length} with price, ${rows.filter(r => r.t != null).length} with temperature`);
  save('sumeru', {
    rows, visa,
    sources: [
      { name: 'Passport Index dataset (Ilya Ilyankou), based on Passport Index', url: 'https://github.com/ilyankou/passport-index-dataset' },
      WB_SRC('PA.NUS.PRVT.PP', 'PPP conversion factor, private consumption (LCU per international $)'),
      WB_SRC('PA.NUS.FCRF', 'Official exchange rate'),
      WB_SRC('VC.IHR.PSRC.P5', 'Intentional homicides per 100,000'),
      WB_SRC('IT.NET.USER.ZS', 'Individuals using the Internet (% of population)'),
      WB_SRC('SP.DYN.LE00.IN', 'Life expectancy at birth'),
      OWID_SRC('average-monthly-surface-temperature', 'Average monthly surface temperature (Copernicus ERA5)'),
    ],
  });
}
