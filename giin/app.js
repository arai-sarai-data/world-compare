import { boot, table, scatter, cname, name, fmt, countrySelect, defaultCountry, pickCountry, tabs, shareX } from '../assets/common.js?v=3';

const dict = {
  ja: {
    tabP: '報酬', payX: '議員報酬は国民の何倍', pay: '議員の基本給（年・国際ドル）', gdp: '国民1人あたりGDP（国際ドル）', listP: '国民と比べて報酬が高い議会', times: '{x}倍', noPay: '議員報酬のデータはまだ取得できていません。', mpPay: '議員の基本給', 
    title: '議員は国民に似ている？', lead: '国会議員の女性の割合と年齢を、その国の国民と比べました。差が大きいほど、議会の顔ぶれが国民とずれています。',
    women: '女性議員の割合', femPop: '国民の女性の割合', mpAge: '議員の平均年齢', medAge: '国民の年齢の中央値', gapW: '女性の差', gapA: '年齢の差', pts: 'ポイント', yrs: '歳',
    tabW: '女性', tabA: '年齢', chartW: '国民と議会の女性の割合', chartA: '国民と議員の年齢', xlW: '国民の女性の割合（%）', ylW: '議会の女性の割合（%）', xlA: '国民の年齢の中央値（歳）', ylA: '議員の平均年齢（歳）',
    listW: '女性が少ない議会（差が大きい順）', listA: '国民より年上の議会（差が大きい順）', noAge: '議員の年齢データはまだ取得できていません。', older: '国民より{g}歳上', fewer: '国民より{g}ポイント少ない',
    share: '{c}の議会：女性{w}%（国民は{p}%）', more: '多い',
    method: '<p>女性議員の割合は列国議会同盟（IPU）の集計（世界銀行経由、下院または一院制）。国民の女性の割合は世界銀行の人口統計です。</p><p>議員の平均年齢はIPU Parlineの「議員の年齢」データ（選挙直後の構成）、国民の年齢の中央値は国連の世界人口推計（Our World in Data経由）です。平均と中央値の比較なので目安です。議員になれる年齢には下限があるため、差はゼロにはなりません。</p><p>報酬はIPU Parlineの議員の基本給（購買力平価換算）を、国民1人あたりGDP（購買力平価、世界銀行）で割った倍率です。手当は含みません。</p>',
  },
  en: {
    tabP: 'Pay', payX: 'MP pay vs. income per person', pay: 'MP basic salary (yearly, int’l $)', gdp: 'GDP per person (int’l $)', listP: 'Best-paid parliaments relative to their people', times: '{x}×', noPay: 'MP pay data are not available yet.', mpPay: 'MP basic salary', 
    title: 'Do parliaments look like their people?', lead: 'The share of women and the age of members of parliament, compared with each country’s population. The bigger the gap, the less the chamber resembles the people.',
    women: 'Women in parliament', femPop: 'Women in population', mpAge: 'Average age of MPs', medAge: 'Median age of people', gapW: 'Women gap', gapA: 'Age gap', pts: 'pts', yrs: 'yrs',
    tabW: 'Women', tabA: 'Age', chartW: 'Women in population and parliament', chartA: 'Age of people and MPs', xlW: 'Women in population (%)', ylW: 'Women in parliament (%)', xlA: 'Median age of people', ylA: 'Average age of MPs',
    listW: 'Fewest women relative to population', listA: 'Oldest relative to population', noAge: 'MP age data are not available yet.', older: '{g} yrs older than people', fewer: '{g} pts below population',
    share: '{c} parliament: {w}% women (population {p}%)', more: 'more',
    method: '<p>Women in parliament: IPU (via World Bank; lower or single chamber). Women in population: World Bank.</p><p>Average age of MPs: IPU Parline age of parliamentarians (composition after the latest election); median age: UN World Population Prospects (via Our World in Data). Mean vs median is an approximation, and eligibility ages mean the gap never reaches zero.</p><p>Pay: IPU Parline basic salary of MPs (PPP) divided by GDP per person (PPP, World Bank). Allowances are excluded.</p>',
  },
  zh: {
    tabP: '薪酬', payX: '议员薪酬是国民的几倍', pay: '议员基本工资（年，国际元）', gdp: '人均GDP（国际元）', listP: '相对国民薪酬最高的议会', times: '{x}倍', noPay: '暂时无法获取议员薪酬数据。', mpPay: '议员基本工资', 
    title: '议员像国民吗？', lead: '把国会议员的女性比例和年龄与该国国民相比。差距越大，议会构成与国民越不相像。',
    women: '女性议员比例', femPop: '国民中女性比例', mpAge: '议员平均年龄', medAge: '国民年龄中位数', gapW: '女性差距', gapA: '年龄差距', pts: '个百分点', yrs: '岁',
    tabW: '女性', tabA: '年龄', chartW: '国民与议会的女性比例', chartA: '国民与议员的年龄', xlW: '国民中女性比例（%）', ylW: '议会女性比例（%）', xlA: '国民年龄中位数（岁）', ylA: '议员平均年龄（岁）',
    listW: '女性偏少的议会（差距从大到小）', listA: '比国民年长的议会（差距从大到小）', noAge: '暂时无法获取议员年龄数据。', older: '比国民大{g}岁', fewer: '比国民少{g}个百分点',
    share: '{c}议会：女性{w}%（国民{p}%）', more: '多',
    method: '<p>女性议员比例来自各国议会联盟（IPU，经世界银行，下院或一院制）；国民女性比例来自世界银行。</p><p>议员平均年龄来自IPU Parline（最近选举后的构成），国民年龄中位数来自联合国世界人口展望（经Our World in Data）。平均数与中位数相比只是参考，且有被选举年龄下限，差距不会为零。</p><p>薪酬为IPU Parline议员基本工资（购买力平价）除以人均GDP（购买力平价，世界银行），不含津贴。</p>',
  },
  ko: {
    tabP: '보수', payX: '의원 보수는 국민의 몇 배', pay: '의원 기본급(연, 국제 달러)', gdp: '1인당 GDP(국제 달러)', listP: '국민에 비해 보수가 높은 의회', times: '{x}배', noPay: '의원 보수 데이터를 아직 가져오지 못했습니다.', mpPay: '의원 기본급', 
    title: '의원은 국민을 닮았을까?', lead: '국회의원의 여성 비율과 나이를 그 나라 국민과 비교했습니다. 차이가 클수록 의회 구성이 국민과 어긋나 있습니다.',
    women: '여성 의원 비율', femPop: '국민 중 여성 비율', mpAge: '의원 평균 나이', medAge: '국민 나이 중앙값', gapW: '여성 차이', gapA: '나이 차이', pts: '%p', yrs: '세',
    tabW: '여성', tabA: '나이', chartW: '국민과 의회의 여성 비율', chartA: '국민과 의원의 나이', xlW: '국민 중 여성 비율(%)', ylW: '의회 여성 비율(%)', xlA: '국민 나이 중앙값(세)', ylA: '의원 평균 나이(세)',
    listW: '여성이 적은 의회 (차이가 큰 순)', listA: '국민보다 나이 많은 의회 (차이가 큰 순)', noAge: '의원 나이 데이터를 아직 가져오지 못했습니다.', older: '국민보다 {g}세 많음', fewer: '국민보다 {g}%p 적음',
    share: '{c} 의회: 여성 {w}% (국민 {p}%)', more: '많음',
    method: '<p>여성 의원 비율은 국제의회연맹(IPU, 세계은행 경유, 하원 또는 단원제), 국민 여성 비율은 세계은행 인구 통계입니다.</p><p>의원 평균 나이는 IPU Parline(최근 선거 후 구성), 국민 나이 중앙값은 유엔 세계인구전망(Our World in Data 경유)입니다. 평균과 중앙값 비교라 대략적인 값이며, 피선거권 나이 하한 때문에 차이는 0이 되지 않습니다.</p><p>보수는 IPU Parline 의원 기본급(구매력평가)을 1인당 GDP(구매력평가, 세계은행)로 나눈 배율입니다. 수당은 제외.</p>',
  },
  es: {
    tabP: 'Sueldo', payX: 'Sueldo de diputado frente a ingreso por persona', pay: 'Sueldo base de diputado (anual, $ int.)', gdp: 'PIB por persona ($ int.)', listP: 'Parlamentos mejor pagados respecto a su pueblo', times: '{x}×', noPay: 'Aún no hay datos de sueldos.', mpPay: 'Sueldo base', 
    title: '¿Se parecen los parlamentos a su pueblo?', lead: 'La proporción de mujeres y la edad de los parlamentarios frente a la población de cada país. Cuanto mayor la brecha, menos se parece la cámara a la gente.',
    women: 'Mujeres en el parlamento', femPop: 'Mujeres en la población', mpAge: 'Edad media de los diputados', medAge: 'Edad mediana de la población', gapW: 'Brecha de mujeres', gapA: 'Brecha de edad', pts: 'pts', yrs: 'años',
    tabW: 'Mujeres', tabA: 'Edad', chartW: 'Mujeres en población y parlamento', chartA: 'Edad de la población y de los diputados', xlW: 'Mujeres en la población (%)', ylW: 'Mujeres en el parlamento (%)', xlA: 'Edad mediana de la población', ylA: 'Edad media de los diputados',
    listW: 'Menos mujeres respecto a la población', listA: 'Más mayores respecto a la población', noAge: 'Aún no hay datos de edad de los diputados.', older: '{g} años más que la población', fewer: '{g} pts menos que la población',
    share: 'Parlamento de {c}: {w}% mujeres (población {p}%)', more: 'más',
    method: '<p>Mujeres en el parlamento: UIP (vía Banco Mundial; cámara baja o única). Mujeres en la población: Banco Mundial.</p><p>Edad media de los diputados: UIP Parline (composición tras la última elección); edad mediana: Perspectivas de la Población Mundial de la ONU (vía Our World in Data). Comparar media y mediana es aproximado, y la edad mínima para ser elegido impide que la brecha llegue a cero.</p><p>Sueldo: sueldo base de los diputados según UIP Parline (PPA) dividido por el PIB por persona (PPA, Banco Mundial). Sin dietas.</p>',
  },
};
const T = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);

boot({
  id: 'giin', dict,
  render(data, t, lang, root, st) {
    const rows = data.rows, isos = rows.map(r => r.iso);
    const hasAge = rows.some(r => r.ageGap != null);
    st.c = pickCountry(st.c, isos, lang);
    st.tab ||= 'w';
    const me = rows.find(r => r.iso === st.c);
    const gapTxt = (g, unit) => g == null ? '' : g >= 0 ? T(t(unit === 'w' ? 'fewer' : 'older'), { g: fmt(g, lang, 1) }) : `${fmt(-g, lang, 1)} ${unit === 'w' ? t('pts') : t('yrs')} ${t('more')}`;
    root.innerHTML = `<div class="controls">${countrySelect(isos, st.c, lang)}</div>
      <div class="kpis">
        <div class="kpi"><span>${t('women')}</span><b>${me.women != null ? fmt(me.women, lang, 1) + '%' : '–'}</b><span>${t('femPop')} ${me.femPop != null ? fmt(me.femPop, lang, 1) + '%' : '–'}</span></div>
        <div class="kpi"><span>${t('mpAge')}</span><b>${me.mpAge != null ? fmt(me.mpAge, lang, 1) : '–'}</b><span>${t('medAge')} ${me.medAge != null ? fmt(me.medAge, lang, 1) : '–'}</span></div>
        <div class="kpi"><span>${t('payX')}</span><b>${me.payX != null ? T(t('times'), { x: fmt(me.payX, lang, 1) }) : '–'}</b><span>${t('mpPay')} ${me.pay != null ? '$' + fmt(me.pay, lang) : '–'}</span></div>
      </div>
      ${me.women != null ? shareX(T(t('share'), { c: name(st.c, lang), w: fmt(me.women, lang, 1), p: fmt(me.femPop, lang, 1) }), lang) : ''}
      ${tabs([['w', t('tabW')], ['a', t('tabA')], ['p', t('tabP')]], st.tab)}<div id="v"></div>`;
    const draw = () => {
      const v = root.querySelector('#v');
      if (st.tab === 'a' && !hasAge) { v.innerHTML = `<p class="muted">${t('noAge')}</p>`; return; }
      if (st.tab === 'p') {
        const list = rows.filter(r => r.payX != null);
        if (!list.length) { v.innerHTML = `<p class="muted">${t('noPay')}</p>`; return; }
        v.innerHTML = `<h3>${t('listP')}</h3><div id="tb"></div>`;
        table(v.querySelector('#tb'), { lang, rows: list, hl: st.c, sortKey: 'payX', cols: [
          { k: 'iso', h: t('country'), f: r => cname(r.iso, lang), s: r => name(r.iso, lang) },
          { k: 'payX', h: t('payX'), n: 1, f: r => T(t('times'), { x: fmt(r.payX, lang, 1) }) },
          { k: 'pay', h: t('pay'), n: 1, f: r => '$' + fmt(r.pay, lang) },
          { k: 'gdp', h: t('gdp'), n: 1, f: r => '$' + fmt(r.gdp, lang) },
        ] });
        return;
      }
      const w = st.tab === 'w';
      const list = rows.filter(r => w ? r.womenGap != null : r.ageGap != null);
      v.innerHTML = `${w ? '' : `<h3>${t('chartA')}</h3><div id="sc"></div>`}<h3>${w ? t('listW') : t('listA')}</h3><div id="tb"></div>`;
      if (!w) scatter(v.querySelector('#sc'), { lang, hl: st.c, xLabel: w ? t('xlW') : t('xlA'), yLabel: w ? t('ylW') : t('ylA'), line: { a: 0, b: 1 }, pts: list.map(r => ({ x: w ? r.femPop : r.medAge, y: w ? r.women : r.mpAge, iso: r.iso, tip: `${name(r.iso, lang)} — ${gapTxt(w ? r.womenGap : r.ageGap, st.tab)}` })) });
      table(v.querySelector('#tb'), { lang, rows: list, hl: st.c, sortKey: w ? 'womenGap' : 'ageGap', cols: w ? [
        { k: 'iso', h: t('country'), f: r => cname(r.iso, lang), s: r => name(r.iso, lang) },
        { k: 'womenGap', h: t('gapW'), n: 1, f: r => fmt(r.womenGap, lang, 1) },
        { k: 'women', h: t('women'), n: 1, f: r => fmt(r.women, lang, 1) + '%' },
        { k: 'femPop', h: t('femPop'), n: 1, f: r => fmt(r.femPop, lang, 1) + '%' },
      ] : [
        { k: 'iso', h: t('country'), f: r => cname(r.iso, lang), s: r => name(r.iso, lang) },
        { k: 'ageGap', h: t('gapA'), n: 1, f: r => fmt(r.ageGap, lang, 1) },
        { k: 'mpAge', h: t('mpAge'), n: 1, f: r => fmt(r.mpAge, lang, 1) },
        { k: 'medAge', h: t('medAge'), n: 1, f: r => fmt(r.medAge, lang, 1) },
      ] });
    };
    root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { st.tab = b.dataset.tab; root.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === b)); draw(); });
    root.querySelector('#pick').onchange = e => { st.c = e.target.value; st.redraw(); };
    draw();
  },
});
