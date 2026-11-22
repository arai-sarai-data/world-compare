// 04 Aid and UN votes: bilateral aid from five donors (OECD DAC via World Bank) vs. agreement with each donor in UN General Assembly roll calls.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { get, csv, wb, safe, round, save, log, readRaw, ROOT, COUNTRIES, WB_SRC } from './util.mjs';

const TT = 'https://raw.githubusercontent.com/rfordatascience/tidytuesday/main/data/2021/2021-03-23/';
export const DONORS = { USA: 'DC.DAC.USAL.CD', JPN: 'DC.DAC.JPNL.CD', GBR: 'DC.DAC.GBRL.CD', FRA: 'DC.DAC.FRAL.CD', DEU: 'DC.DAC.DEUL.CD' };
const REF = ['CHN', 'RUS'];
const FROM = 2010, TO = 2019;

export async function build() {
  const local = f => existsSync(join(ROOT, 'raw', f)) ? readRaw(f) : null;
  const votesText = local('unvotes.csv') || await get(TT + 'unvotes.csv', { timeout: 300000 });
  const callsText = local('roll_calls.csv') || await get(TT + 'roll_calls.csv');
  const a2to3 = Object.fromEntries(Object.entries(COUNTRIES).map(([k, v]) => [v.a2, k]));
  const calls = new Set(csv(callsText).filter(r => { const y = +r.date.slice(0, 4); return y >= FROM && y <= TO; }).map(r => r.rcid));
  // votes[rcid][iso3] = 'yes'|'no'|'abstain'
  const votes = {};
  let maxDate = '';
  for (const line of votesText.split('\n')) {
    const m = line.match(/^(\d+),(?:"[^"]*"|[^,]*),([A-Z]{2}),(yes|no|abstain)\r?$/);
    if (!m || !calls.has(m[1])) continue;
    const iso = a2to3[m[2]]; if (!iso) continue;
    (votes[m[1]] ||= {})[iso] = m[3];
  }
  for (const r of csv(callsText)) if (calls.has(r.rcid) && r.date > maxDate) maxDate = r.date;
  const rcids = Object.keys(votes);
  const members = new Set(rcids.flatMap(r => Object.keys(votes[r])));
  const agree = {};
  for (const iso of members) {
    agree[iso] = {};
    for (const d of [...Object.keys(DONORS), ...REF]) {
      let same = 0, both = 0;
      for (const r of rcids) { const a = votes[r][iso], b = votes[r][d]; if (a && b) { both++; if (a === b) same++; } }
      agree[iso][d] = both >= 50 ? round(same / both * 100, 1) : null;
    }
  }
  log(`enjo: ${rcids.length} roll calls ${FROM}-${TO}, ${members.size} countries`);

  const pop = await safe('WB population', () => wb('SP.POP.TOTL', FROM), {});
  const aid = {};
  for (const [d, ind] of Object.entries(DONORS)) aid[d] = await safe(`WB ${ind}`, () => wb(ind, FROM), {});
  const rows = [];
  for (const iso of members) {
    const p = pop[iso]?.find(x => x.y === 2015)?.v ?? pop[iso]?.[0]?.v ?? null;
    const row = { iso, pop: p, agree: agree[iso], aid: {} };
    for (const d in DONORS) {
      const s = (aid[d][iso] || []).filter(x => x.y >= FROM && x.y <= TO);
      row.aid[d] = s.length ? round(s.reduce((a, x) => a + x.v, 0), 0) : null;
    }
    rows.push(row);
  }
  const haveAid = Object.values(aid).some(m => Object.keys(m).length > 20);
  if (!haveAid) log('enjo: WARNING aid data missing');
  save('enjo', {
    rows, period: [FROM, TO], lastVote: maxDate, rollCalls: rcids.length, donors: Object.keys(DONORS), ref: REF,
    sources: [
      { name: 'Erik Voeten, United Nations General Assembly Voting Data (Harvard Dataverse), via TidyTuesday 2021-03-23', url: 'https://dataverse.harvard.edu/dataset.xhtml?persistentId=hdl:1902.1/12379' },
      ...Object.entries(DONORS).map(([d, ind]) => WB_SRC(ind, `Net bilateral aid flows from DAC donors, ${COUNTRIES[d].en} (current US$)`)),
      WB_SRC('SP.POP.TOTL', 'Population, total'),
    ],
  });
}
