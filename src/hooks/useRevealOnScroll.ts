import { useEffect, type RefObject } from 'react';

export function useRevealOnScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    el.classList.add('reveal');
    observer.observe(el);
    el.querySelectorAll('.reveal').forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [ref]);
}
