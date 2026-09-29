import { useState } from 'react';
import { repulsor } from '../content';
import Code from './Code';
import ExternalLink from './ExternalLink';
import RepulsorBoard from './RepulsorBoard';
import './Repulsor.css';

// En rotar90, la rama del caseOf para cada dirección está en las líneas 5 a 8.
const CASE_LINE = 5;

const Repulsor = () => {
  const [rotatedDir, setRotatedDir] = useState(null);

  return (
    <section
      id="repulsor"
      className="section ground-steel layer"
      data-ground="steel"
      aria-labelledby="repulsor-title"
      style={{ '--layer-prev': 'var(--paper)', '--layer-bg': 'var(--steel)' }}
    >
      <span className="layer-fill" aria-hidden="true" />
      <div className="wrap repulsor-grid">
        <header className="section-head repulsor-head">
          <h2 id="repulsor-title" className="section-title">
            Repulsor
          </h2>
          <p className="section-sub">{repulsor.course}</p>
        </header>

        <div className="repulsor-text">
          {repulsor.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p>
            <ExternalLink href={repulsor.repo} brand="github">
              Código y cómo correrlo en Pharo
            </ExternalLink>
          </p>
        </div>

        <div className="repulsor-play">
          <h3 className="repulsor-play-title">Probalo acá</h3>
          <p className="repulsor-play-note">{repulsor.demoNote}</p>
          <RepulsorBoard onRotate={setRotatedDir} />
        </div>

        <div className="repulsor-code">
          <Code
            code={repulsor.code}
            lang="st"
            label="Método rotar90 de la clase Celda, en Smalltalk"
            activeLines={rotatedDir === null ? [] : [CASE_LINE + rotatedDir]}
          />
          <p className="code-caption">{repulsor.codeCaption}</p>
        </div>
      </div>
    </section>
  );
};

export default Repulsor;
