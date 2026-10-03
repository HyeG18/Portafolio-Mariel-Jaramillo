import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const TOOLS = [
  { key: 'skills.tools.1', icon: '✂️' },
  { key: 'skills.tools.2', icon: '🎬' },
  { key: 'skills.tools.3', icon: '📱' },
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
            className="rounded-3xl p-8 text-left"
            style={{ backgroundColor: 'var(--color-paper)', boxShadow: 'var(--shadow-card)' }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{ color: 'var(--color-magenta)' }}
              dangerouslySetInnerHTML={{ __html: t('skills.tools.title' as any) }}
            />
            <ul className="space-y-4">
              {TOOLS.map(({ key, icon }) => (
                <li key={key} className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{icon}</span>
                  <span className="font-medium" style={{ color: 'var(--color-ink)' }}>
                    {t(key as any)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-3xl p-8 text-left"
            style={{ backgroundColor: 'var(--color-magenta-dark)', boxShadow: 'var(--shadow-card)' }}
          >
            <h3
              className="text-xl font-bold mb-6 text-white"
              dangerouslySetInnerHTML={{ __html: t('skills.strategy.title' as any) }}
            />
            <ul className="space-y-4">
              {STRATEGIES.map(({ key }) => (
                <li key={key} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-pink)' }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-white">
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
