// Small force-directed graph on a canvas: drag nodes, drag background to pan, wheel to zoom, click to open.
window.ForceGraph = function (canvas, nodes, edges, opts) {
  const ctx = canvas.getContext('2d');
  const o = Object.assign({ onOpen() {}, focus: null, labels: 'auto', getStyle: () => ({}) }, opts);
  const byId = {};
  nodes.forEach((n, i) => {
    const a = i * 2.39996; // golden-angle spiral start keeps the first frames tidy
    n.x ??= Math.cos(a) * 12 * Math.sqrt(i + 1); n.y ??= Math.sin(a) * 12 * Math.sqrt(i + 1);
    n.vx = 0; n.vy = 0; n.deg = 0; byId[n.id] = n;
  });
  const links = edges.map(([a, b]) => ({ s: byId[a], t: byId[b] })).filter(l => l.s && l.t);
  links.forEach(l => { l.s.deg++; l.t.deg++; });
  const nb = {}; links.forEach(l => { (nb[l.s.id] ??= new Set()).add(l.t.id); (nb[l.t.id] ??= new Set()).add(l.s.id); });

  let view = { x: 0, y: 0, k: 1 }, heat = 1, hover = null, drag = null, pan = null, moved = false, raf = 0, W = 0, H = 0;
  const dpr = window.devicePixelRatio || 1;
  const radius = n => (n.r ?? 4) + Math.min(n.deg, 14) * 0.7;

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
  }
  function step() {
    const N = nodes.length, rep = o.repulse ?? 900;
    for (let i = 0; i < N; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < N; j++) {
        const b = nodes[j]; let dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy || 0.01;
        if (d2 > 160000) continue;
        const f = rep / d2, d = Math.sqrt(d2); dx /= d; dy /= d;
        a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f;
      }
    }
    const len = o.linkLen ?? 60;
    links.forEach(l => {
      const dx = l.t.x - l.s.x, dy = l.t.y - l.s.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - len) * 0.02, fx = dx / d * f, fy = dy / d * f;
      l.s.vx += fx; l.s.vy += fy; l.t.vx -= fx; l.t.vy -= fy;
    });
    nodes.forEach(n => {
      n.vx -= n.x * 0.0012; n.vy -= n.y * 0.0012;
      if (n === drag) { n.vx = n.vy = 0; return; }
      n.vx *= 0.82; n.vy *= 0.82;
      n.x += n.vx * heat; n.y += n.vy * heat;
    });
    heat = Math.max(heat * 0.995, 0.02);
  }
  function toScreen(n) { return [W / 2 + (n.x + view.x) * view.k, H / 2 + (n.y + view.y) * view.k]; }
  function toWorld(px, py) { return [(px - W / 2) / view.k - view.x, (py - H / 2) / view.k - view.y]; }
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const lit = hover ? nb[hover.id] || new Set() : null;
    const line = css('--edge'), text = css('--text'), muted = css('--muted'), accent = css('--accent');
    ctx.lineWidth = 1;
    links.forEach(l => {
      const on = hover && (l.s === hover || l.t === hover);
      ctx.strokeStyle = on ? accent : line; ctx.globalAlpha = hover && !on ? 0.25 : 0.9;
      const [x1, y1] = toScreen(l.s), [x2, y2] = toScreen(l.t);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    nodes.forEach(n => {
      const [x, y] = toScreen(n), r = radius(n) * Math.sqrt(view.k);
      if (x < -50 || y < -50 || x > W + 50 || y > H + 50) return;
      const st = o.getStyle(n), dim = hover && n !== hover && !lit.has(n.id);
      ctx.globalAlpha = dim ? 0.2 : 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = st.fill || n.color; ctx.fill();
      if (st.ring != null) { // mastery ring
        ctx.beginPath(); ctx.arc(x, y, r + 3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * st.ring);
        ctx.strokeStyle = css('--good'); ctx.lineWidth = 2.5; ctx.stroke(); ctx.lineWidth = 1;
      }
      if (n.id === o.focus || n === hover) { ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2); ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 1; }
      const showLabel = o.labels === 'all' || n === hover || n.id === o.focus || (lit && lit.has(n.id)) || (n.big && view.k > 0.55) || view.k > 1.6;
      if (showLabel) {
        ctx.font = `${n.big ? 600 : 400} ${n.big ? 12 : 11}px system-ui, sans-serif`;
        ctx.fillStyle = dim ? muted : text; ctx.textAlign = 'center';
        ctx.fillText(n.label, x, y + r + 13);
      }
    });
    ctx.globalAlpha = 1;
  }
  function loop() {
    if (!canvas.isConnected) return; // note closed: stop animating
    if (heat > 0.021 || drag) step();
    draw();
    raf = requestAnimationFrame(loop);
  }
  function pick(px, py) {
    let best = null, bd = 1e9;
    nodes.forEach(n => {
      const [x, y] = toScreen(n), d = Math.hypot(x - px, y - py);
      if (d < radius(n) * Math.sqrt(view.k) + 6 && d < bd) { bd = d; best = n; }
    });
    return best;
  }
  const pos = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', e => {
    const [px, py] = pos(e); moved = false;
    canvas.setPointerCapture(e.pointerId);
    drag = pick(px, py);
    if (!drag) pan = { px, py, vx: view.x, vy: view.y };
    heat = Math.max(heat, 0.3);
  });
  canvas.addEventListener('pointermove', e => {
    const [px, py] = pos(e);
    if (drag) { const [wx, wy] = toWorld(px, py); drag.x = wx; drag.y = wy; moved = true; heat = Math.max(heat, 0.3); }
    else if (pan) { view.x = pan.vx + (px - pan.px) / view.k; view.y = pan.vy + (py - pan.py) / view.k; moved = true; }
    else { const h = pick(px, py); if (h !== hover) { hover = h; canvas.style.cursor = h ? 'pointer' : 'grab'; canvas.title = h ? h.label : ''; } }
  });
  canvas.addEventListener('pointerup', () => {
    if (drag && !moved) o.onOpen(drag.id);
    drag = null; pan = null;
  });
  canvas.addEventListener('pointerleave', () => { hover = null; });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const [px, py] = pos(e), [wx, wy] = toWorld(px, py);
    view.k = Math.min(4, Math.max(0.2, view.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
    const [nx, ny] = toWorld(px, py); view.x += nx - wx; view.y += ny - wy;
  }, { passive: false });
  new ResizeObserver(resize).observe(canvas);
  resize();
  for (let i = 0; i < (o.warm ?? 150); i++) step(); // settle before first paint
  // fit everything in view, capped at the requested zoom
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  view.x = -(x0 + x1) / 2; view.y = -(y0 + y1) / 2;
  view.k = W ? Math.min(2.5, W / (x1 - x0 + 90), H / (y1 - y0 + 70)) : (o.zoom ?? 1);
  loop();
  return { reheat() { heat = 1; }, setZoom(k) { view.k = k; } };
};
