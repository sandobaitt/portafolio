import { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { person, sections } from '../content';
import { useTheme } from '../hooks/useTheme';
import './TopBar.css';

const TopBar = ({ active, ground }) => {
  const [theme, toggleTheme] = useTheme();
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const nextTheme = theme === 'dark' ? 'claro' : 'oscuro';
  const where = sections.find((s) => s.id === active)?.label;

  return (
    <header className={`topbar ground-${ground}`} data-open={open || undefined}>
      <div className="topbar-inner">
        <a className="topbar-name" href="#inicio" onClick={() => setOpen(false)}>
          {person.name}
        </a>
        {where && (
          <span key={where} className="topbar-where" aria-hidden="true">
            {where}
          </span>
        )}

        <nav className="topbar-nav" aria-label="Secciones">
          <ul id="topbar-links">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="topbar-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Cambiar a tema ${nextTheme}`}
            title={`Tema ${nextTheme}`}
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
          </button>
          <button
            ref={menuButton}
            type="button"
            className="icon-btn topbar-menu"
            aria-expanded={open}
            aria-controls="topbar-links"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </div>
      <span className="topbar-depth" aria-hidden="true">
        <span className="topbar-depth-fill" />
      </span>
    </header>
  );
};

export default TopBar;
