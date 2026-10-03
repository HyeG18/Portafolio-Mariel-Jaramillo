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
        <div className="flex flex-col items-center relative">
          {/* Starburst image behind photo */}
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
              animation: 'spin-slow 20s linear infinite',
            }}
          />

          {/* Circular text SVG */}
          <svg
            className="absolute pointer-events-none"
            viewBox="0 0 200 200"
            aria-hidden="true"
            style={{
              width: '110%',
              top: '-5%',
              left: '-5%',
              animation: 'spin-slow 20s linear infinite',
            }}
          >
            <defs>
              <path id="hc" d="M100,100 m-75,0 a75,75 0 1,1 150,0 a75,75 0 1,1 -150,0" />
            </defs>
            <text fontSize="14" fontFamily="Poppins" fontWeight="800" fill="white" letterSpacing="2">
              <textPath href="#hc" startOffset="0%">
                CONECTEMOS • CREEMOS JUNTOS • CONECTEMOS • CREEMOS JUNTOS • CONECTEMOS • CREEMOS JUNTOS • CONECTEMOS • CREEMOS JUNTOS •
              </textPath>
            </text>
            <text fontSize="13" fontFamily="Poppins" fontWeight="600" fill="white" letterSpacing="1">
              <textPath href="#hc" startOffset="50%">
                @soymarielitaaa @soymarielitaaa @soymarielitaaa @soymarielitaaa @soymarielitaaa @soymarielitaaa @soymarielitaaa @soymarielitaaa
              </textPath>
            </text>
          </svg>

          {/* Photo wrapper */}
          <div
            className="relative overflow-hidden"
            style={{
              width: '280px',
              height: '340px',
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

          {/* @soymarielitaaa handle below photo */}
          <p
            className="mt-3 text-sm font-semibold tracking-wide z-10"
            style={{ color: 'var(--color-magenta-dark)' }}
          >
            @soymarielitaaa
          </p>
        </div>

        {/* Right: Text content */}
        <div className="flex flex-col gap-6 text-center md:text-left md:max-w-md">
          {/* Kicker */}
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full self-start"
            style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-pink-light)' }}
          >
            {t('hero.kicker' as any)}
          </span>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-family-serif)', color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.15)' }}
            dangerouslySetInnerHTML={{ __html: t('hero.title' as any) }}
          />

          {/* Subtitle (tagline with marker bg) */}
          <p
            className="text-base font-medium inline-block px-2 py-0.5"
            style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-pink-light)' }}
            dangerouslySetInnerHTML={{ __html: t('hero.subtitle' as any) }}
          />

          {/* Tagline lines */}
          <div className="space-y-1">
            <p className="text-2xl font-bold" style={{ color: 'var(--color-magenta-dark)' }}>
              {t('hero.tagline1' as any)}
            </p>
            <p className="text-xl" style={{ color: 'var(--color-ink)' }}>
              {t('hero.tagline2' as any)}
            </p>
            <p className="text-xl italic" style={{ color: 'var(--color-pink)' }}>
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
          />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#contacto"
              className="px-6 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105 text-center"
              style={{ backgroundColor: 'var(--color-magenta)' }}
            >
              {t('hero.cta' as any)}
            </a>
            <a
              href="#contenido"
              className="px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105 text-center"
              style={{
                backgroundColor: 'var(--color-pink-light)',
                color: 'var(--color-magenta)',
              }}
            >
              {t('hero.cta2' as any)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
