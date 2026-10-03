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
      className="metrics py-20 px-4 relative"
      style={{ backgroundColor: 'var(--color-magenta-dark)' }}
    >
      <img
        src={assetUrl('assets/images/hand-phone.webp')}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-32 hidden md:block"
        style={{ opacity: 0.7 }}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-2 text-white"
          style={{ fontFamily: 'var(--font-family-serif)' }}
          dangerouslySetInnerHTML={{ __html: t('metrics.title' as any) }}
        />
        <p
          className="text-center mb-12"
          style={{
            color: 'var(--color-pink-light)',
            border: '2px solid var(--color-pink-light)',
            borderRadius: '999px',
            display: 'inline-block',
            padding: '0.25rem 1rem',
            width: '100%',
          }}
        >
          {t('metrics.subtitle' as any)}
        </p>

        <div className="grid sm:grid-cols-2 gap-10">
          {PLATFORMS.map(({ titleKey, infoKey1, infoKey2, stats }) => (
            <div key={titleKey} className="space-y-4">
              <h3
                className="text-2xl font-bold text-white"
                dangerouslySetInnerHTML={{ __html: t(titleKey as any) }}
              />
              <p
                className="text-sm"
                style={{ color: 'var(--color-pink-light)' }}
                dangerouslySetInnerHTML={{ __html: t(infoKey1 as any) }}
              />
              <p
                className="text-sm"
                style={{ color: 'var(--color-pink-light)' }}
                dangerouslySetInnerHTML={{ __html: t(infoKey2 as any) }}
              />
              <div className="space-y-3">
                {stats.map(({ labelKey, pct }) => (
                  <div key={labelKey} className="metrics__bar">
                    <span className="text-sm font-semibold text-white block mb-1">
                      {t(labelKey as any)}
                    </span>
                    <div
                      className="h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <div
                        className="metrics__bar-fill"
                        data-pct={pct}
                        style={{
                          backgroundColor:
                            pct >= 50 ? 'var(--color-pink)' : 'var(--color-pink-soft)',
                        }}
                      />
                    </div>
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
