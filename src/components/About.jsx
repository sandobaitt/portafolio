import { about, person } from '../content';
import Decode from './Decode';
import './About.css';

const About = () => {
  const [lead, ...rest] = about.paragraphs;

  return (
    <section id="sobre-mi" className="section ground-paper" data-ground="paper" aria-labelledby="sobre-mi-title">
      <div className="wrap">
        <div className="about-grid">
          <img
            className="about-photo"
            src="/profile.webp"
            alt={person.name}
            width="640"
            height="853"
            loading="lazy"
            decoding="async"
          />

          <div className="about-body">
            <h2 id="sobre-mi-title" className="section-title">
              Sobre mí
            </h2>
            <p className="about-lead">{lead}</p>
            <p className="about-p">
              {about.security.map((part, i) =>
                typeof part === 'string' ? (
                  part
                ) : (
                  <a key={i} href={part.url} target="_blank" rel="noopener noreferrer" aria-label={part.text}>
                    <Decode text={part.text} />
                  </a>
                ),
              )}
            </p>
            {rest.map((p) => (
              <p key={p.slice(0, 24)} className="about-p">
                {p}
              </p>
            ))}

            <dl className="about-facts">
              {about.facts.map((f) => (
                <div key={f.term}>
                  <dt>{f.term}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="stack" role="group" aria-labelledby="stack-title">
          <h3 id="stack-title" className="stack-title">
            Herramientas
          </h3>
          <div className="stack-layers">
            {about.tools.map((layer) => (
              <div key={layer.id} className={`stack-layer stack-layer--${layer.id}`} data-scrub="">
                <p className="stack-name">{layer.name}</p>
                <ul className="stack-items" aria-label={layer.name}>
                  {layer.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
