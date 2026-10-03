import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const BRAND_LOGOS = [
  'brand-1.webp',
  'brand-2.webp',
  'brand-3.webp',
  'brand-4.webp',
] as const;

export default function Brands() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="marcas"
      ref={ref}
      className="reveal py-16 px-4"
      style={{ backgroundColor: 'var(--color-pink-light)' }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('brands.title' as any) }}
        />

        <div className="flex flex-wrap gap-8 justify-center items-center mb-8">
          {BRAND_LOGOS.map((logo) => (
            <img
              key={logo}
              src={`/assets/images/${logo}`}
              alt="Brand logo"
              className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          ))}
        </div>

        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-magenta)' }}
        >
          {t('brands.cta' as any)}
        </p>
      </div>
    </section>
  );
}