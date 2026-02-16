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
  params: Promise<{ locale: string; slug: string }>;
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
  const { locale, slug } = await params;
  const posts = await getDataWithPaginationCategoriesI18n(slug, 1, 6, locale);
  const categoriesData = await getCategoriesDataI18n(locale);

  // Recupera tutti gli articoli nella lingua corrente
  const articlesQuery = `*[_type == 'blog' && limited == false && date < now() && language == $locale] { categories[]-> { slug } }`;
  const articles = await client.fetch(articlesQuery, { locale });
  // Ottieni la lista degli slug delle categorie effettivamente usate
  const usedCategorySlugs = Array.from(new Set(
    articles.flatMap((a: any) => (a.categories || []).map((c: any) => c.slug?.current || c.slug))
  ));

  // Fai fallback: per ogni slug usato, prendi la categoria nella lingua corrente se esiste, altrimenti quella italiana
  const categories: { name: string, slug: string }[] = usedCategorySlugs.map(slug => {
    // cerca prima la categoria nella lingua corrente
    const catCurrent = categoriesData.find((c: any) => c.currentSlug === slug && c.language === locale);
    if (catCurrent) return { name: catCurrent.name, slug: catCurrent.currentSlug };
    // fallback: cerca la categoria in italiano
    const catIt = categoriesData.find((c: any) => c.currentSlug === slug && c.language === 'it');
    if (catIt) return { name: catIt.name, slug: catIt.currentSlug };
    // fallback estremo: solo slug
    return { name: slug, slug };
  });

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
                  <CategorySelector key={`${locale}-${slug}`} categories={categories} selected={slug} />
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
