'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Import delle traduzioni
import itTranslations from '@/public/locales/it/common.json';
import enTranslations from '@/public/locales/en/common.json';

type Translation = typeof itTranslations;
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends string
        ? K
        : T[K] extends object
        ? `${K & string}.${NestedKeyOf<T[K]> & string}`
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<Translation>;

const translations = {
  it: itTranslations,
  en: enTranslations,
};



export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<'it' | 'en'>('it');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    function syncLangWithUrl() {
      const segments = pathname.split('/').filter(Boolean);
      const localeFromPath = segments[0];
      if (localeFromPath === 'it' || localeFromPath === 'en') {
        setCurrentLang(localeFromPath);
      }
    }
    syncLangWithUrl();
    // Event listeners rimossi: ora la lingua si aggiorna solo su cambio pathname
  }, [pathname]);

  const t = (key: string) => {
    const translation = translations[currentLang][key as keyof typeof translations[typeof currentLang]];
    return translation || key;
  };

  const changeLanguage = (lang: 'it' | 'en') => {
    setCurrentLang(lang);
    // Non serve più localStorage, la lingua dipende solo dall'URL
  };

  return {
    t,
    i18n: {
      language: currentLang,
      changeLanguage,
    }
  };
}