import { useEffect } from 'react';

// Respaldo para navegadores sin animation-timeline (Firefox 156, Safari
// viejo). Cada elemento con el atributo data-scrub declara su tramo en la
// variable CSS --scrub, con la misma sintaxis que animation-range
// ("entry 10% cover 45%"). La versión nativa usa esa variable directo; acá se
// calcula el progreso con JS, se escribe en --p y scroll-fallback.css mueve
// las mismas @keyframes con animaciones pausadas y adelantadas.
//
// data-scrub vacío: el tramo se mide sobre el propio elemento.
// data-scrub=".selector": se mide sobre el ancestro más cercano que coincida
// (equivale a una view-timeline con nombre definida en ese ancestro).

const supportsNative = () => typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

// Posición del borde de arriba del sujeto (relativa a la pantalla) en un
// punto del tramo, siguiendo la definición de los rangos de view().
function edgeTop(name, pct, h, vh) {
  const p = pct / 100;
  const span = Math.min(h, vh);
  switch (name) {
    case 'entry':
      return vh - p * span;
    case 'exit':
      return (h <= vh ? 0 : vh - h) - p * span;
    case 'contain':
      return h <= vh ? (vh - h) * (1 - p) : -p * (h - vh);
    default:
      return vh - p * (vh + h); // cover
  }
}

function parseRange(value) {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 4) return null;
  const start = parseFloat(parts[1]);
  const end = parseFloat(parts[3]);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return [parts[0], start, parts[2], end];
}

export function useScrubFallback() {
  useEffect(() => {
    if (supportsNative()) return;

    const ranges = new WeakMap();
    let frame = 0;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const writes = [];

      // Primero todas las lecturas, después todas las escrituras.
      for (const el of document.querySelectorAll('[data-scrub]')) {
        if (!ranges.has(el)) ranges.set(el, parseRange(getComputedStyle(el).getPropertyValue('--scrub')));
        const range = ranges.get(el);
        if (!range) continue;
        const subject = el.dataset.scrub ? el.closest(el.dataset.scrub) : el;
        if (!subject) continue;
        const { top, height } = subject.getBoundingClientRect();
        const a = edgeTop(range[0], range[1], height, vh);
        const b = edgeTop(range[2], range[3], height, vh);
        const p = a === b ? Number(top <= a) : (a - top) / (a - b);
        writes.push([el, Math.min(1, Math.max(0, p))]);
      }

      for (const [el, p] of writes) el.style.setProperty('--p', p.toFixed(4));
      // La clase va después de escribir --p: así no hay un cuadro con valores
      // por defecto.
      document.documentElement.classList.add('scrub-js');
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // Imágenes y datos que llegan tarde cambian la altura de la página.
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove('scrub-js');
    };
  }, []);
}
