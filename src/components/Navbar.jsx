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
    { label: 'Proyectos', href: '#projects' }
  ];

  const themeToggleButton = (className) => (
    <button 
      onClick={toggleTheme} 
      className={`theme-toggle ${className}`} 
      aria-label="Toggle Theme" 
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

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
        extraActions={themeToggleButton('mobile-toggle-btn')}
      />
      {themeToggleButton('desktop-only')}
    </>
  );
};

export default Navbar;
