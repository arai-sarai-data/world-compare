import { boot, table, bars, cname, name, fmt, esc, countrySelect, defaultCountry, shareX, tabs, cur as curOf } from '../assets/common.js';

const dict = {
  ja: {
    title: '1時間働くと、何が買える？', lead: '各国の平均賃金（ILO）と物価を組み合わせ、同じ物を買うのに何時間働く必要があるかを比べます。',
    hourly: '平均時給', bm: 'ビッグマック1個', minutes: '分', hours: '時間', rankOf: '位（{n}か国中）',
    calc: '同じ物を買うのに何時間？', calcQ: '{c}で', calcA: 'の物を、各国で買うと', calcNote: '物価の差（購買力平価）で各国の値段に置き換え、その国の平均時給で割っています。',
    tabBm: 'ビッグマック', tabWage: '時給（物価調整後）', colHourly: '平均時給（現地通貨）', colPpp: '時給（国際ドル換算）', colBm: 'ビッグマックに必要な労働', colHours: '週の労働時間', colYear: '賃金の年',
    fastest: 'ビッグマック1個に必要な労働時間（短い順）', est: '推定', unreliable: '物価上昇が大きい・通貨の変更などで比較に向かない国（{n}か国）は順位から除いています。',
    noData: 'この国は賃金データがありません。', share: '{c}ではビッグマック1個に{m}分の労働。世界{r}位',
    method: '<p>平均時給はILOの「被用者の平均時給（現地通貨）」を使います。時給がない国は「平均月収 ÷（週の実労働時間×52÷12）」で求め、労働時間もない国は週40時間と仮定して「推定」と表示します。</p><p>賃金の年から最新の消費者物価指数の年まで、物価の伸びで賃金を補正しています。</p><p>ビッグマックの価格はThe Economistの最新調査です。ユーロ圏で個別価格がない国はユーロ圏の価格を使います。</p><p>「同じ物」の計算は、民間消費の購買力平価（PPP）で値段を各国通貨に置き換えています。平均賃金は高所得者に引っ張られるため、多くの人の実感より高めになります。</p>',
  },
  en: {
    title: 'What does an hour of work buy?', lead: 'Average wages (ILO) combined with prices show how long people in each country work to buy the same thing.',
    hourly: 'Average hourly pay', bm: 'One Big Mac', minutes: 'min', hours: 'h', rankOf: ' of {n} countries',
    calc: 'How many hours for the same thing?', calcQ: 'Something that costs', calcA: 'in {c} takes this much work elsewhere', calcNote: 'The price is converted with purchasing power parities, then divided by each country’s average hourly pay.',
    tabBm: 'Big Mac', tabWage: 'Pay (price-adjusted)', colHourly: 'Hourly pay (local currency)', colPpp: 'Hourly pay (international $)', colBm: 'Work for a Big Mac', colHours: 'Hours per week', colYear: 'Wage year',
    fastest: 'Work needed for one Big Mac (shortest first)', est: 'est.', unreliable: '{n} countries with high inflation or currency changes are left out of the ranking.',
    noData: 'No wage data for this country.', share: 'In {c}, a Big Mac costs {m} minutes of work. #{r} in the world',
    method: '<p>Hourly pay is ILO average hourly earnings of employees (local currency). Where that is missing we use average monthly earnings ÷ (weekly hours actually worked × 52 ÷ 12), assuming 40 hours a week (marked “est.”) when hours are missing too.</p><p>Wages are brought forward to the latest consumer price index year.</p><p>Big Mac prices are The Economist’s latest survey; euro members without their own price use the euro-area price.</p><p>“The same thing” uses private-consumption PPPs. Average earnings are pulled up by high earners, so they are higher than what most people earn.</p>',
  },
  zh: {
    title: '工作1小时能买什么？', lead: '把各国平均工资（ILO）和物价结合起来，比较买同样的东西需要工作多久。',
    hourly: '平均时薪', bm: '一个巨无霸', minutes: '分钟', hours: '小时', rankOf: '名（共{n}国）',
    calc: '买同样的东西要工作几小时？', calcQ: '在{c}价值', calcA: '的东西，在各国需要工作', calcNote: '用购买力平价换算成各国价格，再除以该国平均时薪。',
    tabBm: '巨无霸', tabWage: '时薪（物价调整后）', colHourly: '平均时薪（本币）', colPpp: '时薪（国际元）', colBm: '买巨无霸所需工作', colHours: '每周工时', colYear: '工资年份',
    fastest: '买一个巨无霸所需的工作时间（由短到长）', est: '估计', unreliable: '通胀过高或货币变更、不宜比较的{n}个国家未列入排名。',
    noData: '该国没有工资数据。', share: '在{c}，一个巨无霸需要工作{m}分钟。全球第{r}名',
    method: '<p>平均时薪采用ILO雇员平均小时收入（本币）。没有时薪数据时用“平均月收入÷（每周实际工时×52÷12）”，若工时也缺失则按每周40小时计算并标注“估计”。</p><p>工资按消费者物价指数调整到最新年份。</p><p>巨无霸价格来自《经济学人》最新调查；没有单独价格的欧元区国家使用欧元区价格。</p><p>“同样的东西”使用居民消费购买力平价换算。平均收入会被高收入者拉高。</p>',
  },
  ko: {
    title: '1시간 일하면 무엇을 살 수 있을까?', lead: '각국의 평균 임금(ILO)과 물가를 합쳐, 같은 물건을 사려면 몇 시간 일해야 하는지 비교합니다.',
    hourly: '평균 시급', bm: '빅맥 1개', minutes: '분', hours: '시간', rankOf: '위 ({n}개국 중)',
    calc: '같은 물건에 몇 시간?', calcQ: '{c}에서', calcA: '짜리 물건을 각국에서 사려면', calcNote: '구매력평가로 각국 가격으로 바꾼 뒤, 그 나라 평균 시급으로 나눴습니다.',
    tabBm: '빅맥', tabWage: '시급(물가 조정)', colHourly: '평균 시급(현지 통화)', colPpp: '시급(국제 달러)', colBm: '빅맥에 필요한 노동', colHours: '주당 노동시간', colYear: '임금 연도',
    fastest: '빅맥 1개에 필요한 노동시간 (짧은 순)', est: '추정', unreliable: '물가 상승이 크거나 통화 변경 등으로 비교가 어려운 {n}개국은 순위에서 뺐습니다.',
    noData: '이 나라는 임금 데이터가 없습니다.', share: '{c}에서는 빅맥 1개에 {m}분 노동. 세계 {r}위',
    method: '<p>평균 시급은 ILO 피고용자 평균 시간당 소득(현지 통화)을 씁니다. 없으면 “평균 월소득 ÷ (주당 실노동시간×52÷12)”로 구하고, 노동시간도 없으면 주 40시간으로 가정해 “추정”으로 표시합니다.</p><p>임금은 최신 소비자물가지수 연도까지 물가 상승분을 반영했습니다.</p><p>빅맥 가격은 The Economist 최신 조사이며, 개별 가격이 없는 유로존 국가는 유로존 가격을 씁니다.</p><p>“같은 물건” 계산은 민간소비 구매력평가(PPP)를 씁니다. 평균 소득은 고소득자에 끌려 올라갑니다.</p>',
  },
  es: {
    title: '¿Qué se compra con una hora de trabajo?', lead: 'Salarios medios (OIT) y precios combinados muestran cuánto hay que trabajar en cada país para comprar lo mismo.',
    hourly: 'Salario medio por hora', bm: 'Un Big Mac', minutes: 'min', hours: 'h', rankOf: ' de {n} países',
    calc: '¿Cuántas horas para lo mismo?', calcQ: 'Algo que cuesta', calcA: 'en {c} requiere este trabajo en otros países', calcNote: 'El precio se convierte con paridades de poder adquisitivo y se divide por el salario medio por hora de cada país.',
    tabBm: 'Big Mac', tabWage: 'Salario (ajustado por precios)', colHourly: 'Salario por hora (moneda local)', colPpp: 'Salario por hora ($ internacionales)', colBm: 'Trabajo por un Big Mac', colHours: 'Horas por semana', colYear: 'Año del salario',
    fastest: 'Trabajo necesario para un Big Mac (de menor a mayor)', est: 'est.', unreliable: 'Se excluyen del ranking {n} países con inflación alta o cambios de moneda.',
    noData: 'No hay datos salariales de este país.', share: 'En {c}, un Big Mac cuesta {m} minutos de trabajo. Puesto {r} del mundo',
    method: '<p>El salario por hora es el ingreso medio por hora de los asalariados (OIT, moneda local). Si falta, se usa ingreso mensual medio ÷ (horas semanales trabajadas × 52 ÷ 12), suponiendo 40 horas (marcado “est.”) si tampoco hay horas.</p><p>Los salarios se actualizan con el índice de precios al consumo más reciente.</p><p>Los precios del Big Mac son de The Economist; los países del euro sin precio propio usan el de la zona euro.</p><p>“Lo mismo” usa PPA del consumo privado. Los ingresos medios están inflados por los salarios altos.</p>',
  },
};

const T = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
const dur = (min, t, lang) => min < 90 ? `${fmt(min, lang, min < 10 ? 1 : 0)} ${t('minutes')}` : `${fmt(min / 60, lang, 1)} ${t('hours')}`;

boot({
  id: 'jikyu', dict,
  render(data, t, lang, root, st) {
    const rows = data.rows;
    const ok = rows.filter(r => !r.unreliable);
    const bmRank = ok.filter(r => r.bmMin != null).sort((a, b) => a.bmMin - b.bmMin);
    const isos = rows.map(r => r.iso);
    if (!st.c || !isos.includes(st.c)) st.c = isos.includes(defaultCountry(lang)) ? defaultCountry(lang) : 'JPN';
    if (st.amount == null) st.amount = null;
    const me = rows.find(r => r.iso === st.c);
    const rk = bmRank.findIndex(r => r.iso === st.c) + 1;

    root.innerHTML = `<div class="controls">${countrySelect(isos, st.c, lang)}</div>
      <div class="kpis">
        <div class="kpi"><span>${t('hourly')}</span><b>${me ? fmt(me.hourly, lang, me.hourly < 100 ? 1 : 0) : '–'}</b><span>${esc(curOf(st.c))}${me?.hoursEst ? ` · ${t('est')}` : ''}</span></div>
        <div class="kpi"><span>${t('bm')}</span><b>${me?.bmMin != null ? dur(me.bmMin, t, lang) : '–'}</b><span>${rk ? `${lang === 'en' || lang === 'es' ? '#' + rk : rk}${T(t('rankOf'), { n: bmRank.length })}` : ''}</span></div>
      </div>
      ${me?.bmMin != null && rk ? shareX(T(t('share'), { c: name(st.c, lang), m: fmt(me.bmMin, lang, 0), r: rk }), lang) : ''}
      <h2>${t('calc')}</h2>
      <div class="card"><div class="controls">${T(t('calcQ'), { c: esc(name(st.c, lang)) })} <input type="number" id="amt" min="0" step="any" style="width:9em"> ${esc(curOf(st.c))} ${T(t('calcA'), { c: esc(name(st.c, lang)) })}</div><div id="calc"></div><p class="muted small">${t('calcNote')}</p></div>
      ${tabs([['bm', t('tabBm')], ['wage', t('tabWage')]], st.tab || 'bm')}
      <div id="view"></div>`;

    const amt = root.querySelector('#amt');
    const defAmt = me?.bm ? Math.round(me.bm * 10) : 1000;
    amt.value = st.amount ?? defAmt;
    const calc = () => {
      const x = +amt.value; st.amount = amt.value;
      const host = root.querySelector('#calc');
      if (!me?.ppp || !(x > 0)) { host.innerHTML = me ? '' : `<p class="muted">${t('noData')}</p>`; return; }
      const list = ok.filter(r => r.ppp).map(r => ({ r, h: x * (r.ppp / me.ppp) / r.hourly })).sort((a, b) => a.h - b.h);
      if (!list.find(l => l.r.iso === me.iso)) list.push({ r: me, h: x / me.hourly });
      const pick = [...list.slice(0, 6), ...list.slice(-6)];
      if (!pick.find(l => l.r.iso === me.iso)) pick.splice(6, 0, list.find(l => l.r.iso === me.iso));
      host.innerHTML = bars(pick.map(l => ({ label: cname(l.r.iso, lang), value: l.h, text: dur(l.h * 60, t, lang), hl: l.r.iso === me.iso, cls: l.r.iso === me.iso ? 'warn' : '' })));
    };
    amt.addEventListener('input', calc); calc();
    root.querySelector('#pick').onchange = e => { st.c = e.target.value; st.amount = null; st.redraw(); };

    const view = () => {
      const v = root.querySelector('#view');
      if ((st.tab || 'bm') === 'bm') {
        v.innerHTML = `<h3>${t('fastest')}</h3><div id="tb"></div>`;
        table(v.querySelector('#tb'), { lang, rows: bmRank, hl: st.c, sortKey: 'bmMin', sortAsc: true, cols: [
          { k: 'iso', h: t('country'), f: r => cname(r.iso, lang), s: r => name(r.iso, lang) },
          { k: 'bmMin', h: t('colBm'), n: 1, f: r => dur(r.bmMin, t, lang) },
          { k: 'bm', h: t('bm'), n: 1, f: r => `${fmt(r.bm, lang, 2)} <span class="muted">${esc(curOf(r.iso))}</span>` },
          { k: 'hourly', h: t('colHourly'), n: 1, f: r => fmt(r.hourly, lang, r.hourly < 100 ? 1 : 0) },
        ] });
      } else {
        v.innerHTML = `<div id="tb"></div>`;
        table(v.querySelector('#tb'), { lang, rows: ok.filter(r => r.hourlyUsdPpp != null), hl: st.c, sortKey: 'hourlyUsdPpp', cols: [
          { k: 'iso', h: t('country'), f: r => cname(r.iso, lang), s: r => name(r.iso, lang) },
          { k: 'hourlyUsdPpp', h: t('colPpp'), n: 1, f: r => fmt(r.hourlyUsdPpp, lang, 1) },
          { k: 'hours', h: t('colHours'), n: 1, f: r => `${fmt(r.hours, lang, 1)}${r.hoursEst ? ` <span class="muted">${t('est')}</span>` : ''}` },
          { k: 'earnY', h: t('colYear'), n: 1 },
        ] });
      }
      v.insertAdjacentHTML('beforeend', `<p class="muted small">${T(t('unreliable'), { n: rows.length - ok.length })}</p>`);
    };
    root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { st.tab = b.dataset.tab; root.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === b)); view(); });
    view();
  },
});

