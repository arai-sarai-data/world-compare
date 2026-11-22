import { boot, table, bars, scatter, fit, cname, name, fmt, compact, countrySelect, defaultCountry, pickCountry, tabs, shareX } from '../assets/common.js?v=3';

const dict = {
  ja: {
    title: '援助した国は、国連で味方する？', lead: '主な援助国5か国が各国に出した援助額と、国連総会でその援助国と同じ票を入れた割合を組み合わせました。',
    donor: '援助国', corr: '援助の多さと投票の一致の関係', strong: 'はっきりした関係', weak: '弱い関係', none: 'ほぼ関係なし', neg: '逆の関係',
    rLabel: '相関係数 r = {r}（{n}か国）', chart: '1人あたり援助額と投票一致率', xl: '1人あたり援助額（{a}〜{b}年合計, 米ドル, 対数）', yl: '{d}との投票一致率（%）',
    colAid: '援助額（合計）', colPc: '1人あたり', colAgree: '一致率', top: '援助を多く受けた国', mine: '{c}は国連でどの国と同じ票を入れるか', period: '対象：{a}〜{b}年の国連総会の記名投票{n}件', refNote: '中国とロシアは援助データがないため、投票の一致率だけ参考に示します。',
    share: '{d}の援助と国連投票の一致：r={r}',
    method: '<p>投票一致率：両国とも投票（賛成・反対・棄権）した記名投票のうち、同じ票だった割合。50件未満の組み合わせは除外。投票データはErik Voetenの国連総会投票データ（2019年まで）です。</p><p>援助額：OECD開発援助委員会の二国間援助の純額（世界銀行経由）を同じ期間で合計。1人あたりは2015年の人口で割っています。</p><p>相関係数は援助を受けた国だけで、1人あたり援助額の対数と一致率から計算しています。相関は因果関係を意味しません。地理や歴史的なつながりも影響します。</p>',
  },
  en: {
    title: 'Does aid buy votes at the UN?', lead: 'Aid from five major donors to each country, set against how often that country voted the same way as the donor in the UN General Assembly.',
    donor: 'Donor', corr: 'Link between aid and voting alike', strong: 'clear link', weak: 'weak link', none: 'almost no link', neg: 'reverse link',
    rLabel: 'correlation r = {r} ({n} countries)', chart: 'Aid per person and voting agreement', xl: 'Aid per person ({a}–{b} total, US$, log)', yl: 'Agreement with {d} (%)',
    colAid: 'Aid (total)', colPc: 'Per person', colAgree: 'Agreement', top: 'Largest recipients', mine: 'Who does {c} vote with at the UN?', period: '{n} recorded General Assembly votes, {a}–{b}', refNote: 'China and Russia have no aid data here; their agreement is shown for reference.',
    share: '{d} aid vs UN voting agreement: r={r}',
    method: '<p>Agreement: share of recorded votes where both countries voted (yes, no or abstain) and voted the same. Pairs with fewer than 50 shared votes are dropped. Votes from Erik Voeten’s UN General Assembly Voting Data (to 2019).</p><p>Aid: net bilateral aid from OECD DAC donors (via the World Bank), summed over the same period; per person uses 2015 population.</p><p>The correlation uses recipients only: log aid per person against agreement. Correlation is not causation; geography and history matter too.</p>',
  },
  zh: {
    title: '援助能换来联合国的选票吗？', lead: '把五大援助国对各国的援助额，与该国在联合国大会上与援助国投相同票的比例结合起来。',
    donor: '援助国', corr: '援助多少与投票一致的关系', strong: '关系明显', weak: '关系较弱', none: '几乎无关', neg: '反向关系',
    rLabel: '相关系数 r = {r}（{n}国）', chart: '人均援助与投票一致率', xl: '人均援助（{a}–{b}年合计，美元，对数）', yl: '与{d}的投票一致率（%）',
    colAid: '援助（合计）', colPc: '人均', colAgree: '一致率', top: '受援最多的国家', mine: '{c}在联合国与谁投相同的票', period: '{a}–{b}年联合国大会记名投票{n}次', refNote: '中国和俄罗斯没有援助数据，仅供参考显示投票一致率。',
    share: '{d}援助与联合国投票一致：r={r}',
    method: '<p>一致率：两国都投票（赞成、反对或弃权）的记名投票中投相同票的比例，共同投票少于50次的组合不计。投票数据来自Erik Voeten的联合国大会投票数据（至2019年）。</p><p>援助：OECD发展援助委员会双边援助净额（经世界银行），同期合计；人均按2015年人口计算。</p><p>相关系数仅用受援国，以人均援助对数与一致率计算。相关不等于因果，地理和历史也有影响。</p>',
  },
  ko: {
    title: '원조한 나라는 유엔에서 편을 들까?', lead: '주요 원조국 5개국이 각국에 준 원조액과, 유엔총회에서 그 원조국과 같은 표를 던진 비율을 합쳤습니다.',
    donor: '원조국', corr: '원조 규모와 투표 일치의 관계', strong: '뚜렷한 관계', weak: '약한 관계', none: '거의 관계 없음', neg: '반대 관계',
    rLabel: '상관계수 r = {r} ({n}개국)', chart: '1인당 원조액과 투표 일치율', xl: '1인당 원조액({a}~{b}년 합계, 달러, 로그)', yl: '{d}와의 투표 일치율(%)',
    colAid: '원조액(합계)', colPc: '1인당', colAgree: '일치율', top: '원조를 많이 받은 나라', mine: '{c}는 유엔에서 누구와 같은 표를 던질까', period: '{a}~{b}년 유엔총회 기명투표 {n}건', refNote: '중국과 러시아는 원조 데이터가 없어 투표 일치율만 참고로 보여 줍니다.',
    share: '{d} 원조와 유엔 투표 일치: r={r}',
    method: '<p>일치율: 두 나라가 모두 투표(찬성·반대·기권)한 기명투표 중 같은 표의 비율. 공통 투표가 50건 미만이면 제외. 투표 자료는 Erik Voeten의 유엔총회 투표 데이터(2019년까지)입니다.</p><p>원조액: OECD 개발원조위원회 양자원조 순액(세계은행 경유)을 같은 기간 합계. 1인당은 2015년 인구로 나눴습니다.</p><p>상관계수는 원조를 받은 나라만 대상으로, 1인당 원조액의 로그와 일치율로 계산했습니다. 상관은 인과가 아닙니다.</p>',
  },
  es: {
    title: '¿La ayuda compra votos en la ONU?', lead: 'La ayuda de cinco grandes donantes a cada país, frente a la frecuencia con que ese país votó igual que el donante en la Asamblea General.',
    donor: 'Donante', corr: 'Relación entre ayuda y voto coincidente', strong: 'relación clara', weak: 'relación débil', none: 'casi ninguna relación', neg: 'relación inversa',
    rLabel: 'correlación r = {r} ({n} países)', chart: 'Ayuda por persona y coincidencia de voto', xl: 'Ayuda por persona (total {a}–{b}, US$, log)', yl: 'Coincidencia con {d} (%)',
    colAid: 'Ayuda (total)', colPc: 'Por persona', colAgree: 'Coincidencia', top: 'Mayores receptores', mine: '¿Con quién vota {c} en la ONU?', period: '{n} votaciones nominales de la Asamblea General, {a}–{b}', refNote: 'China y Rusia no tienen datos de ayuda aquí; su coincidencia se muestra como referencia.',
    share: 'Ayuda de {d} y voto en la ONU: r={r}',
    method: '<p>Coincidencia: parte de las votaciones nominales en que ambos países votaron (sí, no o abstención) y votaron igual. Se descartan pares con menos de 50 votos comunes. Datos de Erik Voeten (hasta 2019).</p><p>Ayuda: ayuda bilateral neta de donantes del CAD de la OCDE (vía Banco Mundial) sumada en el mismo periodo; por persona con la población de 2015.</p><p>La correlación usa solo receptores: log de ayuda por persona frente a coincidencia. Correlación no es causalidad.</p>',
  },
};
const T = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);

boot({
  id: 'enjo', dict,
  render(data, t, lang, root, st) {
    const [a, b] = data.period;
    const rows = data.rows;
    st.d ||= lang === 'ja' ? 'JPN' : 'USA';
    const isos = rows.map(r => r.iso);
    st.c = pickCountry(st.c, isos, lang);
    root.innerHTML = `<p class="muted">${T(t('period'), { a, b, n: fmt(data.rollCalls, lang) })}</p>
      ${tabs(data.donors.map(d => [d, name(d, lang)]), st.d)}<div id="dv"></div>
      <h2 id="mh"></h2><div class="controls">${countrySelect(isos, st.c, lang)}</div><div id="mine"></div><p class="muted small">${t('refNote')}</p>`;
    const drawD = () => {
      const d = st.d;
      const rec = rows.filter(r => r.iso !== d && r.aid[d] > 0 && r.pop && r.agree[d] != null).map(r => ({ ...r, pc: r.aid[d] / r.pop }));
      const f = fit(rec.map(r => Math.log10(r.pc)), rec.map(r => r.agree[d]));
      const r = f ? f.r : 0;
      const word = r > 0.4 ? t('strong') : r > 0.15 ? t('weak') : r > -0.15 ? t('none') : t('neg');
      const v = root.querySelector('#dv');
      v.innerHTML = `<div class="callout">${t('corr')}: <b>${word}</b><br><span class="muted">${T(t('rLabel'), { r: fmt(r, lang, 2), n: rec.length })}</span></div>
        ${shareX(T(t('share'), { d: name(d, lang), r: fmt(r, lang, 2) }), lang)}
        <h3>${t('chart')}</h3><div id="sc"></div><h3>${t('top')}</h3><div id="tb"></div>`;
      scatter(v.querySelector('#sc'), { lang, logX: true, hl: st.c, xLabel: T(t('xl'), { a, b }), yLabel: T(t('yl'), { d: name(d, lang) }), line: f, pts: rec.map(x => ({ x: x.pc, y: x.agree[d], iso: x.iso, tip: `${name(x.iso, lang)} — ${t('colPc')} $${fmt(x.pc, lang, 1)}, ${t('colAgree')} ${fmt(x.agree[d], lang, 0)}%` })) });
      table(v.querySelector('#tb'), { lang, rows: rec, hl: st.c, sortKey: 'aidT', cols: [
        { k: 'iso', h: t('country'), f: x => cname(x.iso, lang), s: x => name(x.iso, lang) },
        { k: 'aidT', h: t('colAid'), n: 1, s: x => x.aid[d], f: x => '$' + compact(x.aid[d], lang) },
        { k: 'pc', h: t('colPc'), n: 1, f: x => '$' + fmt(x.pc, lang, x.pc < 10 ? 1 : 0) },
        { k: 'ag', h: t('colAgree'), n: 1, s: x => x.agree[d], f: x => fmt(x.agree[d], lang, 0) + '%' },
      ] });
    };
    const drawC = () => {
      const me = rows.find(r => r.iso === st.c);
      root.querySelector('#mh').textContent = T(t('mine'), { c: name(st.c, lang) });
      const list = [...data.donors, ...data.ref].filter(d => d !== st.c && me.agree[d] != null).map(d => ({ d, v: me.agree[d] })).sort((x, y) => y.v - x.v);
      root.querySelector('#mine').innerHTML = bars(list.map(x => ({ label: cname(x.d, lang), value: x.v, text: fmt(x.v, lang, 0) + '%', cls: data.ref.includes(x.d) ? 'warn' : '' })), { max: 100 });
    };
    root.querySelectorAll('[data-tab]').forEach(btn => btn.onclick = () => { st.d = btn.dataset.tab; root.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === btn)); drawD(); });
    root.querySelector('#pick').onchange = e => { st.c = e.target.value; drawC(); drawD(); };
    drawD(); drawC();
  },
});
