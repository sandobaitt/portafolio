import './Code.css';

// Resaltado mínimo para los dos lenguajes que muestra el sitio. No intenta
// ser un parser: solo marca lo que ayuda a leer el fragmento.

const ASM_OPS =
  'mov|xor|and|or|not|shr|shl|push|pop|add|sub|inc|dec|cmp|jne|je|jmp|jz|jnz|loop|int|call|ret|print|printn';
const ASM_REGS = 'ax|bx|cx|dx|al|ah|bl|bh|cl|ch|dl|dh|si|di|sp|bp|ds|es|ss|cs';

const asmToken = new RegExp(
  [
    "('[^']*')", // cadena
    '((?<=^\\s*)[A-Za-z_]\\w*:)', // etiqueta
    '(\\.\\w+|@\\w+|\\b(?:db|dw|dup)\\b)', // directiva
    `(\\b(?:${ASM_OPS})\\b)`, // instrucción
    `(\\b(?:${ASM_REGS})\\b)`, // registro
    '(\\b\\d[\\da-f]*[bhd]?\\b)', // número
  ].join('|'),
  'gi',
);
const asmKinds = ['str', 'label', 'dir', 'op', 'reg', 'num'];

const stToken = new RegExp(
  [
    '("[^"]*")', // comentario
    '(#\\w+)', // símbolo
    '(\\b\\w+:)', // palabra clave
    '(:=|->|\\^)', // asignación / flecha
  ].join('|'),
  'g',
);
const stKinds = ['com', 'sym', 'key', 'op'];

function paint(text, regex, kinds) {
  const out = [];
  let last = 0;
  regex.lastIndex = 0;
  for (let m = regex.exec(text); m; m = regex.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const group = m.slice(1).findIndex((g) => g !== undefined);
    out.push(
      <span key={m.index} className={`tk-${kinds[group]}`}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function highlightLine(line, lang) {
  if (lang === 'asm') {
    const cut = line.indexOf(';');
    const code = cut === -1 ? line : line.slice(0, cut);
    const comment = cut === -1 ? null : line.slice(cut);
    return (
      <>
        {paint(code, asmToken, asmKinds)}
        {comment && <span className="tk-com">{comment}</span>}
      </>
    );
  }
  return paint(line, stToken, stKinds);
}

// activeLines: números de línea (desde 1) que se marcan, por ejemplo la
// instrucción que se está ejecutando en una animación.
const Code = ({ code, lang, label, className = '', activeLines = [] }) => {
  const lines = code.split('\n');
  return (
    <figure className={`code code--${lang} ${className}`}>
      <pre tabIndex={0} aria-label={label}>
        <code>
          {lines.map((line, i) => (
            <span className={`code-line${activeLines.includes(i + 1) ? ' is-active' : ''}`} key={i}>
              <span className="code-num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="code-text">{highlightLine(line, lang)}</span>
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
};

export default Code;
