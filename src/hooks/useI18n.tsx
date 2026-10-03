import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { I18nDict, I18nKeys } from '../types/i18n';
import esDict from '../i18n/es.json';
import enDict from '../i18n/en.json';

const STORAGE_KEY = 'mariel-lang';

type I18nContextValue = {
  dict: I18nDict;
  lang: 'es' | 'en';
  t: (key: I18nKeys) => string;
  toggleLang: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const dictionaries = { es: esDict, en: enDict };

export function I18nProvider({ children }: { children: ReactNode }) {
  const savedLang = (localStorage.getItem(STORAGE_KEY) as 'es' | 'en') ?? 'es';
  const [lang, setLang] = useState<'es' | 'en'>(savedLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    const dict = dictionaries[lang];
    document.title = dict['meta.title'] as string;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', dict['meta.description'] as string);
    }
  }, [lang]);

  const t = (key: I18nKeys): string => {
    return dictionaries[lang][key] as string;
  };

  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <I18nContext.Provider value={{ dict: dictionaries[lang], lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}