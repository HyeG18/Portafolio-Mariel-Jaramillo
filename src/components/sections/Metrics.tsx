import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useMetricsInView } from '../../hooks/useMetricsInView';

const METRICS = [
  {
    titleKey: 'metrics.ig.title',
    infoKey1: 'metrics.ig.cities',
    infoKey2: 'metrics.ig.ages',
    genderKey: 'metrics.women',
    pct: 58,
  },
  {
    titleKey: 'metrics.tt.title',
    infoKey1: 'metrics.tt.country',
    infoKey2: 'metrics.tt.ages',
    genderKey: 'metrics.men',
    pct: 45,
  },
] as const;

export default function Metrics() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useMetricsInView(ref);

  return (
    <section
      id="audiencia"
      ref={ref}
      className="metrics py-20 px-4"
      style={{ backgroundColor: 'var(--color-magenta-dark)' }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-2 text-white"
          style={{ fontFamily: 'var(--font-family-serif)' }}
          dangerouslySetInnerHTML={{ __html: t('metrics.title' as any) }}
        />
        <p
          className="text-center mb-12"
          style={{ color: 'var(--color-pink-light)' }}
        >
          {t('metrics.subtitle' as any)}
        </p>

        <div className="grid sm:grid-cols-2 gap-10">
          {METRICS.map(({ titleKey, infoKey1, infoKey2, genderKey, pct }) => (
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
              <p className="text-sm font-semibold text-white">
                {t(genderKey as any)}
              </p>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <div
                  className="h-full rounded-full metrics__bar-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: 'var(--color-pink)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}