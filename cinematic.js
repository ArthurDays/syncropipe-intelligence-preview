// Camada cinematográfica. Desktop (≥ 1024px): Lenis + GSAP ScrollTrigger, carregados só quando necessários.
// Mobile: barra inferior e indicadores do carrossel, sem bibliotecas. Se a CDN falhar, o site segue como era.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const main = $('main');

  // ---------- Mobile: indicadores do carrossel de exemplos ----------
  const deck = $('.example-deck');
  if (deck && 'IntersectionObserver' in window) {
    const dots = document.createElement('div'); dots.className = 'deck-dots'; dots.setAttribute('aria-hidden', 'true');
    const cards = $$('.example-card', deck); dots.innerHTML = cards.map(() => '<i></i>').join(''); deck.after(dots);
    const io = new IntersectionObserver((es) => es.forEach((e) => dots.children[cards.indexOf(e.target)].classList.toggle('on', e.isIntersecting)), { root: deck, threshold: .6 });
    cards.forEach((c) => io.observe(c));
  }

  // ---------- Mobile: item atual da barra inferior ----------
  const navLinks = $$('.bottom-nav a'), mobile = matchMedia('(max-width: 1023px)');
  const spots = ['#solucoes', '#prototipos'].map((h) => [h, $(h)]);
  let navFrame = 0;
  const updateNav = () => {
    navFrame = 0; if (!mobile.matches) return;
    let cur = '#inicio'; for (const [h, el] of spots) if (el.getBoundingClientRect().top < innerHeight * .45) cur = h;
    navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === cur));
  };
  addEventListener('scroll', () => { navFrame ||= requestAnimationFrame(updateNav); }, { passive: true });
  updateNav();

  // ---------- Laboratório: atalhos por nicho no painel e rolagem até ele ao abrir ----------
  let lenisRef = null;
  const labEl = $('.prototype-lab'), labFrame = labEl && $('iframe', labEl);
  if (labFrame) {
    // shortcut: lista fixa com os 7 primeiros dos 22 nichos do protótipo; atualizar aqui se os nichos mudarem
    const NICHES = [['oficinas', 'Oficinas'], ['imobiliarias', 'Imobiliárias'], ['educacao', 'Educação'], ['odontologia', 'Odontologia'], ['contabilidade', 'Contabilidade'], ['energia-solar', 'Energia solar'], ['pilates', 'Pilates']];
    const base = labFrame.src.split(/[?#]/)[0], row = document.createElement('span'); row.className = 'lab-niches';
    const goLab = () => lenisRef ? lenisRef.scrollTo(labEl, { offset: -16 }) : labEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    for (const [id, label] of NICHES) { const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.addEventListener('click', (ev) => { ev.preventDefault(); labFrame.src = `${base}?nicho=${id}`; labEl.open ? goLab() : (labEl.open = true); });   // preventDefault: o clique não fecha o painel
      row.append(b); }
    const more = document.createElement('span'); more.textContent = '+ 15 ramos'; row.append(more);
    $('summary', labEl).append(row);
    labEl.addEventListener('toggle', () => { if (labEl.open) goLab(); });
    // com mouse, o protótipo só captura a roda depois de um clique; ao sair dele, a página volta a rolar
    if (matchMedia('(pointer: fine)').matches) { const stage = labFrame.parentElement; stage.classList.add('lab-idle');
      stage.addEventListener('click', () => stage.classList.remove('lab-idle'));
      // cursor dentro do iframe não gera eventos aqui (e dispara pointerleave falso): só volta à espera quando a página vê o cursor fora do palco
      addEventListener('pointermove', (ev) => { if (!stage.contains(ev.target)) stage.classList.add('lab-idle'); }, { passive: true }); }
    // "Quero isso para <nicho>" no protótipo: abre o briefing (openBriefing vem do script.js) já com o ramo no desafio
    const askFor = (nicho) => { if (typeof openBriefing !== 'function') return; openBriefing();
      const d = $('#briefingForm [name="desafio"]'); if (d && !d.value) d.value = `Vi o protótipo de ${String(nicho).slice(0, 60)} e quero algo parecido. `; };
    addEventListener('message', (ev) => { if (ev.origin === new URL(labFrame.src).origin && ev.data?.syncropipe === 'briefing') askFor(ev.data.nicho); });
    const linkNiche = new URLSearchParams(location.search).get('nicho'); if (linkNiche) askFor(linkNiche);   // link aberto fora da landing
  }

  // ---------- Desktop ----------
  const QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
  const LIBS = ['https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'];
  const load = (src) => new Promise((ok, err) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = err; document.head.append(s); });
  const mq = matchMedia(QUERY); let booted = false;
  const boot = () => { if (!mq.matches || booted) return; booted = true; LIBS.reduce((p, src) => p.then(() => load(src)), Promise.resolve()).then(setup).catch(() => {}); };
  mq.addEventListener('change', boot); boot();

  // ---------- Desktop: rede 3D de partículas atrás do logo do hero ----------
  // Baseada no exemplo webgl_buffergeometry_drawrange do three.js: pontos que se ligam por linhas quando se aproximam.
  const heroVisual = $('.hero-visual'); let netBooted = false;
  const bootNet = async () => {
    if (!mq.matches || netBooted || !heroVisual) return; netBooted = true;
    const T = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js');
    const canvas = document.createElement('canvas'); canvas.className = 'cine-net'; canvas.setAttribute('aria-hidden', 'true'); heroVisual.prepend(canvas);
    const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const scene = new T.Scene(), camera = new T.PerspectiveCamera(45, 1, 1, 2000); camera.position.z = 640;
    const N = 150, R = 280, LINK = 100, REACH = 150, base = new Float32Array(N * 3), push = new Float32Array(N * 3), pos = new Float32Array(N * 3), col = new Float32Array(N * 3), vel = [];
    const cyan = new T.Color('#09d7dc'), violet = new T.Color('#9c57f2'), c = new T.Color();
    for (let i = 0; i < N; i++) { // ponto aleatório dentro da esfera
      const v = new T.Vector3().randomDirection().multiplyScalar(R * Math.cbrt(Math.random())); v.toArray(base, i * 3);
      vel.push(new T.Vector3().randomDirection().multiplyScalar(.12 + Math.random() * .2));
      c.copy(cyan).lerp(violet, Math.random()).toArray(col, i * 3);
    }
    // ponto redondo com brilho, no lugar do quadrado padrão do three.js
    const dot = document.createElement('canvas'); dot.width = dot.height = 64; const dc = dot.getContext('2d'), dg = dc.createRadialGradient(32, 32, 0, 32, 32, 32);
    dg.addColorStop(0, '#fff'); dg.addColorStop(.25, 'rgba(255,255,255,.85)'); dg.addColorStop(1, 'rgba(255,255,255,0)'); dc.fillStyle = dg; dc.fillRect(0, 0, 64, 64);
    const pGeo = new T.BufferGeometry(); pGeo.setAttribute('position', new T.BufferAttribute(pos, 3)); pGeo.setAttribute('color', new T.BufferAttribute(col, 3));
    const lPos = new Float32Array(N * N * 3), lCol = new Float32Array(N * N * 3), lGeo = new T.BufferGeometry();
    lGeo.setAttribute('position', new T.BufferAttribute(lPos, 3)); lGeo.setAttribute('color', new T.BufferAttribute(lCol, 3));
    const mat = { vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false };
    const group = new T.Group(); scene.add(group);
    group.add(new T.Points(pGeo, new T.PointsMaterial({ ...mat, size: 16, map: new T.CanvasTexture(dot) })), new T.LineSegments(lGeo, new T.LineBasicMaterial({ ...mat, opacity: .95 })));
    let mx = 0, my = 0, visible = false, frame = 0, cw = 0, ch = 0, over = false;
    const ndc = new T.Vector2(), cur = new T.Vector3(), dir = new T.Vector3();
    addEventListener('pointermove', (ev) => { mx = ev.clientX / innerWidth - .5; my = ev.clientY / innerHeight - .5;
      const b = canvas.getBoundingClientRect(); over = ev.clientX > b.left && ev.clientX < b.right && ev.clientY > b.top && ev.clientY < b.bottom;
      ndc.set((ev.clientX - b.left) / b.width * 2 - 1, 1 - (ev.clientY - b.top) / b.height * 2); }, { passive: true });
    const loop = (t) => {
      frame = 0; if (!visible || !mq.matches || document.hidden) return;   // fora da tela ou no mobile: não gasta GPU
      const w = canvas.clientWidth, h = canvas.clientHeight;   // acompanha o tamanho do hero sem depender de evento
      if (w !== cw || h !== ch) { cw = w; ch = h; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
      if (over) { // cursor no plano central da cena, convertido para o espaço da rede (que gira)
        group.updateMatrixWorld(); cur.set(ndc.x, ndc.y, .5).unproject(camera); dir.copy(cur).sub(camera.position).normalize();
        cur.copy(camera.position).addScaledVector(dir, -camera.position.z / dir.z); group.worldToLocal(cur); }
      let n = 0;
      for (let i = 0; i < N; i++) { const a = i * 3;
        base[a] += vel[i].x; base[a + 1] += vel[i].y; base[a + 2] += vel[i].z;
        if (base[a] ** 2 + base[a + 1] ** 2 + base[a + 2] ** 2 > R * R) vel[i].negate();   // bate na borda da esfera e volta
        // perto do cursor o ponto é empurrado para longe; quando o cursor sai, volta com suavidade
        const dx = base[a] - cur.x, dy = base[a + 1] - cur.y, dz = base[a + 2] - cur.z, dc2 = Math.hypot(dx, dy, dz);
        const f = over && dc2 < REACH && dc2 > .001 ? (1 - dc2 / REACH) * 70 / dc2 : 0;
        push[a] += (dx * f - push[a]) * .12; push[a + 1] += (dy * f - push[a + 1]) * .12; push[a + 2] += (dz * f - push[a + 2]) * .12;
        pos[a] = base[a] + push[a]; pos[a + 1] = base[a + 1] + push[a + 1]; pos[a + 2] = base[a + 2] + push[a + 2];
        for (let j = 0; j < i; j++) { const b = j * 3, d = Math.hypot(pos[a] - pos[b], pos[a + 1] - pos[b + 1], pos[a + 2] - pos[b + 2]);
          if (d > LINK) continue; const k = 1 - d / LINK;   // mais perto = linha mais forte
          for (let q = 0; q < 3; q++) { lPos[n + q] = pos[a + q]; lPos[n + 3 + q] = pos[b + q]; lCol[n + q] = col[a + q] * k; lCol[n + 3 + q] = col[b + q] * k; }
          n += 6; } }
      lGeo.setDrawRange(0, n / 3); pGeo.attributes.position.needsUpdate = lGeo.attributes.position.needsUpdate = lGeo.attributes.color.needsUpdate = true;
      group.rotation.y = t * .00009 + scrollY * .0014 + mx * .5; group.rotation.x = my * .35;
      renderer.render(scene, camera); frame = requestAnimationFrame(loop);
    };
    const start = () => { frame ||= requestAnimationFrame(loop); };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }).observe(heroVisual);
    document.addEventListener('visibilitychange', start); mq.addEventListener('change', start);
  };
  mq.addEventListener('change', () => bootNet().catch(() => {})); bootNet().catch(() => {});

  // posição relativa ao <main>, ignorando transforms (reveal, tilt e flutuação dos cards)
  const off = (el) => { let x = 0, y = 0; for (let e = el; e && e !== main; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };

  // quebra os títulos em palavras uma única vez, preservando <br> e <em>
  function splitWords(h) {
    if (h.dataset.cine) return $$('.cine-word', h); h.dataset.cine = '1';
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) { const f = document.createDocumentFragment();
      for (const part of n.textContent.split(/(\s+)/)) { if (!part.trim()) { f.append(part); continue; } const s = document.createElement('span'); s.className = 'cine-word'; s.textContent = part; f.append(s); }
      n.replaceWith(f); }
    return $$('.cine-word', h);
  }

  // quebra uma linha em letras animáveis; o texto real fica numa cópia só para leitores de tela
  function splitChars(el) {
    if (el.dataset.cine) return $$('.cine-char', el); el.dataset.cine = '1';
    const text = el.textContent, sr = document.createElement('span'), show = document.createElement('span');
    sr.className = 'cine-sr'; sr.textContent = text; show.setAttribute('aria-hidden', 'true');
    text.split(' ').forEach((word, i, all) => { const w = document.createElement('span'); w.className = 'cine-w';
      for (const ch of word) { const c = document.createElement('span'); c.className = 'cine-char'; c.textContent = ch; w.append(c); }
      show.append(w, i < all.length - 1 ? ' ' : ''); });
    el.replaceChildren(sr, show); return $$('.cine-char', el);
  }

  function setup() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add(QUERY, () => {
      const html = document.documentElement, ac = new AbortController(), on = { signal: ac.signal };
      html.classList.add('cine-on');

      // --- scroll suave ---
      const lenis = new Lenis(); lenisRef = lenis;
      const raf = (t) => lenis.raf(t * 1000);
      lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(raf); gsap.ticker.lagSmoothing(0);
      $$('dialog').forEach((d) => d.setAttribute('data-lenis-prevent', ''));
      // âncoras: os links de contato já abrem o briefing (preventDefault no script.js) e ficam de fora
      document.addEventListener('click', (ev) => {
        const a = ev.target.closest?.('a[href^="#"]'); if (!a || ev.defaultPrevented) return;
        const target = $(a.getAttribute('href')); if (!target) return;
        ev.preventDefault(); history.pushState(null, '', a.getAttribute('href'));
        lenis.scrollTo(target, { offset: -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0) });
      }, on);

      // --- exemplos: galeria horizontal. A seção fica alta e o miolo gruda (sticky); o scroll vira deslocamento lateral ---
      // trilho (alto) > miolo (sticky) com título, cards e barra de progresso; a nota de rodapé fica fora, depois do trilho
      const exSec = $('.examples-showcase'), exNote = $('.examples-note', exSec), mk = (c) => Object.assign(document.createElement('div'), { className: c });
      const htrack = mk('cine-htrack'), hwrap = mk('cine-hwrap'), hbar = mk('cine-hbar'); hbar.setAttribute('aria-hidden', 'true'); hbar.innerHTML = '<i></i>';
      hwrap.append(...[...exSec.children].filter((c) => c !== exNote), hbar); htrack.append(hwrap); exSec.prepend(htrack); exSec.classList.add('cine-h');
      let hx = 0;
      const measureH = () => { const left = exSec.getBoundingClientRect().left;   // miolo de borda a borda da tela, para os cards não sumirem no meio
        hwrap.style.marginInline = `${-left}px`; hwrap.style.paddingInline = `${left}px`;
        const last = deck.lastElementChild; hx = last.offsetLeft + last.offsetWidth - (last.offsetParent === deck ? 0 : deck.offsetLeft) - deck.clientWidth;   // pelo layout: scrollWidth muda com a escala de entrada dos cards
        exSec.style.setProperty('--cine-hx', hx); };
      measureH(); ScrollTrigger.addEventListener('refreshInit', measureH);
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: htrack, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
        .to(deck, { x: () => -hx }, 0).fromTo(hbar.firstChild, { scaleX: .5 }, { scaleX: 1 }, 0);   // barra: metade dos cards já está à vista no início

      // --- conduíte de luz: do hero até #prototipos, pelas laterais e pelos vãos entre as seções ---
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'cine-conduit'); svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = '<defs><linearGradient id="cineBeam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#09d7dc"/><stop offset=".55" stop-color="#6ea5ff"/><stop offset="1" stop-color="#9c57f2"/></linearGradient></defs><path class="track"/><path class="glow"/><path class="beam"/><rect class="end" width="10" height="10" rx="2"/><circle class="pkt" r="3.5"/><circle class="pkt" r="3.5"/><circle class="pkt" r="3.5"/><circle class="tip" r="5"/>';
      main.prepend(svg);
      const [track, glow, beam] = $$('path', svg), tip = $('.tip', svg), end = $('.end', svg);
      const stops = ['.hero', '.applications', '.services', '.integration-section', '.ai-agent-section', '.examples-showcase', '.prototype-lab'].map((s) => $(s));
      const ringSel = '.applications, .service-card, .integration-card, .ai-agent-panel, .prototype-lab';
      const state = { p: 0 }; let total = 0, table = [], y0 = 0, y1 = 0, marks = [];

      const content = (sec) => { // caixa visível da seção: ela mesma se for um painel, senão do primeiro ao último filho
        if (sec.matches('.hero, .applications, .examples-showcase, .prototype-lab')) return off(sec);
        const a = off(sec.firstElementChild), b = off(sec.lastElementChild); return { x: a.x, y: a.y, w: a.w, h: b.y + b.h - a.y };
      };
      const build = () => {
        const W = main.offsetWidth, boxes = stops.map(content), lab = boxes.at(-1), cx = W / 2;
        const gx = Math.max(10, boxes[1].x / 2), xs = [gx, W - gx];
        const pts = [[cx, boxes[0].y + boxes[0].h]]; let x = cx;
        boxes.slice(1).forEach((b, i) => { const prev = boxes[i], y = b.y - Math.min(38, Math.max(8, (b.y - prev.y - prev.h) / 2));
          const nx = i === boxes.length - 2 ? cx : xs[i % 2]; pts.push([x, y], [nx, y]); x = nx; });
        pts.push([cx, lab.y]);
        let d = `M${pts[0]}`;
        for (let i = 1; i < pts.length - 1; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], [qx, qy] = pts[i + 1];
          const l1 = Math.hypot(bx - ax, by - ay), l2 = Math.hypot(qx - bx, qy - by), r = Math.min(18, l1 / 2, l2 / 2);
          if (r < 1) continue;
          d += ` L${bx - (bx - ax) / l1 * r},${by - (by - ay) / l1 * r} Q${bx},${by} ${bx + (qx - bx) / l2 * r},${by + (qy - by) / l2 * r}`; }
        d += ` L${pts.at(-1)}`;
        track.setAttribute('d', d); glow.setAttribute('d', d); beam.setAttribute('d', d);
        end.setAttribute('x', cx - 5); end.setAttribute('y', lab.y - 5);
        // tabela scroll → comprimento: trechos verticais acompanham a tela, os horizontais passam rápido
        total = beam.getTotalLength(); table = [0]; const ys = [pts[0][1]]; let prev = beam.getPointAtLength(0);
        for (let l = 6; l <= total; l += 6) { const p = beam.getPointAtLength(l); table.push(table.at(-1) + Math.abs(p.y - prev.y) + Math.abs(p.x - prev.x) * .12); ys.push(p.y); prev = p; }
        y0 = pts[0][1]; y1 = lab.y;
        // anéis de pulso: recriados a cada medição; os já alcançados voltam sem repetir a animação
        marks.forEach((m) => m.ring?.remove());
        const lenAtY = (y) => { const i = ys.findIndex((v) => v >= y - 1); return i < 0 ? total : i * 6; };
        const L = lengthAt(state.p);
        marks = $$(ringSel).map((el) => { const b = off(el), ring = document.createElement('div');
          ring.className = 'cine-ring' + (el.matches('.prototype-lab') ? ' stay' : ''); ring.style.cssText = `left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border-radius:${getComputedStyle(el).borderRadius}`;
          main.append(ring); const len = lenAtY(b.y); if (L >= len) { ring.classList.add('lit'); ring.style.animationDuration = '.01s'; } return { ring, len }; });
        marks.push({ el: deck, len: lenAtY(off(exSec).y + 150) });   // pela seção: o deck está dentro do miolo sticky e a posição dele varia
        draw();
      };
      function lengthAt(p) { if (!table.length) return 0; const s = p * table.at(-1); let lo = 0, hi = table.length - 1;
        while (lo < hi) { const mid = (lo + hi) >> 1; table[mid] < s ? lo = mid + 1 : hi = mid; } return Math.min(total, lo * 6); }
      function draw() {
        const L = lengthAt(state.p), pt = beam.getPointAtLength(L);
        beam.style.strokeDasharray = glow.style.strokeDasharray = `${L} ${total + 10}`; tip.setAttribute('cx', pt.x); tip.setAttribute('cy', pt.y); tip.style.opacity = L > 0 && L < total ? 1 : 0;
        svg.classList.toggle('arrived', L >= total - 1);
        for (const m of marks) { const lit = L >= m.len && L > 0;
          if (m.ring) { if (lit !== m.ring.classList.contains('lit')) { m.ring.style.animationDuration = ''; m.ring.classList.toggle('lit', lit); } }
          else m.el.classList.toggle('cine-lit', lit && L < m.len + 700); }
      }
      build();
      ScrollTrigger.addEventListener('refreshInit', build);
      gsap.to(state, { p: 1, ease: 'none', onUpdate: draw, scrollTrigger: { trigger: main, start: () => `top+=${y0} 62%`, end: () => `top+=${y1} 62%`, scrub: 1, invalidateOnRefresh: true } });

      // pacotes de dados correndo pelo trecho já aceso do conduíte (como os do hero)
      const pkts = $$('.pkt', svg);
      const flow = (t) => { const L = lengthAt(state.p);
        pkts.forEach((c, i) => { if (L < 300) { c.style.opacity = 0; return; }
          const pt = beam.getPointAtLength((t * 260 + i * L / pkts.length) % L); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.style.opacity = 1; }); };
      gsap.ticker.add(flow);

      // --- abertura do hero: título letra por letra, depois o resto em cascata ---
      const copyKids = $$('.hero-copy > *').filter((e) => e.tagName !== 'H1'), accent = $('.hero-title-accent');
      const chars = splitChars($('.hero-title-line:not(.hero-title-accent)'));
      [...copyKids, accent].forEach((e) => e.classList.add('cine-in'));
      if (performance.now() < 2400 && scrollY < 50) {   // só se as bibliotecas chegaram a tempo e a página está no topo
        gsap.set([...copyKids, accent, ...chars], { '--in': 0 });
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .to(copyKids[0], { '--in': 1, duration: .6 })
          .to(chars, { '--in': 1, duration: .7, stagger: .028 }, .1)
          .to(accent, { '--in': 1, duration: .9 }, .5)
          .to(copyKids.slice(1), { '--in': 1, duration: .7, stagger: .12 }, .8);
      }
      html.classList.add('cine-ready');

      // --- botões magnéticos: puxam de leve na direção do cursor ---
      if (matchMedia('(pointer: fine)').matches) $$('.button').forEach((btn) => {
        gsap.set(btn, { '--magx': '0px', '--magy': '0px' });
        btn.addEventListener('pointermove', (ev) => { const b = btn.getBoundingClientRect();
          gsap.to(btn, { '--magx': `${(ev.clientX - b.left - b.width / 2) * .28}px`, '--magy': `${(ev.clientY - b.top - b.height / 2) * .4}px`, duration: .35, overwrite: true }); }, on);
        btn.addEventListener('pointerleave', () => gsap.to(btn, { '--magx': '0px', '--magy': '0px', duration: .8, ease: 'elastic.out(1, .35)', overwrite: true }), on);
      });

      // --- títulos que acendem palavra por palavra ---
      $$('.section-heading h2, .examples-heading h2, .integration-copy h2, .ai-agent-copy h2, .results-copy h2, .faq-intro h2, .cta-card h2').forEach((h) => {
        gsap.fromTo(splitWords(h), { '--lit': 0 }, { '--lit': 1, stagger: .15, ease: 'none', scrollTrigger: { trigger: h, start: 'top 90%', end: 'top 48%', scrub: 1 } });
      });

      // --- entrada dos cards com profundidade, escalonada pelo scroll ---
      $$('.application-grid, .service-grid, .example-deck, .benefit-list').forEach((grid) => {
        const cards = [...grid.children]; cards.forEach((c) => c.classList.add('cine-depth'));
        gsap.fromTo(cards, { '--cine-p': 1 }, { '--cine-p': 0, stagger: .12, ease: 'none', scrollTrigger: { trigger: grid, start: 'top 98%', end: 'top 58%', scrub: 1 } });
      });

      // --- luz do cursor no painel de protótipos ---
      const lab = $('.prototype-lab'), summary = $('summary', lab);
      if (matchMedia('(pointer: fine)').matches) summary.addEventListener('pointermove', (ev) => { const b = summary.getBoundingClientRect(); lab.style.setProperty('--mx', `${ev.clientX - b.left}px`); lab.style.setProperty('--my', `${ev.clientY - b.top}px`); }, on);
      lab.addEventListener('toggle', () => ScrollTrigger.refresh(), on);   // abrir o laboratório muda a altura da página

      // --- processo: a seção trava na tela e os 4 passos acendem um a um ---
      const process = $('.process'), steps = $$('.process-grid article');
      const num = document.createElement('div'); num.className = 'cine-stepnum'; num.setAttribute('aria-hidden', 'true'); num.textContent = '01'; process.append(num);
      // o passo 1 já chega aceso; os outros três acendem durante a trava
      const setNum = function () { const n = '0' + (1 + steps.slice(1).filter((_, i) => this.time() >= i + .55).length);   // número gigante do passo atual
        if (n !== num.textContent) { num.textContent = n; gsap.fromTo(num, { yPercent: 16, opacity: 0 }, { yPercent: 0, opacity: .5, duration: .45, ease: 'power2.out' }); } };
      const pinTl = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: setNum, scrollTrigger: { trigger: process, pin: true, scrub: 1, end: '+=1200',
        // tela baixa: trava com os cards encostados na base, para nenhum ficar cortado
        start: () => process.offsetHeight < innerHeight ? 'center center' : `bottom bottom+=${Math.max(0, parseFloat(getComputedStyle(process).paddingBottom) - 24)}` } });
      pinTl.fromTo('.process-grid', { '--cine-steps': 1 / steps.length }, { '--cine-steps': 1, duration: steps.length - 1 });
      steps.slice(1).forEach((s, i) => pinTl.fromTo(s, { '--on': 0 }, { '--on': 1, duration: .7, ease: 'power2.inOut' }, i + .2));

      // --- convergência de luz no CTA ---
      gsap.fromTo('.cta', { '--cine-cta': 0 }, { '--cine-cta': 1, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 96%', end: 'center 62%', scrub: 1 } });

      ScrollTrigger.sort();   // a seção travada empurra o que vem depois: os gatilhos precisam estar na ordem da página
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      // abriu com #âncora: o navegador ainda está deslizando até ela e a medição sai deslocada; para, mede de novo e vai direto
      const anchor = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (anchor) { scrollTo(0, 0); ScrollTrigger.refresh(); scrollTo(0, anchor.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(anchor).scrollMarginTop) || 0)); }

      return () => { // saiu do desktop: desfaz tudo (o GSAP reverte os próprios tweens)
        ac.abort(); ScrollTrigger.removeEventListener('refreshInit', build); ScrollTrigger.removeEventListener('refreshInit', measureH);
        hbar.remove(); exSec.prepend(...hwrap.children); htrack.remove(); exSec.classList.remove('cine-h'); exSec.style.removeProperty('--cine-hx'); gsap.ticker.remove(raf); gsap.ticker.remove(flow); lenis.destroy(); lenisRef = null;
        svg.remove(); num.remove(); marks.forEach((m) => m.ring?.remove()); deck.classList.remove('cine-lit'); html.classList.remove('cine-on');
      };
    });
  }
})();
