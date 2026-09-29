import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { contact, person } from '../content';
import ExternalLink from './ExternalLink';
import './Contact.css';

const Contact = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
    } catch {
      // Sin permiso de portapapeles queda el enlace mailto.
    }
  };

  return (
    <section
      id="contacto"
      className="contact ground-machine layer"
      data-ground="machine"
      aria-labelledby="contacto-title"
      style={{ '--layer-prev': 'var(--paper)', '--layer-bg': 'var(--machine)' }}
    >
      <span className="layer-fill" aria-hidden="true" />
      <div className="wrap">
        <h2 id="contacto-title" className="contact-title">
          {contact.heading}
        </h2>
        <p className="contact-text">{contact.text}</p>

        <div className="contact-mail">
          <a className="contact-address" href={`mailto:${person.email}`}>
            {person.email.split('@')[0]}@<wbr />
            {person.email.split('@')[1]}
          </a>
          <button type="button" className="btn btn-quiet contact-copy" onClick={copy}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
          <span className="visually-hidden" role="status">
            {copied ? 'Dirección copiada' : ''}
          </span>
        </div>

        <ul className="contact-links">
          <li>
            <ExternalLink href={person.linkedin} brand="linkedin">
              LinkedIn
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={person.github} brand="github">
              GitHub
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={person.instagram} brand="instagram">
              Instagram
            </ExternalLink>
          </li>
        </ul>

        <footer className="colophon">
          <p>
            © {new Date().getFullYear()} {person.fullName}
          </p>
          <a href="#inicio">Volver arriba</a>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
