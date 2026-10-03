import { useI18n } from '../../hooks/useI18n';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 pt-20"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Text side */}
        <div className="text-center md:text-left">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
            style={{ backgroundColor: 'var(--color-pink-light)', color: 'var(--color-magenta)' }}
          >
            {t('hero.kicker' as any)}
          </span>

          <h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-2"
            style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
            dangerouslySetInnerHTML={{ __html: t('hero.title' as any) }}
          />

          <p
            className="text-lg font-medium mb-6"
            style={{ color: 'var(--color-magenta)' }}
            dangerouslySetInnerHTML={{ __html: t('hero.subtitle' as any) }}
          />

          <div className="space-y-1 mb-8">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#contacto"
              className="px-6 py-3 rounded-full font-semibold text-white transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-magenta)' }}
            >
              {t('hero.cta' as any)}
            </a>
            <a
              href="#contenido"
              className="px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: 'var(--color-pink-light)',
                color: 'var(--color-magenta)',
              }}
            >
              {t('hero.cta2' as any)}
            </a>
          </div>
        </div>

        {/* Photo side */}
        <div className="flex justify-center relative">
          <div
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
            style={{
              border: '8px solid var(--color-pink)',
              boxShadow: '0 0 0 4px var(--color-paper), 0 0 0 12px var(--color-pink-soft)',
            }}
          >
            <img
              src="/assets/images/portrait-hero.webp"
              alt="Mariel Jaramillo"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Starburst SVG */}
          <div
            className="absolute pointer-events-none"
            style={{ animation: 'spin-slow 20s linear infinite' }}
            aria-hidden="true"
          >
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
              <path
                d="M200 0 L215 140 L350 100 L240 185 L400 200 L240 215 L350 300 L215 260 L200 400 L185 260 L50 300 L160 215 L0 200 L160 185 L50 100 L185 140 Z"
                fill="var(--color-pink-light)"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Circular text SVG */}
          <svg
            className="absolute w-96 h-96 pointer-events-none"
            viewBox="0 0 400 400"
            style={{ animation: 'spin-slow 20s linear infinite' }}
            aria-hidden="true"
          >
            <defs>
              <path id="circle-text-path" d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0" />
            </defs>
            <text fontSize="28" fontFamily="Poppins" fontWeight="800" fill="var(--color-magenta)">
              <textPath href="#circle-text-path" startOffset="0%">
                ¡DOY VIDA A TU MARCA! ¡DOY VIDA A TU MARCA! ¡DOY VIDA A TU MARCA! ¡DOY VIDA A TU MARCA!
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
