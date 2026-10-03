import { useState, useRef } from 'react';
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

  const [loadedReels, setLoadedReels] = useState<Record<Niche, Set<string>>>({
    food: new Set(),
    beauty: new Set(),
    lifestyle: new Set(),
    pets: new Set(),
  });

  const handleReelClick = (niche: Niche, url: string) => {
    setLoadedReels((prev) => ({
      ...prev,
      [niche]: new Set([...prev[niche], url]),
    }));
  };

  return (
    <section
      id="contenido"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-magenta-dark)' }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-pink-light)' }}
          dangerouslySetInnerHTML={{ __html: t('videos.title' as any) }}
        />

        <div className="flex justify-center gap-6 flex-wrap mb-12" style={{ color: 'var(--color-pink-light)' }}>
          {FORMATS.map((format) => (
            <span key={format}>{t(`videos.formats.${format}` as any)}</span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {NICHE_ORDER.map((niche) => {
            const isPets = niche === 'pets';
            return (
              <article
                key={niche}
                className={`niche ${isPets ? 'col-span-2' : ''}`}
              >
                <h3
                  className="text-xl md:text-2xl font-bold mb-6 text-center"
                  style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-pink-light)' }}
                  dangerouslySetInnerHTML={{ __html: t(`videos.niche.${niche}` as any) }}
                />
                <div className="grid grid-cols-2 gap-4">
                  {REELS[niche].map(({ url, thumb, alt }) => (
                    <div
                      key={url}
                      className="reel relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer"
                      style={{ backgroundColor: 'var(--color-ink)' }}
                      onClick={() => handleReelClick(niche, url)}
                      role="button"
                      tabIndex={0}
                      aria-label={t('videos.watch' as any)}
                      onKeyDown={(e) => e.key === 'Enter' && handleReelClick(niche, url)}
                    >
                      {loadedReels[niche].has(url) ? (
                        <iframe
                          src={`${url}embed/captioned/`}
                          className="absolute inset-0 w-full h-full"
                          allow="encrypted-media; clipboard-write"
                          allowFullScreen
                          loading="lazy"
                          title={alt}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                          <img
                            src={assetUrl(`assets/images/${thumb}`)}
                            alt={alt}
                            className="w-16 h-16 rounded-full object-cover"
                            loading="lazy"
                          />
                          <span className="text-white text-sm font-medium text-center px-4">
                            {t('videos.watch' as any)}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
