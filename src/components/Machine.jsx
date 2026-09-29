import { assembler } from '../content';
import ExternalLink from './ExternalLink';
import OctalMachine from './OctalMachine';
import './Machine.css';

const Machine = () => {
  return (
    <section
      id="assembler"
      className="section ground-machine layer machine"
      data-ground="machine"
      aria-labelledby="assembler-title"
      style={{ '--layer-prev': 'var(--steel)', '--layer-bg': 'var(--machine)' }}
    >
      <span className="layer-fill" aria-hidden="true" />

      <div className="wrap machine-intro">
        <header className="section-head">
          <h2 id="assembler-title" className="section-title">
            Assembler 8086
          </h2>
          <p className="section-sub">{assembler.course}</p>
        </header>
        {assembler.paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="machine-p">
            {p}
          </p>
        ))}
      </div>

      <OctalMachine />

      <div id="assembler-fin" className="wrap machine-outro">
        <ExternalLink href={assembler.source} brand="github">
          Ver este final en GitHub
        </ExternalLink>
        <ExternalLink href={assembler.repo} brand="github">
          Repositorio completo
        </ExternalLink>
      </div>
    </section>
  );
};

export default Machine;
