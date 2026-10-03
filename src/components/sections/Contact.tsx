import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const CONTACT_LINKS = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/584249406129',
    icon: 'M17.472 14.763c-1.28-.635-2.704-1.01-4.22-1.01-3.756 0-6.82 3.064-6.82 6.82 0 .72.104 1.416.297 2.078l-.78 2.93 2.98-.78c.63.206 1.28.297 1.95.297 3.756 0 6.82-3.063 6.82-6.82 0-1.053-.24-2.054-.66-2.954M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.22l-2.26 8.39c-.135.503-.48.9-.925 1.065L9.47 15.26a10.39 10.39 0 01-2.74-1.74l-.71-.63a1.5 1.5 0 01.12-2.12l.76-.76a1.5 1.5 0 012.12.12l.63.71c.38.43.94.69 1.53.71l1.52.12 4.17-1.24c.49-.15.9-.48 1.09-.9l.97-3.58a1.5 1.5 0 00-1.42-1.88l-3.42.37z',
  },
  {
    label: 'Email',
    href: 'mailto:collabsmarielj26@gmail.com',
    icon: 'M0 3v18h24V3H0zm12 10.5l6.097-4.58L12 13.5zm-9.09 6.682V5.818l7.5 5.636L2.91 20.182zm9.09 0l7.5-5.636-7.5-5.636v14.364z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/soymarielitaaa',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@soymarielitaaa',
    icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
] as const;

export default function Contact() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="contacto"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-pink-light)' }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('contact.title' as any) }}
        />
        <p className="mb-12" style={{ color: 'var(--color-magenta)' }}>
          {t('contact.subtitle' as any)}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {CONTACT_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--color-paper)',
                boxShadow: 'var(--shadow-card)',
                color: 'var(--color-magenta)',
              }}
              aria-label={label}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 flex-shrink-0"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={icon} />
              </svg>
              <span className="text-sm font-medium">
                {label === 'WhatsApp' || label === 'Email' ? t(`contact.${label.toLowerCase()}` as any) : label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
