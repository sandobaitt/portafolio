import ExternalLink from './ExternalLink';
import { hero, person } from '../content';
import Strata from './Strata';
import './Hero.css';

const Hero = () => {
  return (
    <section id="inicio" className="hero ground-paper" data-ground="paper">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="hero-name">
            <span className="hero-line">
              <span>Lautaro</span>
            </span>{' '}
            <span className="hero-line">
              <span>Sandoval</span>
            </span>
          </h1>
          <p className="hero-lead">{hero.lead}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={`mailto:${person.email}`}>
              Escribime
            </a>
            <ExternalLink href={person.github} brand="github">
              GitHub
            </ExternalLink>
            <ExternalLink href={person.linkedin} brand="linkedin">
              LinkedIn
            </ExternalLink>
          </div>
          <p className="hero-place">{person.location}</p>
        </div>

        <Strata />
      </div>
    </section>
  );
};

export default Hero;
