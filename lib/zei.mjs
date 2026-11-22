// 02 Value for tax: tax burden (UNU-WIDER via OWID, fallback World Bank) vs public outcomes (World Bank).
import { wb, owid, safe, latest, mean, round, save, log, WB_SRC, OWID_SRC } from './util.mjs';

export const OUTCOMES = [
  ['life', 'SP.DYN.LE00.IN', 1, 'Life expectancy at birth'],
  ['u5', 'SH.DYN.MORT', -1, 'Under-5 mortality rate'],
  ['homicide', 'VC.IHR.PSRC.P5', -1, 'Intentional homicides per 100,000'],
  ['learn', 'HD.HCI.HLOS', 1, 'Harmonized test scores'],
  ['water', 'SH.H2O.SMDW.ZS', 1, 'Safely managed drinking water (% of population)'],
  ['net', 'IT.NET.USER.ZS', 1, 'Internet users (% of population)'],
  ['pm25', 'EN.ATM.PM25.MC.M3', -1, 'PM2.5 air pollution, mean annual exposure'],
];

function pctRank(values) { // map iso -> 0..100
  const arr = Object.entries(values).sort((a, b) => a[1] - b[1]);
  const n = arr.length, out = {};
  arr.forEach(([iso], i) => { out[iso] = n > 1 ? (i / (n - 1)) * 100 : 50; });
  return out;
}

export async function build() {
  let taxSrc = 'owid';
  let tax = await safe('OWID tax', () => owid('tax-revenues-as-a-share-of-gdp-unu-wider', /tax/i), {});
  if (Object.keys(tax).length < 80) { taxSrc = 'wb'; tax = await wb('GC.TAX.TOTL.GD.ZS', 2012); }
  const series = {};
  for (const [k, ind] of OUTCOMES) series[k] = await safe(`WB ${ind}`, () => wb(ind, 2010), {});

  const raw = {}, pr = {};
  for (const [k, , dir] of OUTCOMES) {
    raw[k] = {};
    for (const iso in series[k]) { const l = latest(series[k][iso], 2012); if (l) raw[k][iso] = l; }
    const vals = Object.fromEntries(Object.entries(raw[k]).map(([i, l]) => [i, dir * l.v]));
    pr[k] = pctRank(vals);
  }
  const rows = [];
  for (const iso in tax) {
    const s = tax[iso].filter(d => d.y >= 2015); if (!s.length) continue;
    const lastY = s[s.length - 1].y;
    const t = mean(s, lastY - 2, lastY);
    if (t == null || t < 1 || t > 70) continue;
    const parts = {}; let sum = 0, n = 0;
    for (const [k] of OUTCOMES) if (pr[k][iso] != null) { parts[k] = { v: round(raw[k][iso].v, 2), y: raw[k][iso].y, p: round(pr[k][iso], 0) }; sum += pr[k][iso]; n++; }
    if (n < 5) continue;
    rows.push({ iso, tax: round(t, 1), taxY: lastY, score: round(sum / n, 1), n, parts });
  }
  // Expected outcome score at each tax level (least squares); residual = value for tax.
  const xs = rows.map(r => r.tax), ys = rows.map(r => r.score), nn = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / nn, my = ys.reduce((a, b) => a + b, 0) / nn;
  let sxy = 0, sxx = 0; for (let i = 0; i < nn; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const b = sxy / sxx, a = my - b * mx;
  for (const r of rows) { r.expected = round(a + b * r.tax, 1); r.gap = round(r.score - r.expected, 1); }
  log(`zei: ${rows.length} countries (tax from ${taxSrc}), fit a=${a.toFixed(2)} b=${b.toFixed(3)}`);
  save('zei', {
    rows, fit: { a: round(a, 3), b: round(b, 4) }, taxSrc,
    sources: [
      taxSrc === 'owid' ? OWID_SRC('tax-revenues-as-a-share-of-gdp-unu-wider', 'Tax revenues as a share of GDP (UNU-WIDER Government Revenue Dataset)') : WB_SRC('GC.TAX.TOTL.GD.ZS', 'Tax revenue (% of GDP)'),
      ...OUTCOMES.map(([, ind, , l]) => WB_SRC(ind, l)),
    ],
  });
}
