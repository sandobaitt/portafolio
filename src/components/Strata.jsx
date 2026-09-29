import { useEffect, useRef, useState } from 'react';
import { strata } from '../content';

// El corte de la portada. Después de la entrada, un recorrido baja por las
// tres capas y cada una muestra su mecanismo: el celular de CCR se desplaza,
// la flecha de Repulsor gira con la línea de rotar90 que corresponde y un
// cursor recorre las instrucciones de assembler.

const TICK = 800;
const TICKS_PER_LAYER = 5;
const START_DELAY = 1600;

const OBJECT_LINES = [
  'direccion := direccion',
  '    caseOf: {',
  '        [ #arriba ]    -> [ #derecha ].',
  '        [ #derecha ]   -> [ #abajo ].',
  '        [ #abajo ]     -> [ #izquierda ].',
  '        [ #izquierda ] -> [ #arriba ] }',
];

const MACHINE_LINES = ['mov al, num', 'and al, 111b', 'push ax', 'shr num, 3'];
// Valores después de cada instrucción, empezando con num = 10100111b.
const MACHINE_STATE = [
  { al: '10100111', num: '10100111' },
  { al: '00000111', num: '10100111' },
  { al: '00000111', num: '10100111', pushed: true },
  { al: '00000111', num: '00010100', pushed: true },
];

const PHONE_PAN = [0, 13, 26, 39, 52];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useCycle(ref, enabled) {
  const [tick, setTick] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => setStarted(true), START_DELAY);
    return () => clearTimeout(t);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !started || !visible) return;
    const id = setInterval(() => {
      if (!document.hidden) setTick((t) => t + 1);
    }, TICK);
    return () => clearInterval(id);
  }, [enabled, started, visible]);

  return tick;
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19.5V5" />
    <path d="M5.75 11.25 12 5l6.25 6.25" />
  </svg>
);

const Strata = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const tick = useCycle(ref, !reduced);

  const running = tick >= 0;
  const layer = running ? Math.floor(tick / TICKS_PER_LAYER) % 3 : -1;
  const sub = running ? tick % TICKS_PER_LAYER : 0;
  const cycle = running ? Math.floor(tick / (TICKS_PER_LAYER * 3)) : 0;

  // Web: el celular baja mientras la capa está activa y vuelve después.
  const pan = layer === 0 ? PHONE_PAN[sub] : 0;

  // Objetos: dos giros por vuelta, siempre en sentido horario.
  const turnsBefore = cycle * 2;
  const turns = layer === 1 ? turnsBefore + (sub >= 3 ? 2 : sub >= 1 ? 1 : 0) : layer === 2 ? turnsBefore + 2 : turnsBefore;
  // La línea del caseOf que se aplicó en el último giro queda marcada mientras dura.
  const rotation = layer === 1 && sub >= 1 ? (sub >= 3 ? 2 : 1) : 0;
  const objectLine = rotation ? 2 + ((turnsBefore + rotation - 1) % 4) : -1;

  // Máquina: una instrucción por paso.
  const machineStep = layer === 2 ? Math.min(sub, MACHINE_LINES.length - 1) : -1;
  const machineState = MACHINE_STATE[Math.max(machineStep, 0)];

  const depthIds = ['sitios', 'repulsor', 'assembler'];

  return (
    <nav ref={ref} className="strata" aria-label="Mi trabajo, de la web a la máquina">
      {strata.map((s, i) => (
        <a
          key={s.id}
          className={`stratum stratum--${s.id}`}
          href={`#${s.id}`}
          style={{ '--i': i }}
          data-active={depthIds[layer] === s.id ? '' : undefined}
        >
          <span className="stratum-label">
            <span className="stratum-depth">{s.depth}</span>
            <span className="stratum-title">{s.title}</span>
            <span className="stratum-detail">{s.detail}</span>
          </span>

          <span className="stratum-visual" aria-hidden="true">
            {i === 0 && (
              <>
                <img
                  className="stratum-shot stratum-shot--desktop"
                  src="/work/ikigai-desktop.webp"
                  alt=""
                  width="1440"
                  height="900"
                  fetchPriority="high"
                />
                <span className="stratum-phone" data-scrolling={layer === 0 ? '' : undefined}>
                  <img src="/work/ccr-mobile-long.webp" alt="" width="390" height="2600" style={{ '--pan': `${pan}%` }} />
                </span>
              </>
            )}

            {i === 1 && (
              <>
                <span className="stratum-code">
                  {OBJECT_LINES.map((line, n) => (
                    <span key={n} className="stratum-line" data-on={objectLine === n ? '' : undefined}>
                      {line}
                    </span>
                  ))}
                </span>
                <span className="stratum-arrow" style={{ '--turns': turns }}>
                  <Arrow />
                </span>
              </>
            )}

            {i === 2 && (
              <>
                <span className="stratum-code">
                  {MACHINE_LINES.map((line, n) => (
                    <span key={n} className="stratum-line" data-on={machineStep === n ? '' : undefined}>
                      {line}
                    </span>
                  ))}
                </span>
                <span className="stratum-regs" data-live={machineStep >= 0 ? '' : undefined}>
                  <span>
                    al <b key={`al${machineState.al}`}>{machineState.al}</b>
                  </span>
                  <span>
                    num <b key={`num${machineState.num}`}>{machineState.num}</b>
                  </span>
                  <span>
                    pila <b key={`p${machineState.pushed}`}>{machineState.pushed ? '7' : '·'}</b>
                  </span>
                </span>
              </>
            )}
          </span>
        </a>
      ))}
    </nav>
  );
};

export default Strata;
