// 01 What does an hour of work buy? ILO earnings & hours + Economist Big Mac prices + World Bank PPP/CPI.
import { get, csv, num, wb, safe, ilo, lastOf, latest, round, readRaw, save, log, isCountry, WB_SRC } from './util.mjs';

const BIGMAC = 'https://raw.githubusercontent.com/TheEconomist/big-mac-data/master/output-data/big-mac-raw-index.csv';
const EURO = ['AUT', 'BEL', 'HRV', 'CYP', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'PRT', 'SVK', 'SVN', 'ESP'];

export async function build() {
  const bmText = await safe('Big Mac (GitHub)', () => get(BIGMAC), null) || readRaw('bigmac.csv');
  const bmRows = csv(bmText);
  const big = {};
  for (const r of bmRows) {
    const iso = r.iso_a3; if (!isCountry(iso) || num(r.local_price) == null) continue;
    if (!big[iso] || r.date > big[iso].date) big[iso] = { date: r.date, price: +r.local_price, usd: +r.dollar_price, cur: r.currency_code };
  }
  // The Economist reports one euro-area price; use it for euro members without their own price.
  for (const r of bmRows) if (r.iso_a3 === 'EUZ' && (!big._euz || r.date > big._euz.date)) big._euz = { date: r.date, price: +r.local_price, usd: +r.dollar_price, cur: 'EUR' };
  for (const e of EURO) if (!big[e] && big._euz) big[e] = { ...big._euz, euroArea: true };

  // ILOSTAT: average hourly earnings (EHRA) and average monthly earnings (EMTA) of employees, local currency.
  const total = r => r.sex === 'SEX_T' && !r.classif1;
  const hourlyRows = await safe('ILO hourly earnings', () => ilo('EAR_EHRA_SEX_NB_A', total), []);
  const earnRows = await safe('ILO monthly earnings', () => ilo('EAR_EMTA_SEX_NB_A', total), []);
  const hourRows = await safe('ILO hours', () => ilo('HOW_TEMP_SEX_ECO_NB_A', r => r.sex === 'SEX_T' && /^ECO_(AGGREGATE|SECTOR|ISIC4)_TOTAL$/.test(r.classif1)), []);
  const pick = rows => {
    const m = {};
    for (const r of rows) { const iso = r.ref_area, y = +r.time, v = num(r.obs_value); if (!isCountry(iso) || v == null || !y) continue; if (!m[iso] || y > m[iso].y) m[iso] = { y, v }; }
    return m;
  };
  const earn = pick(earnRows), hours = pick(hourRows), hourlyE = pick(hourlyRows);
  const [ppp, cpi, fx] = await Promise.all([
    safe('WB PPP', () => wb('PA.NUS.PRVT.PP', 2015)),
    safe('WB CPI', () => wb('FP.CPI.TOTL', 2012)),
    safe('WB FX', () => wb('PA.NUS.FCRF', 2015)),
  ]);
  if (!Object.keys(earn).length && !Object.keys(hourlyE).length) throw new Error('no earnings data');

  const rows = [];
  for (const iso of new Set([...Object.keys(earn), ...Object.keys(hourlyE)])) {
    // Prefer measured hourly earnings; otherwise monthly earnings divided by weekly hours.
    const eh = hourlyE[iso], em = earn[iso];
    const useH = eh && eh.y >= 2015 && (!em || eh.y >= em.y - 1);
    const e = useH ? eh : em; if (!e || e.y < 2015) continue;
    const c = cpi[iso] || [];
    const cLast = latest(c), cAt = c.find(d => d.y === e.y);
    const adj = cLast && cAt && cLast.y > e.y ? cLast.v / cAt.v : 1;
    const c3 = c.length >= 4 ? Math.pow(c[c.length - 1].v / c[c.length - 4].v, 1 / 3) - 1 : null;
    const h = hours[iso] && hours[iso].v > 15 && hours[iso].v < 70 ? hours[iso] : null;
    const wk = h ? h.v : 40;
    const hourly = useH ? e.v * adj : e.v * adj / (wk * 52 / 12);
    const b = big[iso];
    const p = lastOf(ppp, iso, 2018);
    const row = {
      iso, basis: useH ? 'h' : 'm', earn: round(e.v, 2), earnY: e.y, adjTo: cLast && adj !== 1 ? cLast.y : e.y, hours: round(wk, 1), hoursEst: !useH && !h,
      hourly: round(hourly, 2), ppp: p ? round(p.v, 4) : null, pppY: p?.y ?? null, infl: round(c3 == null ? null : c3 * 100, 1),
      bm: b ? b.price : null, bmDate: b?.date ?? null, euroArea: !!b?.euroArea,
      fx: round(lastOf(fx, iso, 2018)?.v, 4),
    };
    row.bmMin = row.bm ? round(row.bm / hourly * 60, 1) : null;
    row.hourlyUsdPpp = p ? round(hourly / p.v, 2) : null;
    // Plausibility: high inflation or currency changes make the comparison unreliable.
    row.unreliable = (row.infl != null && row.infl > 25) || (row.bmMin != null && (row.bmMin < 2 || row.bmMin > 400)) || (row.hourlyUsdPpp != null && (row.hourlyUsdPpp < 0.3 || row.hourlyUsdPpp > 120));
    rows.push(row);
  }
  log(`jikyu: ${rows.length} countries, ${rows.filter(r => r.bmMin).length} with Big Mac, ${rows.filter(r => r.unreliable).length} flagged`);
  save('jikyu', {
    rows,
    sources: [
      { name: 'ILOSTAT – Average hourly earnings of employees (EAR_EHRA_SEX_NB)', url: 'https://ilostat.ilo.org/data/' },
      { name: 'ILOSTAT – Average monthly earnings of employees (EAR_EMTA_SEX_NB)', url: 'https://ilostat.ilo.org/data/' },
      { name: 'ILOSTAT – Mean weekly hours actually worked (HOW_TEMP_SEX_ECO_NB)', url: 'https://ilostat.ilo.org/data/' },
      { name: 'The Economist – Big Mac index', url: 'https://github.com/TheEconomist/big-mac-data' },
      WB_SRC('PA.NUS.PRVT.PP', 'PPP conversion factor, private consumption (LCU per international $)'),
      WB_SRC('FP.CPI.TOTL', 'Consumer price index'),
    ],
  });
}
