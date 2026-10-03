import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { assetUrl } from '../../utils/assetUrl';

const GEAR_ITEMS = [
  { key: 'gear.1', img: 'mics-tx-f11.webp' },
  { key: 'gear.2', img: 'phone-samsung-a25.webp' },
  { key: 'gear.3', img: 'tripod-large.webp' },
  { key: 'gear.4', img: 'panel-rgb.webp' },
  { key: 'gear.5', img: 'light-panel.webp' },
  { key: 'gear.6', img: 'tripod-small.webp' },
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
      style={{ backgroundColor: 'var(--cream)' }}
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
                  src={assetUrl('assets/images/' + img)}
                  alt={t(key as any)}
                  className="w-full h-full object-cover transition-transform duration-300"
                  loading="lazy"
                  style={{ transform: 'translateY(0) rotate(0deg)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) rotate(-1deg)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0) rotate(0deg)';
                  }}
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
