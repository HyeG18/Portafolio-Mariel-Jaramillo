import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { assetUrl } from '../../utils/assetUrl';

const TOOLS = [
  { key: 'skills.tools.1' },
  { key: 'skills.tools.2' },
  { key: 'skills.tools.3' },
] as const;

const STRATEGIES = [
  { key: 'skills.strategy.1' },
  { key: 'skills.strategy.2' },
  { key: 'skills.strategy.3' },
  { key: 'skills.strategy.4' },
] as const;

export default function Skills() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="habilidades"
      ref={ref}
      className="reveal py-20 px-4"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-family-serif)', color: 'var(--color-ink)' }}
          dangerouslySetInnerHTML={{ __html: t('skills.title' as any) }}
        />
        <p className="mb-12" style={{ color: 'var(--color-magenta)' }}>
          {t('skills.subtitle' as any)}
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          <div
            className="relative rounded-3xl p-8 text-left overflow-hidden"
            style={{ backgroundColor: 'var(--magenta-dark)', boxShadow: 'var(--shadow-card)' }}
          >
            <img
              src={assetUrl('assets/images/camera-pink.webp')}
              alt=""
              className="absolute bottom-2 right-2 pointer-events-none"
              style={{ width: '110px', opacity: 0.95 }}
              aria-hidden="true"
            />
            <h3
              className="text-xl font-bold mb-6"
              style={{ color: 'var(--color-pink-soft)' }}
              dangerouslySetInnerHTML={{ __html: t('skills.tools.title' as any) }}
            />
            <ul className="space-y-4">
              {TOOLS.map(({ key }) => (
                <li key={key} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'var(--pink)' }}
                    aria-hidden="true"
                  />
                  <span className="font-medium" style={{ color: 'white' }}>
                    {t(key as any)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative rounded-3xl p-8 text-left overflow-hidden"
            style={{ backgroundColor: 'white', border: '2px solid var(--pink-soft)', boxShadow: 'var(--shadow-card)' }}
          >
            <img
              src={assetUrl('assets/images/tulips.webp')}
              alt=""
              className="absolute bottom-2 right-2 pointer-events-none"
              style={{ width: '110px', opacity: 0.95 }}
              aria-hidden="true"
            />
            <h3
              className="text-xl font-bold mb-6"
              style={{ color: 'var(--color-magenta-dark)' }}
              dangerouslySetInnerHTML={{ __html: t('skills.strategy.title' as any) }}
            />
            <ul className="space-y-4">
              {STRATEGIES.map(({ key }) => (
                <li key={key} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'var(--lime-dark)' }}
                    aria-hidden="true"
                  />
                  <span className="font-medium" style={{ color: 'var(--color-ink)' }}>
                    {t(key as any)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
