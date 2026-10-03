import { useRef, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useMetricsInView } from '../../hooks/useMetricsInView';
import { assetUrl } from '../../utils/assetUrl';

const PLATFORMS = [
  {
    titleKey: 'metrics.ig.title',
    infoKey1: 'metrics.ig.cities',
    infoKey2: 'metrics.ig.ages',
    stats: [
      { labelKey: 'metrics.women', pct: 58 },
      { labelKey: 'metrics.men', pct: 42 },
    ],
  },
  {
    titleKey: 'metrics.tt.title',
    infoKey1: 'metrics.tt.country',
    infoKey2: 'metrics.tt.ages',
    stats: [
      { labelKey: 'metrics.women', pct: 66 },
      { labelKey: 'metrics.men', pct: 34 },
    ],
  },
] as const;

export default function Metrics() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useMetricsInView(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.querySelectorAll('.metrics__bar-fill').forEach((bar) => {
              const htmlBar = bar as HTMLElement;
              const pct = htmlBar.getAttribute('data-pct');
              if (pct) {
                htmlBar.style.setProperty('--pct', pct);
                htmlBar.classList.add('in-view');
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="audiencia"
      ref={ref}
      className="metrics py-20 px-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-pink-light)' }}
    >
      <img
        src={assetUrl('assets/images/hand-phone.webp')}
        alt=""
        aria-hidden="true"
        className="absolute hidden md:block"
        style={{
          width: 'clamp(150px, 22vw, 260px)',
          right: '-30px',
          bottom: '-20px',
          transform: 'rotate(-10deg)',
          opacity: 0.9,
        }}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-magenta-dark)' }}
          dangerouslySetInnerHTML={{ __html: t('metrics.title' as any) }}
        />
        <p
          className="text-center mb-12 mx-auto"
          style={{
            color: 'var(--color-magenta-dark)',
            border: '2px solid var(--color-magenta-dark)',
            borderRadius: '999px',
            display: 'table',
            padding: '0.35rem 1.4rem',
            fontWeight: 600,
          }}
        >
          {t('metrics.subtitle' as any)}
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          {PLATFORMS.map(({ titleKey, infoKey1, infoKey2, stats }) => (
            <div
              key={titleKey}
              className="flex flex-col"
              style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3
                className="metrics-card-title text-2xl font-bold mb-2"
                style={{ color: 'var(--color-magenta-dark)' }}
                dangerouslySetInnerHTML={{ __html: t(titleKey as any) }}
              />
              <p
                className="text-sm mb-1"
                style={{ color: 'var(--color-ink)' }}
                dangerouslySetInnerHTML={{ __html: t(infoKey1 as any) }}
              />
              <p
                className="text-sm mb-4"
                style={{ color: 'var(--color-ink)' }}
                dangerouslySetInnerHTML={{ __html: t(infoKey2 as any) }}
              />

              <div className="flex flex-col gap-3 mt-auto pt-4">
                {stats.map(({ labelKey, pct }) => (
                  <div key={labelKey} className="grid grid-cols-[4.5rem_1fr_3.2rem] items-center gap-3 text-sm">
                    <span className="font-bold" style={{ color: 'var(--color-magenta-dark)' }}>
                      {t(labelKey as any)}
                    </span>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--color-pink-soft)' }}
                    >
                      <div
                        className="metrics__bar-fill"
                        data-pct={pct}
                        style={{
                          backgroundColor: pct >= 50 ? 'var(--color-lime)' : 'var(--color-pink)',
                        }}
                      />
                    </div>
                    <span className="font-extrabold text-right" style={{ color: 'var(--color-magenta-dark)' }}>
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
