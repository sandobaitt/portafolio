import { useEffect, useState } from 'react';

// Devuelve dos cosas según el scroll:
// - active: la sección que cruza el 40% superior de la pantalla (para el menú).
// - ground: el suelo de la sección que está debajo de la barra superior,
//   para que la barra tome el color de la capa en la que estás.
// Además dibuja la barra de profundidad (.topbar-depth): un tramo por sección
// con el color de su capa, y el avance. Escribe el estilo directo, sin volver
// a renderizar.
export function useScrollSections(ids, barHeight = 56) {
  const [state, setState] = useState({ active: null, ground: 'paper' });

  useEffect(() => {
    let frame = 0;
    let layoutFrame = 0;

    // Tramos de la barra. Se miden en "espacio de scroll": una sección empieza
    // en la barra cuando su borde de arriba cruza la línea del 40% de la
    // pantalla, la misma que decide la sección activa del menú.
    const layout = () => {
      layoutFrame = 0;
      const bar = document.querySelector('.topbar');
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const probe = window.innerHeight * 0.4;
      const stops = [];
      let prev = null;
      for (const el of document.querySelectorAll('main [data-ground]')) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const at = Math.min(100, Math.max(0, ((top - probe) / max) * 100));
        if (prev) stops.push(`var(--seg-${prev.ground}) ${prev.at.toFixed(2)}% ${at.toFixed(2)}%`);
        prev = { ground: el.dataset.ground, at: prev ? at : 0 };
      }
      if (prev) stops.push(`var(--seg-${prev.ground}) ${prev.at.toFixed(2)}% 100%`);
      bar.style.setProperty('--bar', `linear-gradient(90deg, ${stops.join(', ')})`);
    };

    const measure = () => {
      frame = 0;
      const depth = document.querySelector('.topbar-depth');
      if (depth) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        depth.style.setProperty('--p', (max > 0 ? Math.min(1, window.scrollY / max) : 0).toFixed(4));
      }
      const probe = window.innerHeight * 0.4;
      let active = null;
      let ground = 'paper';

      for (const el of document.querySelectorAll('[data-ground]')) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= barHeight && rect.bottom > barHeight) ground = el.dataset.ground;
        if (ids.includes(el.id) && rect.top <= probe && rect.bottom > probe) active = el.id;
      }

      setState((prev) => (prev.active === active && prev.ground === ground ? prev : { active, ground }));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const onLayout = () => {
      if (!layoutFrame) layoutFrame = requestAnimationFrame(layout);
      onScroll();
    };

    layout();
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onLayout);
    // Imágenes y datos que llegan tarde cambian el alto de las secciones.
    const ro = new ResizeObserver(onLayout);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onLayout);
      ro.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(layoutFrame);
    };
  }, [ids, barHeight]);

  return state;
}
