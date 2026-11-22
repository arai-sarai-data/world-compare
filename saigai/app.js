import { boot, table, scatter, cname, name, fmt, countrySelect, defaultCountry, pickCountry, shareX, tabs } from '../assets/common.js';

const dict = {
  ja: {
    title: '災害の被害は「備え」で決まる？', lead: '自然災害による死亡率を、その国の豊かさから予想される水準と比べました。予想より被害が大きい国は、備えや対応に課題があるかもしれません。',
    rate: '災害による死亡率', perYear: '10万人あたり・年平均', expected: '豊かさから予想される値', ratio: '予想との比', worse: '予想の{x}倍', better: '予想の{x}倍（少ない）',
    chart: '豊かさと災害死亡率', xl: '1人あたりGDP（購買力平価, 国際ドル, 対数）', yl: '災害死亡率（10万人あたり・年, 対数）',
    tabWorse: '予想より被害が大きい', tabBetter: '予想より被害が小さい', colRate: '死亡率', colExp: '予想', colRatio: '比', colWorst: '最悪の年', colDmg: '経済損失（GDP比・年平均）',
    share: '{c}の災害死亡率は、豊かさから予想される値の{x}倍',
    method: '<p>死亡率：WHO世界保健推計の自然災害による死亡率（10万人あたり、2000年以降の年平均、Our World in Data経由）。大地震などの年に大きく左右されます（「最悪の年」を参照）。</p><p>予想値：全ての国について「1人あたりGDP（購買力平価、世界銀行）の対数」と「死亡率の対数」の関係を直線で近似し、その国のGDPを当てはめた値です。比が1より大きいほど、同じくらい豊かな国より被害が大きいことを示します。</p><p>経済損失はEM-DAT（Our World in Data経由）。記録のない年はゼロとして平均しています。地震や台風の起きやすさ（自然条件）は考慮していません。</p>',
  },
  en: {
    title: 'Do disasters hit harder than wealth predicts?', lead: 'Death rates from natural disasters compared with what each country’s income would predict. Countries far above the line may have gaps in preparedness or response.',
    rate: 'Disaster death rate', perYear: 'per 100,000 a year', expected: 'Predicted from income', ratio: 'Versus prediction', worse: '{x}× the prediction', better: '{x}× the prediction (lower)',
    chart: 'Income and disaster deaths', xl: 'GDP per person (PPP, int’l $, log)', yl: 'Disaster deaths per 100,000 a year (log)',
    tabWorse: 'Worse than predicted', tabBetter: 'Better than predicted', colRate: 'Death rate', colExp: 'Predicted', colRatio: 'Ratio', colWorst: 'Worst year', colDmg: 'Economic damage (% of GDP a year)',
    share: '{c}: disaster deaths are {x}× what its income would predict',
    method: '<p>Death rate: WHO Global Health Estimates, natural disasters, per 100,000, yearly average since 2000 (via Our World in Data). Single catastrophic years weigh heavily (see “worst year”).</p><p>Prediction: a straight-line fit across all countries between log GDP per person (PPP, World Bank) and log death rate. A ratio above 1 means more deaths than equally rich countries.</p><p>Economic damage: EM-DAT (via Our World in Data), years without records counted as zero. Natural exposure to quakes or storms is not accounted for.</p>',
  },
  zh: {
    title: '灾害伤亡由“准备”决定吗？', lead: '把自然灾害死亡率与按国家富裕程度预测的水平相比。远高于预测的国家，可能在防灾或应对上存在问题。',
    rate: '灾害死亡率', perYear: '每10万人·年平均', expected: '按收入预测', ratio: '与预测之比', worse: '预测的{x}倍', better: '预测的{x}倍（较少）',
    chart: '收入与灾害死亡', xl: '人均GDP（购买力平价，国际元，对数）', yl: '灾害死亡率（每10万人·年，对数）',
    tabWorse: '比预测严重', tabBetter: '比预测轻微', colRate: '死亡率', colExp: '预测', colRatio: '比', colWorst: '最严重年份', colDmg: '经济损失（占GDP·年平均）',
    share: '{c}的灾害死亡率是按收入预测值的{x}倍',
    method: '<p>死亡率：WHO全球卫生估计中自然灾害死亡率（每10万人，2000年以来年平均，经Our World in Data）。大地震等单一年份影响很大（见“最严重年份”）。</p><p>预测值：以全体国家人均GDP（购买力平价，世界银行）对数与死亡率对数做直线拟合，代入该国GDP得到。比值大于1表示比同等富裕国家伤亡更多。</p><p>经济损失来自EM-DAT（经Our World in Data），无记录年份按零计算。未考虑地震、台风等自然条件。</p>',
  },
  ko: {
    title: '재해 피해는 “대비”가 좌우할까?', lead: '자연재해 사망률을 그 나라의 소득 수준으로 예상되는 값과 비교했습니다. 예상보다 피해가 큰 나라는 대비나 대응에 과제가 있을 수 있습니다.',
    rate: '재해 사망률', perYear: '10만 명당·연평균', expected: '소득으로 예상한 값', ratio: '예상 대비', worse: '예상의 {x}배', better: '예상의 {x}배(적음)',
    chart: '소득과 재해 사망률', xl: '1인당 GDP(구매력평가, 국제 달러, 로그)', yl: '재해 사망률(10만 명당·연, 로그)',
    tabWorse: '예상보다 피해가 큼', tabBetter: '예상보다 피해가 작음', colRate: '사망률', colExp: '예상', colRatio: '비', colWorst: '최악의 해', colDmg: '경제 손실(GDP 대비·연평균)',
    share: '{c}의 재해 사망률은 소득으로 예상한 값의 {x}배',
    method: '<p>사망률: WHO 세계보건추정의 자연재해 사망률(10만 명당, 2000년 이후 연평균, Our World in Data 경유). 대지진 등 한 해의 영향이 큽니다(“최악의 해” 참고).</p><p>예상값: 모든 나라의 1인당 GDP(구매력평가, 세계은행) 로그와 사망률 로그의 관계를 직선으로 근사해 그 나라 GDP를 넣은 값입니다. 비가 1보다 크면 비슷하게 잘사는 나라보다 피해가 큽니다.</p><p>경제 손실은 EM-DAT(Our World in Data 경유), 기록 없는 해는 0으로 평균했습니다. 지진·태풍이 일어나기 쉬운 자연 조건은 고려하지 않았습니다.</p>',
  },
  es: {
    title: '¿Golpean los desastres más de lo que predice la riqueza?', lead: 'Las muertes por desastres naturales comparadas con lo que predice el ingreso de cada país. Los países muy por encima pueden tener fallos de preparación o respuesta.',
    rate: 'Mortalidad por desastres', perYear: 'por 100.000 al año', expected: 'Predicha por el ingreso', ratio: 'Frente a la predicción', worse: '{x}× la predicción', better: '{x}× la predicción (menor)',
    chart: 'Ingreso y muertes por desastres', xl: 'PIB por persona (PPA, $ int., log)', yl: 'Muertes por 100.000 al año (log)',
    tabWorse: 'Peor de lo predicho', tabBetter: 'Mejor de lo predicho', colRate: 'Mortalidad', colExp: 'Predicha', colRatio: 'Razón', colWorst: 'Peor año', colDmg: 'Daño económico (% del PIB al año)',
    share: '{c}: las muertes por desastres son {x}× lo que predice su ingreso',
    method: '<p>Mortalidad: Estimaciones Mundiales de Salud de la OMS, desastres naturales, por 100.000, media anual desde 2000 (vía Our World in Data). Un año catastrófico pesa mucho (ver “peor año”).</p><p>Predicción: recta ajustada en todos los países entre el log del PIB por persona (PPA, Banco Mundial) y el log de la mortalidad. Una razón mayor que 1 indica más muertes que países igual de ricos.</p><p>Daño económico: EM-DAT (vía Our World in Data); los años sin registros cuentan como cero. No se considera la exposición natural a terremotos o tormentas.</p>',
  },
};
const T = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);

boot({
  id: 'saigai', dict,
  render(data, t, lang, root, st) {
    const rows = data.rows, isos = rows.map(r => r.iso);
    st.c = pickCountry(st.c, isos, lang);
    st.tab ||= 'worse';
    const me = rows.find(r => r.iso === st.c);
    const rtxt = r => r.ratio >= 1 ? T(t('worse'), { x: fmt(r.ratio, lang, 1) }) : T(t('better'), { x: fmt(r.ratio, lang, 2) });
    root.innerHTML = `<div class="controls">${countrySelect(isos, st.c, lang)}</div>
      <div class="kpis">
        <div class="kpi"><span>${t('rate')}</span><b>${fmt(me.rate, lang, 2)}</b><span>${t('perYear')} (${me.y0}–${me.y1})</span></div>
        <div class="kpi"><span>${t('expected')}</span><b>${fmt(me.expected, lang, 2)}</b><span>${t('perYear')}</span></div>
        <div class="kpi"><span>${t('ratio')}</span><b class="${me.ratio >= 1 ? 'up' : 'down'}">${fmt(me.ratio, lang, 1)}×</b><span>${t('colWorst')}: ${me.worstY}</span></div>
      </div>
      ${shareX(T(t('share'), { c: name(st.c, lang), x: fmt(me.ratio, lang, 1) }), lang)}
      <h2>${t('chart')}</h2><div id="sc"></div>
      ${tabs([['worse', t('tabWorse')], ['better', t('tabBetter')]], st.tab)}<div id="tb"></div>`;
    scatter(root.querySelector('#sc'), { lang, logX: true, logY: true, hl: st.c, xLabel: t('xl'), yLabel: t('yl'), line: data.fit, pts: rows.map(r => ({ x: r.gdp, y: Math.max(r.rate, 0.005), iso: r.iso, tip: `${name(r.iso, lang)} — ${fmt(r.rate, lang, 2)} (${rtxt(r)})` })) });
    const draw = () => table(root.querySelector('#tb'), { lang, rows, hl: st.c, sortKey: 'ratio', sortAsc: st.tab === 'better', cols: [
      { k: 'iso', h: t('country'), f: r => cname(r.iso, lang), s: r => name(r.iso, lang) },
      { k: 'ratio', h: t('colRatio'), n: 1, f: r => `<span class="${r.ratio >= 1 ? 'up' : 'down'}">${fmt(r.ratio, lang, r.ratio < 1 ? 2 : 1)}×</span>` },
      { k: 'rate', h: t('colRate'), n: 1, f: r => fmt(r.rate, lang, 2) },
      { k: 'expected', h: t('colExp'), n: 1, f: r => fmt(r.expected, lang, 2) },
      { k: 'worstY', h: t('colWorst'), n: 1 },
      { k: 'damage', h: t('colDmg'), n: 1, f: r => r.damage != null ? fmt(r.damage, lang, r.damage < 0.1 ? 3 : 2) + '%' : '–' },
    ] });
    root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { st.tab = b.dataset.tab; root.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === b)); draw(); });
    root.querySelector('#pick').onchange = e => { st.c = e.target.value; st.redraw(); };
    draw();
  },
});
