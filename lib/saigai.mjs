// 07 Disaster gap: deaths and damages from natural disasters vs. what a country's income would predict.
import { wb, owid, safe, latest, round, save, log, WB_SRC, OWID_SRC } from './util.mjs';

const FROM = 2000;

export async function build() {
  const [death, dmg, gdp, expo] = await Promise.all([
    owid('death-rate-from-natural-disasters'),
    safe('OWID damages', () => owid('economic-damages-from-natural-disasters-as-a-share-of-gdp', /all_disasters/), {}),
    wb('NY.GDP.PCAP.PP.KD', 2015),
    safe('WB exposure', () => wb('EN.CLC.MDAT.ZS', 2000), {}),
  ]);
  const rows = [];
  for (const iso in death) {
    const s = death[iso].filter(d => d.y >= FROM); if (s.length < 10) continue;
    const y0 = s[0].y, y1 = s[s.length - 1].y;
    const rate = s.reduce((a, d) => a + d.v, 0) / s.length;
    const worst = s.reduce((a, d) => d.v > a.v ? d : a, s[0]);
    const g = latest(gdp[iso], 2015); if (!g) continue;
    const ds = (dmg[iso] || []).filter(d => d.y >= FROM);
    const dmgLastY = ds.length ? Math.max(...ds.map(d => d.y), y1) : null;
    const damage = ds.length ? ds.reduce((a, d) => a + d.v, 0) / (dmgLastY - FROM + 1) : null;
    const e = latest(expo[iso]);
    rows.push({ iso, rate: round(rate, 3), y0, y1, worstY: worst.y, worst: round(worst.v, 2), gdp: round(g.v, 0), damage: round(damage, 4), expo: round(e?.v, 2) });
  }
  // Expected death rate from income: log-log least squares.
  const L = rows.map(r => [Math.log10(r.gdp), Math.log10(r.rate + 0.01)]);
  const n = L.length, mx = L.reduce((a, p) => a + p[0], 0) / n, my = L.reduce((a, p) => a + p[1], 0) / n;
  let sxy = 0, sxx = 0; for (const [x, y] of L) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; }
  const b = sxy / sxx, a = my - b * mx;
  for (const r of rows) { const exp = Math.pow(10, a + b * Math.log10(r.gdp)) - 0.01; r.expected = round(Math.max(exp, 0.001), 3); r.ratio = round((r.rate + 0.01) / (r.expected + 0.01), 2); }
  log(`saigai: ${rows.length} countries, fit a=${a.toFixed(3)} b=${b.toFixed(3)}`);
  if (rows.length < 50) throw new Error('too few rows');
  save('saigai', {
    rows, fit: { a: round(a, 4), b: round(b, 4) },
    sources: [
      OWID_SRC('death-rate-from-natural-disasters', 'Death rate from natural disasters (WHO Global Health Estimates)'),
      OWID_SRC('economic-damages-from-natural-disasters-as-a-share-of-gdp', 'Economic damages from natural disasters as a share of GDP (EM-DAT)'),
      WB_SRC('NY.GDP.PCAP.PP.KD', 'GDP per capita, PPP (constant international $)'),
      WB_SRC('EN.CLC.MDAT.ZS', 'Droughts, floods, extreme temperatures (% of population, average 1990-2009)'),
    ],
  });
}
