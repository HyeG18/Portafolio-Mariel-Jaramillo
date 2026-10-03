import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { assetUrl } from '../../utils/assetUrl';

export default function AboutMe() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="sobre-mi"
      ref={ref}
      className="reveal py-24 px-4"
      style={{ backgroundColor: 'var(--color-lime)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid min-[860px]:grid-cols-[1fr_1.4fr] gap-12 items-center">
          {/* Phone-frame photo */}
          <div className="flex justify-center">
            <div
              className="relative w-72 h-[32rem] rounded-[3rem] overflow-hidden"
              style={{
                border: '6px solid var(--color-ink)',
                boxShadow: 'var(--shadow-card)',
              }}
              aria-hidden="true"
            >
              <img
                src={assetUrl('assets/images/portrait-about.webp')}
                alt="Mariel Jaramillo — Retrato"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span
                className="absolute text-xs font-bold uppercase tracking-wider text-center"
                style={{
                  bottom: '12%',
                  left: '5%',
                  right: '5%',
                  backgroundColor: 'var(--color-magenta-hot)',
                  color: '#fff',
                  padding: '0.35em 0.5em',
                  borderRadius: '0.4rem',
                }}
              >
                {t('about.badge' as any)}
              </span>
            </div>
          </div>

          {/* Text side */}
          <div>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-family-body)', color: 'var(--color-magenta-dark)' }}
              dangerouslySetInnerHTML={{
                __html: (t('about.title' as any) as string).replace(
                  'Soy Mariel',
                  '<span style="color:var(--color-magenta-hot)">Soy Mariel</span>'
                )
              }}
            />
            <p
              className="text-lg font-bold mb-4"
              style={{ color: 'var(--color-magenta-dark)' }}
            >
              {t('about.lead' as any)}
            </p>
            <p className="mb-3" style={{ fontFamily: 'var(--font-family-body)', color: 'var(--color-magenta-dark)' }} dangerouslySetInnerHTML={{ __html: t('about.p1' as any) }} />
            <p className="mb-3" style={{ fontFamily: 'var(--font-family-body)', color: 'var(--color-magenta-dark)' }} dangerouslySetInnerHTML={{ __html: t('about.p3' as any) }} />
          </div>
        </div>
      </div>
    </section>
  );
}
