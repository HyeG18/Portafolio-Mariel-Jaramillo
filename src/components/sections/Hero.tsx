import { useI18n } from '../../hooks/useI18n';
import { assetUrl } from '../../utils/assetUrl';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 pt-20"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(254,228,236,0.7), rgba(254,228,236,0.4)), url('${assetUrl('assets/images/texture-pink.webp')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row md:items-center md:justify-center gap-10 md:gap-[10rem]">

        {/* Left: Photo + decorations */}
        <div className="flex flex-col items-center relative" style={{ width: 'min(320px, 35vw)' }}>
          {/* Starburst image (behind photo, now sized relative to an explicitly-widthed wrapper) */}
          <img
            src={assetUrl('assets/images/starburst-glitter.webp')}
            alt=""
            className="absolute pointer-events-none"
            aria-hidden="true"
            loading="eager"
            style={{
              width: '136%',
              top: '-18%',
              left: '-18%',
              animation: 'spin-slow 40s linear infinite',
              zIndex: 0,
            }}
          />

          {/* Circular spinning badge — small corner accent, NOT a halo around the whole photo */}
          <svg
            className="absolute pointer-events-none"
            viewBox="0 0 200 200"
            aria-hidden="true"
            style={{
              width: '42%',
              top: '-14%',
              right: '-16%',
              animation: 'spin-slow 18s linear infinite',
              zIndex: 3,
            }}
          >
            <defs>
              <path id="hc" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0" />
            </defs>
            <text fontSize="28" fontFamily="Poppins" fontWeight="700" fill="white" letterSpacing="0.12em">
              <textPath href="#hc" startOffset="0%">
                {t('hero.circular' as any)}
              </textPath>
            </text>
          </svg>

          {/* Photo — kept as rounded rectangle, NOT circular (explicit design decision) */}
          <div
            className="relative overflow-hidden w-full"
            style={{
              aspectRatio: '280 / 340',
              borderRadius: '1.25rem',
              border: '6px solid var(--color-pink)',
              boxShadow: '0 0 0 3px var(--color-paper), 0 8px 32px rgba(179,18,90,0.22)',
              zIndex: 2,
            }}
          >
            <img
              src={assetUrl('assets/images/portrait-hero.webp')}
              alt="Mariel Jaramillo"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* @soymarielitaaa handle below photo — appears ONLY here, not duplicated in the SVG */}
          <p
            className="mt-6 z-10"
            style={{
              fontFamily: 'var(--font-family-body)',
              fontWeight: 700,
              fontSize: '1.3rem',
              color: '#fff',
              textShadow: '0 2px 10px rgba(125,19,72,0.6)',
            }}
          >
            @soymarielitaaa
          </p>
        </div>

        {/* Right: Text content */}
        <div className="flex flex-col gap-6 text-center md:text-left md:max-w-md">
          {/* Kicker */}
          <span
            className="inline-block text-xs font-bold tracking-[0.35em] uppercase self-start"
            style={{ color: 'var(--color-magenta-dark)' }}
          >
            {t('hero.kicker' as any)}
          </span>

          {/* Title */}
          <h1
            className="hero-title-text text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-family-serif)', color: 'white', textShadow: '0 4px 24px rgba(125,19,72,0.35)' }}
            dangerouslySetInnerHTML={{ __html: t('hero.title' as any) }}
          />

          {/* Tagline lines */}
          <div className="space-y-2">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-magenta-dark)' }}>
              {t('hero.tagline1' as any)}
            </p>
            <p>
              <em
                className="not-italic inline-block px-2 py-0.5 font-bold text-xl md:text-2xl"
                style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-pink-light)' }}
              >
                {t('hero.tagline2' as any)}
              </em>
            </p>
            <p className="text-xl font-bold" style={{ color: 'var(--color-ink)' }}>
              {t('hero.tagline3' as any)}
            </p>
          </div>

          {/* Camera decorative image */}
          <img
            src={assetUrl('assets/images/camera-pink.webp')}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="w-[70px] self-center md:self-start"
            style={{ filter: 'drop-shadow(0 6px 12px rgba(61,10,36,0.3))' }}
          />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#contacto"
              className="px-6 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105 text-center"
              style={{ backgroundColor: 'var(--color-magenta-dark)' }}
            >
              {t('hero.cta' as any)}
            </a>
            <a
              href="#contenido"
              className="hero-cta-ghost px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105 text-center"
            >
              {t('hero.cta2' as any)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
