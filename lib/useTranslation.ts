'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    function syncLangWithUrl() {
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const segments = pathname.split('/').filter(Boolean);
        const localeFromPath = segments[0];
        if (localeFromPath === 'it' || localeFromPath === 'en') {
          setCurrentLang(localeFromPath);
        }
      }
    }
    syncLangWithUrl();
    window.addEventListener('popstate', syncLangWithUrl);
    const origPushState = window.history.pushState;
    const origReplaceState = window.history.replaceState;
    window.history.pushState = function(...args) {
      origPushState.apply(this, args);
      syncLangWithUrl();
    };
    window.history.replaceState = function(...args) {
      origReplaceState.apply(this, args);
      syncLangWithUrl();
    };
    return () => {
      window.removeEventListener('popstate', syncLangWithUrl);
      window.history.pushState = origPushState;
      window.history.replaceState = origReplaceState;
    };
  }, []);

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