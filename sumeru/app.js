import { boot, table, cname, name, fmt, countrySelect, defaultCountry, pickCountry, esc } from '../assets/common.js?v=3';

const dict = {
  ja: {
    title: 'このパスポートで、どこに住める？', lead: '自分のパスポートで入国しやすい国を、物価・治安・ネット・気候・寿命と一緒に一覧にしました。',
    passport: 'パスポート', entry: '入国', F: 'ビザ不要', A: '到着時ビザ', E: '電子ビザ', V: 'ビザが必要', X: '入国不可', days: '{d}日',
    fEntry: '入国のしやすさ', fFree: 'ビザ不要のみ', fEasy: '到着時・電子ビザも含む', fAll: 'すべて', fClimate: '気候', cAny: 'こだわらない', cCool: '涼しい（平均15℃未満）', cMild: '温暖（15〜22℃）', cWarm: '暑い（22℃以上）',
    nFree: 'ビザなしで行ける国', score: '総合', price: '物価', priceNote: '{c}=100', safety: '殺人率', net: 'ネット', temp: '気温', life: '寿命',
    hint: '総合は、物価の安さ・治安・ネット普及・寿命を世界の順位（0〜100）にして平均したものです。列名を押すと並べ替えられます。',
    method: '<p>入国条件はPassport Index（Ilya Ilyankouによる公開データ）です。観光目的の短期滞在の条件で、長期の居住や就労には別の許可が必要です。最新の条件は必ず各国の公式情報で確認してください。</p><p>物価は「購買力平価÷為替レート」で求めた物価水準を、選んだパスポートの国を100として表しています。治安は人口10万人あたりの殺人件数、ネットはインターネット利用者の割合（いずれも世界銀行）。気温は直近10年の年平均（Copernicus ERA5、Our World in Data経由）で、国土全体の平均なので首都の気温とは違います。</p>',
  },
  en: {
    title: 'Where could you live with your passport?', lead: 'Countries your passport opens easily, alongside cost of living, safety, internet, climate and life expectancy.',
    passport: 'Passport', entry: 'Entry', F: 'Visa-free', A: 'Visa on arrival', E: 'e-Visa', V: 'Visa required', X: 'No admission', days: '{d} days',
    fEntry: 'Entry', fFree: 'Visa-free only', fEasy: 'Incl. on-arrival and e-visa', fAll: 'All', fClimate: 'Climate', cAny: 'Any', cCool: 'Cool (under 15°C)', cMild: 'Mild (15–22°C)', cWarm: 'Hot (22°C+)',
    nFree: 'Visa-free destinations', score: 'Overall', price: 'Prices', priceNote: '{c} = 100', safety: 'Homicides', net: 'Internet', temp: 'Temp.', life: 'Life exp.',
    hint: 'Overall averages world percentiles (0–100) for low prices, safety, internet use and life expectancy. Click a column to sort.',
    method: '<p>Entry rules: Passport Index dataset by Ilya Ilyankou, for short tourist stays. Living or working needs separate permits; always check official sources.</p><p>Prices: price level (PPP ÷ exchange rate) with the passport country = 100. Safety: homicides per 100,000; internet: share of people online (World Bank). Temperature: 10-year national average (Copernicus ERA5 via Our World in Data), not the capital’s.</p>',
  },
  zh: {
    title: '用这本护照，可以住在哪里？', lead: '列出你的护照容易入境的国家，并附上物价、治安、网络、气候和寿命。',
    passport: '护照', entry: '入境', F: '免签', A: '落地签', E: '电子签', V: '需要签证', X: '禁止入境', days: '{d}天',
    fEntry: '入境难易', fFree: '仅免签', fEasy: '含落地签和电子签', fAll: '全部', fClimate: '气候', cAny: '不限', cCool: '凉爽（低于15℃）', cMild: '温和（15–22℃）', cWarm: '炎热（22℃以上）',
    nFree: '免签可去的国家', score: '综合', price: '物价', priceNote: '{c}=100', safety: '凶杀率', net: '网络', temp: '气温', life: '寿命',
    hint: '综合分为物价低、治安、网络普及、寿命四项世界百分位（0–100）的平均。点击列名可排序。',
    method: '<p>入境条件来自Passport Index（Ilya Ilyankou整理的公开数据），针对短期旅游。长期居住或工作需另行许可，请以各国官方信息为准。</p><p>物价为“购买力平价÷汇率”得出的物价水平，以护照所属国为100。治安为每10万人凶杀数，网络为上网人口比例（世界银行）。气温为近10年全国平均（Copernicus ERA5，经Our World in Data），不是首都气温。</p>',
  },
  ko: {
    title: '이 여권으로 어디에 살 수 있을까?', lead: '내 여권으로 들어가기 쉬운 나라를 물가·치안·인터넷·기후·수명과 함께 정리했습니다.',
    passport: '여권', entry: '입국', F: '무비자', A: '도착 비자', E: '전자 비자', V: '비자 필요', X: '입국 불가', days: '{d}일',
    fEntry: '입국 조건', fFree: '무비자만', fEasy: '도착·전자 비자 포함', fAll: '전체', fClimate: '기후', cAny: '상관없음', cCool: '선선함(15℃ 미만)', cMild: '온화함(15~22℃)', cWarm: '더움(22℃ 이상)',
    nFree: '무비자로 갈 수 있는 나라', score: '종합', price: '물가', priceNote: '{c}=100', safety: '살인율', net: '인터넷', temp: '기온', life: '수명',
    hint: '종합은 물가가 낮음·치안·인터넷 보급·수명을 세계 백분위(0~100)로 바꿔 평균한 값입니다. 열 이름을 누르면 정렬됩니다.',
    method: '<p>입국 조건은 Passport Index(Ilya Ilyankou 공개 데이터)로, 단기 관광 기준입니다. 장기 거주·취업은 별도 허가가 필요하니 공식 정보를 꼭 확인하세요.</p><p>물가는 구매력평가÷환율로 구한 물가 수준을 여권 국가=100으로 나타냈습니다. 치안은 인구 10만 명당 살인 건수, 인터넷은 이용자 비율(세계은행). 기온은 최근 10년 국토 평균(Copernicus ERA5, Our World in Data 경유)이라 수도 기온과 다릅니다.</p>',
  },
  es: {
    title: '¿Dónde podrías vivir con tu pasaporte?', lead: 'Los países a los que tu pasaporte te deja entrar con facilidad, con coste de vida, seguridad, internet, clima y esperanza de vida.',
    passport: 'Pasaporte', entry: 'Entrada', F: 'Sin visado', A: 'Visado a la llegada', E: 'Visado electrónico', V: 'Visado obligatorio', X: 'Entrada prohibida', days: '{d} días',
    fEntry: 'Entrada', fFree: 'Solo sin visado', fEasy: 'Incl. a la llegada y electrónico', fAll: 'Todos', fClimate: 'Clima', cAny: 'Cualquiera', cCool: 'Fresco (menos de 15 °C)', cMild: 'Templado (15–22 °C)', cWarm: 'Cálido (22 °C+)',
    nFree: 'Destinos sin visado', score: 'Global', price: 'Precios', priceNote: '{c} = 100', safety: 'Homicidios', net: 'Internet', temp: 'Temp.', life: 'Esp. de vida',
    hint: 'Global promedia percentiles mundiales (0–100) de precios bajos, seguridad, uso de internet y esperanza de vida. Pulsa una columna para ordenar.',
    method: '<p>Reglas de entrada: Passport Index (datos abiertos de Ilya Ilyankou), para estancias turísticas cortas. Vivir o trabajar requiere permisos aparte; consulta siempre fuentes oficiales.</p><p>Precios: nivel de precios (PPA ÷ tipo de cambio) con el país del pasaporte = 100. Seguridad: homicidios por 100.000; internet: porcentaje de usuarios (Banco Mundial). Temperatura: media nacional de 10 años (Copernicus ERA5 vía Our World in Data), no la de la capital.</p>',
  },
};
const T = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
const CLS = { F: 'good', A: 'warn', E: 'warn', V: 'bad', X: 'bad' };

function pct(rows, key, dir) {
  const v = rows.filter(r => r[key] != null).sort((a, b) => dir * (a[key] - b[key]));
  const n = v.length, out = {}; v.forEach((r, i) => { out[r.iso] = n > 1 ? i / (n - 1) * 100 : 50; }); return out;
}

boot({
  id: 'sumeru', dict,
  render(data, t, lang, root, st) {
    const { visa } = data;
    const passports = Object.keys(visa.m);
    st.p = pickCountry(st.p, passports, lang);
    st.e ||= 'easy'; st.cl ||= 'any';
    const byIso = Object.fromEntries(data.rows.map(r => [r.iso, r]));
    // Percentile where 100 = best: cheap prices, few homicides, many internet users, long lives.
    const P = [pct(data.rows, 'price', -1), pct(data.rows, 'hom', -1), pct(data.rows, 'net', 1), pct(data.rows, 'life', 1)];
    for (const r of data.rows) { const s = P.map(p => p[r.iso]).filter(v => v != null); r.score = s.length >= 3 ? s.reduce((a, b) => a + b, 0) / s.length : null; }
    root.innerHTML = `<div class="controls">${countrySelect(passports, st.p, lang).replace(t('you'), t('passport'))}
      <label>${t('fEntry')} <select id="fe">${['free', 'easy', 'all'].map(k => `<option value="${k}"${st.e === k ? ' selected' : ''}>${t({ free: 'fFree', easy: 'fEasy', all: 'fAll' }[k])}</option>`).join('')}</select></label>
      <label>${t('fClimate')} <select id="fc">${['any', 'cool', 'mild', 'warm'].map(k => `<option value="${k}"${st.cl === k ? ' selected' : ''}>${t('c' + k[0].toUpperCase() + k.slice(1))}</option>`).join('')}</select></label></div>
      <div class="kpis"><div class="kpi"><span>${t('nFree')}</span><b id="nfree"></b></div></div><p class="muted small">${t('hint')}</p><div id="tb"></div>`;
    const draw = () => {
      const codes = visa.m[st.p], home = byIso[st.p];
      root.querySelector('#nfree').textContent = fmt([...codes].filter(c => c === 'F').length, lang);
      const ok = st.e === 'free' ? 'F' : st.e === 'easy' ? 'FAE' : 'FAEVX';
      const rows = visa.list.map((iso, i) => ({ ...(byIso[iso] || { iso }), code: codes[i], d: visa.days[st.p]?.[iso] }))
        .filter(r => r.iso !== st.p && ok.includes(r.code))
        .filter(r => st.cl === 'any' || (r.t != null && (st.cl === 'cool' ? r.t < 15 : st.cl === 'mild' ? r.t >= 15 && r.t < 22 : r.t >= 22)))
        .map(r => ({ ...r, rel: r.price != null && home?.price ? r.price / home.price * 100 : null }));
      table(root.querySelector('#tb'), { lang, rows, sortKey: 'score', pageSize: 25, cols: [
        { k: 'iso', h: t('country'), f: r => cname(r.iso, lang), s: r => name(r.iso, lang) },
        { k: 'code', h: t('entry'), f: r => `<span class="pill ${CLS[r.code] || ''}">${esc(t(r.code) || r.code)}</span>${r.d ? ` <span class="muted small">${T(t('days'), { d: r.d })}</span>` : ''}`, s: r => 'FAEVX'.indexOf(r.code) },
        { k: 'score', h: t('score'), n: 1, f: r => fmt(r.score, lang, 0) },
        { k: 'rel', h: `${t('price')} <span class="muted">(${T(t('priceNote'), { c: esc(name(st.p, lang)) })})</span>`, n: 1, f: r => fmt(r.rel, lang, 0), s: r => r.rel == null ? null : -r.rel },
        { k: 'hom', h: t('safety'), n: 1, f: r => fmt(r.hom, lang, 1), s: r => r.hom == null ? null : -r.hom },
        { k: 'net', h: t('net'), n: 1, f: r => r.net != null ? fmt(r.net, lang, 0) + '%' : '–' },
        { k: 't', h: t('temp'), n: 1, f: r => r.t != null ? `${fmt(r.t, lang, 0)}℃ <span class="muted small">${fmt(r.tMin, lang, 0)}〜${fmt(r.tMax, lang, 0)}</span>` : '–' },
        { k: 'life', h: t('life'), n: 1, f: r => fmt(r.life, lang, 1) },
      ] });
    };
    root.querySelector('#pick').onchange = e => { st.p = e.target.value; draw(); };
    root.querySelector('#fe').onchange = e => { st.e = e.target.value; draw(); };
    root.querySelector('#fc').onchange = e => { st.cl = e.target.value; draw(); };
    draw();
  },
});
