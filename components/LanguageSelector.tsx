'use client';

import { useTranslation } from '@/lib/useTranslation';
import { useRouter, usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useEffect } from 'react';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  
  // Sincronizza lo stato i18n con il locale del path
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const localeFromPath = segments[0];
    
    if (['it', 'en'].includes(localeFromPath) && localeFromPath !== i18n.language) {
      i18n.changeLanguage(localeFromPath as 'it' | 'en');
    }
  }, [pathname, i18n]);
  
  const locale = i18n.language;

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    
    // Sostituisci il locale nel path
    if (segments[0] === 'it' || segments[0] === 'en') {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    
    const newPath = '/' + segments.join('/');
    
    // Usa window.location per forzare un reload completo e evitare stati misti
    window.location.href = newPath;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {locale === 'it' ? t('language.italian') : t('language.english')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('it')}
          className={locale === 'it' ? 'bg-accent' : ''}
        >
          🇮🇹 {t('language.italian')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          🇬🇧 {t('language.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;