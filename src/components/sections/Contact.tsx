import { useRef } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { assetUrl } from '../../utils/assetUrl';

const WHATSAPP_PATH = 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5c-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3z';
const EMAIL_PATH = 'M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm10 8.6L4.2 6h15.6L12 12.6zM4 8.3V18h16V8.3l-8 6.4-8-6.4z';
const INSTAGRAM_PATH = 'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-9.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z';
const TIKTOK_PATH = 'M16.6 2h3.1a6.4 6.4 0 0 0 .4 2.3 5.9 5.9 0 0 0 2.5 2.9c.8.5 1.1.6 1.4.7v3.2a9.5 9.5 0 0 1-4.3-1.4c-.3-.2-.5-.4-.8-.6v6.4a6.7 6.7 0 1 1-6.7-6.7c.3 0 .7 0 1 .1v3.3a3.4 3.4 0 1 0 2.4 3.3V2h1z';

export default function Contact() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  useRevealOnScroll(ref);

  return (
    <section
      id="contacto"
      ref={ref}
      className="reveal py-20 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(232,115,168,0.7), rgba(232,115,168,0.7)), url('${assetUrl('assets/images/texture-pink.webp')}')`,
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 min-[860px]:grid-cols-[1fr_1.4fr] gap-12 items-center">
          <div className="contact__photo reveal flex justify-center">
            <img
              src={assetUrl('assets/images/mariel-contact.webp')}
              alt="Mariel Jaramillo con micrófono"
              className="rounded-2xl"
              style={{
                maxWidth: '400px',
                width: '100%',
                filter: 'drop-shadow(0 12px 24px rgba(61,10,36,0.35))',
              }}
            />
          </div>
          <div className="contact__info reveal">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-family-body)', color: '#fff', lineHeight: 1.3 }}
              dangerouslySetInnerHTML={{
                __html: (t('contact.title' as any) as string).replace(
                  '<span>',
                  '<span style="background-color:var(--color-lime);color:var(--color-magenta-dark);padding:0em 0.15em;">'
                )
              }}
            />
            <p className="contact__subtitle mb-8 font-bold" style={{ color: 'var(--color-magenta-dark)', fontSize: '1.6rem' }}>
              {t('contact.subtitle' as any)}
            </p>
            <div
              className="contact__card flex flex-col"
              style={{
                transform: 'rotate(-1deg)',
                backgroundColor: 'var(--color-paper)',
                boxShadow: 'var(--shadow-card)',
                borderRadius: '1rem',
                padding: '1.5rem',
                gap: '0.6rem',
              }}
            >
              <a
                href="https://wa.me/584249406129"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item flex items-center gap-3 text-sm font-semibold"
                style={{ color: 'var(--color-magenta-dark)', padding: '0.55rem 0.7rem', borderRadius: '0.7rem' }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="currentColor" aria-hidden="true">
                  <path d={WHATSAPP_PATH} />
                </svg>
                <span>{t('contact.phone' as any)}</span>
              </a>
              <a
                href="mailto:collabsmarielj26@gmail.com"
                className="contact-item flex items-center gap-3 text-sm font-semibold"
                style={{ color: 'var(--color-magenta-dark)', padding: '0.55rem 0.7rem', borderRadius: '0.7rem' }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="currentColor" aria-hidden="true">
                  <path d={EMAIL_PATH} />
                </svg>
                <span>{t('contact.email' as any)}</span>
              </a>
              <a
                href="https://www.instagram.com/soymarielitaaa"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item flex items-center gap-3 text-sm font-semibold"
                style={{ color: 'var(--color-magenta-dark)', padding: '0.55rem 0.7rem', borderRadius: '0.7rem' }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="currentColor" aria-hidden="true">
                  <path d={INSTAGRAM_PATH} />
                </svg>
                <span>@soymarielitaaa</span>
              </a>
              <a
                href="https://www.tiktok.com/@soymarielitaaa"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item flex items-center gap-3 text-sm font-semibold"
                style={{ color: 'var(--color-magenta-dark)', padding: '0.55rem 0.7rem', borderRadius: '0.7rem' }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 flex-shrink-0" fill="currentColor" aria-hidden="true">
                  <path d={TIKTOK_PATH} />
                </svg>
                <span>@soymarielitaaa</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
