// Interactive widgets embedded in notes with {{w:name}}.
(function () {
  const W = (window.WIDGETS = {});
  const g = 9.81;
  const C = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmt = (x, s = 4) => (Number.isFinite(x) ? String(Number(x.toPrecision(s))) : '—');
  const el = html => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };

  // Builds labelled sliders; calls cb(values) on every change.
  function sliders(box, specs, cb) {
    const vals = {};
    const wrap = el('<div class="ctl"></div>');
    specs.forEach(s => {
      vals[s.k] = s.v;
      const row = el(`<label><span>${s.label}</span><input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.v}"><b></b></label>`);
      const inp = row.querySelector('input'), out = row.querySelector('b');
      const show = () => { out.textContent = fmt(vals[s.k]) + (s.unit ? ' ' + s.unit : ''); };
      inp.addEventListener('input', () => { vals[s.k] = +inp.value; show(); cb(vals); });
      show(); wrap.appendChild(row);
    });
    box.appendChild(wrap);
    return vals;
  }
  function canvas(box, w, h) {
    const c = el(`<canvas class="wcanvas" style="aspect-ratio:${w}/${h}"></canvas>`);
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr; c.height = h * dpr; box.appendChild(c);
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    ctx.clear = () => ctx.clearRect(0, 0, w, h);
    return ctx;
  }
  function arrow(ctx, x1, y1, x2, y2, color, wdt = 2.5) {
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = ctx.fillStyle = color; ctx.lineWidth = wdt;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4));
    ctx.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4)); ctx.fill();
  }
  function animate(ctx, frame) { // runs until the canvas leaves the page
    let last = performance.now();
    const tick = now => { if (!ctx.canvas.isConnected) return; frame(Math.min(0.05, (now - last) / 1000)); last = now; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  const readout = box => box.appendChild(el('<div class="readout"></div>'));
  const title = (box, t) => box.appendChild(el(`<div class="wtitle">⚙ ${t}</div>`));

  W.examstats = box => {
    const counts = {};
    PROBLEMS.forEach(p => p.concepts.forEach(c => { (counts[c] ??= { n: 0, ex: new Set() }).n++; counts[c].ex.add(p.id.split('-')[0]); }));
    const rows = Object.entries(counts).sort((a, b) => b[1].n - a[1].n);
    const max = rows[0][1].n;
    box.appendChild(el(`<table class="stats"><thead><tr><th>Concept</th><th>Problems</th><th>On how many of 6 exams</th></tr></thead><tbody>${
      rows.map(([id, c]) => `<tr><td>${App.link(id)}</td><td><div class="bar" style="width:${(c.n / max) * 100}%"></div>${c.n}</td><td>${c.ex.size} / 6</td></tr>`).join('')
    }</tbody></table>`));
  };

  W.rpm = box => {
    title(box, 'Unit converter');
    const out = readout(box);
    const v = sliders(box, [
      { k: 'rpm', label: 'Speed', min: 1, max: 300, step: 1, v: 27, unit: 'rpm' },
      { k: 'lb', label: 'Weight', min: 1, max: 100, step: 1, v: 48, unit: 'lb' },
    ], r);
    function r() {
      const w = v.rpm * 2 * Math.PI / 60;
      out.innerHTML = `${v.rpm} rpm × 2π / 60 = <b>${fmt(w)} rad/s</b> · period T = 60 / ${v.rpm} = <b>${fmt(60 / v.rpm)} s</b><br>${v.lb} lb ÷ 32.2 = <b>${fmt(v.lb / 32.2)} slug</b>`;
    }
    r();
  };

  W.cross = box => {
    title(box, 'Cross product calculator');
    const ids = ['ax', 'ay', 'az', 'bx', 'by', 'bz'], def = [1, 3, 5, 2, -4, -6];
    const f = el(`<div class="vecin">A = (${ids.slice(0, 3).map((k, i) => `<input type="number" data-k="${k}" value="${def[i]}">`).join(', ')})
      <br>B = (${ids.slice(3).map((k, i) => `<input type="number" data-k="${k}" value="${def[i + 3]}">`).join(', ')})</div>`);
    box.appendChild(f);
    const out = readout(box);
    const r = () => {
      const q = {}; f.querySelectorAll('input').forEach(i => (q[i.dataset.k] = +i.value || 0));
      const x = q.ay * q.bz - q.az * q.by, y = q.az * q.bx - q.ax * q.bz, z = q.ax * q.by - q.ay * q.bx;
      out.innerHTML = `x: Ay·Bz − Az·By = (${q.ay})(${q.bz}) − (${q.az})(${q.by}) = <b>${x}</b><br>
        y: Az·Bx − Ax·Bz = (${q.az})(${q.bx}) − (${q.ax})(${q.bz}) = <b>${y}</b><br>
        z: Ax·By − Ay·Bx = (${q.ax})(${q.by}) − (${q.ay})(${q.bx}) = <b>${z}</b><br>
        A × B = <b>(${x}î ${y < 0 ? '−' : '+'} ${Math.abs(y)}ĵ ${z < 0 ? '−' : '+'} ${Math.abs(z)}k̂)</b> &nbsp; |A × B| = ${fmt(Math.hypot(x, y, z))}`;
    };
    f.addEventListener('input', r); r();
  };

  W.torque = box => {
    title(box, 'Torque playground: τ = r·F·sin θ');
    const ctx = canvas(box, 600, 300), out = readout(box);
    const v = sliders(box, [
      { k: 'r', label: 'Arm length r', min: 0.2, max: 3, step: 0.1, v: 2, unit: 'm' },
      { k: 'F', label: 'Force F', min: 0, max: 100, step: 1, v: 60, unit: 'N' },
      { k: 'th', label: 'Angle θ (r → F)', min: -180, max: 180, step: 1, v: 90, unit: '°' },
    ], draw);
    function draw() {
      ctx.clear();
      const px = 150, py = 200, S = 110, arm = -20 * Math.PI / 180, th = v.th * Math.PI / 180;
      const tx = px + v.r * S / 3 * 1.6 * Math.cos(arm), ty = py + v.r * S / 3 * 1.6 * Math.sin(arm);
      const fa = arm - th, L = 30 + v.F * 1.2; // canvas y is flipped, so CCW is a negative angle
      const fx = tx + L * Math.cos(fa), fy = ty + L * Math.sin(fa);
      // line of action and the perpendicular from the pivot to it
      const ux = Math.cos(fa), uy = Math.sin(fa), t = (px - tx) * ux + (py - ty) * uy;
      const qx = tx + t * ux, qy = ty + t * uy;
      ctx.setLineDash([5, 5]); ctx.strokeStyle = C('--muted'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(tx - 600 * ux, ty - 600 * uy); ctx.lineTo(tx + 600 * ux, ty + 600 * uy); ctx.stroke();
      ctx.setLineDash([]); ctx.strokeStyle = C('--good'); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
      ctx.strokeStyle = C('--text'); ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke(); ctx.lineCap = 'butt';
      ctx.fillStyle = C('--accent'); ctx.beginPath(); ctx.arc(px, py, 8, 0, 7); ctx.fill();
      if (v.F > 0) arrow(ctx, tx, ty, fx, fy, C('--bad'), 3);
      const tau = v.r * v.F * Math.sin(th), rp = Math.abs(v.r * Math.sin(th));
      ctx.fillStyle = C('--text'); ctx.font = '13px system-ui';
      ctx.fillText('pivot', px - 18, py + 26);
      ctx.fillStyle = C('--good'); ctx.fillText('r⊥ (moment arm)', (px + qx) / 2 + 6, (py + qy) / 2);
      out.innerHTML = `r⊥ = r·|sin θ| = <b>${fmt(rp)} m</b> &nbsp; τ = (${v.r})(${v.F}) sin(${v.th}°) = <b>${fmt(tau)} N·m</b> → ${Math.abs(tau) < 1e-9 ? 'no rotation' : tau > 0 ? 'CCW (+)' : 'CW (−)'}`;
    }
    draw();
  };

  W.seesaw = box => {
    title(box, 'Seesaw balancer');
    const ctx = canvas(box, 600, 200), out = readout(box);
    const v = sliders(box, [
      { k: 'm1', label: 'Left mass', min: 10, max: 100, step: 1, v: 60, unit: 'kg' },
      { k: 'd1', label: 'Left distance', min: 0.2, max: 2.5, step: 0.1, v: 1.5, unit: 'm' },
      { k: 'm2', label: 'Right mass', min: 10, max: 100, step: 1, v: 45, unit: 'kg' },
      { k: 'd2', label: 'Right distance', min: 0.2, max: 2.5, step: 0.1, v: 2, unit: 'm' },
    ], draw);
    function draw() {
      ctx.clear();
      const ccw = v.m1 * g * v.d1, cw = v.m2 * g * v.d2, net = ccw - cw;
      const ang = -Math.max(-0.25, Math.min(0.25, net / 3000)); // left heavier → tilts left (CCW)
      ctx.save(); ctx.translate(300, 140); ctx.rotate(ang);
      ctx.fillStyle = C('--text'); ctx.fillRect(-270, -5, 540, 10);
      [[-v.d1, v.m1, '--accent'], [v.d2, v.m2, '--good']].forEach(([d, m, col]) => {
        const s = 8 + m / 5; ctx.fillStyle = C(col); ctx.fillRect(d * 100 - s / 2, -5 - s, s, s);
      });
      ctx.restore();
      ctx.fillStyle = C('--muted'); ctx.beginPath(); ctx.moveTo(300, 145); ctx.lineTo(285, 180); ctx.lineTo(315, 180); ctx.fill();
      out.innerHTML = `CCW (left): ${fmt(ccw)} N·m &nbsp; CW (right): ${fmt(cw)} N·m &nbsp; Στ = <b>${fmt(net)} N·m</b> → ${Math.abs(net) < 15 ? '<b>balanced!</b>' : net > 0 ? 'left side goes down' : 'right side goes down'}`;
    }
    draw();
  };

  W.inertia = box => {
    title(box, 'Same mass, same radius, different shapes');
    const out = readout(box);
    const v = sliders(box, [
      { k: 'm', label: 'Mass m', min: 1, max: 20, step: 0.5, v: 5, unit: 'kg' },
      { k: 'r', label: 'Radius / length', min: 0.1, max: 2, step: 0.05, v: 0.5, unit: 'm' },
    ], r);
    const shapes = [['Solid sphere', 2 / 5], ['Rod about center (L)', 1 / 12], ['Solid disk', 1 / 2], ['Hollow sphere', 2 / 3], ['Rod about end (L)', 1 / 3], ['Hoop / point mass', 1]];
    function r() {
      const base = v.m * v.r * v.r;
      out.innerHTML = '<table class="stats">' + shapes.map(([n, k]) => `<tr><td>${n}</td><td style="width:50%"><div class="bar" style="width:${k * 100}%"></div></td><td>${fmt(k * base)} kg·m²</td></tr>`).join('') + '</table>';
    }
    r();
  };

  W.parallel = box => {
    title(box, 'Parallel axis: slide the axis along a rod');
    const ctx = canvas(box, 600, 120), out = readout(box);
    const v = sliders(box, [
      { k: 'm', label: 'Rod mass', min: 0.5, max: 10, step: 0.1, v: 2, unit: 'kg' },
      { k: 'L', label: 'Rod length', min: 0.5, max: 4, step: 0.1, v: 2, unit: 'm' },
      { k: 'f', label: 'Axis position (0 = center, 1 = end)', min: 0, max: 1, step: 0.01, v: 0.5, unit: '' },
    ], draw);
    function draw() {
      ctx.clear();
      const d = v.f * v.L / 2, Icm = v.m * v.L * v.L / 12, md2 = v.m * d * d;
      ctx.fillStyle = C('--text'); ctx.fillRect(60, 55, 480, 10);
      ctx.fillStyle = C('--muted'); ctx.fillRect(298, 45, 4, 30); ctx.font = '12px system-ui'; ctx.fillText('CM', 291, 40);
      const ax = 300 + v.f * 240; ctx.fillStyle = C('--accent'); ctx.beginPath(); ctx.arc(ax, 60, 9, 0, 7); ctx.fill();
      ctx.fillText('axis', ax - 12, 95);
      out.innerHTML = `I_cm = (1/12)(${v.m})(${v.L})² = ${fmt(Icm)} &nbsp;+&nbsp; m·d² = (${v.m})(${fmt(d)})² = ${fmt(md2)} &nbsp;=&nbsp; <b>I = ${fmt(Icm + md2)} kg·m²</b>${v.f === 1 ? ' &nbsp;✓ equals (1/3)mL² = ' + fmt(v.m * v.L * v.L / 3) : ''}`;
    }
    draw();
  };

  W.cm = box => {
    title(box, 'Composite CM table (edit me; tick "hole" for cut-outs)');
    const rows = [['Rectangle', 4.5, 0.75, false], ['Triangle', 6, 4.167, false], ['Circle hole', 0.7854, 5, true]];
    const t = el('<table class="cmtab"><thead><tr><th>Shape</th><th>Area A</th><th>x̄ᵢ</th><th>hole?</th><th>A·x̄ᵢ</th><th></th></tr></thead><tbody></tbody><tfoot></tfoot></table>');
    const add = el('<button class="btn small">+ add shape</button>');
    box.append(t, add);
    const out = readout(box);
    const body = t.tBodies[0];
    function addRow(r) {
      const tb = document.createElement('tbody'); // <tr> only parses inside a table section
      tb.innerHTML = `<tr><td><input value="${r[0]}"></td><td><input type="number" step="any" value="${r[1]}"></td><td><input type="number" step="any" value="${r[2]}"></td><td><input type="checkbox" ${r[3] ? 'checked' : ''}></td><td class="ax"></td><td><button class="x" title="remove">×</button></td></tr>`;
      const tr = tb.firstElementChild;
      tr.querySelector('.x').onclick = () => { tr.remove(); calc(); };
      body.appendChild(tr);
    }
    function calc() {
      let sA = 0, sAx = 0;
      [...body.rows].forEach(tr => {
        const i = tr.querySelectorAll('input'), A = (+i[1].value || 0) * (i[3].checked ? -1 : 1), x = +i[2].value || 0;
        tr.querySelector('.ax').textContent = fmt(A * x); sA += A; sAx += A * x;
      });
      t.tFoot.innerHTML = `<tr><td>Total</td><td>${fmt(sA)}</td><td></td><td></td><td>${fmt(sAx)}</td><td></td></tr>`;
      out.innerHTML = `x̄ = ΣA·x̄ᵢ / ΣA = ${fmt(sAx)} / ${fmt(sA)} = <b>${fmt(sAx / sA)}</b>`;
    }
    rows.forEach(addRow);
    add.onclick = () => { addRow(['Shape', 1, 1, false]); calc(); };
    t.addEventListener('input', calc); calc();
  };

  W.kin = box => {
    title(box, 'Constant-α calculator');
    const out = readout(box);
    const v = sliders(box, [
      { k: 'w0', label: 'Start ω₀', min: 0, max: 50, step: 0.5, v: 0, unit: 'rad/s' },
      { k: 'a', label: 'α', min: -10, max: 30, step: 0.1, v: 16, unit: 'rad/s²' },
      { k: 't', label: 'Time t', min: 0, max: 10, step: 0.1, v: 4, unit: 's' },
    ], r);
    function r() {
      const w = v.w0 + v.a * v.t, th = v.w0 * v.t + 0.5 * v.a * v.t * v.t;
      out.innerHTML = `ω = ω₀ + αt = <b>${fmt(w)} rad/s</b> (${fmt(w * 60 / 2 / Math.PI)} rpm)<br>θ = ω₀t + ½αt² = <b>${fmt(th)} rad</b> = ${fmt(th / 2 / Math.PI)} rev<br>Rope off a 0.05 m reel: s = rθ = ${fmt(0.05 * th)} m`;
    }
    r();
  };

  W.belt = box => {
    title(box, 'Belt drive: rim speeds match');
    const ctx = canvas(box, 600, 220), out = readout(box);
    const v = sliders(box, [
      { k: 'r1', label: 'Pulley 1 radius', min: 0.2, max: 1, step: 0.05, v: 0.4 },
      { k: 'r2', label: 'Pulley 2 radius', min: 0.2, max: 1, step: 0.05, v: 0.8 },
      { k: 'w1', label: 'ω₁', min: 0, max: 6, step: 0.1, v: 2, unit: 'rad/s' },
    ], () => {});
    let a1 = 0, a2 = 0;
    animate(ctx, dt => {
      const w2 = v.r1 * v.w1 / v.r2; a1 += v.w1 * dt; a2 += w2 * dt;
      ctx.clear();
      const R1 = v.r1 * 90, R2 = v.r2 * 90, c1 = [170, 110], c2 = [430, 110];
      ctx.strokeStyle = C('--muted'); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(c1[0], c1[1] - R1); ctx.lineTo(c2[0], c2[1] - R2); ctx.moveTo(c1[0], c1[1] + R1); ctx.lineTo(c2[0], c2[1] + R2); ctx.stroke();
      [[c1, R1, a1, '--accent'], [c2, R2, a2, '--good']].forEach(([c, R, a, col]) => {
        ctx.fillStyle = C(col); ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = C('--text'); ctx.lineWidth = 2;
        for (let k = 0; k < 3; k++) { const q = -a + k * 2.094; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + R * Math.cos(q), c[1] + R * Math.sin(q)); ctx.stroke(); }
      });
      out.innerHTML = `ω₂ = r₁ω₁ / r₂ = (${v.r1})(${v.w1}) / ${v.r2} = <b>${fmt(w2)} rad/s</b> &nbsp; rim speed both: ${fmt(v.r1 * v.w1)} m/s`;
    });
  };

  W.pulley = box => {
    title(box, 'Block hanging from a pulley with mass');
    const ctx = canvas(box, 600, 260), out = readout(box);
    const v = sliders(box, [
      { k: 'm', label: 'Block mass m', min: 0.5, max: 20, step: 0.5, v: 5, unit: 'kg' },
      { k: 'M', label: 'Pulley mass M (disk)', min: 0, max: 40, step: 0.5, v: 10, unit: 'kg' },
      { k: 'R', label: 'Pulley radius R', min: 0.1, max: 0.6, step: 0.05, v: 0.3, unit: 'm' },
    ], () => { y = 0; th = 0; vel = 0; });
    let y = 0, vel = 0, th = 0;
    animate(ctx, dt => {
      const a = v.m * g / (v.m + v.M / 2), T = v.m * (g - a);
      vel += a * dt * 0.25; y += vel * dt * 60; th += vel * dt * 60 / (v.R * 150);
      if (y > 150) { y = 0; vel = 0; }
      ctx.clear();
      const cx = 300, cy = 50, R = v.R * 150;
      ctx.fillStyle = C('--accent'); ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = C('--text'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R * Math.cos(th), cy + R * Math.sin(th)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + R, cy); ctx.lineTo(cx + R, cy + 40 + y); ctx.stroke();
      ctx.fillStyle = C('--good'); const s = 20 + v.m * 1.5; ctx.fillRect(cx + R - s / 2, cy + 40 + y, s, s);
      out.innerHTML = `Block: mg − T = ma. Pulley: T·R = (½MR²)(a/R) → T = ½Ma.<br>a = mg / (m + ½M) = <b>${fmt(a)} m/s²</b> (radius cancels!) &nbsp; T = <b>${fmt(T)} N</b> (weight is ${fmt(v.m * g)} N) &nbsp; α = a/R = ${fmt(a / v.R)} rad/s²`;
    });
  };

  const SHAPES = [['Solid sphere', 0.4, '#61afef'], ['Solid cylinder', 0.5, '#98c379'], ['Hollow sphere', 2 / 3, '#e5c07b'], ['Hoop', 1, '#e06c75']];
  W.race = box => {
    title(box, 'Ramp race (try changing mass and radius: nothing changes!)');
    const ctx = canvas(box, 600, 300), out = readout(box);
    const go = el('<button class="btn">▶ Race</button>'); box.appendChild(go);
    const v = sliders(box, [
      { k: 'ang', label: 'Ramp angle', min: 5, max: 45, step: 1, v: 20, unit: '°' },
      { k: 'm', label: 'Mass (all balls)', min: 1, max: 50, step: 1, v: 5, unit: 'kg' },
      { k: 'r', label: 'Radius (all balls)', min: 0.05, max: 0.5, step: 0.01, v: 0.2, unit: 'm' },
    ], () => { t = 0; run = false; });
    let t = 0, run = false;
    go.onclick = () => { t = 0; run = true; };
    const Lm = 10; // ramp length in metres
    animate(ctx, dt => {
      if (run) t += dt;
      ctx.clear();
      const th = v.ang * Math.PI / 180, rr = Math.min(22, 6 + v.r * 40);
      ctx.font = '12px system-ui';
      const res = SHAPES.map(([n, k, col], i) => {
        const a = g * Math.sin(th) / (1 + k), tf = Math.sqrt(2 * Lm / a), s = Math.min(Lm, 0.5 * a * t * t);
        const y = 55 + i * 66, x = 150 + (s / Lm) * 400;
        ctx.strokeStyle = C('--edge'); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, y + rr); ctx.lineTo(560, y + rr); ctx.stroke();
        ctx.fillStyle = C('--muted'); ctx.fillRect(558, y - 20, 3, rr + 22);
        ctx.fillStyle = C('--text'); ctx.fillText(n, 10, y + 4);
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill();
        ctx.strokeStyle = C('--bg'); ctx.lineWidth = 2; const sp = s / v.r;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + rr * Math.cos(sp), y + rr * Math.sin(sp)); ctx.stroke();
        return { n, k, a, tf, col };
      });
      out.innerHTML = res.map(r => `<span style="color:${r.col}">●</span> ${r.n} (k = ${fmt(r.k, 3)}): a = ${fmt(r.a, 3)} m/s², finishes 10 m in <b>${fmt(r.tf, 3)} s</b>`).join('<br>') + `<br><i>a = g sin θ / (1 + k) has no m or r in it.</i>`;
    });
  };

  W.energy = box => {
    title(box, 'Where does the energy go at the bottom of a ramp?');
    const sel = el(`<select>${SHAPES.map(([n, k]) => `<option value="${k}">${n}</option>`).join('')}</select>`);
    box.appendChild(sel);
    const bar = el('<div class="ebar"><i class="t"></i><i class="r"></i><i class="l"></i></div>'); box.appendChild(bar);
    const out = readout(box);
    const v = sliders(box, [
      { k: 'h', label: 'Height h', min: 0.5, max: 20, step: 0.5, v: 5, unit: 'm' },
      { k: 'loss', label: 'Energy lost to friction', min: 0, max: 60, step: 1, v: 0, unit: '%' },
    ], r);
    sel.onchange = r;
    function r() {
      const k = +sel.value, keep = 1 - v.loss / 100, ft = keep / (1 + k), fr = keep * k / (1 + k);
      const vb = Math.sqrt(2 * g * v.h * keep / (1 + k));
      const [t, rr, l] = bar.children;
      t.style.width = ft * 100 + '%'; rr.style.width = fr * 100 + '%'; l.style.width = (1 - keep) * 100 + '%';
      out.innerHTML = `<span class="sw t"></span> ½mv² ${fmt(ft * 100, 3)}% &nbsp; <span class="sw r"></span> ½Iω² ${fmt(fr * 100, 3)}% &nbsp; <span class="sw l"></span> E_loss ${v.loss}%<br>v = √(2gh·(1 − loss) / (1 + k)) = <b>${fmt(vb)} m/s</b>`;
    }
    r();
  };

  W.skater = box => {
    title(box, 'Spinning skater (top view): L = Iω stays fixed');
    const ctx = canvas(box, 600, 240), out = readout(box);
    const L = 12, Ib = 1.2, mArm = 4;
    const v = sliders(box, [{ k: 'r', label: 'Arm reach', min: 0.15, max: 0.9, step: 0.01, v: 0.9, unit: 'm' }], () => {});
    let ang = 0;
    animate(ctx, dt => {
      const I = Ib + 2 * mArm * v.r * v.r, w = L / I; ang += w * dt;
      ctx.clear();
      const cx = 300, cy = 120, R = v.r * 120;
      ctx.strokeStyle = C('--text'); ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - R * Math.cos(ang), cy - R * Math.sin(ang)); ctx.lineTo(cx + R * Math.cos(ang), cy + R * Math.sin(ang)); ctx.stroke();
      ctx.lineCap = 'butt'; ctx.fillStyle = C('--accent'); ctx.beginPath(); ctx.arc(cx, cy, 22, 0, 7); ctx.fill();
      ctx.fillStyle = C('--good');
      [1, -1].forEach(s => { ctx.beginPath(); ctx.arc(cx + s * R * Math.cos(ang), cy + s * R * Math.sin(ang), 9, 0, 7); ctx.fill(); });
      out.innerHTML = `I = ${Ib} + 2(${mArm})(${v.r})² = ${fmt(I)} kg·m² &nbsp; ω = L / I = <b>${fmt(w)} rad/s</b> &nbsp; L = <b>${L}</b> (constant) &nbsp; KE = L²/(2I) = <b>${fmt(L * L / 2 / I)} J</b>`;
    });
  };
})();
