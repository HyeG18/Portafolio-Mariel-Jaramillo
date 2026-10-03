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

        <div className="flex flex-col gap-16 max-w-[1100px] mx-auto">
          {NICHE_ORDER.map((niche) => {
            const reels = REELS[niche];
            const isSingle = reels.length === 1;
            return (
              <article key={niche} className="niche text-center">
                <h3
                  className="niche-title text-xl md:text-2xl font-bold mb-6"
                  style={{ fontFamily: 'var(--font-family-serif)', color: 'white' }}
                  dangerouslySetInnerHTML={{ __html: t(`videos.niche.${niche}` as any) }}
                />
                <div className="grid grid-cols-2 gap-20 max-w-[600px] mx-auto">
                  {reels.map(({ url, thumb, alt }) => (
                    <div
                      key={url}
                      className={`reel relative aspect-[9/16] overflow-hidden cursor-pointer mx-auto ${isSingle ? 'col-span-2' : ''}`}
                      style={{
                        borderRadius: 'var(--radius-lg)',
                        border: '3px solid var(--color-pink)',
                        backgroundColor: 'var(--color-ink)',
                        maxWidth: isSingle ? '320px' : '280px',
                      }}
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
