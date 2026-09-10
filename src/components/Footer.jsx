import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-secondary)',
      marginTop: '4rem',
      fontSize: '0.9rem'
    }}>
      <p>© {new Date().getFullYear()} Lautaro Emanuel Sandoval. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
