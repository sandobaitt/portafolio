import { useEffect, useRef, useState } from 'react';
import { edgeTop, parseRange } from '../hooks/useScrubFallback';
import './Decode.css';

// Texto cifrado con un corrimiento tipo César que se descifra con el scroll,
// como en un CTF de criptografía: cada letra arranca 13 lugares corrida
// (ROT13) y gira hacia atrás hasta quedar en su lugar, en onda de izquierda
// a derecha.
//
// El texto real queda siempre debajo, transparente: ocupa el lugar (el
// párrafo no se mueve), dibuja el subrayado del enlace y deja que las
// palabras pasen de línea como siempre. Encima va cada palabra cifrada,
// escalada entera al ancho de la palabra real.
//
// Se escrubea con JS en todos los navegadores (CSS no puede cambiar letras).
// Con movimiento reducido o sin JS se ve el texto real. Lo animado va con
// aria-hidden: quien lo use pone el texto real en el aria-label del enlace.

const SHIFT = 13;
const WAVE = 0.55; // cuánto se escalonan las letras (0 = todas juntas)

function rotate(ch, n) {
  const code = ch.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + n) % 26) + 65);
  if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + n) % 26) + 97);
  return ch;
}

const isLetter = (ch) => /[A-Za-z]/.test(ch);

// Un canvas con la fuente del texto, para medir palabras sin tocar el DOM.
function makeMeasurer(el) {
  const cs = getComputedStyle(el);
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  return (s) => ctx.measureText(s).width;
}

const Decode = ({ text, range = 'cover 12% cover 42%' }) => {
  const ref = useRef(null);
  const measurer = useRef(null);
  // 1 = descifrado: es lo que se ve antes de medir, sin JS y con movimiento reducido.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    const parsed = parseRange(range);
    if (!el || !parsed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!measurer.current) return; // hasta que cargue la fuente, texto real
      const vh = window.innerHeight;
      const { top, height } = el.getBoundingClientRect();
      const a = edgeTop(parsed[0], parsed[1], height, vh);
      const b = edgeTop(parsed[2], parsed[3], height, vh);
      const p = Math.min(1, Math.max(0, (a - top) / (a - b)));
      setProgress(Math.round(p * 100) / 100);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      measurer.current = makeMeasurer(el);
      measure();
    });

    // Solo escucha el scroll mientras el texto está cerca de la pantalla.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) window.addEventListener('scroll', onScroll, { passive: true });
        else window.removeEventListener('scroll', onScroll);
        measure();
      },
      { rootMargin: '25% 0px' },
    );
    io.observe(el);

    return () => {
      alive = false;
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [range]);

  if (progress >= 1 || !measurer.current) {
    return (
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    );
  }

  const width = measurer.current;
  const count = [...text].filter(isLetter).length;
  let index = 0;

  return (
    <span ref={ref} className="decode" aria-hidden="true">
      {text.split(/(\s+)/).map((word, w) => {
        if (!word || /^\s+$/.test(word)) return word;
        // Cada letra se descifra en su propia ventana del tramo.
        const letters = [...word].map((ch) => {
          if (!isLetter(ch)) return { ch, done: true };
          const start = (index++ / Math.max(1, count - 1)) * WAVE;
          const local = Math.min(1, Math.max(0, (progress - start) / (1 - WAVE)));
          const shift = Math.round(SHIFT * (1 - local));
          return { ch: rotate(ch, shift), done: shift === 0 };
        });
        const cipher = letters.map((l) => l.ch).join('');
        const fit = Math.min(1.4, Math.max(0.7, width(word) / width(cipher)));
        return (
          <span key={w} className="decode-word">
            {word}
            <span className="decode-shown" style={{ '--fit': fit.toFixed(3) }}>
              {letters.map((l, i) =>
                l.done ? (
                  <span key={i} className="decode-done">
                    {l.ch}
                  </span>
                ) : (
                  l.ch
                ),
              )}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default Decode;
