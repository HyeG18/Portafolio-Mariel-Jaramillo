import { useState, useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

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

export default function ContentReels() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  const [activeNiche, setActiveNiche] = useState<Niche>('food');
  const [loadedReels, setLoadedReels] = useState<Set<string>>(new Set());

  const handleReelClick = (url: string) => {
    setLoadedReels((prev) => new Set([...prev, url]));
  };

  return (
    <section
      id="contenido"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('videos.title' as any) }}
        />

        <div className="flex flex-wrap gap-3 justify-center mb-8 mt-6">
          {(['food', 'beauty', 'lifestyle', 'pets'] as Niche[]).map((niche) => (
            <span
              key={niche}
              className="text-sm px-4 py-1 rounded-full cursor-pointer transition-colors"
              style={{
                backgroundColor: activeNiche === niche ? 'var(--color-magenta)' : 'var(--color-pink-soft)',
                color: activeNiche === niche ? 'white' : 'var(--color-magenta)',
              }}
              onClick={() => setActiveNiche(niche)}
            >
              {t(`videos.niche.${niche}` as any)}
            </span>
          ))}
        </div>

        <p
          className="text-center text-lg font-medium mb-6"
          style={{ color: 'var(--color-magenta)' }}
          dangerouslySetInnerHTML={{ __html: t(`videos.niche.${activeNiche}` as any) }}
        />

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {REELS[activeNiche].map(({ url, thumb, alt }) => (
            <div
              key={url}
              className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer"
              style={{ backgroundColor: 'var(--color-ink)' }}
              onClick={() => handleReelClick(url)}
              role="button"
              tabIndex={0}
              aria-label={t('videos.watch' as any)}
              onKeyDown={(e) => e.key === 'Enter' && handleReelClick(url)}
            >
              {loadedReels.has(url) ? (
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
                    src={`/assets/images/${thumb}`}
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
      </div>
    </section>
  );
}
