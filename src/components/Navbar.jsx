import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import PillNav from './PillNav';
import './Navbar.css';

const Navbar = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const links = [
    { label: 'Inicio', href: '#home' },
    { label: 'Sobre Mí', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Proyectos', href: '#projects' },
    { label: 'Contacto', href: '#contact' }
  ];

  return (
    <>
      <PillNav
        logo="LS."
        logoAlt="LS Logo"
        items={links}
        baseColor="var(--accent-color)"
        pillColor="var(--surface-color)"
        hoveredPillTextColor="var(--surface-color)"
        pillTextColor="var(--text-primary)"
      />
      <button 
        onClick={toggleTheme} 
        className="theme-toggle" 
        aria-label="Toggle Theme" 
        style={{ 
          position: 'fixed', 
          top: '1.2em', 
          right: '2em', 
          zIndex: 100, 
          background: 'var(--surface-color)', 
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)', 
          cursor: 'pointer' 
        }}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </>
  );
};

export default Navbar;
