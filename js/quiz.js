// Brain game: endless quiz (exam questions + randomly generated ones) and flashcards.
(function () {
  const g = 9.81, PI = Math.PI;
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const rf = (a, b, dp = 1) => +(a + Math.random() * (b - a)).toFixed(dp);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const f = (x, s = 4) => String(Number(x.toPrecision(s)));
  const sin = d => Math.sin(d * PI / 180), cos = d => Math.cos(d * PI / 180);

  // Each generator returns { c: conceptId, q, ans, unit, sol } with fresh random numbers.
  const GEN = [
    () => { const r = rf(0.5, 3), F = ri(10, 200), t = pick([30, 45, 60, 90, 120, 150]), a = r * F * sin(t);
      return { c: 'torque', q: `A ${F} N force acts at the end of a ${r} m wrench. The angle between the wrench (r) and the force is ${t}°. What is the size of the torque?`, ans: a, unit: 'N·m',
        sol: `τ = r·F·sin θ = (${r})(${F}) sin ${t}° = **${f(a)} N·m**` }; },
    () => { let x = ri(-4, 4) || 2, y = ri(-4, 4) || -3; const Fx = ri(-50, 50), Fy = ri(-50, 50), a = x * Fy - y * Fx;
      return { c: 'torque', q: `A force F = (${Fx}î + ${Fy}ĵ) N acts at the point (${x}, ${y}) m. The pivot is at the origin and CCW is positive. Find the torque.`, ans: a, unit: 'N·m',
        sol: `τ = x·Fy − y·Fx = (${x})(${Fy}) − (${y})(${Fx}) = **${a} N·m** (${a > 0 ? 'CCW' : a < 0 ? 'CW' : 'none'})` }; },
    () => { const A = [ri(-5, 5), ri(-5, 5), ri(-5, 5)], B = [ri(-5, 5), ri(-5, 5), ri(-5, 5)], k = ri(0, 2), n = 'xyz'[k];
      const i = (k + 1) % 3, j = (k + 2) % 3, a = A[i] * B[j] - A[j] * B[i];
      return { c: 'cross-product', q: `A = (${A.join(', ')}), B = (${B.join(', ')}). Find the ${n}-component of A × B.`, ans: a, unit: '',
        sol: `(A × B)${n} = A${'xyz'[i]}·B${'xyz'[j]} − A${'xyz'[j]}·B${'xyz'[i]} = (${A[i]})(${B[j]}) − (${A[j]})(${B[i]}) = **${a}**` }; },
    () => { const F = ri(20, 300), t = ri(10, 80), which = pick(['x', 'y']), a = which === 'x' ? F * cos(t) : F * sin(t);
      return { c: 'vectors', q: `A ${F} N force points ${t}° above the horizontal. What is its ${which}-component?`, ans: a, unit: 'N',
        sol: `F${which} = F ${which === 'x' ? 'cos' : 'sin'} θ = ${F} ${which === 'x' ? 'cos' : 'sin'} ${t}° = **${f(a)} N**` }; },
    () => { const rpm = ri(5, 300), a = rpm * 2 * PI / 60;
      return { c: 'units', q: `Convert ${rpm} rpm to rad/s.`, ans: a, unit: 'rad/s', sol: `${rpm} × 2π / 60 = **${f(a)} rad/s**` }; },
    () => { const W = ri(2, 120), a = W / 32.2;
      return { c: 'units', q: `An object weighs ${W} lb. What is its mass in slugs?`, ans: a, unit: 'slug', sol: `m = W / g = ${W} / 32.2 = **${f(a)} slug**` }; },
    () => { const al = rf(1, 20), t = rf(1, 8), a = 0.5 * al * t * t;
      return { c: 'const-alpha', q: `A wheel starts from rest with α = ${al} rad/s². Through what angle does it turn in ${t} s?`, ans: a, unit: 'rad',
        sol: `θ = ω₀t + ½αt² = 0 + ½(${al})(${t})² = **${f(a)} rad** (${f(a / 2 / PI)} rev)` }; },
    () => { const al = rf(1, 15), w = ri(20, 400), a = w / al;
      return { c: 'const-alpha', q: `A motor starts from rest with constant α = ${al} rad/s². How long until ω = ${w} rad/s?`, ans: a, unit: 's',
        sol: `ω = ω₀ + αt → t = ω/α = ${w}/${al} = **${f(a)} s**` }; },
    () => { const r1 = rf(0.05, 0.3, 2), r2 = rf(0.1, 0.6, 2), w1 = ri(5, 100), a = r1 * w1 / r2;
      return { c: 'belts-gears', q: `A ${r1} m pulley spinning at ${w1} rad/s drives a ${r2} m pulley with a belt. Find ω of the second pulley.`, ans: a, unit: 'rad/s',
        sol: `r₁ω₁ = r₂ω₂ → ω₂ = (${r1})(${w1})/${r2} = **${f(a)} rad/s**` }; },
    () => { const r = rf(0.02, 0.2, 2), rev = ri(2, 60), a = r * rev * 2 * PI;
      return { c: 'linear-angular', q: `A reel of radius ${r} m turns ${rev} revolutions. How much line comes off?`, ans: a, unit: 'm',
        sol: `θ = ${rev} × 2π = ${f(rev * 2 * PI)} rad. s = rθ = **${f(a)} m**` }; },
    () => { const w = ri(2, 8), h = ri(2, 8), b = ri(2, 8), h2 = ri(2, 8);
      const A1 = w * h, A2 = 0.5 * b * h2, x1 = w / 2, x2 = w + b / 3, a = (A1 * x1 + A2 * x2) / (A1 + A2);
      return { c: 'center-of-mass', q: `A ${w} × ${h} rectangle sits from x = 0 to ${w}. A right triangle (base ${b}, height ${h2}) is attached on its right side, with its tall vertical side against the rectangle at x = ${w}. Find x̄.`, ans: a, unit: '',
        sol: `Rectangle: A = ${A1}, x̄ = ${x1}. Triangle: A = ${A2}, fat side on the left so x̄ = ${w} + ${b}/3 = ${f(x2)}.\nx̄ = (${A1}·${x1} + ${A2}·${f(x2)}) / (${A1} + ${A2}) = **${f(a)}**` }; },
    () => { const w = ri(6, 12), h = ri(3, 8), r = rf(0.5, Math.min(h, 4) / 2.5, 1), cx = rf(r + 0.5, w - r - 0.5, 1);
      const A1 = w * h, A2 = -PI * r * r, a = (A1 * w / 2 + A2 * cx) / (A1 + A2);
      return { c: 'center-of-mass', q: `A ${w} × ${h} plate (x = 0 to ${w}) has a circular hole of radius ${r} centered at x = ${cx}. Find x̄.`, ans: a, unit: '',
        sol: `Plate: A = ${A1}, x̄ = ${w / 2}. Hole: A = −π(${r})² = ${f(A2)}, x̄ = ${cx}.\nx̄ = (${A1}·${w / 2} + (${f(A2)})·${cx}) / (${A1} − ${f(-A2)}) = **${f(a)}**` }; },
    () => { const m = rf(0.5, 10), L = rf(0.5, 4), d = rf(0.1, L / 2, 2), a = m * L * L / 12 + m * d * d;
      return { c: 'parallel-axis', q: `A ${m} kg rod, ${L} m long, spins about an axis ${d} m from its center. Find I.`, ans: a, unit: 'kg·m²',
        sol: `I = (1/12)mL² + md² = (1/12)(${m})(${L})² + (${m})(${d})² = **${f(a)} kg·m²**` }; },
    () => { const [n, k] = pick([['solid disk', 0.5], ['solid sphere', 0.4], ['hoop', 1], ['hollow sphere', 2 / 3]]), m = rf(1, 30), r = rf(0.1, 1.5, 2), a = k * m * r * r;
      return { c: 'moment-of-inertia', q: `Find I of a ${m} kg ${n} of radius ${r} m about its center.`, ans: a, unit: 'kg·m²',
        sol: `I = ${f(k, 3)}·m·r² = ${f(k, 3)}(${m})(${r})² = **${f(a)} kg·m²**` }; },
    () => { const M = ri(2, 40), R = rf(0.1, 1, 2), F = ri(5, 120), I = 0.5 * M * R * R, a = F * R / I;
      return { c: 'newton-rotation', q: `A ${F} N force is applied tangentially to the rim of a ${M} kg solid disk (R = ${R} m) on a frictionless axle. Find α.`, ans: a, unit: 'rad/s²',
        sol: `I = ½MR² = ${f(I)}. τ = FR = ${f(F * R)}. α = τ/I = **${f(a)} rad/s²**` }; },
    () => { const m = rf(1, 20), M = ri(1, 40), a = m * g / (m + M / 2);
      return { c: 'pulley-systems', q: `A ${m} kg block hangs from a rope wrapped around a ${M} kg solid-disk pulley (frictionless axle). Released from rest, find the block's acceleration.`, ans: a, unit: 'm/s²',
        sol: `Block: mg − T = ma. Pulley: T·R = (½MR²)(a/R) → T = ½Ma.\nmg = (m + ½M)a → a = (${m})(9.81)/(${m} + ${M / 2}) = **${f(a)} m/s²**` }; },
    () => { const I = rf(0.2, 20), rpm = ri(10, 300), w = rpm * 2 * PI / 60, a = 0.5 * I * w * w;
      return { c: 'rot-ke', q: `A flywheel with I = ${I} kg·m² spins at ${rpm} rpm. Find its rotational KE.`, ans: a, unit: 'J',
        sol: `ω = ${rpm} × 2π/60 = ${f(w)} rad/s. KE = ½Iω² = ½(${I})(${f(w)})² = **${f(a)} J**` }; },
    () => { const [n, k] = pick([['solid sphere', 0.4], ['solid cylinder', 0.5], ['hoop', 1], ['hollow sphere', 2 / 3]]), h = rf(0.5, 15), a = Math.sqrt(2 * g * h / (1 + k));
      return { c: 'rolling', q: `A ${n} rolls without slipping from rest down a ramp of height ${h} m. Find its speed at the bottom (no losses).`, ans: a, unit: 'm/s',
        sol: `mgh = ½mv² + ½(k·mr²)(v/r)² → v = √(2gh/(1+k)) with k = ${f(k, 3)}.\nv = √(2·9.81·${h}/${f(1 + k, 3)}) = **${f(a)} m/s**` }; },
    () => { const m = rf(0.5, 10), r = rf(0.05, 0.4, 2), v = rf(1, 8), t = ri(5, 30), I = 0.4 * m * r * r;
      const Ei = 0.5 * m * v * v + 0.5 * I * (v / r) ** 2;
      const d = +(rf(0.5, 0.9, 2) * Ei / (m * g * sin(t))).toFixed(2), U = m * g * d * sin(t), a = Ei - U; // d below the no-loss max, so the loss is positive
      return { c: 'energy-rotation', q: `A ${m} kg solid sphere (r = ${r} m) rolls up a ${t}° incline starting at ${v} m/s and stops after ${d} m. How much energy was lost?`, ans: a, unit: 'J',
        sol: `h = ${d} sin ${t}° = ${f(d * sin(t))} m. KE_t = ${f(0.5 * m * v * v)}, KE_r = ½(⅖mr²)(v/r)² = ${f(0.5 * I * (v / r) ** 2)}. U = mgh = ${f(U)}.\nE_loss = KE_t + KE_r − U = **${f(a)} J**` }; },
    () => { const I = ri(50, 800), w1 = rf(0.5, 4, 2), m = ri(10, 80), r = rf(0.5, 3), a = I * w1 / (I + m * r * r);
      return { c: 'coam', q: `A turntable (I = ${I} kg·m²) spins freely at ${w1} rad/s. A ${m} kg person (point mass) steps on at ${r} m from the axis. Find the new ω.`, ans: a, unit: 'rad/s',
        sol: `I₁ω₁ = (I₁ + mr²)ω₂ → ω₂ = (${I})(${w1}) / (${I} + ${m}·${r}²) = **${f(a)} rad/s**` }; },
    () => { const m = rf(0.05, 0.5, 2), v = ri(10, 50), vb = ri(5, 30), r = rf(0.3, 1.2, 2), I = rf(0.5, 3), a = (m * v * r + m * vb * r) / I;
      return { c: 'coam', q: `A ${m} kg ball moving at ${v} m/s hits a resting rod (I = ${I} kg·m² about its pivot) ${r} m from the pivot and bounces straight back at ${vb} m/s. Find ω of the rod.`, ans: a, unit: 'rad/s',
        sol: `mvr = mv′r + Iω′ with v′ = −${vb}.\n(${m})(${v})(${r}) = (${m})(−${vb})(${r}) + ${I}ω′ → ω′ = **${f(a)} rad/s**` }; },
    () => { const I = rf(0.5, 50), rpm = ri(10, 200), a = I * rpm * 2 * PI / 60;
      return { c: 'angular-momentum', q: `An object with I = ${I} kg·m² spins at ${rpm} rpm. Find its angular momentum.`, ans: a, unit: 'kg·m²/s',
        sol: `ω = ${f(rpm * 2 * PI / 60)} rad/s. L = Iω = **${f(a)} kg·m²/s**` }; },
    () => { const t = ri(5, 300), rpm = ri(100, 3000), a = t * rpm * 2 * PI / 60;
      return { c: 'power-rotation', q: `A motor delivers ${t} N·m of torque at ${rpm} rpm. Find its power.`, ans: a, unit: 'W',
        sol: `ω = ${f(rpm * 2 * PI / 60)} rad/s. P = τω = **${f(a)} W**` }; },
    () => { const m1 = ri(20, 90), d1 = rf(0.5, 2.5), m2 = ri(20, 90), a = m1 * d1 / m2;
      return { c: 'equilibrium', q: `A ${m1} kg child sits ${d1} m left of a seesaw pivot. How far right must a ${m2} kg child sit to balance?`, ans: a, unit: 'm',
        sol: `m₁gd₁ = m₂gd₂ → d₂ = (${m1})(${d1})/${m2} = **${f(a)} m**` }; },
  ];

  function fromProblem(p) {
    if (p.kind === 'mc') return { c: p.concepts[0], cs: p.concepts, src: p, q: p.prompt, choices: p.choices, answer: p.answer, sol: p.why };
    return { c: p.concepts[0], cs: p.concepts, src: p, q: p.prompt, ans: p.value, unit: p.unit, sol: p.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') };
  }
  const genFor = c => GEN.filter(fn => { try { return fn().c === c; } catch { return false; } });
  const GEN_BY = {};
  CONCEPTS.forEach(c => (GEN_BY[c.id] = genFor(c.id)));

  function nextQuestion(mode) {
    const S = App.store;
    if (mode.startsWith('exam:')) return fromProblem(pick(PROBLEMS.filter(p => p.id.startsWith(mode.slice(5) + '-'))));
    if (mode === 'exam-mc') return fromProblem(pick(PROBLEMS.filter(p => p.kind === 'mc')));
    if (mode === 'gen') return { ...pick(GEN)(), gen: true };
    let concept = null;
    if (mode.startsWith('c:')) concept = mode.slice(2);
    if (mode === 'weak') { // pick a concept with probability ∝ how unmastered it is
      const ids = CONCEPTS.filter(c => c.group !== 'hub' && c.id !== 'process-method').map(c => c.id);
      const w = ids.map(id => 110 - (S.mastery[id] || 0)); let r = Math.random() * w.reduce((a, b) => a + b);
      concept = ids.find((id, i) => (r -= w[i]) < 0) || ids[0];
    }
    if (concept) {
      const probs = PROBLEMS.filter(p => p.concepts.includes(concept)), gens = GEN_BY[concept] || [];
      if (gens.length && (Math.random() < 0.6 || !probs.length)) return { ...pick(gens)(), gen: true };
      if (probs.length) return fromProblem(pick(probs));
    }
    return Math.random() < 0.5 ? { ...pick(GEN)(), gen: true } : fromProblem(pick(PROBLEMS));
  }

  // Tolerance: 2% relative (exam keys round), small absolute floor for answers near 0.
  function grade(given, ans) {
    if (!Number.isFinite(given)) return 'bad';
    const ok = x => Math.abs(x - ans) <= Math.max(0.02 * Math.abs(ans), 0.011);
    if (ok(given)) return 'right';
    if (ok(-given)) return 'sign';
    return 'wrong';
  }

  window.Quiz = {
    GEN, grade, nextQuestion,
    render(main, mode = 'mix') {
      const S = App.store;
      const opts = [['mix', '🎲 Everything mixed'], ['weak', '🎯 Focus on my weakest concepts'], ['gen', '🔢 Fresh random number problems'], ['exam-mc', '📝 Real exam multiple choice']]
        .concat(EXAMS.map(e => [`exam:${e.id}`, `📄 ${e.title} exam only`]))
        .concat(CONCEPTS.filter(c => c.group !== 'hub').map(c => [`c:${c.id}`, `• ${c.title}`]));
      main.innerHTML = `<div class="quiz">
        <div class="qhead"><h1>🧠 Brain Game</h1>
          <div class="hud"><span title="experience points">⚡ <b id="xp">${S.xp}</b> XP</span><span title="streak">🔥 <b id="streak">${S.streak}</b></span><span title="best streak">🏆 <b id="best">${S.best}</b></span></div></div>
        <select id="qmode">${opts.map(([v, l]) => `<option value="${v}" ${v === mode ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <div id="qcard" class="qcard"></div></div>`;
      const sel = main.querySelector('#qmode');
      sel.onchange = () => { location.hash = '#/quiz/' + encodeURIComponent(sel.value); };
      const card = main.querySelector('#qcard');
      const hud = () => { ['xp', 'streak', 'best'].forEach(k => (main.querySelector('#' + k).textContent = S[k])); };

      function ask() {
        const q = nextQuestion(mode), cs = q.cs || [q.c];
        let done = false;
        card.innerHTML = `<div class="qmeta">${cs.map(c => App.link(c)).join(' ')} ${q.src ? `<span class="tag">from ${App.link(q.src.id, App.examTitle(q.src.id) + ' #' + q.src.id.split('-')[1])}</span>` : '<span class="tag">generated</span>'}</div>
          <div class="qtext">${App.inline(q.q)}</div>
          ${q.choices ? `<div class="choices">${q.choices.map((c, i) => `<button class="choice" data-i="${i}">${App.inline(c)}</button>`).join('')}</div>`
            : `<div class="numin"><input id="ans" type="number" step="any" placeholder="your answer" autocomplete="off"> <span class="unit">${q.unit || ''}</span> <button class="btn" id="chk">Check</button></div>`}
          <div id="fb"></div>`;
        const fb = card.querySelector('#fb');
        function finish(result, extra) {
          if (done) return; done = true;
          const right = result === 'right';
          S.streak = right ? S.streak + 1 : 0; S.best = Math.max(S.best, S.streak);
          if (right) S.xp += 10 + Math.min(S.streak, 10);
          App.bump(cs, right ? 12 : -4);
          if (right && q.src) S.solved[q.src.id] = 1;
          App.save(); hud();
          fb.innerHTML = `<div class="callout ${right ? 'tip' : 'warn'}"><div class="ct">${right ? '✅ Correct!' : result === 'sign' ? '⚠️ Right size, wrong sign' : '❌ Not quite'}${extra || ''}</div>${App.md(q.sol)}</div>
            <button class="btn" id="next">Next question →</button> ${q.src ? App.link(q.src.id, 'Open full walkthrough') : App.link(q.c, 'Review this concept')}`;
          fb.querySelector('#next').onclick = ask;
          fb.querySelector('#next').focus();
        }
        if (q.choices) {
          card.querySelectorAll('.choice').forEach(b => (b.onclick = () => {
            if (done) return;
            card.querySelectorAll('.choice').forEach(x => { if (+x.dataset.i === q.answer) x.classList.add('right'); });
            if (+b.dataset.i !== q.answer) b.classList.add('wrong');
            finish(+b.dataset.i === q.answer ? 'right' : 'wrong');
          }));
        } else {
          const inp = card.querySelector('#ans');
          const check = () => { const r = grade(parseFloat(inp.value), q.ans); if (r === 'bad') { inp.focus(); return; } finish(r, ` &nbsp; <span class="muted">answer: ${f(q.ans)} ${q.unit || ''}</span>`); };
          card.querySelector('#chk').onclick = check;
          inp.onkeydown = e => { if (e.key === 'Enter') check(); };
          inp.focus();
        }
      }
      ask();
    },

    cards(main, only = '') {
      const all = [];
      CONCEPTS.forEach(c => (c.cards || []).forEach(([q, a]) => { if (!only || c.id === only) all.push({ q, a, c: c.id }); }));
      const deck = all.sort(() => Math.random() - 0.5);
      let i = 0, flipped = false, got = 0;
      main.innerHTML = `<div class="quiz"><div class="qhead"><h1>🃏 Flashcards</h1><div class="hud"><span id="fcount"></span></div></div>
        <select id="fsel"><option value="">All concepts (${all.length} cards)</option>${CONCEPTS.filter(c => c.cards).map(c => `<option value="${c.id}" ${c.id === only ? 'selected' : ''}>${c.title}</option>`).join('')}</select>
        <div class="flash" id="flash" tabindex="0"></div>
        <div class="row"><button class="btn ghost" id="again">↺ Again</button><button class="btn" id="gotit">✓ Got it</button></div>
        <p class="muted">Click the card or press Space to flip. ← again, → got it.</p></div>`;
      const fl = main.querySelector('#flash');
      main.querySelector('#fsel').onchange = e => { location.hash = '#/cards/' + e.target.value; };
      function show() {
        main.querySelector('#fcount').textContent = deck.length ? `${got} learned · ${deck.length - i} left` : '';
        if (i >= deck.length) { fl.innerHTML = `<div class="face">🎉 Deck done! ${got} cards learned.<br><button class="btn" id="re">Shuffle again</button></div>`; fl.querySelector('#re').onclick = () => Quiz.cards(main, only); return; }
        const c = deck[i];
        fl.className = 'flash' + (flipped ? ' flipped' : '');
        fl.innerHTML = `<div class="face">${flipped ? '<small>answer</small>' + App.inline(c.a) : '<small>' + App.link(c.c) + '</small>' + App.inline(c.q)}</div>`;
      }
      const flip = () => { flipped = !flipped; show(); };
      const answer = ok => { if (i >= deck.length) return; if (ok) { got++; App.bump([deck[i].c], 3); App.save(); } else deck.push(deck[i]); i++; flipped = false; show(); };
      fl.onclick = e => { if (!e.target.closest('a')) flip(); };
      main.querySelector('#again').onclick = () => answer(false);
      main.querySelector('#gotit').onclick = () => answer(true);
      main.onkeydown = e => { if (e.key === ' ') { e.preventDefault(); flip(); } if (e.key === 'ArrowRight') answer(true); if (e.key === 'ArrowLeft') answer(false); };
      fl.focus(); show();
    },
  };
})();
