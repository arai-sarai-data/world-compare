// Shared runtime for all World, Compared sites: languages, country names, tables, charts, page frame.
export const LANGS = [['ja', '日本語'], ['en', 'English'], ['zh', '中文'], ['ko', '한국어'], ['es', 'Español']];
const LOC = { ja: 'ja-JP', en: 'en-US', zh: 'zh-CN', ko: 'ko-KR', es: 'es-ES' };
export const REPO = 'https://github.com/arai-sarai-data/world-compare';

const C = {
  ja: { site: '世界くらべ', tag: 'ばらばらの公開データを組み合わせて、国を比べる', search: '国名で検索', more: 'さらに表示', sources: 'データの出典', updated: 'データ更新日', method: '計算方法と注意点', loading: '読み込み中…', error: 'データを読み込めませんでした。少し待ってから再読み込みしてください。', share: 'Xで共有', rank: '順位', country: '国', noMatch: '該当する国はありません', code: 'ソースコード', license: '集計結果は CC BY 4.0 で自由に使えます。元データの条件は各出典に従います。', back: '一覧へ', all: 'すべて', you: '比べたい国', year: '年', Africa: 'アフリカ', Americas: '南北アメリカ', Asia: 'アジア', Europe: 'ヨーロッパ', Oceania: 'オセアニア', region: '地域', none: 'データなし', open: '開く' },
  en: { site: 'World, Compared', tag: 'Scattered public data, combined to compare countries', search: 'Search countries', more: 'Show more', sources: 'Data sources', updated: 'Data updated', method: 'Method and caveats', loading: 'Loading…', error: 'Could not load the data. Please reload in a moment.', share: 'Share on X', rank: 'Rank', country: 'Country', noMatch: 'No matching country', code: 'Source code', license: 'Results are free to reuse under CC BY 4.0. Original data keep their own terms.', back: 'All sites', all: 'All', you: 'Country to compare', year: 'Year', Africa: 'Africa', Americas: 'Americas', Asia: 'Asia', Europe: 'Europe', Oceania: 'Oceania', region: 'Region', none: 'No data', open: 'Open' },
  zh: { site: '世界比一比', tag: '把分散的公开数据组合起来，比较各国', search: '搜索国家', more: '显示更多', sources: '数据来源', updated: '数据更新日期', method: '计算方法与注意事项', loading: '加载中…', error: '无法加载数据，请稍后刷新。', share: '分享到X', rank: '排名', country: '国家', noMatch: '没有符合的国家', code: '源代码', license: '统计结果可依 CC BY 4.0 自由使用。原始数据遵循各来源的条款。', back: '全部网站', all: '全部', you: '要比较的国家', year: '年份', Africa: '非洲', Americas: '美洲', Asia: '亚洲', Europe: '欧洲', Oceania: '大洋洲', region: '地区', none: '无数据', open: '打开' },
  ko: { site: '세계 비교', tag: '흩어진 공개 데이터를 합쳐 나라를 비교합니다', search: '나라 검색', more: '더 보기', sources: '데이터 출처', updated: '데이터 갱신일', method: '계산 방법과 주의점', loading: '불러오는 중…', error: '데이터를 불러오지 못했습니다. 잠시 후 새로 고침해 주세요.', share: 'X에 공유', rank: '순위', country: '나라', noMatch: '해당하는 나라가 없습니다', code: '소스 코드', license: '집계 결과는 CC BY 4.0으로 자유롭게 쓸 수 있습니다. 원자료는 각 출처의 조건을 따릅니다.', back: '전체 사이트', all: '전체', you: '비교할 나라', year: '연도', Africa: '아프리카', Americas: '아메리카', Asia: '아시아', Europe: '유럽', Oceania: '오세아니아', region: '지역', none: '데이터 없음', open: '열기' },
  es: { site: 'El mundo, comparado', tag: 'Datos públicos dispersos, combinados para comparar países', search: 'Buscar país', more: 'Mostrar más', sources: 'Fuentes de datos', updated: 'Datos actualizados', method: 'Método y advertencias', loading: 'Cargando…', error: 'No se pudieron cargar los datos. Vuelve a cargar en un momento.', share: 'Compartir en X', rank: 'Puesto', country: 'País', noMatch: 'Ningún país coincide', code: 'Código fuente', license: 'Los resultados pueden reutilizarse con CC BY 4.0. Los datos originales mantienen sus condiciones.', back: 'Todos los sitios', all: 'Todos', you: 'País para comparar', year: 'Año', Africa: 'África', Americas: 'América', Asia: 'Asia', Europe: 'Europa', Oceania: 'Oceanía', region: 'Región', none: 'Sin datos', open: 'Abrir' },
};
export const common = C;

const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { } } };

export function getLang() {
  const q = new URLSearchParams(location.search).get('lang') || location.hash.slice(1);
  if (C[q]) return q;
  const s = store.get('wc-lang'); if (C[s]) return s;
  const n = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return C[n] ? n : 'en';
}

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let NAMES = {};
export async function loadNames(base) {
  if (Object.keys(NAMES).length) return NAMES;
  NAMES = await (await fetch(base + 'assets/countries.json')).json();
  return NAMES;
}
export const name = (iso, lang) => NAMES[iso]?.[lang] || NAMES[iso]?.en || iso;
export const region = iso => NAMES[iso]?.r || 'Other';
export const cur = iso => NAMES[iso]?.cur || '';
// Windows shows flag emoji as two letters; detect real flag rendering once and hide them otherwise.
const FLAGS = (() => {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 16; const x = c.getContext('2d');
    x.font = '14px sans-serif'; x.fillText('\u{1F1EF}\u{1F1F5}', 0, 14);
    const d = x.getImageData(0, 0, 16, 16).data;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] && (Math.abs(d[i] - d[i + 1]) > 40 || Math.abs(d[i] - d[i + 2]) > 40)) return true;
    return false;
  } catch { return false; }
})();
export const flag = iso => { if (!FLAGS) return ''; const a = NAMES[iso]?.a2; return a && a.length === 2 && a !== 'XK' ? String.fromCodePoint(...[...a].map(c => 127397 + c.charCodeAt(0))) : ''; };
export const cname = (iso, lang) => `<span class="cn">${flag(iso)} ${esc(name(iso, lang))}</span>`;

export function fmt(n, lang, d = 0) {
  if (n == null || Number.isNaN(n)) return '–';
  if (Math.abs(n) < 0.5 * 10 ** -d) n = 0; // avoid "-0"
  return new Intl.NumberFormat(LOC[lang], { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n);
}
export function compact(n, lang) {
  if (n == null || Number.isNaN(n)) return '–';
  return new Intl.NumberFormat(LOC[lang], { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}
export function date(s, lang) {
  if (!s) return '–';
  const d = new Date(s); if (isNaN(d)) return s;
  return new Intl.DateTimeFormat(LOC[lang], { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
}

// Horizontal bars on one scale. rows: [{label(html), value, text, cls}]
export function bars(rows, { max, min = 0 } = {}) {
  const m = max ?? Math.max(...rows.map(r => Math.abs(r.value)), 1e-9);
  return `<div class="bars">${rows.map(r => `<div class="brow${r.hl ? ' hl' : ''}"><span class="lab">${r.label}</span><span class="track"><em class="${r.cls || ''}" style="width:${Math.max(0.6, Math.min(100, 100 * (Math.abs(r.value) - min) / (m - min)))}%"></em>${r.mark != null ? `<b class="mark" style="left:${Math.min(100, 100 * r.mark / m)}%"></b>` : ''}</span><span class="val">${r.text ?? r.value}</span></div>`).join('')}</div>`;
}

// Sortable, searchable table. cols: [{k, h, n:numeric, f:(row)=>html, s:(row)=>sortValue}]
export function table(host, { cols, rows, lang, search = r => name(r.iso, lang) + ' ' + r.iso, pageSize = 20, sortKey = null, sortAsc = false, rank = true, hl = null }) {
  let q = '', k = sortKey, asc = sortAsc, shown = pageSize;
  const c = C[lang];
  host.innerHTML = `<div class="tools"><input type="search" placeholder="${c.search}" aria-label="${c.search}"></div><div class="tbl"><table><thead></thead><tbody></tbody></table></div><div class="more"></div>`;
  const inp = host.querySelector('input'), thead = host.querySelector('thead'), tbody = host.querySelector('tbody'), more = host.querySelector('.more');
  const val = (col, r) => col.s ? col.s(r) : r[col.k];
  function draw() {
    let list = rows;
    if (k) { const col = cols.find(x => x.k === k); list = [...list].sort((a, b) => { const x = val(col, a), y = val(col, b); if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1; return (x > y ? 1 : x < y ? -1 : 0) * (asc ? 1 : -1); }); }
    const ranked = list.map((r, i) => [r, i + 1]);
    const filtered = q ? ranked.filter(([r]) => search(r).toLowerCase().includes(q)) : ranked;
    thead.innerHTML = `<tr>${rank ? `<th class="n">${c.rank}</th>` : ''}${cols.map(col => `<th data-k="${col.k}" class="${col.n ? 'n' : ''} ${col.k === k ? 'sorted' + (asc ? ' asc' : '') : ''}" scope="col" tabindex="0">${col.h}</th>`).join('')}</tr>`;
    tbody.innerHTML = filtered.slice(0, shown).map(([r, i]) => `<tr class="${hl && r.iso === hl ? 'hl' : ''}">${rank ? `<td class="rank n">${i}</td>` : ''}${cols.map(col => `<td class="${col.n ? 'n' : ''}">${col.f ? col.f(r) : esc(r[col.k])}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${cols.length + 1}" class="muted">${c.noMatch}</td></tr>`;
    more.innerHTML = filtered.length > shown ? `<button class="btn" type="button">${c.more} (${fmt(filtered.length - shown, lang)})</button>` : '';
  }
  const sortBy = th => { if (!th) return; if (k === th.dataset.k) asc = !asc; else { k = th.dataset.k; asc = false; } draw(); };
  inp.addEventListener('input', () => { q = inp.value.trim().toLowerCase(); shown = pageSize; draw(); });
  thead.addEventListener('click', e => sortBy(e.target.closest('th[data-k]')));
  thead.addEventListener('keydown', e => { if (e.key === 'Enter') sortBy(e.target.closest('th[data-k]')); });
  more.addEventListener('click', e => { if (e.target.closest('button')) { shown += pageSize * 3; draw(); } });
  draw();
}

// Scatter plot (SVG). pts: [{x, y, iso, tip}], hl: iso to highlight. line: {a, b} for y = a + b*x (in plotted x units).
export function scatter(host, { pts, xLabel, yLabel, logX = false, logY = false, hl = null, line = null, xRef = null, yRef = null, lang }) {
  const W = 640, H = 380, L = 52, R = 14, T = 14, B = 44;
  const fx = v => logX ? Math.log10(v) : v, fy = v => logY ? Math.log10(v) : v;
  const P = pts.filter(p => p.x != null && p.y != null && (!logX || p.x > 0) && (!logY || p.y > 0));
  if (!P.length) { host.innerHTML = ''; return; }
  const xs = P.map(p => fx(p.x)), ys = P.map(p => fy(p.y));
  let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  if (xRef != null) { x0 = Math.min(x0, fx(xRef)); x1 = Math.max(x1, fx(xRef)); }
  if (yRef != null) { y0 = Math.min(y0, fy(yRef)); y1 = Math.max(y1, fy(yRef)); }
  const px = (x1 - x0) * 0.04 || 1, py = (y1 - y0) * 0.06 || 1; x0 -= px; x1 += px; y0 -= py; y1 += py;
  const sx = v => L + (v - x0) / (x1 - x0) * (W - L - R), sy = v => H - B - (v - y0) / (y1 - y0) * (H - T - B);
  const ticks = (a, b, log) => {
    if (log) { const out = []; for (let e = Math.floor(a); e <= Math.ceil(b); e++) for (const m of [1, 2, 5]) { const v = Math.log10(m) + e; if (v >= a && v <= b) out.push(v); } return out; }
    const span = b - a, step0 = Math.pow(10, Math.floor(Math.log10(span / 5))), step = [1, 2, 5, 10].map(m => m * step0).find(s => span / s <= 6);
    const out = []; for (let v = Math.ceil(a / step) * step; v <= b; v += step) out.push(+v.toFixed(10)); return out;
  };
  const lab = (v, log) => { const n = log ? Math.pow(10, v) : v; return Math.abs(n) < 1 && n !== 0 ? new Intl.NumberFormat(LOC[lang], { maximumSignificantDigits: 2 }).format(n) : compact(n, lang); };
  let g = '';
  for (const v of ticks(x0, x1, logX)) g += `<line class="grid" x1="${sx(v)}" x2="${sx(v)}" y1="${T}" y2="${H - B}"/><text class="tick" x="${sx(v)}" y="${H - B + 16}" text-anchor="middle">${lab(v, logX)}</text>`;
  for (const v of ticks(y0, y1, logY)) g += `<line class="grid" y1="${sy(v)}" y2="${sy(v)}" x1="${L}" x2="${W - R}"/><text class="tick" x="${L - 6}" y="${sy(v) + 4}" text-anchor="end">${lab(v, logY)}</text>`;
  if (xRef != null) g += `<line class="ref" x1="${sx(fx(xRef))}" x2="${sx(fx(xRef))}" y1="${T}" y2="${H - B}"/>`;
  if (yRef != null) g += `<line class="ref" y1="${sy(fy(yRef))}" y2="${sy(fy(yRef))}" x1="${L}" x2="${W - R}"/>`;
  if (line) g += `<line class="fit" x1="${sx(x0)}" y1="${sy(line.a + line.b * x0)}" x2="${sx(x1)}" y2="${sy(line.a + line.b * x1)}"/>`;
  const dots = P.map(p => `<circle class="dot${p.iso === hl ? ' hl' : ''}" cx="${sx(fx(p.x)).toFixed(1)}" cy="${sy(fy(p.y)).toFixed(1)}" r="${p.iso === hl ? 7 : 4}" data-iso="${p.iso}"><title>${esc(p.tip || name(p.iso, lang))}</title></circle>`);
  const h = P.find(p => p.iso === hl);
  const hlLabel = h ? `<text class="hlab" x="${Math.min(W - R - 4, sx(fx(h.x)) + 10)}" y="${sy(fy(h.y)) - 10}" text-anchor="${sx(fx(h.x)) > W - 120 ? 'end' : 'start'}">${esc(name(h.iso, lang))}</text>` : '';
  host.innerHTML = `<figure class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(yLabel)} / ${esc(xLabel)}">${g}<line class="axis" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/><line class="axis" x1="${L}" x2="${L}" y1="${T}" y2="${H - B}"/>${dots.join('')}${hlLabel}<text class="alab" x="${(L + W - R) / 2}" y="${H - 6}" text-anchor="middle">${esc(xLabel)}</text><text class="alab" transform="translate(13 ${(T + H - B) / 2}) rotate(-90)" text-anchor="middle">${esc(yLabel)}</text></svg><figcaption class="tip" aria-live="polite"></figcaption></figure>`;
  const tip = host.querySelector('.tip');
  host.querySelector('svg').addEventListener('pointerover', e => { const d = e.target.closest('circle'); if (d) tip.textContent = d.querySelector('title').textContent; });
}

// Least squares y = a + b x
export function fit(xs, ys) {
  const n = xs.length; if (n < 3) return null;
  const mx = xs.reduce((s, v) => s + v, 0) / n, my = ys.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
  const b = sxy / sxx; return { a: my - b * mx, b, r: sxy / Math.sqrt(sxx * syy) };
}

export function shareX(text, lang) {
  const u = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.origin + location.pathname + '?lang=' + lang)}`;
  return `<a class="share" href="${u}" target="_blank" rel="noopener">𝕏 ${C[lang].share}</a>`;
}

export function countrySelect(isos, value, lang, id = 'pick') {
  const opts = [...isos].sort((a, b) => name(a, lang).localeCompare(name(b, lang), LOC[lang]));
  return `<label class="pick">${C[lang].you} <select id="${id}">${opts.map(i => `<option value="${i}"${i === value ? ' selected' : ''}>${esc(name(i, lang))}</option>`).join('')}</select></label>`;
}

export function tabs(items, active) {
  return `<div class="tabs" role="tablist">${items.map(([k, label]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${k === active}">${label}</button>`).join('')}</div>`;
}

export const defaultCountry = lang => ({ ja: 'JPN', en: 'USA', zh: 'CHN', ko: 'KOR', es: 'ESP' }[lang]);
// Keep the current choice if valid; else the language's home country, Japan, the US, or the first available.
export const pickCountry = (cur, isos, lang) => [cur, defaultCountry(lang), 'JPN', 'USA', isos[0]].find(c => c && isos.includes(c));

// Page frame. dict: {ja:{title, lead, ...}}; render(data, t, lang, root, state)
export async function boot({ id, dict, render, base = '../' }) {
  let lang = getLang(), data = null;
  const root = document.getElementById('app');
  const t = k => dict[lang]?.[k] ?? C[lang][k] ?? dict.en?.[k] ?? C.en[k] ?? k;
  const header = document.createElement('header'); header.className = 'top';
  document.body.prepend(header);
  const footer = document.createElement('footer'); document.body.append(footer);
  const state = {};
  state.redraw = () => draw();

  function frame() {
    document.documentElement.lang = lang;
    document.title = `${t('title')} | ${C[lang].site}`;
    header.innerHTML = `<a class="home" href="${base}?lang=${lang}">← ${C[lang].site}</a><select class="lang" aria-label="Language">${LANGS.map(([k, v]) => `<option value="${k}"${k === lang ? ' selected' : ''}>${v}</option>`).join('')}</select>`;
    header.querySelector('select').onchange = e => { lang = e.target.value; store.set('wc-lang', lang); history.replaceState(null, '', '?lang=' + lang); draw(); };
  }
  function foot() {
    const src = (data?.sources || []).map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>${s.note ? ` <span class="muted">${esc(s.note)}</span>` : ''}</li>`).join('');
    footer.innerHTML = `<div class="wrap"><details><summary>${C[lang].method}</summary><div class="method">${t('method')}</div></details><h2>${C[lang].sources}</h2><ul class="src">${src}</ul><p class="muted">${C[lang].updated}: ${date(data?.updated, lang)} · <a href="${REPO}" target="_blank" rel="noopener">${C[lang].code}</a> · ${C[lang].license}</p></div>`;
  }
  function draw() {
    frame();
    if (!data) { root.innerHTML = `<p class="muted">${C[lang].loading}</p>`; return; }
    root.innerHTML = `<h1>${t('title')}</h1><p class="lead">${t('lead')}</p><div id="body"></div>`;
    try { render(data, t, lang, root.querySelector('#body'), state); }
    catch (e) { console.error(e); root.querySelector('#body').innerHTML = `<p class="err">${C[lang].error}</p>`; }
    foot();
  }
  draw();
  try {
    const [d] = await Promise.all([fetch(`${base}data/${id}.json`, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }), loadNames(base)]);
    data = d;
  } catch (e) { console.error(e); root.innerHTML = `<p class="err">${C[lang].error}</p>`; return; }
  draw();
}
