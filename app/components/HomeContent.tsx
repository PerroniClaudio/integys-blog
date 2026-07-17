'use client';

import CategorySelector from './CategorySelector';
import NewsletterButton from '@/components/ui/newsletter-button';
import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';

interface HomeContentProps {
  categories: Array<{
    name: string;
    slug: string;
  }>;
  locale: string;
}

export default function HomeContent({ categories, locale }: HomeContentProps) {
  const { t } = useTranslation();
  const audienceBasePath = locale === 'en' ? 'arguments' : 'argomenti';
  const enterprisesSlug = locale === 'en' ? 'enterprises' : 'aziende';
  const publicAdministrationSlug = locale === 'en' ? 'public-administration' : 'pubblica-amministrazione';

  return (
    <section className="col-span-8">
      {/* <div className="flex flex-col items-center justify-center gap-3 py-4 sm:flex-row xl:gap-12">
        <Link
          className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground sm:w-[18rem]"
          href={`/${locale}/${audienceBasePath}/${enterprisesSlug}`}
        >
          {t('home.forEnterprises')}
        </Link>
        <Link
          className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground sm:w-[18rem]"
          href={`/${locale}/${audienceBasePath}/${publicAdministrationSlug}`}
        >
          {t('home.forPublicAdministration')}
        </Link>
      </div>
      <hr className="border border-secondary" /> */}

      {/* <div className="flex flex-col items-center justify-between gap-4 my-2 xl:flex-row">
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
      <hr className="border border-secondary" /> */}
    </section>
  );
}
