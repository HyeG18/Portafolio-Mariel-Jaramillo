import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { assetUrl } from '../../utils/assetUrl';

const REELS = {
  food: [
    { url: 'https://www.instagram.com/reel/DXad8f1R9Oo/', thumb: 'video-food-1.webp', alt: 'Reel comida 1' },
    { url: 'https://www.instagram.com/reel/DW1qZ3-xHcF/', thumb: 'video-food-2.webp', alt: 'Reel comida 2' },
  ],
  beauty: [
    { url: 'https://www.instagram.com/reel/DW48lRYsPfZ/', thumb: 'video-beauty-1.webp', alt: 'Reel belleza 1' },
    { url: 'https://www.instagram.com/reel/DWcrYoPkbk_/', thumb: 'video-beauty-2.webp', alt: 'Reel belleza 2' },
  ],
  lifestyle: [
    { url: 'https://www.instagram.com/reel/DWRdzafkTjU/', thumb: 'video-lifestyle-1.webp', alt: 'Reel lifestyle 1' },
    { url: 'https://www.instagram.com/reel/DV_wYhlESgA/', thumb: 'video-lifestyle-2.webp', alt: 'Reel lifestyle 2' },
  ],
  pets: [
    { url: 'https://www.instagram.com/reel/DWKImhwETFN/', thumb: 'video-pets-1.webp', alt: 'Reel mascotas' },
  ],
} as const;

type Niche = keyof typeof REELS;

const NICHE_ORDER: Niche[] = ['food', 'beauty', 'lifestyle', 'pets'];

const FORMATS = ['reviews', 'tutorials', 'vlogs', 'problema'] as const;

export default function ContentReels() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);
  const [activeNiche, setActiveNiche] = useState<Niche>('food');

  useEffect(() => {
    const instgrm = (window as unknown as { instgrm?: { Embeds: { process: () => void } } }).instgrm;
    if (instgrm) {
      instgrm.Embeds.process();
    }
  }, [activeNiche]);

  return (
    <section
      id="contenido"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-magenta-dark)' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="videos-title text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ fontFamily: 'var(--font-family-body)', color: 'var(--color-pink-light)' }}
          dangerouslySetInnerHTML={{
            __html: 'Mis formas de <em>contenido</em>'
          }}
        />

        <div className="flex justify-center gap-4 flex-wrap mb-12">
          {FORMATS.map((format) => (
            <span
              key={format}
              className="font-bold text-sm"
              style={{
                backgroundColor: 'var(--color-pink)',
                color: 'var(--color-magenta-dark)',
                padding: '0.5rem 1.4rem',
                borderRadius: '999px',
              }}
            >
              {t(`videos.formats.${format}` as any)}
            </span>
          ))}
        </div>

        <div className="flex justify-center gap-3 flex-wrap mb-12">
          {NICHE_ORDER.map((niche) => (
            <button
              key={niche}
              onClick={() => setActiveNiche(niche)}
              className="font-bold text-sm transition-all duration-200"
              style={{
                backgroundColor: activeNiche === niche ? 'var(--color-pink-light)' : 'transparent',
                color: activeNiche === niche ? 'var(--color-magenta-dark)' : 'var(--color-pink-light)',
                border: `2px solid ${activeNiche === niche ? 'var(--color-pink-light)' : 'var(--color-pink)'}`,
                padding: '0.5rem 1.4rem',
                borderRadius: '999px',
                cursor: 'pointer',
              }}
            >
              {t(`videos.niche.${niche}` as any).replace(/&amp;/g, '&').replace(/<[^>]*>/g, '')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 max-w-[600px] mx-auto">
          {REELS[activeNiche].map(({ url, thumb, alt }) => (
            <div
              key={url}
              className="relative overflow-hidden cursor-pointer group"
              style={{
                borderRadius: '1rem',
                border: '3px solid var(--color-pink)',
                aspectRatio: '9/16',
              }}
              onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && window.open(url, '_blank', 'noopener,noreferrer')}
              aria-label={t('videos.watch' as any)}
            >
              <img
                src={assetUrl(`assets/images/${thumb}`)}
                alt={alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#c13584" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5,3 19,12 5,21" fill="#c13584" stroke="none" />
                  </svg>
                </div>
                <span className="text-white text-xs font-semibold text-center px-2">
                  {t('videos.watch' as any)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
