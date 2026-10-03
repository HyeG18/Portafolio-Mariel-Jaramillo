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
  const { t, lang, toggleLang } = useI18n();
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
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a
          href="#inicio"
          className="font-bold text-lg"
          style={{ color: 'var(--color-magenta)' }}
          aria-label="Mariel Jaramillo — Inicio"
        >
          Mariel Jaramillo
        </a>

        <ul
          id="navLinks"
          className="hidden md:flex gap-6 list-none m-0 p-0"
        >
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: 'var(--color-ink)' }}
                onClick={handleLinkClick}
              >
                {t(key as any)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            aria-label={`Cambiar a ${lang === 'es' ? 'inglés' : 'español'}`}
            className="text-sm font-semibold px-2 py-1 rounded transition-colors"
            style={{
              backgroundColor: 'var(--color-pink-light)',
              color: 'var(--color-magenta)',
            }}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>

          <button
            id="navBurger"
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span
              className="block w-6 h-0.5"
              style={{ backgroundColor: 'var(--color-ink)' }}
            />
            <span
              className="block w-6 h-0.5"
              style={{ backgroundColor: 'var(--color-ink)' }}
            />
            <span
              className="block w-6 h-0.5"
              style={{ backgroundColor: 'var(--color-ink)' }}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden" style={{ backgroundColor: 'var(--color-paper)' }}>
          <ul className="flex flex-col gap-4 p-6 list-none m-0">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  className="text-base font-medium"
                  style={{ color: 'var(--color-ink)' }}
                  onClick={handleLinkClick}
                >
                  {t(key as any)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
