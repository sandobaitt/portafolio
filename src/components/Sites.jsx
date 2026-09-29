import ExternalLink from './ExternalLink';
import { sites } from '../content';
import './Sites.css';

const Sites = () => {
  return (
    <section id="sitios" className="section ground-paper" data-ground="paper" aria-labelledby="sitios-title">
      <div className="wrap">
        <header className="section-head">
          <h2 id="sitios-title" className="section-title">
            Sitios publicados
          </h2>
          <p className="section-sub">{sites.intro}</p>
        </header>

        <div className="sites">
          {sites.items.map((site, i) => (
            <article key={site.id} className={`site ${i % 2 ? 'site--flip' : ''}`} aria-labelledby={`${site.id}-name`}>
              <a
                className="site-shots"
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir el sitio de ${site.name}`}
              >
                <span className="site-desktop">
                  <img
                    data-scrub=".site-shots"
                    src={site.desktop}
                    alt={`El sitio de ${site.name} en computadora`}
                    width="1440"
                    height="3600"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="site-phone" data-scrub="">
                  <img
                    data-scrub=".site-shots"
                    src={site.mobile}
                    alt={`El sitio de ${site.name} en celular`}
                    width="390"
                    height="2600"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </a>

              <div className="site-copy">
                <h3 id={`${site.id}-name`} className="site-name">
                  {site.name}
                </h3>
                <p className="site-place">{site.place}</p>
                <p className="site-summary">{site.summary}</p>
                {site.detail && <p className="site-detail">{site.detail}</p>}
                <ul className="tags" aria-label="Tecnologías">
                  {site.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="site-links">
                  <ExternalLink href={site.url}>Ver el sitio</ExternalLink>
                  <ExternalLink href={site.repo} brand="github">
                    Código
                  </ExternalLink>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sites;
