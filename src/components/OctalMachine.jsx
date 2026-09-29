import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ChevronDown, ChevronUp } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { assembler } from '../content';
import Code from './Code';
import './OctalMachine.css';

// El final del 28/08/2025 ejecutado con el scroll. La escena queda fija
// mientras la página recorre la pista; cada tramo de la pista es un paso.
// Los botones de paso mueven el scroll, así el estado sale siempre de un
// solo lugar. En pantallas muy bajas la escena no se fija y los botones
// cambian el paso directamente.
//
// El registro es una cinta: 9 ceros esperando a la izquierda y los 8 bits
// de num. Cada shr num, 3 corre la cinta tres lugares; los ceros entran
// solos y los bits de la derecha salen de la ventana.

const TAPE = [...'000000000', ...'10100111'];
const WAITING = 9;
const LOOP = [28, 29, 30, 32, 33];

const STEPS = [
  { lines: [2, 9], shift: 0, cx: 3, al: null, stack: [], out: '', note: 'num vale 10100111b y cx cuenta tres vueltas.' },
  {
    lines: [13, 14, 16],
    shift: 0,
    cx: 3,
    mask: true,
    al: '111',
    stack: [7],
    out: '',
    note: 'and al, 111b se queda con los tres bits de abajo: 111b, o sea 7. push ax lo guarda en la pila.',
  },
  { lines: [18, 20], shift: 1, cx: 2, al: '111', stack: [7], out: '', note: 'shr num, 3 corre el número tres lugares. Por la izquierda entran ceros.' },
  { lines: [13, 14, 16], shift: 1, cx: 2, mask: true, al: '100', stack: [7, 4], out: '', note: 'Ahora los tres bits de abajo son 100b, que es 4. El 4 queda arriba del 7.' },
  { lines: [18, 20], shift: 2, cx: 1, al: '100', stack: [7, 4], out: '', note: 'Otro corrimiento de tres lugares.' },
  { lines: [13, 14, 16], shift: 2, cx: 1, mask: true, al: '010', stack: [7, 4, 2], out: '', note: 'Quedan 010b, que es 2, y el 2 queda arriba de todo.' },
  { lines: [18, 20, 21, 22], shift: 3, cx: 0, al: '010', stack: [7, 4, 2], out: '', note: 'cx llega a 0 y el programa sale del bucle.' },
  {
    lines: LOOP,
    shift: 3,
    cx: 0,
    al: null,
    stack: [7, 4],
    out: '2',
    note: 'pop ax saca el último que entró, el 2. add al, 48d lo pasa a ASCII y int 21h lo imprime.',
  },
  { lines: LOOP, shift: 3, cx: 0, al: null, stack: [7], out: '24', note: 'Después sale el 4.' },
  { lines: LOOP, shift: 3, cx: 0, al: null, stack: [], out: '247', note: 'Y por último el 7. En pantalla queda 247, que es 10100111b en octal.' },
];

const LAST = STEPS.length - 1;
const SHORT_SCREEN = '(max-height: 540px)';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

// Mide la pista: cuánto se puede scrollear con la escena fija y dónde empieza.
function measureTrack(track) {
  const stage = track.firstElementChild;
  const stickTop = parseFloat(getComputedStyle(stage).top) || 0;
  const rect = track.getBoundingClientRect();
  return { rect, stickTop, distance: rect.height - stage.offsetHeight };
}

const OctalMachine = () => {
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const windowRef = useRef(null);
  const [index, setIndex] = useState(0);
  const pinned = !useMediaQuery(SHORT_SCREEN);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  const step = STEPS[index];

  // Sin fijar: la barra de progreso sigue al paso elegido con los botones.
  useEffect(() => {
    if (!pinned) progressRef.current.style.transform = `scaleX(${index / LAST})`;
  }, [pinned, index]);

  // Fijada: scroll -> paso.
  useEffect(() => {
    if (!pinned) return;
    const progress = progressRef.current;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;
      const { rect, stickTop, distance } = measureTrack(track);
      const p = distance > 0 ? clamp((stickTop - rect.top) / distance, 0, 1) : 0;
      progress.style.transform = `scaleX(${p})`;
      const next = Math.min(LAST, Math.floor(p * STEPS.length));
      setIndex((prev) => (prev === next ? prev : next));
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
  }, [pinned]);

  // El listado sigue a las líneas que se están ejecutando, como un depurador.
  useLayoutEffect(() => {
    const win = windowRef.current;
    if (!win) return;
    const follow = () => {
      const pre = win.querySelector('pre');
      const lines = win.querySelectorAll('.code-line');
      if (!pre || !lines.length || !win.clientHeight) return;
      const first = lines[step.lines[0] - 1];
      const last = lines[step.lines[step.lines.length - 1] - 1];
      const center = (first.offsetTop + last.offsetTop + last.offsetHeight) / 2;
      const max = Math.max(0, pre.offsetHeight - win.clientHeight);
      win.style.setProperty('--code-offset', `${clamp(center - win.clientHeight / 2, 0, max)}px`);
    };
    follow();
    const ro = new ResizeObserver(follow);
    ro.observe(win);
    return () => ro.disconnect();
  }, [step]);

  const goTo = (target) => {
    const i = clamp(target, 0, LAST);
    if (!pinned) {
      setIndex(i);
      return;
    }
    const { rect, stickTop, distance } = measureTrack(trackRef.current);
    const top = window.scrollY + rect.top - stickTop + ((i + 0.5) / STEPS.length) * distance;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div
      ref={trackRef}
      className="om-track"
      data-pinned={pinned ? '' : undefined}
      style={{ '--steps': STEPS.length }}
    >
      <div className="om-stage">
        <div className="wrap om-stage-grid">
          <div className="om-head">
            <h3 className="om-title">Así corre, paso a paso</h3>
            <span className="om-count">
              paso {index + 1} de {STEPS.length}
            </span>
          </div>

          <figure className="om" aria-label="Estado del programa: registro num, al, pila y pantalla">
            <div className="om-grid">
              <span className="om-label">num</span>
              <div className="om-register">
                <div className="om-tape">
                  {TAPE.map((bit, i) => {
                    const pos = i - WAITING + step.shift * 3;
                    return (
                      <span
                        key={i}
                        className="om-bit"
                        style={{ '--pos': pos }}
                        data-masked={step.mask && pos >= 5 && pos <= 7 ? '' : undefined}
                        data-gone={pos > 7 ? '' : undefined}
                      >
                        {bit}
                      </span>
                    );
                  })}
                </div>
                <span className="om-mask" data-on={step.mask ? '' : undefined} />
              </div>
              <span className="om-cx">
                cx <b key={step.cx}>{step.cx}</b>
              </span>

              <span className="om-label">al</span>
              <span className="om-al">
                {step.al ? (
                  <span key={step.al + index}>
                    {step.al}b <span className="om-eq">=</span> <b>{parseInt(step.al, 2)}</b>
                  </span>
                ) : (
                  <span className="om-empty">sin usar</span>
                )}
              </span>
            </div>

            <div className="om-io">
              <div className="om-stack">
                <span className="om-label">pila</span>
                <ol className="om-stack-list">
                  {step.stack.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ol>
              </div>
              <div className="om-screen">
                <span className="om-label">pantalla</span>
                <p>
                  <span className="om-prompt">El numero binario a octal es: </span>
                  <span className="om-out">
                    {step.out.split('').map((c, i) => (
                      <span key={i} className="om-char">
                        {c}
                      </span>
                    ))}
                    <span className="om-caret" aria-hidden="true" />
                  </span>
                </p>
              </div>
            </div>
          </figure>

          <p className="om-note">
            {step.note}
            {index === 0 && (
              <span className="om-hint">
                {pinned ? ' Seguí bajando para ejecutarlo.' : ' Avanzá con los botones.'}
              </span>
            )}
          </p>

          <div className="om-controls">
            <button type="button" className="btn btn-quiet" onClick={() => goTo(index - 1)} disabled={index === 0}>
              <ChevronUp size={16} aria-hidden="true" />
              Anterior
            </button>
            <button type="button" className="btn btn-primary" onClick={() => goTo(index + 1)} disabled={index === LAST}>
              <ChevronDown size={16} aria-hidden="true" />
              Siguiente
            </button>
            {pinned && (
              <a className="om-skip" href="#assembler-fin">
                <ArrowDownToLine size={15} aria-hidden="true" />
                Saltar
              </a>
            )}
          </div>

          <div className="om-listing">
            <p className="om-listing-title">
              <a href={assembler.source} target="_blank" rel="noopener noreferrer">
                <FaGithub className="om-listing-brand" aria-hidden="true" />
                {assembler.exampleTitle}
              </a>
            </p>
            <div ref={windowRef} className="om-code-window">
              <Code code={assembler.code} lang="asm" label={assembler.exampleTitle} activeLines={step.lines} />
            </div>
          </div>
        </div>

        <div className="om-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
    </div>
  );
};

export default OctalMachine;
