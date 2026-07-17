import { getDataWithPaginationCategoryFiltersI18n } from '@/app/actions-i18n';
import ArticleList from '@/app/components/ArticleList';
import CategorySelector from '@/app/components/CategorySelector';
import Footer from '@/app/components/Footer';
import Hero from '@/app/components/Hero';
import Navbar from '@/app/components/Navbar';
import Newsletter from '@/components/ui/newsletter';
import NewsletterButton from '@/components/ui/newsletter-button';

export const fixedAudiences = {
  aziende: {
    categoryId: 'aziende',
    label: {
      it: 'Aziende',
      en: 'Enterprises',
    },
  },
  enterprises: {
    categoryId: 'aziende',
    label: {
      it: 'Aziende',
      en: 'Enterprises',
    },
  },
  'pubblica-amministrazione': {
    categoryId: 'pubblica-amministrazione',
    label: {
      it: 'Pubblica Amministrazione',
      en: 'Public Administration',
    },
  },
  'public-administration': {
    categoryId: 'pubblica-amministrazione',
    label: {
      it: 'Pubblica Amministrazione',
      en: 'Public Administration',
    },
  },
} as const;

type Audience = keyof typeof fixedAudiences;

export default async function FixedCategoryPage({
  audience,
  locale,
  selectedCategory,
}: {
  audience: Audience;
  locale: string;
  selectedCategory?: string;
}) {
  const { categoryId, label } = fixedAudiences[audience];
  const posts = await getDataWithPaginationCategoryFiltersI18n(categoryId, selectedCategory, 1, 6, locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const categoriesRes = await fetch(`${siteUrl}/api/categories-list?language=${locale}`);
  const categories = categoriesRes.ok ? await categoriesRes.json() : [];
  const selectableCategories = categories.filter((category: { categoryIdMultilingua?: string }) => category.categoryIdMultilingua !== categoryId);
  const audienceBasePath = locale === 'en' ? 'arguments' : 'argomenti';
  const audienceSlugMap: Record<string, string> =
    locale === 'en'
      ? {
          aziende: 'enterprises',
          enterprises: 'enterprises',
          'pubblica-amministrazione': 'public-administration',
          'public-administration': 'public-administration',
        }
      : {
          aziende: 'aziende',
          enterprises: 'aziende',
          'pubblica-amministrazione': 'pubblica-amministrazione',
          'public-administration': 'pubblica-amministrazione',
        };
  const audienceSlug = audienceSlugMap[audience] || audience;
  const filtersPath = `${audienceBasePath}/${audienceSlug}`;
  const audienceLabel = locale === 'en' ? label.en : label.it;

  return (
    <>
      <Navbar shouldChangeColor={true} />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <section className="col-span-8">
              <hr className="border border-secondary" />
              <div className="flex flex-col items-center justify-between gap-4 my-2 lg:flex-row">
                <NewsletterButton />
                <div className="flex items-center justify-end gap-4">
                  <h2 className="text-lg font-bold md:whitespace-nowrap">
                    {locale === 'it' ? `Articoli per ${audienceLabel}` : `${audienceLabel} articles`}
                  </h2>
                  <CategorySelector categories={selectableCategories} selected={selectedCategory || ''} filtersPath={filtersPath} />
                </div>
              </div>
              <hr className="border border-secondary" />
            </section>
            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{posts}</div>
              <ArticleList
                key={`${locale}-${audience}-${selectedCategory || 'all'}`}
                category={selectedCategory}
                fixedCategoryIdMultilingua={categoryId}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
