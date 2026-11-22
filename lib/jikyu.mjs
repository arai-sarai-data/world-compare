// 01 What does an hour of work buy? ILO earnings & hours + Economist Big Mac prices + World Bank PPP/CPI.
import { gunzipSync } from 'node:zlib';
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

  // ILO renames indicators from time to time: read the table of contents and try every monthly-earnings table in local currency.
  let cands = ['EAR_4MTH_SEX_ECO_CUR_NB_A', 'EAR_4MTH_SEX_OCU_CUR_NB_A', 'EAR_4MTH_SEX_CUR_NB_A'];
  const toc = await safe('ILO toc', async () => {
    const buf = await get('https://rplumber.ilo.org/metadata/toc/indicator/?lang=en&format=.csv', { as: 'buf', tries: 2 });
    const text = (buf[0] === 0x1f && buf[1] === 0x8b) ? gunzipSync(buf).toString('utf8') : buf.toString('utf8');
    return csv(text);
  }, []);
  if (toc.length) {
    const idKey = Object.keys(toc[0]).find(k => /^id$|indicator$/i.test(k)) || Object.keys(toc[0])[0];
    const ids = toc.map(r => r[idKey]).filter(i => /^EAR_/.test(i));
    log(`ILO toc: ${toc.length} entries, earnings ids: ${ids.join(' ').slice(0, 1500)}`);
    const found = ids.filter(i => /^EAR_4MTH_SEX(_ECO|_OCU)?_CUR_NB_A$/.test(i) || /^EAR_4MTH_SEX(_ECO|_OCU)?_NB_A$/.test(i));
    if (found.length) cands = [...new Set([...found.sort((a, b) => (/_ECO_/.test(a) ? 0 : 1) - (/_ECO_/.test(b) ? 0 : 1)), ...cands])];
  }
  let earnRows = [];
  for (const id of cands) {
    earnRows = await safe(`ILO earnings ${id}`, () => ilo(id, r => r.sex === 'SEX_T' && (!r.classif1 || /TOTAL$|^CUR_TYPE_LCU$/.test(r.classif1)) && (!r.classif2 || r.classif2 === 'CUR_TYPE_LCU' || /TOTAL$/.test(r.classif2)) && (r.classif1 === 'CUR_TYPE_LCU' || r.classif2 === 'CUR_TYPE_LCU' || /_LCU$/.test(id))), []);
    if (earnRows.length) break;
  }
  const hourRows = await safe('ILO hours', () => ilo('HOW_TEMP_SEX_ECO_NB_A', r => r.sex === 'SEX_T' && /^ECO_(AGGREGATE|SECTOR|ISIC4)_TOTAL$/.test(r.classif1)), []);
  const pick = rows => {
    const m = {};
    for (const r of rows) { const iso = r.ref_area, y = +r.time, v = num(r.obs_value); if (!isCountry(iso) || v == null || !y) continue; if (!m[iso] || y > m[iso].y) m[iso] = { y, v }; }
    return m;
  };
  const earn = pick(earnRows), hours = pick(hourRows);
  const [ppp, cpi, fx] = await Promise.all([
    safe('WB PPP', () => wb('PA.NUS.PRVT.PP', 2015)),
    safe('WB CPI', () => wb('FP.CPI.TOTL', 2012)),
    safe('WB FX', () => wb('PA.NUS.FCRF', 2015)),
  ]);
  if (!Object.keys(earn).length) throw new Error('no earnings data');

  const rows = [];
  for (const iso of new Set([...Object.keys(earn), ...Object.keys(big)])) {
    const e = earn[iso]; if (!e || e.y < 2015) continue;
    const c = cpi[iso] || [];
    const cLast = latest(c), cAt = c.find(d => d.y === e.y);
    const adj = cLast && cAt && cLast.y > e.y ? cLast.v / cAt.v : 1;
    const c3 = c.length >= 4 ? Math.pow(c[c.length - 1].v / c[c.length - 4].v, 1 / 3) - 1 : null;
    const h = hours[iso] && hours[iso].v > 15 && hours[iso].v < 70 ? hours[iso] : null;
    const wk = h ? h.v : 40;
    const monthlyHours = wk * 52 / 12;
    const hourly = e.v * adj / monthlyHours;
    const b = big[iso];
    const p = lastOf(ppp, iso, 2018);
    const row = {
      iso, earn: round(e.v, 0), earnY: e.y, adjTo: cLast && adj !== 1 ? cLast.y : e.y, hours: round(wk, 1), hoursEst: !h,
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
      { name: 'ILOSTAT – Average monthly earnings of employees by economic activity (EAR_4MTH_SEX_ECO_CUR_NB)', url: 'https://ilostat.ilo.org/data/' },
      { name: 'ILOSTAT – Mean weekly hours actually worked (HOW_TEMP_SEX_ECO_NB)', url: 'https://ilostat.ilo.org/data/' },
      { name: 'The Economist – Big Mac index', url: 'https://github.com/TheEconomist/big-mac-data' },
      WB_SRC('PA.NUS.PRVT.PP', 'PPP conversion factor, private consumption (LCU per international $)'),
      WB_SRC('FP.CPI.TOTL', 'Consumer price index'),
    ],
  });
}
