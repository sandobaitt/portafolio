import { useEffect, useState } from 'react';

// Devuelve dos cosas según el scroll:
// - active: la sección que cruza el 40% superior de la pantalla (para el menú).
// - ground: el suelo de la sección que está debajo de la barra superior,
//   para que la barra tome el color de la capa en la que estás.
// Además estira la línea de profundidad de la barra (.topbar-progress)
// escribiendo el estilo directo, sin volver a renderizar.
export function useScrollSections(ids, barHeight = 56) {
  const [state, setState] = useState({ active: null, ground: 'paper' });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const depth = document.querySelector('.topbar-progress');
      if (depth) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        depth.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
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

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids, barHeight]);

  return state;
}
