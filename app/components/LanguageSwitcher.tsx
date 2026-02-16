"use client";

import * as React from "react";
import { useLanguageFromURL } from "../hooks/useLanguageFromURL";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/useTranslation";

// Configurazione lingue supportate
const LANGUAGES = {
  it: { name: "Italiano", flag: "🇮🇹", code: "IT" },
  en: { name: "English", flag: "🇬🇧", code: "EN" },
} as const;

interface ArticleVersion {
  language: string;
  slug: string;
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { updateURLLanguage, isReady } = useLanguageFromURL();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [articleVersions, setArticleVersions] = React.useState<ArticleVersion[]>([]);
  const [isArticlePage, setIsArticlePage] = React.useState(false);
  
  // Assicurati che il componente si renda solo sul client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Rileva se siamo su una pagina articolo e carica le versioni
  React.useEffect(() => {
    if (!mounted) return;

    const pathParts = pathname.split('/').filter(Boolean);
    const isNews = pathParts.includes('news');
    setIsArticlePage(isNews);

    if (isNews && pathParts.length >= 3) {
      const locale = pathParts[0];
      const slug = pathParts[pathParts.length - 1];

      // Fetch delle versioni dell'articolo
      fetch(`/api/article-versions?slug=${slug}&locale=${locale}`)
        .then(res => res.json())
        .then(data => {
          if (data.versions) {
            setArticleVersions(data.versions);
          }
        })
        .catch(err => console.error('Error fetching article versions:', err));
    } else {
      setArticleVersions([]);
    }
  }, [pathname, mounted]);

  // Non renderizzare durante SSR
  if (!mounted || !isReady) {
    return (
      <Button variant="outline" size="icon" className="relative min-w-[40px]">
        <span className="text-sm font-semibold">IT</span>
        <span className="sr-only">Loading language switcher...</span>
      </Button>
    );
  }

  const switchLanguage = (newLocale: string) => {
    // Se siamo su una pagina articolo, usa lo slug corretto per quella lingua
    if (isArticlePage && articleVersions.length > 0) {
      const targetVersion = articleVersions.find(v => v.language === newLocale);
      if (targetVersion) {
        window.location.href = `/${newLocale}/news/${targetVersion.slug}`;
        return;
      }
    }
    
    // Altrimenti comportamento normale
    updateURLLanguage(newLocale);
  };

  const currentLanguage = LANGUAGES[i18n.language as keyof typeof LANGUAGES] || LANGUAGES.it;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative min-w-[40px]">
          <span className="text-sm font-semibold">
            {currentLanguage.code}
          </span>
          <span className="sr-only">Cambia lingua / Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[200]">
        {Object.entries(LANGUAGES).map(([code, language]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => switchLanguage(code)}
            className={`flex items-center gap-2 ${
              i18n.language === code ? "bg-accent" : ""
            }`}>
            <span className="text-lg">{language.flag}</span>
            <span className="font-medium">{language.name}</span>
            {i18n.language === code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}