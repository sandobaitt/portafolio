import { ArrowUpRight } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6';

const BRANDS = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
};

// Enlace que abre en otra pestaña. Si apunta a una red, lleva su logo
// a la izquierda, tenue, y se enciende al pasar el mouse.
const ExternalLink = ({ href, brand, children, className = '' }) => {
  const Brand = brand ? BRANDS[brand] : null;
  return (
    <a className={`link-out ${className}`} href={href} target="_blank" rel="noopener noreferrer">
      {Brand && <Brand className="link-brand" aria-hidden="true" />}
      {children}
      <ArrowUpRight className="link-arrow" size={16} aria-hidden="true" />
    </a>
  );
};

export default ExternalLink;
