import en from './en';
import hi from './hi';
import es from './es';
import type { Translations } from './en';

export type LanguageCode = 'en' | 'hi' | 'es';

const translations: Record<LanguageCode, Translations> = { en, hi, es };

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: 'English',
  hi: 'हिन्दी',
  es: 'Español',
};

export function getTranslation(lang: LanguageCode): Translations {
  return translations[lang] || en;
}

export function getInitialLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('app-language') as LanguageCode | null;
  if (stored && stored in translations) return stored;
  const browserLang = navigator.language?.split('-')[0];
  if (browserLang && browserLang in translations) return browserLang as LanguageCode;
  return 'en';
}

export type { Translations };
export { translations };
