import { useCallback, useEffect, useState } from 'react';

const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function readTheme() {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return media().matches ? 'dark' : 'light';
}

// El tema sigue al sistema hasta que el visitante elige uno; esa elección
// se guarda y el script de index.html la aplica antes del primer render.
export function useTheme() {
  const [theme, setTheme] = useState(readTheme);

  // Varios componentes usan este hook: todos siguen el atributo data-theme
  // y la preferencia del sistema, así un cambio en uno llega a los demás.
  useEffect(() => {
    const mq = media();
    const sync = () => setTheme(readTheme());
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    mq.addEventListener('change', sync);
    return () => {
      observer.disconnect();
      mq.removeEventListener('change', sync);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = readTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Sin almacenamiento el tema dura lo que dura la pestaña.
    }
    setTheme(next);
  }, []);

  return [theme, toggle];
}
