'use client';

import { useEffect, useState } from 'react';
import CategorySelector from './CategorySelector';
import NewsletterButton from '@/components/ui/newsletter-button';
import { useTranslation } from '@/lib/useTranslation';

interface HomeContentProps {
  categories: Array<{
    name: string;
    slug: string;
  }>;
}

export default function HomeContent({ categories }: HomeContentProps) {
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Assicurati che i18n sia inizializzato
    setIsReady(true);
  }, [i18n]);


  if (!isReady) {
    return (
      <section className="col-span-8">
        <hr className="border border-secondary" />
        <div className="flex flex-col items-center justify-between gap-4 my-2 xl:flex-row">
          <div className="flex gap-4">
            <NewsletterButton />
          </div>
          <div className="flex items-center justify-end gap-4">
            <h2 className="text-lg font-bold md:whitespace-nowrap">
              {t('home.browseArticles')}
            </h2>
            <CategorySelector categories={categories} selected={""} />
          </div>
        </div>
        <hr className="border border-secondary" />
      </section>
    );
  }

  return (
    <section className="col-span-8">
      <hr className="border border-secondary" />
      <div className="flex flex-col items-center justify-between gap-4 my-2 xl:flex-row">
        <div className="flex gap-4">
          <NewsletterButton />
        </div>
        <div className="flex items-center justify-end gap-4">
          <h2 className="text-lg font-bold md:whitespace-nowrap">
            {t('home.browseArticles')}
          </h2>
          <CategorySelector categories={categories} selected={""} />
        </div>
      </div>
      <hr className="border border-secondary" />
    </section>
  );
}