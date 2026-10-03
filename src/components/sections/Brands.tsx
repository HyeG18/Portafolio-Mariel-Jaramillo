import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { assetUrl } from '../../utils/assetUrl';

const BRAND_LOGOS = [
  { file: 'brand-chicago.webp', alt: 'Restaurante Chicago' },
  { file: 'brand-brocks.webp', alt: 'Brocks' },
  { file: 'brand-gummylove.webp', alt: 'Gummy Love' },
  { file: 'brand-kittypom.webp', alt: 'Kitty Pom' },
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
          {BRAND_LOGOS.map(({ file, alt }) => (
            <img
              key={file}
              src={assetUrl('assets/images/' + file)}
              alt={alt}
              className="w-auto object-contain transition-all duration-300 hover:scale-110 hover:-rotate-3"
              style={{
                width: 'clamp(100px, 18vw, 160px)',
                filter: 'drop-shadow(0 6px 14px rgba(61,10,36,0.15))',
              }}
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
