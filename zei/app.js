import { boot, table, bars, scatter, cname, name, fmt, countrySelect, defaultCountry, pickCountry, shareX } from '../assets/common.js';

const IND = ['life', 'u5', 'homicide', 'learn', 'water', 'net', 'pm25'];
const dict = {
  ja: {
    title: '税金の元は取れている？', lead: '国民が払う税金の重さ（GDP比）と、寿命・子どもの死亡率・治安・学力・水・ネット・空気の7つの成果を並べ、同じくらいの税負担の国と比べて成果が多いか少ないかを示します。',
    tax: '税負担（GDP比）', score: '成果スコア', gap: '同じ税負担の国との差', above: '平均より多い', below: '平均より少ない',
    chart: '税負担と成果', xl: '税負担（GDP比, %）', yl: '成果スコア（0〜100）', parts: '成果の内訳（世界での位置、100が最良）',
    life: '平均寿命', u5: '5歳未満の死亡率', homicide: '殺人の少なさ', learn: '学力テスト', water: '安全な飲み水', net: 'ネット利用率', pm25: '空気のきれいさ',
    best: '税の割に成果が大きい国', colTax: '税負担', colScore: '成果', colGap: '差', share: '{c}は税負担{t}%で成果スコア{s}。同じ税負担の国より{g}',
    method: '<p>税負担は国連大学WIDERの政府歳入データ（社会保険料を含む税収のGDP比、直近3年平均）。取れない場合は世界銀行の税収GDP比を使います。</p><p>成果スコア：7指標それぞれで各国を世界の順位（0〜100、100が最良）に直し、平均しました。5指標以上ある国のみ。</p><p>「差」は、全ての国から求めた「税負担がこのくらいならこのくらいの成果」という直線（最小二乗法）との差です。プラスなら同程度の税負担の国より成果が多いことを示します。所得水準や人口構成など、税以外の要因も成果に影響します。石油・ガスなど資源収入の多い国や、金融・観光で稼ぐ小さな国は、税が軽くても財源が多いため上位に来やすくなります。</p>',
  },
  en: {
    title: 'Are taxes paying off?', lead: 'Tax burden (share of GDP) against seven outcomes — life expectancy, child mortality, safety, learning, water, internet and clean air — compared with countries that tax about the same.',
    tax: 'Tax burden (% of GDP)', score: 'Outcome score', gap: 'Versus countries with similar taxes', above: 'above the line', below: 'below the line',
    chart: 'Tax burden and outcomes', xl: 'Tax burden (% of GDP)', yl: 'Outcome score (0–100)', parts: 'Outcome breakdown (world position, 100 = best)',
    life: 'Life expectancy', u5: 'Child survival (under 5)', homicide: 'Few homicides', learn: 'Test scores', water: 'Safe drinking water', net: 'Internet use', pm25: 'Clean air',
    best: 'Most outcome for the tax', colTax: 'Tax', colScore: 'Outcome', colGap: 'Gap', share: '{c}: tax {t}% of GDP, outcome score {s}, {g} versus similar-tax countries',
    method: '<p>Tax burden: UNU-WIDER Government Revenue Dataset (taxes including social contributions, % of GDP, average of the latest 3 years); World Bank tax revenue if unavailable.</p><p>Outcome score: each of the seven indicators is converted to a world percentile (100 = best) and averaged; countries need at least five.</p><p>The gap is the distance from a least-squares line fitted across all countries. Positive means more outcome than countries with similar taxes. Income and demographics also matter. Oil and gas exporters and small financial or tourism hubs can fund services without heavy taxes, so they tend to rank high.</p>',
  },
  zh: {
    title: '税交得值吗？', lead: '把税负（占GDP比例）与寿命、儿童死亡率、治安、学力、饮水、网络、空气七项成果并列，比较同等税负的国家谁的成果更多。',
    tax: '税负（占GDP）', score: '成果得分', gap: '与同等税负国家的差', above: '高于平均', below: '低于平均',
    chart: '税负与成果', xl: '税负（占GDP, %）', yl: '成果得分（0–100）', parts: '成果明细（世界位置，100为最好）',
    life: '平均寿命', u5: '5岁以下儿童存活', homicide: '凶杀少', learn: '学力测试', water: '安全饮用水', net: '网络使用率', pm25: '空气清洁',
    best: '税负相对成果最大的国家', colTax: '税负', colScore: '成果', colGap: '差', share: '{c}税负{t}%，成果得分{s}，与同等税负国家相比{g}',
    method: '<p>税负来自联合国大学WIDER政府收入数据库（含社保缴款的税收占GDP比例，最近3年平均），无数据时使用世界银行税收占GDP比例。</p><p>成果得分：七项指标各自换算成世界百分位（100为最好）后取平均，至少需要五项。</p><p>“差”是与全体国家最小二乘回归线的距离，正值表示成果多于同等税负的国家。收入和人口结构也有影响。石油天然气出口国以及依靠金融、旅游的小国，即使税负轻也有其他财源，因此容易排名靠前。</p>',
  },
  ko: {
    title: '세금 낸 만큼 돌아오나?', lead: '세금 부담(GDP 대비)과 수명·아동 사망률·치안·학력·식수·인터넷·공기 7가지 성과를 나란히 놓고, 세금 부담이 비슷한 나라보다 성과가 많은지 적은지 보여 줍니다.',
    tax: '세금 부담(GDP 대비)', score: '성과 점수', gap: '세금 부담이 비슷한 나라와의 차이', above: '평균보다 많음', below: '평균보다 적음',
    chart: '세금 부담과 성과', xl: '세금 부담(GDP 대비, %)', yl: '성과 점수(0~100)', parts: '성과 내역(세계 위치, 100이 최고)',
    life: '기대수명', u5: '5세 미만 생존', homicide: '살인 적음', learn: '학력 시험', water: '안전한 식수', net: '인터넷 이용률', pm25: '깨끗한 공기',
    best: '세금에 비해 성과가 큰 나라', colTax: '세금 부담', colScore: '성과', colGap: '차이', share: '{c}: 세금 부담 {t}%, 성과 점수 {s}, 비슷한 세금 부담 나라보다 {g}',
    method: '<p>세금 부담은 UNU-WIDER 정부수입 데이터(사회보험료 포함 세수의 GDP 대비, 최근 3년 평균). 없으면 세계은행 세수 비율을 씁니다.</p><p>성과 점수: 7개 지표를 세계 백분위(100이 최고)로 바꿔 평균했습니다. 5개 이상 있는 나라만.</p><p>“차이”는 모든 나라로 구한 최소제곱 직선과의 거리입니다. 플러스면 비슷한 세금 부담의 나라보다 성과가 많습니다. 소득과 인구 구조도 영향을 줍니다. 석유·가스 수출국이나 금융·관광으로 버는 작은 나라는 세금이 적어도 재원이 많아 상위에 오기 쉽습니다.</p>',
  },
  es: {
    title: '¿Rinden los impuestos?', lead: 'La carga fiscal (% del PIB) frente a siete resultados —esperanza de vida, mortalidad infantil, seguridad, aprendizaje, agua, internet y aire limpio— comparada con países que recaudan lo mismo.',
    tax: 'Carga fiscal (% del PIB)', score: 'Puntuación de resultados', gap: 'Frente a países con impuestos similares', above: 'por encima', below: 'por debajo',
    chart: 'Carga fiscal y resultados', xl: 'Carga fiscal (% del PIB)', yl: 'Puntuación (0–100)', parts: 'Desglose (posición mundial, 100 = mejor)',
    life: 'Esperanza de vida', u5: 'Supervivencia infantil', homicide: 'Pocos homicidios', learn: 'Pruebas de aprendizaje', water: 'Agua potable segura', net: 'Uso de internet', pm25: 'Aire limpio',
    best: 'Más resultados por impuesto', colTax: 'Impuestos', colScore: 'Resultados', colGap: 'Diferencia', share: '{c}: impuestos {t}% del PIB, puntuación {s}, {g} frente a países similares',
    method: '<p>Carga fiscal: base de datos de ingresos públicos de UNU-WIDER (impuestos con cotizaciones sociales, % del PIB, media de los 3 últimos años); si falta, la del Banco Mundial.</p><p>Puntuación: cada indicador se convierte en percentil mundial (100 = mejor) y se promedia; se exigen al menos cinco.</p><p>La diferencia es la distancia a una recta de mínimos cuadrados para todos los países. Positiva = más resultados que países con impuestos similares. El ingreso y la demografía también influyen. Los exportadores de petróleo y gas y los pequeños centros financieros o turísticos financian servicios sin impuestos altos, por lo que suelen quedar arriba.</p>',
  },
};
const T = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
const signed = (v, lang) => (v > 0 ? '+' : '') + fmt(v, lang, 1);

boot({
  id: 'zei', dict,
  render(data, t, lang, root, st) {
    const rows = data.rows, isos = rows.map(r => r.iso);
    st.c = pickCountry(st.c, isos, lang);
    const me = rows.find(r => r.iso === st.c);
    root.innerHTML = `<div class="controls">${countrySelect(isos, st.c, lang)}</div>
      <div class="kpis">
        <div class="kpi"><span>${t('tax')}</span><b>${fmt(me.tax, lang, 1)}%</b><span>${me.taxY}</span></div>
        <div class="kpi"><span>${t('score')}</span><b>${fmt(me.score, lang, 0)}</b><span>/100</span></div>
        <div class="kpi"><span>${t('gap')}</span><b class="${me.gap >= 0 ? 'down' : 'up'}">${signed(me.gap, lang)}</b><span>${me.gap >= 0 ? t('above') : t('below')}</span></div>
      </div>
      ${shareX(T(t('share'), { c: name(st.c, lang), t: fmt(me.tax, lang, 1), s: fmt(me.score, lang, 0), g: signed(me.gap, lang) }), lang)}
      <h2>${t('parts')}</h2><div id="parts"></div>
      <h2>${t('chart')}</h2><div id="sc"></div>
      <h2>${t('best')}</h2><div id="tb"></div>`;
    root.querySelector('#parts').innerHTML = bars(IND.filter(k => me.parts[k]).map(k => ({ label: t(k), value: me.parts[k].p, text: fmt(me.parts[k].p, lang, 0), cls: me.parts[k].p >= 50 ? 'good' : 'bad' })), { max: 100 });
    scatter(root.querySelector('#sc'), { lang, hl: st.c, xLabel: t('xl'), yLabel: t('yl'), line: data.fit, pts: rows.map(r => ({ x: r.tax, y: r.score, iso: r.iso, tip: `${name(r.iso, lang)} — ${t('colTax')} ${fmt(r.tax, lang, 1)}%, ${t('colScore')} ${fmt(r.score, lang, 0)} (${signed(r.gap, lang)})` })) });
    table(root.querySelector('#tb'), { lang, rows, hl: st.c, sortKey: 'gap', cols: [
      { k: 'iso', h: t('country'), f: r => cname(r.iso, lang), s: r => name(r.iso, lang) },
      { k: 'gap', h: t('colGap'), n: 1, f: r => `<span class="${r.gap >= 0 ? 'down' : 'up'}">${signed(r.gap, lang)}</span>` },
      { k: 'score', h: t('colScore'), n: 1, f: r => fmt(r.score, lang, 0) },
      { k: 'tax', h: t('colTax'), n: 1, f: r => fmt(r.tax, lang, 1) + '%' },
    ] });
    root.querySelector('#pick').onchange = e => { st.c = e.target.value; st.redraw(); };
  },
});
