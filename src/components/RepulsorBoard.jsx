import { useEffect, useId, useReducer, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import './RepulsorBoard.css';

// Reglas tomadas del código en Pharo del TPI:
// - Celda>>rotar90: la casilla que dejás gira 90° en sentido horario.
// - JuegoEnEjecucion>>avanzarJugador: si la flecha te saca del tablero,
//   perdés una vida y te quedás donde estabas.
// - Celda class>>aleatoria: 10% de casillas especiales, cada una da una vida.

const SIZE = 8;
const LIVES = 3;
const STEP = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];
const DIR_LABEL = ['hacia arriba', 'a la derecha', 'hacia abajo', 'a la izquierda'];
const NAMES = ['Azul', 'Rojo'];

function newGame() {
  return {
    id: Math.random(),
    cells: Array.from({ length: SIZE * SIZE }, () => {
      const dir = Math.floor(Math.random() * 4);
      return { dir, turns: dir, power: Math.random() < 0.1 };
    }),
    players: [
      { pos: null, lives: LIVES },
      { pos: null, lives: LIVES },
    ],
    turn: 0,
    phase: 'place',
    winner: null,
    bump: null,
    rotated: null,
    message: `${NAMES[0]}: elegí la casilla de salida.`,
  };
}

function reducer(state, action) {
  if (action.type === 'reset') return newGame();

  if (action.type === 'place') {
    if (state.phase !== 'place') return state;
    const other = 1 - state.turn;
    if (state.players[other].pos === action.index) {
      return { ...state, message: `Esa casilla ya es de ${NAMES[other]}. Elegí otra.` };
    }
    const players = state.players.map((p, k) => (k === state.turn ? { ...p, pos: action.index } : p));
    if (players[other].pos === null) {
      return { ...state, players, turn: other, message: `${NAMES[other]}: elegí la casilla de salida.` };
    }
    return {
      ...state,
      players,
      turn: 0,
      phase: 'move',
      message: `Arranca ${NAMES[0]}. Tocá el tablero o usá el botón Mover.`,
    };
  }

  if (action.type === 'move') {
    if (state.phase !== 'move') return state;
    const k = state.turn;
    const other = 1 - k;
    const me = state.players[k];
    const cell = state.cells[me.pos];
    const row = Math.floor(me.pos / SIZE) + STEP[cell.dir][0];
    const col = (me.pos % SIZE) + STEP[cell.dir][1];

    const cells = state.cells.slice();
    cells[me.pos] = { ...cell, dir: (cell.dir + 1) % 4, turns: cell.turns + 1 };

    let { pos, lives } = me;
    let note;
    let bump = null;

    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      lives -= 1;
      bump = { player: k, dir: cell.dir, seq: (state.bump?.seq ?? 0) + 1 };
      note = lives
        ? `${NAMES[k]} se sale del tablero: pierde una vida y se queda en su casilla.`
        : `${NAMES[k]} se sale del tablero y se queda sin vidas.`;
    } else {
      pos = row * SIZE + col;
      if (cells[pos].power) {
        lives += 1;
        cells[pos] = { ...cells[pos], power: false };
        note = `${NAMES[k]} cae en una casilla verde y suma una vida.`;
      } else {
        note = `${NAMES[k]} avanza ${DIR_LABEL[cell.dir]}.`;
      }
    }

    const players = state.players.map((p, i) => (i === k ? { pos, lives } : p));
    const rotated = { dir: cell.dir, seq: (state.rotated?.seq ?? 0) + 1 };
    if (lives === 0) {
      return { ...state, cells, players, bump, rotated, phase: 'over', winner: other, message: `${note} Gana ${NAMES[other]}.` };
    }
    return { ...state, cells, players, bump, rotated, turn: other, message: `${note} Le toca a ${NAMES[other]}.` };
  }

  return state;
}

function randomFreeCell(state) {
  const taken = state.players[1 - state.turn].pos;
  let index;
  do {
    index = Math.floor(Math.random() * SIZE * SIZE);
  } while (index === taken);
  return index;
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19.5V5" />
    <path d="M5.75 11.25 12 5l6.25 6.25" />
  </svg>
);

// onRotate recibe la dirección que tenía la casilla antes de girar, para
// marcar la rama del caseOf de rotar90 que se aplicó.
const RepulsorBoard = ({ onRotate }) => {
  const [state, dispatch] = useReducer(reducer, null, newGame);
  const [auto, setAuto] = useState(false);
  const [focus, setFocus] = useState(0);
  const cellRefs = useRef([]);
  const helpId = useId();

  const running = auto && state.phase !== 'over';

  useEffect(() => {
    onRotate?.(state.rotated ? state.rotated.dir : null);
  }, [state.rotated, onRotate]);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(
      () => {
        if (state.phase === 'place') dispatch({ type: 'place', index: randomFreeCell(state) });
        else dispatch({ type: 'move' });
      },
      state.phase === 'place' ? 350 : 420,
    );
    return () => clearTimeout(t);
  }, [running, state]);

  const onCell = (index) => {
    setAuto(false);
    setFocus(index);
    if (state.phase === 'place') dispatch({ type: 'place', index });
    else if (state.phase === 'move') dispatch({ type: 'move' });
  };

  const onKeyDown = (e, i) => {
    const r = Math.floor(i / SIZE);
    const c = i % SIZE;
    let next = null;
    if (e.key === 'ArrowUp' && r > 0) next = i - SIZE;
    else if (e.key === 'ArrowDown' && r < SIZE - 1) next = i + SIZE;
    else if (e.key === 'ArrowLeft' && c > 0) next = i - 1;
    else if (e.key === 'ArrowRight' && c < SIZE - 1) next = i + 1;
    else if (e.key === 'Home') next = r * SIZE;
    else if (e.key === 'End') next = r * SIZE + SIZE - 1;
    if (next === null) return;
    e.preventDefault();
    setFocus(next);
    cellRefs.current[next]?.focus();
  };

  const move = () => {
    setAuto(false);
    dispatch({ type: 'move' });
  };

  const reset = () => {
    setAuto(false);
    dispatch({ type: 'reset' });
  };

  const [a, b] = state.players;
  const shared = a.pos !== null && a.pos === b.pos;

  return (
    <div className="rb">
      <div className="rb-players">
        {state.players.map((p, k) => (
          <div
            key={k}
            className={`rb-player rb-player--${k}`}
            data-turn={state.phase !== 'over' && state.turn === k ? '' : undefined}
            data-out={p.lives === 0 ? '' : undefined}
          >
            <span className="rb-player-dot" aria-hidden="true" />
            <span className="rb-player-name">{NAMES[k]}</span>
            <span className="rb-lives">
              <span className="rb-pips" aria-hidden="true">
                {Array.from({ length: Math.min(p.lives, 8) }, (_, i) => (
                  <span key={i} className="rb-pip" />
                ))}
              </span>
              <span className="rb-lives-num">
                {p.lives} {p.lives === 1 ? 'vida' : 'vidas'}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div
        key={state.id}
        className="rb-board"
        role="group"
        aria-label={`Tablero de ${SIZE} por ${SIZE}`}
        aria-describedby={helpId}
        style={{ '--size': SIZE }}
      >
        {state.cells.map((cell, i) => {
          const here = state.players.map((p, k) => (p.pos === i ? NAMES[k] : null)).filter(Boolean);
          return (
            <button
              key={i}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              type="button"
              className={`rb-cell${cell.power ? ' is-power' : ''}`}
              tabIndex={i === focus ? 0 : -1}
              onClick={() => onCell(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              aria-label={`Fila ${Math.floor(i / SIZE) + 1}, columna ${(i % SIZE) + 1}, flecha ${DIR_LABEL[cell.dir]}${
                cell.power ? ', casilla verde' : ''
              }${here.length ? `, ${here.join(' y ')} acá` : ''}`}
            >
              <span
                className="rb-arrow"
                data-scrub=""
                style={{ '--turns': cell.turns, '--scrub': `cover ${i % SIZE}% cover ${12 + (i % SIZE)}%` }}
              >
                <Arrow />
              </span>
              {cell.power && (
                <span className="rb-plus" aria-hidden="true">
                  +1
                </span>
              )}
            </button>
          );
        })}

        {state.players.map((p, k) =>
          p.pos === null ? null : (
            <span
              key={k}
              className={`rb-token rb-token--${k}`}
              data-turn={state.phase === 'move' && state.turn === k ? '' : undefined}
              data-shared={shared ? '' : undefined}
              style={{ '--r': Math.floor(p.pos / SIZE), '--c': p.pos % SIZE }}
              aria-hidden="true"
            >
              <span
                key={state.bump?.player === k ? state.bump.seq : 0}
                className="rb-token-dot"
                data-bump={state.bump?.player === k ? state.bump.dir : undefined}
              />
            </span>
          ),
        )}
      </div>

      <p id={helpId} className="rb-message" role="status" aria-live="polite">
        {state.message}
      </p>

      <div className="rb-controls">
        <button type="button" className="btn btn-primary" onClick={move} disabled={state.phase !== 'move'}>
          Mover
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => setAuto((v) => !v)} disabled={state.phase === 'over'}>
          {running ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {running ? 'Pausar' : 'Partida automática'}
        </button>
        <button type="button" className="btn btn-quiet" onClick={reset}>
          <RotateCcw size={16} aria-hidden="true" />
          Tablero nuevo
        </button>
      </div>
    </div>
  );
};

export default RepulsorBoard;
