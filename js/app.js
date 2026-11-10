// App shell: note registry, markdown-lite renderer, router, sidebar, panels, progress store.
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---------- progress store (per browser) ----------
  const KEY = 'ef151-vault-v1';
  const blank = () => ({ mastery: {}, visited: {}, solved: {}, xp: 0, streak: 0, best: 0 });
  let store = blank();
  try { store = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { /* private mode: run without saving */ }

  // ---------- notes & links ----------
  const NOTES = {};
  const examOf = id => EXAMS.find(e => id.startsWith(e.id + '-'));
  CONCEPTS.forEach(c => (NOTES[c.id] = { ...c, type: 'concept' }));
  EXAMS.forEach(e => (NOTES['exam-' + e.id] = { id: 'exam-' + e.id, title: e.title + ' Exam', group: 'exam', type: 'exam', exam: e }));
  PROBLEMS.forEach(p => (NOTES[p.id] = { ...p, type: 'problem', group: NOTES[p.concepts[0]].group, title: `${examOf(p.id).title} #${p.id.split('-')[1]}: ${p.title}` }));

  const out = {}, back = {};
  const addLink = (a, b) => { if (a === b || !NOTES[b]) return; (out[a] ??= new Set()).add(b); (back[b] ??= new Set()).add(a); };
  CONCEPTS.forEach(c => [...c.body.matchAll(/\[\[([^\]|]+)/g)].forEach(m => addLink(c.id, m[1])));
  PROBLEMS.forEach(p => { p.concepts.forEach(c => addLink(p.id, c)); addLink(p.id, 'exam-' + examOf(p.id).id); });
  EXAMS.forEach(e => addLink('exam-' + e.id, 'start-here'));

  // ---------- markdown-lite ----------
  function link(id, label) {
    const n = NOTES[id];
    if (!n) return `<span class="broken">${esc(label || id)}</span>`;
    return `<a class="wl" href="#/n/${id}" data-id="${id}">${esc(label || n.title)}</a>`;
  }
  function inline(s) {
    return esc(s)
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, id, l) => link(id, l && l.replace(/&amp;/g, '&')))
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<i>$2</i>');
  }
  function md(src) {
    const L = String(src).trim().split('\n'), html = [];
    let para = [];
    const flush = () => { if (para.length) { html.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
    for (let i = 0; i < L.length; i++) {
      const line = L[i].trimEnd(); let m;
      if (!line.trim()) { flush(); continue; }
      if ((m = line.match(/^(#{1,3}) (.*)/))) { flush(); html.push(`<h${m[1].length + 1}>${inline(m[2])}</h${m[1].length + 1}>`); continue; }
      if ((m = line.match(/^\$\$ (.*)/))) { flush(); html.push(`<div class="formula">${inline(m[1])}</div>`); continue; }
      if ((m = line.match(/^\{\{w:(\w+)\}\}$/))) { flush(); html.push(`<div class="widget" data-w="${m[1]}"></div>`); continue; }
      if ((m = line.match(/^> \[!(\w+)\] ?(.*)/))) {
        flush(); const inner = [];
        while (L[i + 1] && L[i + 1].startsWith('>')) inner.push(L[++i].replace(/^> ?/, ''));
        const icon = { tip: '💡', warn: '⚠️', example: '📘' }[m[1]] || '📌';
        html.push(`<div class="callout ${m[1]}"><div class="ct">${icon} ${inline(m[2])}</div>${md(inner.join('\n'))}</div>`); continue;
      }
      if (line.startsWith('|')) {
        flush(); const rows = [line];
        while (L[i + 1] && L[i + 1].startsWith('|')) rows.push(L[++i]);
        const cells = r => r.trim().replace(/^\||\|$/g, '').split(/\|(?![^[]*\]\])/).map(c => c.trim()); // keep [[id|label]] intact
        const body = rows.filter((r, k) => k !== 1 || !/^\|[\s|:-]+\|?$/.test(r));
        html.push(`<table><thead><tr>${cells(body[0]).map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.slice(1).map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
        continue;
      }
      if ((m = line.match(/^(- |\d+\. )/))) {
        flush(); const ol = /\d/.test(m[1][0]), items = [line];
        while (L[i + 1] && (ol ? /^\d+\. /.test(L[i + 1]) : L[i + 1].startsWith('- '))) items.push(L[++i]);
        html.push(`<${ol ? 'ol' : 'ul'}>${items.map(t => `<li>${inline(t.replace(/^(- |\d+\. )/, ''))}</li>`).join('')}</${ol ? 'ol' : 'ul'}>`);
        continue;
      }
      para.push(line.trim());
    }
    flush();
    return html.join('\n');
  }

  const App = (window.App = {
    NOTES, store, link, inline, md, out, back,
    examTitle: id => examOf(id).title,
    save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* not persisted */ } },
    bump(ids, d) { ids.forEach(id => { if (NOTES[id]?.type === 'concept') store.mastery[id] = Math.max(0, Math.min(100, (store.mastery[id] || 0) + d)); }); },
  });

  // ---------- sidebar ----------
  function renderTree() {
    const groups = {};
    CONCEPTS.filter(c => c.group !== 'hub').forEach(c => (groups[c.group] ??= []).push(c));
    const item = (id, label, cls = '') => `<a class="ti ${cls}" href="#/n/${id}" data-id="${id}"><span class="dot" style="background:${GROUPS[NOTES[id].group].color}"></span>${esc(label)}${store.solved[id] ? ' <span class="ok">✓</span>' : ''}</a>`;
    $('#tree').innerHTML = `
      <div class="tsec">Play</div>
      <a class="ti" href="#/graph">🕸️ Graph view</a><a class="ti" href="#/quiz/mix">🧠 Brain game</a><a class="ti" href="#/cards/">🃏 Flashcards</a><a class="ti" href="#/progress">📈 My progress</a>
      <div class="tsec">Notes</div>${item('start-here', 'Start Here', 'bold')}
      ${Object.entries(groups).map(([gk, cs]) => `<details open><summary>${GROUPS[gk].label}</summary>${cs.map(c => item(c.id, c.title)).join('')}</details>`).join('')}
      <div class="tsec">Exams</div>
      ${EXAMS.map(e => `<details><summary>${e.title}</summary>${item('exam-' + e.id, 'Overview', 'bold')}${PROBLEMS.filter(p => p.id.startsWith(e.id + '-')).map(p => item(p.id, '#' + p.id.split('-')[1] + ' ' + p.title)).join('')}</details>`).join('')}`;
    markActive();
  }
  function markActive() {
    const h = location.hash;
    document.querySelectorAll('#tree .ti').forEach(a => {
      const on = a.getAttribute('href') === h || (h.startsWith('#/quiz') && a.getAttribute('href').startsWith('#/quiz'));
      a.classList.toggle('active', on);
      if (on) { const d = a.closest('details'); if (d) d.open = true; }
    });
  }
  $('#filter').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#tree .ti').forEach(a => (a.style.display = !q || a.textContent.toLowerCase().includes(q) ? '' : 'none'));
    document.querySelectorAll('#tree details').forEach(d => (d.open = !!q || d.open));
  });

  // ---------- quick switcher (Ctrl+K) ----------
  const pal = $('#palette'), pin = $('#palette input'), plist = $('#palette ul');
  let hits = [], sel = 0;
  const plain = n => (n.body || n.prompt || '') + ' ' + (n.steps || []).join(' ');
  function openPalette() { pal.hidden = false; pin.value = ''; search(); pin.focus(); }
  function search() {
    const q = pin.value.toLowerCase().trim();
    hits = Object.values(NOTES).map(n => {
      const t = n.title.toLowerCase(), b = plain(n).toLowerCase();
      const s = !q ? (n.type === 'concept' ? 1 : 0) : t.startsWith(q) ? 4 : t.includes(q) ? 3 : b.includes(q) ? 1 : 0;
      return { n, s };
    }).filter(h => h.s > 0).sort((a, b) => b.s - a.s).slice(0, 14);
    sel = 0; drawHits();
  }
  function drawHits() {
    plist.innerHTML = hits.map((h, i) => `<li class="${i === sel ? 'sel' : ''}" data-id="${h.n.id}"><span class="dot" style="background:${GROUPS[h.n.group].color}"></span>${esc(h.n.title)}<small>${h.n.type}</small></li>`).join('') || '<li class="muted">No matches</li>';
  }
  function go(id) { pal.hidden = true; location.hash = '#/n/' + id; }
  pin.addEventListener('input', search);
  pin.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, hits.length - 1); drawHits(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); drawHits(); e.preventDefault(); }
    if (e.key === 'Enter' && hits[sel]) go(hits[sel].n.id);
    if (e.key === 'Escape') pal.hidden = true;
  });
  plist.addEventListener('click', e => { const li = e.target.closest('li[data-id]'); if (li) go(li.dataset.id); });
  pal.addEventListener('click', e => { if (e.target === pal) pal.hidden = true; });
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); } });
  $('#searchbtn').onclick = openPalette;

  // ---------- graph helpers ----------
  function graphData(ids) {
    const set = new Set(ids);
    const nodes = ids.map(id => {
      const n = NOTES[id];
      return { id, label: n.type === 'problem' ? `${examOf(id).id.toUpperCase()} #${id.split('-')[1]}` : n.title, color: GROUPS[n.group].color,
        r: n.type === 'problem' ? 2.5 : n.type === 'exam' ? 6 : n.id === 'start-here' ? 9 : 5, big: n.type !== 'problem', type: n.type };
    });
    const edges = [];
    ids.forEach(a => (out[a] || []).forEach(b => { if (set.has(b)) edges.push([a, b]); }));
    return { nodes, edges };
  }
  const nodeStyle = n => n.type === 'concept' ? { ring: (store.mastery[n.id] || 0) / 100 }
    : n.type === 'problem' && !store.visited[n.id] ? { fill: getComputedStyle(document.documentElement).getPropertyValue('--edge') } : {};

  function localGraph(id) {
    const ids = new Set([id, ...(out[id] || []), ...(back[id] || [])]);
    const box = $('#localgraph'); box.innerHTML = '<canvas></canvas>';
    const { nodes, edges } = graphData([...ids]);
    ForceGraph(box.firstChild, nodes, edges, { focus: id, onOpen: go, getStyle: nodeStyle, linkLen: 45, repulse: 500, zoom: 0.9, labels: ids.size < 14 ? 'all' : 'auto' });
  }

  // ---------- views ----------
  const main = $('#main');
  function mountWidgets(root) {
    root.querySelectorAll('.widget').forEach(w => { const fn = WIDGETS[w.dataset.w]; if (fn) fn(w); else w.textContent = 'missing widget ' + w.dataset.w; });
  }
  function masteryBar(id) {
    const v = store.mastery[id] || 0;
    return `<div class="mastery" title="Mastery: right answers fill it, wrong answers drain it a little"><div style="width:${v}%"></div><span>Mastery ${v}%</span></div>`;
  }
  function problemList(ps) {
    return `<table class="plist"><tbody>${ps.map(p => `<tr><td style="white-space:nowrap">${link(p.id, examOf(p.id).title + ' #' + p.id.split('-')[1])}</td><td>${link(p.id, p.title)}</td><td><span class="tag">${p.kind === 'mc' ? 'multiple choice' : 'free response'}</span></td><td>${p.concepts.map(c => `<span class="chip" style="--c:${GROUPS[NOTES[c].group].color}">${link(c, NOTES[c].title)}</span>`).join(' ')}</td><td>${store.solved[p.id] ? '✓' : ''}</td></tr>`).join('')}</tbody></table>`;
  }

  function viewConcept(n) {
    const uses = PROBLEMS.filter(p => p.concepts.includes(n.id));
    main.innerHTML = `<article class="note">
      <div class="crumbs"><span class="dot" style="background:${GROUPS[n.group].color}"></span>${GROUPS[n.group].label}</div>
      <h1>${esc(n.title)}</h1>
      ${n.group !== 'hub' ? `${masteryBar(n.id)}<div class="row"><a class="btn" href="#/quiz/c:${n.id}">🧠 Quiz me on this</a>${n.cards ? `<a class="btn ghost" href="#/cards/${n.id}">🃏 ${n.cards.length} flashcards</a>` : ''}</div>` : ''}
      ${md(n.body)}
      ${uses.length ? `<h2>Exam problems that use this (${uses.length})</h2>${problemList(uses)}` : ''}
    </article>`;
    mountWidgets(main);
  }

  function viewExam(n) {
    const ps = PROBLEMS.filter(p => p.id.startsWith(n.exam.id + '-'));
    const count = {}; ps.forEach(p => p.concepts.forEach(c => (count[c] = (count[c] || 0) + 1)));
    main.innerHTML = `<article class="note">
      <div class="crumbs">${link('start-here')} › Exams</div>
      <h1>${esc(n.title)}</h1>
      <div class="row"><a class="btn" href="#/quiz/exam:${n.exam.id}">🧠 Quiz me on this exam</a></div>
      <p>${ps.filter(p => store.solved[p.id]).length} of ${ps.length} solved. Problems 1 to 8 are multiple choice (2 pts); 9 to 14 are free response.</p>
      ${problemList(ps)}
      <h2>Concepts on this exam</h2>
      <p>${Object.entries(count).sort((a, b) => b[1] - a[1]).map(([c, k]) => `<span class="chip" style="--c:${GROUPS[NOTES[c].group].color}">${link(c)} ×${k}</span>`).join(' ')}</p>
    </article>`;
  }

  function viewProblem(p) {
    const ex = examOf(p.id), sibs = PROBLEMS.filter(q => q.id.startsWith(ex.id + '-')), k = sibs.indexOf(p);
    const nav = `<div class="pnav">${k > 0 ? link(sibs[k - 1].id, '← #' + sibs[k - 1].id.split('-')[1]) : '<span></span>'}${link('exam-' + ex.id, ex.title + ' overview')}${k < sibs.length - 1 ? link(sibs[k + 1].id, '#' + sibs[k + 1].id.split('-')[1] + ' →') : '<span></span>'}</div>`;
    const chips = `<p class="muted">Concepts: ${p.concepts.map(c => `<span class="chip" style="--c:${GROUPS[NOTES[c].group].color}">${link(c)}</span>`).join(' ')}</p>`;
    const head = `<div class="crumbs">${link('exam-' + ex.id, ex.title)} › Problem ${p.id.split('-')[1]} · ${p.kind === 'mc' ? 'multiple choice' : 'free response'}</div><h1>${esc(p.title)}</h1>${chips}<div class="prompt">${inline(p.prompt)}</div>`;
    const reward = () => { if (!store.solved[p.id]) { store.solved[p.id] = 1; store.xp += 15; App.bump(p.concepts, 10); App.save(); renderTree(); } };

    if (p.kind === 'mc') {
      main.innerHTML = `<article class="note">${head}<div class="choices">${p.choices.map((c, i) => `<button class="choice" data-i="${i}">${inline(c)}</button>`).join('')}</div><div id="fb"></div>${nav}</article>`;
      main.querySelectorAll('.choice').forEach(b => (b.onclick = () => {
        const right = +b.dataset.i === p.answer;
        main.querySelectorAll('.choice').forEach(x => { x.disabled = true; if (+x.dataset.i === p.answer) x.classList.add('right'); });
        if (!right) { b.classList.add('wrong'); App.bump(p.concepts, -3); App.save(); } else reward();
        $('#fb').innerHTML = `<div class="callout ${right ? 'tip' : 'warn'}"><div class="ct">${right ? '✅ Correct!' : '❌ The answer is: ' + inline(p.choices[p.answer])}</div><p>${inline(p.why)}</p></div><button class="btn ghost" id="retry">Try again</button>`;
        $('#retry').onclick = () => viewProblem(p);
      }));
      return;
    }
    main.innerHTML = `<article class="note">${head}
      <h2>What you know</h2><ul>${p.given.map(g => `<li>${inline(g)}</li>`).join('')}</ul>
      <h2>What you want</h2><p><b>${inline(p.find)}</b></p>
      <h2>Try it yourself first</h2>
      <div class="numin"><input id="ans" type="number" step="any" placeholder="your answer"> <span class="unit">${esc(p.unit)}</span> <button class="btn" id="chk">Check</button></div><div id="fb"></div>
      <h2>Step-by-step solution</h2>
      <ol class="steps">${p.steps.map(s => `<li class="hidden">${inline(s)}</li>`).join('')}</ol>
      <div class="row"><button class="btn" id="nextstep">Show next step</button><button class="btn ghost" id="allsteps">Show all</button></div>
      <div id="final" hidden><div class="callout tip"><div class="ct">Final answer</div><p><b>${p.value} ${esc(p.unit)}</b></p></div></div>
      ${p.traps && p.traps.length ? `<div class="callout warn"><div class="ct">⚠️ Common mistakes</div><ul>${p.traps.map(t => `<li>${inline(t)}</li>`).join('')}</ul></div>` : ''}
      ${nav}</article>`;
    const lis = [...main.querySelectorAll('.steps li')];
    const reveal = all => {
      const nxt = lis.find(l => l.classList.contains('hidden'));
      (all ? lis : nxt ? [nxt] : []).forEach(l => l.classList.remove('hidden'));
      if (!lis.some(l => l.classList.contains('hidden'))) { $('#final').hidden = false; $('#nextstep').disabled = true; }
    };
    $('#nextstep').onclick = () => reveal(false);
    $('#allsteps').onclick = () => reveal(true);
    const check = () => {
      const r = Quiz.grade(parseFloat($('#ans').value), p.value);
      if (r === 'bad') return;
      if (r === 'right') reward(); else { App.bump(p.concepts, -2); App.save(); }
      $('#fb').innerHTML = `<div class="callout ${r === 'right' ? 'tip' : 'warn'}"><div class="ct">${r === 'right' ? '✅ Nailed it! That matches the key.' : r === 'sign' ? '⚠️ Right size, wrong sign. Check CW vs CCW / direction.' : '❌ Not yet. Reveal one step at a time below and try again.'}</div></div>`;
    };
    $('#chk').onclick = check;
    $('#ans').onkeydown = e => { if (e.key === 'Enter') check(); };
  }

  function viewGraph() {
    $('#right').hidden = true;
    main.innerHTML = `<div class="gview"><div class="gbar"><b>Graph view</b>
      <label><input type="checkbox" id="gprob" ${localStorage.getItem('ef151-gprob') === '0' ? '' : 'checked'}> show exam problems</label>
      <span class="legend">${Object.values(GROUPS).map(g => `<span><i style="background:${g.color}"></i>${g.label}</span>`).join('')}</span>
      <span class="muted">drag · scroll to zoom · click to open · green ring = mastery</span></div><div class="gcanvas"><canvas></canvas></div></div>`;
    const draw = () => {
      const showP = $('#gprob').checked;
      try { localStorage.setItem('ef151-gprob', showP ? '1' : '0'); } catch { /* ignore */ }
      const box = main.querySelector('.gcanvas'); box.innerHTML = '<canvas></canvas>';
      const ids = Object.keys(NOTES).filter(id => showP || NOTES[id].type !== 'problem');
      const { nodes, edges } = graphData(ids);
      ForceGraph(box.firstChild, nodes, edges, { onOpen: go, getStyle: nodeStyle, linkLen: showP ? 40 : 90, repulse: showP ? 1600 : 4000, warm: 400 });
    };
    $('#gprob').onchange = draw; draw();
  }

  function viewProgress() {
    $('#right').hidden = true;
    const cs = CONCEPTS.filter(c => c.group !== 'hub');
    const avg = Math.round(cs.reduce((s, c) => s + (store.mastery[c.id] || 0), 0) / cs.length);
    main.innerHTML = `<article class="note"><h1>📈 My Progress</h1>
      <div class="hud big"><span>⚡ <b>${store.xp}</b> XP</span><span>🏆 best streak <b>${store.best}</b></span><span>✓ <b>${Object.keys(store.solved).length}</b> / ${PROBLEMS.length} problems solved</span><span>👁 <b>${Object.keys(store.visited).length}</b> / ${Object.keys(NOTES).length} notes explored</span><span>🧠 overall mastery <b>${avg}%</b></span></div>
      <h2>Mastery by concept</h2><table class="stats">${cs.map(c => `<tr><td>${link(c.id)}</td><td style="width:50%"><div class="bar" style="width:${store.mastery[c.id] || 0}%"></div></td><td>${store.mastery[c.id] || 0}%</td><td><a href="#/quiz/c:${c.id}">practice</a></td></tr>`).join('')}</table>
      <h2>By exam</h2><table class="stats">${EXAMS.map(e => { const ps = PROBLEMS.filter(p => p.id.startsWith(e.id + '-')), s = ps.filter(p => store.solved[p.id]).length; return `<tr><td>${link('exam-' + e.id, e.title)}</td><td style="width:50%"><div class="bar" style="width:${s / ps.length * 100}%"></div></td><td>${s} / ${ps.length}</td></tr>`; }).join('')}</table>
      <p><button class="btn ghost" id="reset">Reset all progress</button></p></article>`;
    $('#reset').onclick = () => { if (confirm('Erase all XP, mastery and solved problems on this browser?')) { Object.assign(store, blank()); App.save(); renderTree(); viewProgress(); } };
  }

  function viewNote(id) {
    const n = NOTES[id] || NOTES['start-here'];
    store.visited[n.id] = 1; App.save();
    $('#right').hidden = false;
    if (n.type === 'concept') viewConcept(n); else if (n.type === 'exam') viewExam(n); else viewProblem(n);
    document.title = n.title + ' · Rotation Vault';
    const list = (s, empty) => s && s.size ? [...s].map(x => `<li><span class="dot" style="background:${GROUPS[NOTES[x].group].color}"></span>${link(x)}</li>`).join('') : `<li class="muted">${empty}</li>`;
    $('#backlinks').innerHTML = list(back[n.id], 'Nothing links here yet');
    $('#outlinks').innerHTML = list(out[n.id], 'No outgoing links');
    localGraph(n.id);
  }

  function route() {
    const [, view, arg = ''] = location.hash.split('/');
    const a = decodeURIComponent(arg);
    main.onkeydown = null;
    if (view === 'graph') viewGraph();
    else if (view === 'quiz') { $('#right').hidden = true; Quiz.render(main, a || 'mix'); }
    else if (view === 'cards') { $('#right').hidden = true; Quiz.cards(main, a); }
    else if (view === 'progress') viewProgress();
    else viewNote(view === 'n' ? a : 'start-here');
    if (view !== 'quiz') main.scrollTop = 0;
    markActive();
    document.body.classList.remove('nav-open');
  }

  // ---------- chrome ----------
  const theme = localStorage.getItem('ef151-theme');
  if (theme) document.documentElement.dataset.theme = theme;
  $('#themebtn').onclick = () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const nxt = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nxt;
    try { localStorage.setItem('ef151-theme', nxt); } catch { /* ignore */ }
    route();
  };
  $('#navbtn').onclick = () => document.body.classList.toggle('nav-open');
  window.addEventListener('hashchange', route);
  renderTree();
  route();
})();
