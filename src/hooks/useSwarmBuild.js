import { useLayoutEffect } from 'react';
import { swarm as copy } from '../content';
import '../swarm.css';

// La página se construye sola: un enjambre de cursores la arma a la vista, a
// medida que se scrollea. Dibujan cajas con la cruz, tipean el texto, sacan
// guías de las reglas y duplican lo que se repite.
//
// Es un homenaje a Swarm de Joel Califa (califa.github.io/swarm-site) y a Swarm
// Rebuild de Dhvanil Patel. La idea y la coreografía son de ellos; este código
// está escrito desde cero para este sitio.
//
// Cada cursor corre un generador por tarea: avanza un paso por cuadro y su
// `finally` deja el elemento real como tiene que estar, aunque se cancele.
// Nada espera oculto sin JS: el motor oculta un elemento recién cuando está por
// entrar en pantalla. Con movimiento reducido no corre, y "Saltar" o Esc
// muestran todo al instante.

// ---------------------------------------------------------------- Ajustes
const ENABLED = true;
const AGENTS = 14; // cursores en escritorio
const LITE_AGENTS = 7; // en celular o equipos modestos
const INTRO = 750; // órbita inicial alrededor de la marca, en ms (0 = sin órbita)
const SPEED = 1; // velocidad general: 2 = el doble de rápido
const TYPE_TIME = 1000; // tiempo de tipeo de un párrafo largo, en ms
const LINE = 0.92; // una tarea arranca cuando su borde de arriba cruza este alto de pantalla
const PEEK = 260; // o cuando lleva este tiempo asomada, en ms
const MAX_WAIT = 3000; // lo que lleva más que esto en pantalla sin cursor libre se muestra solo
const FAST = 4; // px/ms: con el scroll más rápido que esto, no se construye
const REST = 120; // un cursor sin tarea desaparece después de este tiempo, en ms

// Lo que se construye y cómo. No está el tiro al aro: ya se arma a su manera.
const TARGETS = [
  ['text', '.hero-name, .hero-lead, .hero-place, .section-title, .section-sub, .stack-title, .contact-title, .contact-text'],
  ['text', '.site-name, .site-place, .site-summary, .site-detail, .machine-p, .about-lead, .about-p:not(:has(a))'],
  ['text', '.repulsor-text > p:not(:has(a)), .repulsor-play-title, .repulsor-play-note, .rb-message, .code-caption'],
  ['box', '.strata, .stratum, .hero-actions > *, .site-desktop, .site-phone, .repulsor-text .link-out, .repulsor-code .code'],
  ['box', '.rb-player, .rb-board, .rb-controls .btn, .om-head, .om, .om-note, .om-controls, .om-listing, .machine-outro .link-out'],
  ['box', '.about-photo, .about-p:has(a), .about-facts > div, .stack-layers, .stack-layer, .stack-name, .github-calendar'],
  ['box', '.github-repos .link-out, .contact-address, .contact-copy, .colophon > *'],
  ['line', '.about-facts, .repo-list, .colophon'],
  // Lo repetido: el primero se dibuja y los demás se duplican de él.
  ['dup', '.tags li, .site-links > a, .stack-items li, .repo:not(.repo--skeleton), .contact-links li'],
];

const COLORS = ['#3b5bff', '#12a5a0', '#8b45e8', '#e0357b', '#d9a400', '#1f9d55', '#d8341f'];

const isLite = () => window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const random = (a, b) => a + Math.random() * (b - a);
const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
const easeOut = (k) => 1 - (1 - k) ** 3;

const CURSOR_HTML = `
  <svg class="sw-shape sw-arrow" viewBox="0 0 18 18" aria-hidden="true"><path d="M2.5 2.2 16 7.6l-6 1.9-2.2 6z"/></svg>
  <svg class="sw-shape sw-cross" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 1v16M1 9h16"/></svg>
  <svg class="sw-shape sw-ibeam" viewBox="0 0 18 18" aria-hidden="true"><path d="M6 2h6M6 16h6M9 2v14"/></svg>`;

function div(className, parent) {
  const node = document.createElement('div');
  node.className = className;
  parent?.append(node);
  return node;
}

// Colores de la capa donde está el elemento: amarillo y cian sobre el azul.
function paint(node, el) {
  const cs = getComputedStyle(el);
  node.style.setProperty('--sw-accent', cs.getPropertyValue('--accent'));
  node.style.setProperty('--sw-on-accent', cs.getPropertyValue('--on-accent'));
  const onMachine = el.closest('.ground-machine');
  node.style.setProperty('--sw-guide', cs.getPropertyValue(onMachine ? '--machine-cyan' : '--p2'));
  node.style.setProperty('--sw-on-guide', cs.getPropertyValue(onMachine ? '--machine' : '--paper'));
}

// La caja de selección: borde, cuatro tiradores y la medida abajo.
function makeFrame(parent, el) {
  const node = div('sw-frame', parent);
  node.hidden = true;
  paint(node, el);
  ['tl', 'tr', 'bl', 'br'].forEach((corner) => div(`sw-handle sw-${corner}`, node));
  const badge = div('sw-badge', node);
  return {
    node,
    set({ x, y, w, h }, label = true) {
      node.hidden = false;
      node.style.transform = `translate(${x}px, ${y}px)`;
      node.style.width = `${w}px`;
      node.style.height = `${h}px`;
      badge.hidden = !label;
      if (label) badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
    },
  };
}

// Letras visibles de un elemento, en orden, sin los espacios.
function letters(el) {
  const list = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    for (let i = 0; i < node.data.length; i++) if (node.data[i].trim()) list.push([node, i]);
  }
  return list;
}

const reveal = (el, how) => {
  el.style.visibility = '';
  el.style.clipPath = '';
  if (how === 'sweep') el.animate({ clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] }, { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  else if (how === 'fade') el.animate({ opacity: [0, 1] }, { duration: 200, easing: 'ease-out' });
};

// ---------------------------------------------------------------- Motor
export function useSwarmBuild() {
  useLayoutEffect(() => {
    if (!ENABLED || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lite = isLite();
    const agents = lite ? LITE_AGENTS : AGENTS;
    const targets = new Map();
    const guides = [];
    const seenSections = new Set();
    const intro = INTRO > 0 && window.scrollY < 40;
    let frames = new Map(); // rectángulos de este cuadro
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let ready = false;
    let doneCount = 0;
    let totalCount = 0;
    let idleSince = 0;
    let finished = false;
    let introUntil = 0;

    // Capas: fijas a la pantalla, así no agrandan la página ni se desalinean
    // con lo que queda pegado al scroll.
    const layer = div('sw-layer', document.body);
    layer.inert = true;
    layer.setAttribute('aria-hidden', 'true');
    div('sw-ruler sw-ruler-top', layer);
    div('sw-ruler sw-ruler-left', layer);
    div('sw-mark', layer).innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6"/><path d="M16 24V9M9.5 15.5 16 9l6.5 6.5"/></svg>';

    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'sw-skip';
    skip.textContent = copy.skip;
    document.body.append(skip);

    const cursors = Array.from({ length: agents }, (_, i) => {
      const node = div('sw-cursor', layer);
      node.innerHTML = CURSOR_HTML;
      node.style.setProperty('--c', COLORS[i % COLORS.length]);
      const side = i % 4;
      const x = side === 0 ? -30 : side === 1 ? window.innerWidth + 30 : random(0, window.innerWidth);
      const y = side === 2 ? -30 : side === 3 ? window.innerHeight + 30 : random(0, window.innerHeight);
      node.style.transform = `translate(${x}px, ${y}px)`;
      return { node, gen: null, task: null, shape: 'arrow', phase: (i / agents) * Math.PI * 2, restAt: -Infinity, x, y };
    });

    const rectOf = (el) => {
      let r = frames.get(el);
      if (!r) {
        r = el.getBoundingClientRect();
        frames.set(el, r);
      }
      return r;
    };

    const areaOf = (el) => {
      const r = rectOf(el);
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    };

    const setShape = (c, shape) => {
      if (c.shape !== shape) {
        c.shape = shape;
        c.node.dataset.shape = shape;
      }
    };

    const travel = (c, x, y) => clamp(Math.hypot(x - c.x, y - c.y) * 0.9, 180, 520);

    // ------------------------------------------------------- Pasos de un cursor
    function* moveTo(c, target, ms) {
      const sx = c.x;
      const sy = c.y;
      const bend = random(-0.12, 0.12);
      for (let t = 0; t < ms; ) {
        t += yield;
        const k = easeInOut(clamp(t / ms, 0, 1));
        const [x, y] = target();
        const arc = Math.sin(k * Math.PI) * bend;
        c.x = sx + (x - sx) * k - (y - sy) * arc;
        c.y = sy + (y - sy) * k + (x - sx) * arc;
      }
    }

    // Deja la caja un momento en su lugar, siguiendo al scroll.
    function* hold(frame, area, ms) {
      for (let t = 0; t < ms; ) {
        t += yield;
        frame.set(area(), false);
      }
    }

    // Arrastra la caja desde arriba a la izquierda. `area` da el rectángulo.
    function* dragFrame(c, frame, area, ms) {
      setShape(c, 'cross');
      const a = area();
      yield* moveTo(c, () => [area().x, area().y], travel(c, a.x, a.y));
      c.node.dataset.down = '';
      for (let t = 0; t < ms; ) {
        t += yield;
        const k = easeOut(clamp(t / ms, 0, 1));
        const b = area();
        frame.set({ x: b.x, y: b.y, w: b.w * k, h: b.h * k });
        c.x = b.x + b.w * k;
        c.y = b.y + b.h * k;
      }
      delete c.node.dataset.down;
    }

    function* boxTask(c, task) {
      const { el } = task;
      const frame = makeFrame(layer, el);
      frame.node.classList.add('sw-frame-fill');
      const area = () => areaOf(el);
      try {
        const size = area();
        yield* dragFrame(c, frame, area, clamp(Math.hypot(size.w, size.h) * 0.75, 200, 560));
        reveal(el, el.tagName === 'IMG' || el.querySelector(':scope > img') ? 'sweep' : 'fade');
        frame.node.classList.remove('sw-frame-fill');
        yield* hold(frame, area, 170);
      } finally {
        frame.node.remove();
        reveal(el);
      }
    }

    function* textTask(c, task) {
      const { el } = task;
      const list = letters(el);
      const range = document.createRange();
      const frame = makeFrame(layer, el);
      const caret = div('sw-caret', layer);
      caret.hidden = true;
      paint(caret, el);
      // La caja es la del texto, no la del bloque: se ve del ancho de lo escrito.
      const bounds = () => {
        range.selectNodeContents(el);
        const r = range.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      };
      try {
        if (!list.length) return;
        yield* dragFrame(c, frame, bounds, clamp(bounds().w * 0.45, 150, 340));
        setShape(c, 'ibeam');
        el.style.clipPath = 'polygon(0 0, 0 0, 0 0)';
        el.style.visibility = '';
        caret.hidden = false;
        // Los títulos cortos se tipean letra por letra; los párrafos, de corrido.
        const rate = Math.max(0.03, list.length / TYPE_TIME);
        const pad = 40;
        let done = 0;
        for (let budget = 0; done < list.length; ) {
          const dt = yield;
          budget += dt * rate;
          frame.set(bounds(), false);
          const step = Math.floor(budget);
          if (!step) continue;
          budget -= step;
          done = Math.min(list.length, done + step);
          const [node, i] = list[done - 1];
          if (!node.isConnected || i >= node.data.length) break; // el texto cambió mientras se tipeaba
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const r = range.getBoundingClientRect();
          if (!r.width && !r.height) continue; // letra oculta en este tamaño
          const now = rectOf(el);
          const x = r.right - now.left;
          const top = r.top - now.top;
          const bottom = r.bottom - now.top;
          const w = now.width + pad;
          // Todo lo de arriba, y la línea actual hasta el cursor de texto.
          el.style.clipPath = `polygon(${-pad}px ${-pad}px, ${w}px ${-pad}px, ${w}px ${top}px, ${x}px ${top}px, ${x}px ${bottom}px, ${-pad}px ${bottom}px)`;
          caret.style.transform = `translate(${r.right}px, ${r.top}px)`;
          caret.style.height = `${r.height}px`;
          c.x = r.right + 5;
          c.y = r.bottom - 2;
        }
        caret.hidden = true;
        el.style.clipPath = '';
        yield* hold(frame, bounds, 120);
      } finally {
        frame.node.remove();
        caret.remove();
        reveal(el);
      }
    }

    // Pluma: de un extremo al otro, con los puntos de anclaje.
    function* lineTask(c, task) {
      const { el } = task;
      const line = div('sw-line', layer);
      line.hidden = true;
      paint(line, el);
      try {
        const start = () => {
          const r = rectOf(el);
          return [r.left, r.top];
        };
        const [x0, y0] = start();
        setShape(c, 'cross');
        yield* moveTo(c, start, travel(c, x0, y0));
        line.hidden = false;
        const ms = clamp(rectOf(el).width * 0.5, 180, 420);
        for (let t = 0; t < ms; ) {
          t += yield;
          const k = easeInOut(clamp(t / ms, 0, 1));
          const [x, y] = start();
          const w = rectOf(el).width * k;
          line.style.transform = `translate(${x}px, ${y}px)`;
          line.style.width = `${w}px`;
          c.x = x + w;
          c.y = y;
        }
      } finally {
        line.remove();
        reveal(el);
      }
    }

    // Copia lo ya dibujado: selecciona, arrastra el duplicado y mide la distancia.
    function* dupTask(c, task) {
      const { el, master } = task;
      const frame = makeFrame(layer, master);
      const measure = div('sw-measure', layer);
      measure.hidden = true;
      paint(measure, el);
      let ghost = null;
      try {
        const m = () => rectOf(master);
        setShape(c, 'arrow');
        const m0 = m();
        const grabX = m0.width * 0.5;
        const grabY = m0.height * 0.5;
        yield* moveTo(c, () => [m().left + grabX, m().top + grabY], travel(c, m0.left + grabX, m0.top + grabY));
        frame.set(areaOf(master), false);
        yield* hold(frame, () => areaOf(master), 60);

        // La copia vive en la capa, así que lleva puesto el estilo calculado.
        const from0 = m();
        ghost = master.cloneNode(true);
        ghost.removeAttribute('id');
        ghost.classList.add('sw-ghost');
        const cs = getComputedStyle(master);
        for (const prop of ['display', 'alignItems', 'gap', 'padding', 'border', 'borderRadius', 'background', 'color', 'font', 'fontStretch', 'letterSpacing', 'gridTemplateColumns', 'boxSizing']) {
          ghost.style[prop] = cs[prop];
        }
        ghost.style.width = `${from0.width}px`;
        ghost.style.height = `${from0.height}px`;
        ghost.style.transform = `translate(${from0.left}px, ${from0.top}px)`;
        layer.append(ghost);
        c.node.dataset.down = '';
        measure.hidden = false;

        const dist = Math.hypot(rectOf(el).left - from0.left, rectOf(el).top - from0.top);
        const ms = clamp(dist * 0.7, 170, 420);
        for (let t = 0; t < ms; ) {
          t += yield;
          const k = easeInOut(clamp(t / ms, 0, 1));
          const from = m();
          const to = rectOf(el);
          const x = from.left + (to.left - from.left) * k;
          const y = from.top + (to.top - from.top) * k;
          ghost.style.transform = `translate(${x}px, ${y}px)`;
          frame.set(areaOf(master), false);
          c.x = x + grabX;
          c.y = y + grabY;
          // La distancia, del borde del original a la copia.
          const horizontal = Math.abs(to.left - from.left) >= Math.abs(to.top - from.top);
          const gap = Math.max(0, horizontal ? x - from.right : y - from.bottom);
          measure.dataset.axis = horizontal ? 'x' : 'y';
          measure.textContent = String(Math.round(gap));
          measure.style.transform = horizontal
            ? `translate(${from.right}px, ${from.top + from.height / 2}px)`
            : `translate(${from.left + from.width / 2}px, ${from.bottom}px)`;
          measure.style.setProperty('--len', `${gap}px`);
        }
        delete c.node.dataset.down;
      } finally {
        frame.node.remove();
        ghost?.remove();
        measure.remove();
        reveal(el);
      }
    }

    // Saca una guía de la regla hasta el borde de la sección. Queda puesta hasta
    // que la sección termina; la horizontal sigue al scroll.
    function* guideTask(c, task) {
      const { el, section } = task;
      const guide = { el, section, nodes: [], track: null, done: false };
      guides.push(guide);
      try {
        const vh = window.innerHeight;
        const startY = clamp(rectOf(el).top, 60, vh - 60);
        setShape(c, 'arrow');
        yield* moveTo(c, () => [8, startY], travel(c, 8, startY));
        const vertical = div('sw-guide sw-guide-v', layer);
        paint(vertical, el);
        vertical.style.transform = 'translateX(0)';
        guide.nodes.push(vertical);
        for (let t = 0; t < 340; ) {
          t += yield;
          const x = rectOf(el).left * easeInOut(clamp(t / 340, 0, 1));
          vertical.style.transform = `translateX(${x}px)`;
          c.x = x;
        }
        if (lite) return;

        const rulerY = 76;
        yield* moveTo(c, () => [rectOf(el).left + 220, rulerY], 240);
        const horizontal = div('sw-guide sw-guide-h', layer);
        paint(horizontal, el);
        horizontal.style.transform = `translateY(${rulerY}px)`;
        guide.nodes.push(horizontal);
        for (let t = 0; t < 340; ) {
          t += yield;
          const y = rulerY + (rectOf(el).top - rulerY) * easeInOut(clamp(t / 340, 0, 1));
          horizontal.style.transform = `translateY(${y}px)`;
          c.y = y;
        }
        guide.track = horizontal;
      } finally {
        guide.done = true;
      }
    }

    const RUNNERS = { box: boxTask, text: textTask, line: lineTask, dup: dupTask };

    // ------------------------------------------------------- Registro de tareas
    const known = new WeakSet();
    const main = document.querySelector('main');

    const finishTarget = (t) => {
      if (t.status === 'done') return;
      t.status = 'done';
      doneCount++;
    };

    const enqueue = (t) => {
      t.el.style.visibility = 'hidden';
      t.status = 'queued';
      t.peek = 0;
      wake();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const { target: el, isIntersecting, boundingClientRect: r } of entries) {
          const t = targets.get(el);
          if (!isIntersecting || !t || t.status !== 'idle') continue;
          io.unobserve(el);
          // Si entra por arriba, ya quedó atrás: se ve como está.
          if (r.top >= 0 || r.bottom > window.innerHeight * 0.5) enqueue(t);
          else finishTarget(t);
        }
      },
      { rootMargin: '0px 0px 8% 0px' },
    );

    const scan = () => {
      const added = [];
      for (const [kind, selector] of TARGETS) {
        const masters = new Map();
        for (const el of main.querySelectorAll(selector)) {
          if (known.has(el)) continue;
          known.add(el);
          if (!el.getClientRects().length) continue; // oculto en este tamaño
          let finalKind = kind;
          let master = null;
          if (kind === 'dup') {
            const group = el.parentElement;
            master = masters.get(group) ?? null;
            if (!master) {
              masters.set(group, el);
              finalKind = 'box';
            }
          }
          const t = { el, kind: finalKind, master, status: 'idle', peek: 0, parent: null, section: el.closest('section') };
          targets.set(el, t);
          added.push(t);
        }
      }
      totalCount += added.length;
      for (const t of added) {
        let up = t.el.parentElement;
        while (up && up !== main && !targets.has(up)) up = up.parentElement;
        t.parent = up && up !== main ? targets.get(up) : null;
        if (t.master) t.masterTask = targets.get(t.master);
        const r = t.el.getBoundingClientRect();
        // Lo que ya está en pantalla se oculta antes de la primera pintada.
        if (r.bottom <= 0) finishTarget(t);
        else if (r.top < window.innerHeight * 1.08) enqueue(t);
        else io.observe(t.el);
      }
    };

    // ------------------------------------------------------- Final
    const stop = () => {
      if (finished) return;
      finished = true;
      for (const c of cursors) {
        c.gen?.return();
        c.gen = null;
      }
      for (const t of targets.values()) reveal(t.el);
      doneCount = totalCount;
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeprint', stop);
      cancelAnimationFrame(raf);
      raf = 0;
      skip.classList.remove('is-on');
      layer.classList.remove('is-on');
      setTimeout(() => {
        layer.remove();
        skip.remove();
      }, 400);
    };

    // ------------------------------------------------------- Bucle
    const tick = (now) => {
      raf = 0;
      try {
        step(now);
      } catch (error) {
        // Pase lo que pase, la página no se queda sin contenido.
        console.error(error);
        stop();
      }
    };

    const step = (now) => {
      const elapsed = Math.max(0, now - last);
      const dt = Math.min(64, elapsed) * SPEED;
      const y = window.scrollY;
      const speed = Math.abs(y - lastY) / Math.max(1, elapsed);
      last = now;
      lastY = y;
      frames = new Map();
      const vh = window.innerHeight;
      const atEnd = y >= document.documentElement.scrollHeight - vh - 2;
      const inIntro = intro && (!ready || now < introUntil);

      // 1. Qué puede arrancar.
      const runnable = [];
      const open = new Set();
      let backlog = 0;
      let peeking = false;
      for (const t of targets.values()) {
        if (t.status === 'running') open.add(t.section);
        // Con un salto al final, lo que quedó arriba sin verse ya no cuenta.
        if (t.status === 'idle' && atEnd && rectOf(t.el).bottom <= 0) {
          io.unobserve(t.el);
          finishTarget(t);
        }
        if (t.status !== 'queued') continue;
        const r = rectOf(t.el);
        if (speed > FAST || r.bottom <= 0) {
          reveal(t.el);
          finishTarget(t);
          continue;
        }
        open.add(t.section);
        if (inIntro) continue;
        if (r.top < vh && !t.peek) t.peek = now;
        if (t.peek) peeking = true;
        if (t.peek && now - t.peek > MAX_WAIT) {
          reveal(t.el, 'fade');
          finishTarget(t);
          continue;
        }
        if (r.top < vh * LINE || atEnd || (t.peek && now - t.peek > PEEK)) {
          backlog++;
          const blocked = (t.parent && t.parent.status !== 'done') || (t.masterTask && t.masterTask.status !== 'done');
          if (!blocked) runnable.push({ t, r });
        }
      }

      // 2. Asignar a los cursores libres, en orden de lectura.
      if (ready && !inIntro) {
        runnable.sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left);
        const free = cursors.filter((c) => !c.gen);
        let started = 0;
        for (const { t } of runnable) {
          if (!free.length || started >= 2) break;
          // Primero la guía de la sección, si esta es su primera tarea.
          if (t.section && !seenSections.has(t.section) && free.length > 1) {
            seenSections.add(t.section);
            const anchor = t.section.querySelector('.section-title, .hero-name, .contact-title') || t.el;
            const c = free.shift();
            c.task = { el: anchor, section: t.section, kind: 'guide' };
            c.gen = guideTask(c, c.task);
            c.gen.next();
          }
          const c = free.shift();
          t.status = 'running';
          c.task = t;
          c.gen = RUNNERS[t.kind](c, t);
          c.gen.next();
          started++;
        }
      }

      // 3. Avanzar lo que está en marcha. Con mucho pendiente, más rápido.
      const hurry = 1 + clamp(backlog / 12, 0, 1.6);
      let busy = 0;
      for (const c of cursors) {
        if (!c.gen) continue;
        busy++;
        if (c.gen.next(dt * hurry).done) {
          if (c.task.kind !== 'guide') finishTarget(c.task);
          c.gen = null;
          c.task = null;
          c.restAt = now;
          setShape(c, 'arrow');
          delete c.node.dataset.down;
        }
      }

      // 4. Las guías siguen a su sección y se van cuando la sección terminó.
      for (let i = guides.length - 1; i >= 0; i--) {
        const g = guides[i];
        if (g.track) g.track.style.transform = `translateY(${rectOf(g.el).top}px)`;
        if (g.done && !open.has(g.section)) {
          for (const node of g.nodes) {
            node.animate({ opacity: [1, 0] }, { duration: 300, easing: 'ease-out' }).finished.finally(() => node.remove());
          }
          guides.splice(i, 1);
        }
      }

      // 5. Solo se ve el cursor que tiene una tarea. El resto espera oculto, salvo
      // en la órbita inicial, cuando todavía no hay nada que tapar.
      for (const c of cursors) {
        if (inIntro) {
          c.phase += dt * 0.0024;
          const pull = clamp(dt * 0.006, 0, 1);
          c.x += (window.innerWidth / 2 + Math.cos(c.phase) * 74 - c.x) * pull;
          c.y += (vh / 2 + Math.sin(c.phase) * 59 - c.y) * pull;
        }
        c.node.style.transform = `translate(${c.x}px, ${c.y}px)`;
        c.node.classList.toggle('is-idle', !inIntro && !c.gen && now - c.restAt > REST);
      }

      // 6. Qué se ve, y si hace falta otro cuadro.
      const allDone = doneCount >= totalCount && totalCount > 0;
      const working = busy > 0 || backlog > 0 || inIntro;
      if (working) idleSince = 0;
      else if (!idleSince) idleSince = now;
      const resting = idleSince > 0 && now - idleSince > 700;
      layer.classList.toggle('is-on', !resting);
      layer.classList.toggle('is-rulers', working && !inIntro && !lite);
      layer.classList.toggle('is-intro', inIntro);
      skip.classList.toggle('is-on', !resting && !inIntro && !allDone);

      if (allDone && resting) {
        stop();
        return;
      }
      // Lo que está debajo de la pantalla no apura a nadie. Duerme hasta el
      // próximo scroll.
      if (!resting || peeking) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf && !finished) {
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => wake();
    const onKey = (e) => {
      if (e.key === 'Escape') stop();
    };

    skip.addEventListener('click', stop);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeprint', stop);

    // Los repositorios llegan después, desde la API de GitHub.
    const github = document.querySelector('#github');
    const mo = new MutationObserver(scan);
    if (github) mo.observe(github, { childList: true, subtree: true });

    scan();
    layer.classList.add('is-on');
    layer.classList.toggle('is-intro', intro);

    // Se espera la fuente real para medir bien (con un tope).
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))]).then(() => {
      if (finished) return;
      ready = true;
      introUntil = performance.now() + INTRO;
      wake();
    });
    wake();

    return stop;
  }, []);
}
