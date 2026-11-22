import { boot, bars, cname, name, fmt, countrySelect, defaultCountry, pickCountry, tabs, shareX, esc } from '../assets/common.js';

const P = ['nato', 'oda', 'abuja', 'edu'];
const dict = {
  ja: {
    title: '国の約束、守られてる？', lead: '各国が国際的に約束した数値目標と、実際の数字を並べました。',
    nato: 'NATO 国防費 GDP比2%', oda: '途上国援助 国民所得比0.7%', abuja: 'アフリカ 予算の15%を保健に', edu: '教育費 GDP比4%以上',
    natoD: '2014年のNATOウェールズ首脳会議で、加盟国は10年以内に国防費をGDPの2%に近づけると約束しました（2025年にはさらに高い目標で合意）。',
    odaD: '1970年の国連総会決議で、先進国は政府開発援助（ODA）を国民総所得の0.7%にすると約束し、その後も何度も確認されています。',
    abujaD: '2001年のアブジャ宣言で、アフリカ連合の各国は政府予算の15%以上を保健に充てると約束しました。',
    eduD: '2015年の仁川宣言（教育2030）で、各国は教育に「GDPの4〜6%」または「政府支出の15〜20%」以上を充てる目安に合意しました。どちらかを満たせば達成としています。',
    kept: '達成', notKept: '未達', of: '{a} / {b} か国が達成', target: '目標', now: '最新', tenAgo: '10年前', byCountry: '国ごとに見る', notApplicable: 'この国が対象の約束はデータがありません。', budgetShare: '政府支出に占める割合',
    share: '{p}：{a}/{b}か国が達成',
    method: '<p>各国の最新値（NATOとODAは2018年以降、その他は2015年以降）を目標と比べています。</p><p>国防費はSIPRI（世界銀行経由）、ODAはOECD開発援助委員会（Our World in Data経由）、保健と教育は世界銀行の統計です。国防費はNATO公表値と定義が少し異なります。</p><p>保健15%はアフリカ地域の国、国防2%はNATO加盟国（軍を持たないアイスランドを除く）が対象です。</p>',
  },
  en: {
    title: 'Are countries keeping their promises?', lead: 'International numeric pledges next to the actual numbers.',
    nato: 'NATO: defence at 2% of GDP', oda: 'Aid at 0.7% of national income', abuja: 'Africa: 15% of budget to health', edu: 'Education: 4%+ of GDP',
    natoD: 'At the 2014 Wales summit NATO members pledged to move towards spending 2% of GDP on defence within a decade (a higher target was agreed in 2025).',
    odaD: 'A 1970 UN General Assembly resolution set official development assistance at 0.7% of gross national income for rich countries; it has been reaffirmed many times.',
    abujaD: 'In the 2001 Abuja Declaration, African Union states pledged at least 15% of government budgets to health.',
    eduD: 'The 2015 Incheon Declaration (Education 2030) set benchmarks of 4–6% of GDP or 15–20% of public spending on education. Meeting either counts.',
    kept: 'Met', notKept: 'Not met', of: '{a} of {b} countries meet it', target: 'Target', now: 'Latest', tenAgo: '10 years earlier', byCountry: 'By country', notApplicable: 'No data on pledges for this country.', budgetShare: 'Share of public spending',
    share: '{p}: {a} of {b} countries meet it',
    method: '<p>Each country’s latest value (since 2018 for NATO and aid, since 2015 otherwise) is compared with the target.</p><p>Defence: SIPRI via World Bank; aid: OECD DAC via Our World in Data; health and education: World Bank. SIPRI defence figures differ slightly from NATO’s own.</p><p>Health covers African countries; defence covers NATO members except Iceland, which has no armed forces.</p>',
  },
  zh: {
    title: '各国守约了吗？', lead: '把各国做出的国际数值承诺与实际数字放在一起。',
    nato: '北约：国防开支占GDP 2%', oda: '援助占国民收入0.7%', abuja: '非洲：预算15%用于卫生', edu: '教育开支占GDP 4%以上',
    natoD: '2014年北约威尔士峰会上，成员国承诺十年内使国防开支接近GDP的2%（2025年又商定了更高目标）。',
    odaD: '1970年联合国大会决议要求发达国家将官方发展援助提高到国民总收入的0.7%，此后多次重申。',
    abujaD: '2001年《阿布贾宣言》中，非洲联盟各国承诺将至少15%的政府预算用于卫生。',
    eduD: '2015年《仁川宣言》（教育2030）提出教育投入达到GDP的4–6%或公共支出的15–20%，满足其一即视为达标。',
    kept: '达标', notKept: '未达标', of: '{b}国中{a}国达标', target: '目标', now: '最新', tenAgo: '10年前', byCountry: '按国家查看', notApplicable: '没有该国相关承诺的数据。', budgetShare: '占公共支出比例',
    share: '{p}：{b}国中{a}国达标',
    method: '<p>将各国最新值（北约与援助为2018年以后，其他为2015年以后）与目标比较。</p><p>国防：SIPRI（经世界银行）；援助：OECD发展援助委员会（经Our World in Data）；卫生和教育：世界银行。SIPRI数据与北约公布值略有差异。</p><p>卫生指标针对非洲国家；国防针对北约成员国（无军队的冰岛除外）。</p>',
  },
  ko: {
    title: '나라들은 약속을 지키고 있을까?', lead: '각국이 국제적으로 약속한 수치 목표와 실제 숫자를 나란히 놓았습니다.',
    nato: 'NATO 국방비 GDP 2%', oda: '원조 국민소득 0.7%', abuja: '아프리카 예산 15%를 보건에', edu: '교육비 GDP 4% 이상',
    natoD: '2014년 NATO 웨일스 정상회의에서 회원국은 10년 안에 국방비를 GDP의 2%에 가깝게 하겠다고 약속했습니다(2025년에 더 높은 목표에 합의).',
    odaD: '1970년 유엔총회 결의는 선진국의 공적개발원조를 국민총소득의 0.7%로 정했고, 이후 여러 차례 재확인되었습니다.',
    abujaD: '2001년 아부자 선언에서 아프리카연합 국가들은 정부 예산의 15% 이상을 보건에 쓰겠다고 약속했습니다.',
    eduD: '2015년 인천 선언(교육 2030)은 교육에 GDP의 4~6% 또는 공공지출의 15~20%를 쓰는 기준을 정했습니다. 하나라도 충족하면 달성으로 봅니다.',
    kept: '달성', notKept: '미달', of: '{b}개국 중 {a}개국 달성', target: '목표', now: '최신', tenAgo: '10년 전', byCountry: '나라별로 보기', notApplicable: '이 나라가 해당하는 약속의 데이터가 없습니다.', budgetShare: '공공지출 대비',
    share: '{p}: {b}개국 중 {a}개국 달성',
    method: '<p>각국의 최신값(NATO와 원조는 2018년 이후, 나머지는 2015년 이후)을 목표와 비교합니다.</p><p>국방비는 SIPRI(세계은행 경유), 원조는 OECD 개발원조위원회(Our World in Data 경유), 보건·교육은 세계은행 통계입니다. SIPRI 수치는 NATO 공식 수치와 조금 다릅니다.</p><p>보건 15%는 아프리카 국가, 국방 2%는 NATO 회원국(군대가 없는 아이슬란드 제외)이 대상입니다.</p>',
  },
  es: {
    title: '¿Cumplen los países sus promesas?', lead: 'Compromisos numéricos internacionales junto a las cifras reales.',
    nato: 'OTAN: defensa al 2% del PIB', oda: 'Ayuda al 0,7% de la renta nacional', abuja: 'África: 15% del presupuesto a salud', edu: 'Educación: 4%+ del PIB',
    natoD: 'En la cumbre de Gales de 2014, los aliados se comprometieron a acercarse al 2% del PIB en defensa en una década (en 2025 acordaron una meta más alta).',
    odaD: 'Una resolución de la Asamblea General de la ONU de 1970 fijó la ayuda oficial al desarrollo en el 0,7% de la renta nacional bruta de los países ricos; se ha reafirmado muchas veces.',
    abujaD: 'En la Declaración de Abuja de 2001, los países de la Unión Africana prometieron destinar al menos el 15% del presupuesto a salud.',
    eduD: 'La Declaración de Incheon de 2015 (Educación 2030) fijó referencias del 4–6% del PIB o del 15–20% del gasto público en educación. Basta con cumplir una.',
    kept: 'Cumple', notKept: 'No cumple', of: '{a} de {b} países cumplen', target: 'Meta', now: 'Último', tenAgo: '10 años antes', byCountry: 'Por país', notApplicable: 'No hay datos de compromisos para este país.', budgetShare: 'Parte del gasto público',
    share: '{p}: cumplen {a} de {b} países',
    method: '<p>Se compara el último valor de cada país (desde 2018 para OTAN y ayuda, desde 2015 en lo demás) con la meta.</p><p>Defensa: SIPRI vía Banco Mundial; ayuda: CAD de la OCDE vía Our World in Data; salud y educación: Banco Mundial. Las cifras de SIPRI difieren algo de las de la OTAN.</p><p>Salud: países africanos; defensa: miembros de la OTAN salvo Islandia, que no tiene fuerzas armadas.</p>',
  },
};
const T = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
const pill = (ok, t) => `<span class="pill ${ok ? 'good' : 'bad'}">${ok ? t('kept') : t('notKept')}</span>`;

boot({
  id: 'yakusoku', dict,
  render(data, t, lang, root, st) {
    const rows = data.rows;
    st.p ||= 'nato';
    const isos = [...new Set(rows.map(r => r.iso))];
    st.c = pickCountry(st.c, isos, lang);
    root.innerHTML = `${tabs(P.map(p => [p, t(p)]), st.p)}<div id="pl"></div><h2>${t('byCountry')}</h2><div class="controls">${countrySelect(isos, st.c, lang)}</div><div id="bc"></div>`;
    const drawP = () => {
      const list = rows.filter(r => r.p === st.p && r.v != null).sort((a, b) => b.v - a.v);
      const met = rows.filter(r => r.p === st.p && r.met).length, all = rows.filter(r => r.p === st.p).length;
      const max = Math.max(...list.map(r => r.v), list[0]?.target * 1.5 || 1);
      root.querySelector('#pl').innerHTML = `<p class="lead" style="margin-top:12px">${t(st.p + 'D')}</p>
        <div class="callout"><b>${T(t('of'), { a: met, b: all })}</b> · ${t('target')} ${fmt(list[0]?.target, lang, 1)}%</div>
        ${shareX(T(t('share'), { p: t(st.p), a: met, b: all }), lang)}
        ${bars(list.map(r => ({ label: cname(r.iso, lang), value: r.v, mark: r.target, text: `${fmt(r.v, lang, 2)}%`, cls: r.met ? 'good' : 'bad', hl: r.iso === st.c })), { max })}`;
    };
    const drawC = () => {
      const mine = rows.filter(r => r.iso === st.c);
      root.querySelector('#bc').innerHTML = mine.length ? mine.map(r => `<div class="card"><h3 style="margin-top:0">${esc(t(r.p))} ${pill(r.met, t)}</h3>
        <div class="kpis" style="margin:0"><div class="kpi"><span>${t('now')} (${r.y ?? '–'})</span><b>${r.v != null ? fmt(r.v, lang, 2) + '%' : '–'}</b></div>
        <div class="kpi"><span>${t('target')}</span><b>${fmt(r.target, lang, 1)}%</b></div>
        <div class="kpi"><span>${t('tenAgo')}</span><b>${r.before != null ? fmt(r.before, lang, 2) + '%' : '–'}</b></div>
        ${r.p === 'edu' && r.v2 != null ? `<div class="kpi"><span>${t('budgetShare')} (${r.y2 ?? '–'})</span><b>${r.v2 != null ? fmt(r.v2, lang, 1) + '%' : '–'}</b><span>${t('target')} 15%</span></div>` : ''}</div></div>`).join('') : `<p class="muted">${t('notApplicable')}</p>`;
    };
    root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { st.p = b.dataset.tab; root.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', x === b)); drawP(); });
    root.querySelector('#pick').onchange = e => { st.c = e.target.value; drawC(); drawP(); };
    drawP(); drawC();
    void name;
  },
});
