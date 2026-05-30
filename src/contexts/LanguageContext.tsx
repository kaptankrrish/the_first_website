'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getTranslation, getInitialLanguage, type LanguageCode, type Translations } from '@/translations';

interface LanguageContextValue {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: getTranslation('en'),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      const initial = getInitialLanguage();
      setLangState(initial);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = initial;
      }
      setMounted(true);
    });
  }, []);

  const setLang = useCallback((code: LanguageCode) => {
    setLangState(code);
    localStorage.setItem('app-language', code);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
    }
  }, []);

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: 'en', setLang, t: getTranslation('en') }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: getTranslation(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
