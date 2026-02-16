export const dynamic = "force-dynamic";

import { simpleBlogCard } from "@/lib/interface";
import ArticleList from "@/app/components/ArticleList";
import { client } from "@/lib/sanity";
import { getDataI18n, getDataWithPaginationI18n, getCategoriesDataI18n } from "@/app/actions-i18n";
import CategorySelector from "@/app/components/CategorySelector";
import ContactUs from "@/components/ui/contact-us";
import HeroRiservata from "@/app/components/HeroRiservata";
import BrowseArticlesText from "@/app/components/BrowseArticlesText";

export async function generateStaticParams() {
  const query = `
    *[_type == 'blog' && limited == true && date < now()] | order(date desc) {
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current, language}
    }
  `;

  const data: simpleBlogCard[] = await client.fetch(query);

  return data.map((post) => ({ 
    locale: post.language || 'it',
    slug: post.currentSlug 
  }));
}

export const revalidate = 30;

type CategoryData = { name: string; currentSlug: string; };
interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const data: simpleBlogCard[] = await getDataI18n(locale, true);
  const posts = await getDataWithPaginationI18n(1, 6, locale, true);

  // Carica le categorie filtrate per lingua invece di estrarle dagli articoli
  const categoriesData = await getCategoriesDataI18n(locale);
  const categories = categoriesData.map((cat: CategoryData) => ({ name: cat.name, slug: cat.currentSlug }));

  // Key dinamica per forzare il remount su cambio lingua/route
  const key = locale + '-' + (typeof window !== 'undefined' ? window.location.pathname : '');

  return (
    <>
      {/* <Navbar shouldChangeColor={true} /> */}
      <HeroRiservata key={key} />
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <section className="col-span-8">
              <hr className="border border-secondary" />
              <div className="flex flex-col items-center justify-between gap-4 my-2 xl:flex-row">
                <div className="flex gap-4 justify-start">
                  {/* <NewsletterButton/> */}
                </div>
                <div className="flex items-center justify-end gap-4">
                  <BrowseArticlesText key={key} />
                  <CategorySelector key={key} categories={categories} selected={""} limited={true} />
                </div>
              </div>
              <hr className="border border-secondary" />
            </section>

            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts}
              </div>
              <ArticleList key={key} limited={true} locale={locale} />
            </div>

          </div>
        </div>
      </main>
      <ContactUs />
      {/* <Newsletter /> */}
    </>
  );
}