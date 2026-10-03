import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';

const PACKAGES = [
  {
    nameKey: 'packages.1.name',
    features: ['packages.1.f1', 'packages.1.f2', 'packages.1.f3', 'packages.1.f4'] as const,
    priceKey: 'packages.1.price',
    noteKey: 'packages.1.note',
    popular: false,
  },
  {
    nameKey: 'packages.2.name',
    features: ['packages.2.f1', 'packages.2.f2', 'packages.2.f3', 'packages.2.f4', 'packages.2.f5'] as const,
    priceKey: 'packages.2.price',
    noteKey: 'packages.2.note',
    popular: true,
  },
  {
    nameKey: 'packages.3.name',
    features: ['packages.3.f1', 'packages.3.f2', 'packages.3.f3', 'packages.3.f4', 'packages.3.f5', 'packages.3.f6'] as const,
    priceKey: 'packages.3.price',
    noteKey: 'packages.3.note',
    popular: false,
  },
] as const;

export default function Packages() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="paquetes"
      ref={ref}
      className="packages reveal py-20 px-4"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-family-body)', color: 'var(--color-magenta-dark)' }}
          dangerouslySetInnerHTML={{
            __html: 'Mis paquetes de <em style="color:var(--color-magenta-hot);font-style:normal;font-weight:inherit">contenido</em>'
          }}
        />
        <p className="mb-12 text-xl font-bold" style={{ fontFamily: 'var(--font-family-body)', color: 'var(--color-magenta-hot)' }}>
          {t('packages.subtitle' as any)}
        </p>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map(({ nameKey, features, priceKey, noteKey, popular }) => (
            <div
              key={nameKey}
              className="package-card relative rounded-3xl p-6 text-left transition-transform duration-300 hover:-translate-y-1.5 flex flex-col h-full"
              data-popular={popular}
              style={{
                border: `3px solid ${popular ? 'var(--color-magenta-dark)' : 'var(--color-pink)'}`,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {popular && (
                <span
                  className="package__badge text-xs font-bold tracking-wider uppercase px-4 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-lime)' }}
                >
                  {t('packages.popular' as any)}
                </span>
              )}

              <h3
                className="text-lg font-bold mb-4"
                style={{ color: 'var(--color-ink)' }}
                dangerouslySetInnerHTML={{ __html: t(nameKey as any) }}
              />

              <ul className="space-y-2 mb-6 flex-1">
                {features.map((fKey) => (
                  <li key={fKey} className="flex items-start gap-2 text-sm">
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-magenta)' }}
                      aria-hidden="true"
                    />
                    <span style={{ color: 'var(--color-ink)' }}>
                      {t(fKey as any)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-magenta)' }}>
                  {t(noteKey as any)}
                </p>
                <p
                  className="text-2xl font-bold mb-4"
                  style={{ color: 'var(--color-magenta-dark)' }}
                >
                  {t(priceKey as any)}
                </p>
                <a
                  href="https://wa.me/584249406129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center px-4 py-2 rounded-full font-semibold transition-transform hover:scale-105"
                  style={{
                    backgroundColor: popular ? 'var(--color-magenta)' : 'var(--color-magenta-dark)',
                    color: 'white',
                  }}
                >
                  {t('packages.cta' as any)}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
