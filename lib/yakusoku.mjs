// 03 International pledges vs. actual numbers: NATO 2%, ODA 0.7% GNI, Abuja 15% health, Incheon education benchmark.
import { wb, owid, safe, latest, round, save, log, COUNTRIES, WB_SRC, OWID_SRC } from './util.mjs';

const NATO = 'ALB BEL BGR CAN HRV CZE DNK EST FIN FRA DEU GRC HUN ITA LVA LTU LUX MNE NLD MKD NOR POL PRT ROU SVK SVN ESP SWE TUR GBR USA'.split(' ');
const AFRICA = Object.keys(COUNTRIES).filter(i => COUNTRIES[i].r === 'Africa');

const near = (s, y) => s?.find(d => d.y === y)?.v ?? null;

export async function build() {
  const [mil, oda, health, eduGdp, eduBud] = await Promise.all([
    safe('WB military', () => wb('MS.MIL.XPND.GD.ZS', 2010)),
    safe('OWID ODA', () => owid('foreign-aid-given-as-a-share-of-national-income', /share_gni/)),
    safe('WB health', () => wb('SH.XPD.GHED.GE.ZS', 2010)),
    safe('WB edu GDP', () => wb('SE.XPD.TOTL.GD.ZS', 2010)),
    safe('WB edu budget', () => wb('SE.XPD.TOTL.GB.ZS', 2010)),
  ]);
  const rows = [];
  const add = (p, iso, series, target, minY) => {
    const l = latest(series?.[iso], minY); if (!l) return;
    const before = near(series[iso], l.y - 10);
    rows.push({ p, iso, v: round(l.v, 2), y: l.y, target, met: l.v >= target, before: round(before, 2), hist: series[iso].filter(d => d.y >= l.y - 14).map(d => [d.y, round(d.v, 2)]) });
  };
  for (const iso of NATO) add('nato', iso, mil, 2, 2018);
  for (const iso in oda) add('oda', iso, oda, 0.7, 2018);
  for (const iso of AFRICA) add('abuja', iso, health, 15, 2015);
  for (const iso in eduGdp) {
    const g = latest(eduGdp[iso], 2015), b = latest(eduBud?.[iso], 2015);
    if (!g && !b) continue;
    const met = (g && g.v >= 4) || (b && b.v >= 15);
    rows.push({ p: 'edu', iso, v: g ? round(g.v, 2) : null, y: g?.y ?? null, v2: b ? round(b.v, 2) : null, y2: b?.y ?? null, target: 4, target2: 15, met: !!met, before: g ? round(near(eduGdp[iso], g.y - 10), 2) : null, hist: (eduGdp[iso] || []).filter(d => g && d.y >= g.y - 14).map(d => [d.y, round(d.v, 2)]) });
  }
  const count = p => rows.filter(r => r.p === p).length;
  log(`yakusoku: nato ${count('nato')}, oda ${count('oda')}, abuja ${count('abuja')}, edu ${count('edu')}`);
  if (rows.length < 50) throw new Error('too few rows');
  save('yakusoku', {
    rows,
    sources: [
      WB_SRC('MS.MIL.XPND.GD.ZS', 'Military expenditure (% of GDP), SIPRI'),
      OWID_SRC('foreign-aid-given-as-a-share-of-national-income', 'Foreign aid given as a share of national income (OECD)'),
      WB_SRC('SH.XPD.GHED.GE.ZS', 'Domestic general government health expenditure (% of general government expenditure)'),
      WB_SRC('SE.XPD.TOTL.GD.ZS', 'Government expenditure on education (% of GDP)'),
      WB_SRC('SE.XPD.TOTL.GB.ZS', 'Government expenditure on education (% of government expenditure)'),
      { name: 'NATO Wales Summit Declaration (2014), para. 14', url: 'https://www.nato.int/cps/en/natohq/official_texts_112964.htm' },
      { name: 'UN General Assembly resolution 2626 (1970) – 0.7% ODA target', url: 'https://www.oecd.org/en/topics/sub-issues/oda-standards/the-0-7-odagni-target-a-history.html' },
      { name: 'Abuja Declaration (2001) – 15% of budget to health', url: 'https://www.who.int/publications/m/item/the-abuja-declaration-ten-years-on' },
      { name: 'Education 2030 Incheon Declaration and Framework for Action', url: 'https://unesdoc.unesco.org/ark:/48223/pf0000245656' },
    ],
  });
}
