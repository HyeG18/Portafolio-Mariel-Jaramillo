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
      className="reveal brands py-24 px-4"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-20"
          style={{ fontFamily: 'var(--font-family-body)', color: 'var(--color-magenta-dark)' }}
          dangerouslySetInnerHTML={{ __html: t('brands.title' as any) }}
        />

        <div className="flex flex-wrap gap-12 justify-center items-center mb-20">
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
          className="text-3xl font-bold"
          style={{ color: 'var(--color-magenta-hot)' }}
        >
          {t('brands.cta' as any)}
        </p>
      </div>
    </section>
  );
}
