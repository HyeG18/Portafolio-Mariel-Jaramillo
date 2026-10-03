import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const GEAR_ITEMS = [
  { key: 'gear.1', img: 'gear-mic.webp' },
  { key: 'gear.2', img: 'gear-phone.webp' },
  { key: 'gear.3', img: 'gear-tripod-big.webp' },
  { key: 'gear.4', img: 'gear-rgb-panel.webp' },
  { key: 'gear.5', img: 'gear-light-panel.webp' },
  { key: 'gear.6', img: 'gear-tripod-small.webp' },
] as const;

export default function Gear() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="equipo"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
        >
          {t('gear.title' as any)}
        </h2>
        <p className="mb-12" style={{ color: 'var(--color-magenta)' }}>
          {t('gear.subtitle' as any)}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {GEAR_ITEMS.map(({ key, img }) => (
            <figure key={key} className="text-center">
              <div
                className="rounded-2xl overflow-hidden mb-3 aspect-square"
                style={{ backgroundColor: 'var(--color-pink-light)' }}
              >
                <img
                  src={`/assets/images/${img}`}
                  alt={t(key as any)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <figcaption
                className="text-sm font-medium"
                style={{ color: 'var(--color-ink)' }}
              >
                {t(key as any)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
