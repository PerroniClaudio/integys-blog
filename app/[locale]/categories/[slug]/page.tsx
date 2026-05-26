export const dynamic = "force-dynamic";

import { Categories } from "@/lib/interface";
import { client } from "@/lib/sanity";
import ArticleList from "@/app/components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import { getDataWithPaginationCategoriesI18n, getCategoriesDataI18n } from "@/app/actions-i18n";

import CategorySelector from "@/app/components/CategorySelector";
import Newsletter from "@/components/ui/newsletter";
import NewsletterButton from "@/components/ui/newsletter-button";
import Footer from "@/app/components/Footer";

interface PageProps {
  params: Promise<{ locale: string; slug: string }> | { locale: string; slug: string };
}

async function getData(slug: string, locale: string) {
  const query = `
    *[_type == 'blog' && limited == false && references(*[_type == 'categorie' && slug.current == $slug]._id) && date < now() && language == $locale] | order(date desc) {
      _id,
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current}
    }
  `;

  const data = await client.fetch(query, { slug, locale });

  return data;
}

export async function generateStaticParams() {
  const query = `
    *[_type == 'categorie' && count(*[_type == 'blog' && limited == false && date < now() && references(^._id)]) > 0] {
      "slug": slug.current,
      language
    }
  `;

  const data = await client.fetch(query);

  return data.map((cat: any) => ({ 
    locale: cat.language || 'it',
    slug: cat.slug 
  }));
}

export const revalidate = 30;


async function Categorie({ params }: PageProps) {
  const { locale, slug } = await Promise.resolve(params);
  const posts = await getDataWithPaginationCategoriesI18n(slug, 1, 6, locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Recupera categorie tramite API route (ipotizzando /api/categories-list)
  const categoriesRes = await fetch(`${siteUrl}/api/categories-list?language=${locale}`);
  const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

  return (
    <>
      <Navbar shouldChangeColor={true} />
      <Hero key={locale} />
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">

            <section className="col-span-8">
              <hr className="border border-secondary" />
              <div className="flex flex-col items-center justify-between gap-4 my-2 lg:flex-row">
                <NewsletterButton/>
                <div className="flex items-center justify-end gap-4">
                  <h2 className="text-lg font-bold md:whitespace-nowrap">
                    {locale === 'it' 
                      ? 'Scorri gli articoli in basso o seleziona una categoria'
                      : 'Browse the articles below or select a category'}
                  </h2>
                  <CategorySelector key={`${locale}-${slug}`} categories={categoriesData} selected={slug} />
                </div>
              </div>
              <hr className="border border-secondary" />
            </section>

            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts}
              </div>
              <ArticleList key={`${locale}-${slug}`} category={slug} locale={locale} />
            </div>

          </div>
        </div>
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}
export default Categorie;
