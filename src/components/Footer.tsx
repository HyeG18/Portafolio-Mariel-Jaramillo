import { useI18n } from '../hooks/useI18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer
      className="py-8 px-4 text-center"
      style={{ backgroundColor: 'var(--color-magenta-dark)', color: 'var(--color-pink-light)' }}
    >
      <p className="text-sm mb-4">{t('footer.text' as any)}</p>
      <a
        href="#inicio"
        className="text-xs font-semibold hover:underline transition-opacity"
        style={{ color: 'var(--color-lime)' }}
        aria-label={t('footer.top' as any)}
      >
        ↑ {t('footer.top' as any)}
      </a>
    </footer>
  );
}
