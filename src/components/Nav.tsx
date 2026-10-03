import { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useScrolled } from '../hooks/useScrolled';

const NAV_LINKS = [
  { key: 'nav.home', href: '#inicio' },
  { key: 'nav.about', href: '#sobre-mi' },
  { key: 'nav.skills', href: '#habilidades' },
  { key: 'nav.videos', href: '#contenido' },
  { key: 'nav.gear', href: '#equipo' },
  { key: 'nav.metrics', href: '#audiencia' },
  { key: 'nav.packages', href: '#paquetes' },
  { key: 'nav.contact', href: '#contacto' },
] as const;

export default function Nav() {
  const { t, lang, setLang } = useI18n();
  const scrolled = useScrolled(10);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header
      id="nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
      style={{ backgroundColor: 'rgba(254,239,244,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <nav className="w-full flex items-center justify-between" style={{ padding: '0.9rem 1.5rem' }}>
        <a
          href="#inicio"
          className="font-bold text-xl"
          style={{ color: 'var(--color-magenta-dark)' }}
          aria-label="Mariel Jaramillo — Inicio"
        >
          UGC <em style={{ color: 'var(--color-magenta-hot)', fontStyle: 'normal' }}>Mariel</em>
        </a>

        <ul
          id="navLinks"
          className="hidden lg:flex gap-6 list-none m-0 p-0"
        >
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                className="text-base font-semibold hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-ink)' }}
                onClick={handleLinkClick}
              >
                {t(key as any)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div
            className="nav__lang flex items-center gap-1"
            style={{
              border: '2px solid var(--color-magenta-dark)',
              borderRadius: '999px',
              padding: '0.3rem 0.7rem',
            }}
          >
            <button
              onClick={() => setLang('es')}
              aria-label="Cambiar a español"
              style={{
                opacity: lang === 'es' ? 1 : 0.45,
                color: 'var(--color-magenta-dark)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              ES
            </button>
            <span style={{ color: 'var(--color-magenta-dark)', opacity: 0.6, fontSize: '0.8rem' }}>|</span>
            <button
              onClick={() => setLang('en')}
              aria-label="Change to English"
              style={{
                opacity: lang === 'en' ? 1 : 0.45,
                color: 'var(--color-magenta-dark)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              EN
            </button>
          </div>

          <button
            id="navBurger"
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span
              className="block w-6 h-0.5 transition-transform duration-300"
              style={{
                backgroundColor: 'var(--color-magenta-dark)',
                transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block w-6 h-0.5 transition-opacity duration-300"
              style={{
                backgroundColor: 'var(--color-magenta-dark)',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-0.5 transition-transform duration-300"
              style={{
                backgroundColor: 'var(--color-magenta-dark)',
                transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      <div
        className="lg:hidden overflow-hidden transition-all duration-300 ease-out"
        style={{
          backgroundColor: 'rgba(254,239,244,0.95)',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-120%)',
          opacity: menuOpen ? 1 : 0,
          maxHeight: menuOpen ? '500px' : '0',
        }}
      >
        <ul className="flex flex-col gap-4 p-6 list-none m-0">
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                className="text-base font-semibold"
                style={{ color: 'var(--color-ink)' }}
                onClick={handleLinkClick}
              >
                {t(key as any)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
