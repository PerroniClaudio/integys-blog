'use client';

import { useTranslation } from '@/lib/useTranslation';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useLanguageFromURL() {
  const pathname = usePathname() || '';
  const router = useRouter();
  const { i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Estrae il locale dal pathname (es: /it/articolo -> it)
    const segments = pathname.split('/').filter(Boolean);
    const localeFromPath = segments[0];
    
    // Determina la lingua target basata sul path
    const targetLang = ['it', 'en'].includes(localeFromPath) ? localeFromPath : 'it';
    const currentLang = i18n.language;

    // Cambia lingua solo se è diversa da quella corrente
    if (targetLang !== currentLang) {
      i18n.changeLanguage(targetLang as 'it' | 'en');
    }

    setIsReady(true);
  }, [pathname, i18n]);

  const updateURLLanguage = (newLang: string) => {
    const segments = pathname.split('/').filter(Boolean);
    
    // Se il primo segmento è un locale, sostituiscilo
    if (segments[0] === 'it' || segments[0] === 'en') {
      segments[0] = newLang;
    } else {
      // Altrimenti aggiungilo all'inizio
      segments.unshift(newLang);
    }
    
    const newPath = '/' + segments.join('/');
    
    // Usa window.location per forzare un reload completo e evitare stati misti
    window.location.href = newPath;
  };

  return {
    currentLanguage: i18n.language,
    isReady,
    updateURLLanguage,
  };
}