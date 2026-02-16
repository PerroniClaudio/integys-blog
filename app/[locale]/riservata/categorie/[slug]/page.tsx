export const dynamic = "force-dynamic";

import { Categories, simpleBlogCard } from "@/lib/interface";
import { client } from "@/lib/sanity";
// import ArticleList from "@/app/components/ArticleList";
// import Navbar from "@/app/components/Navbar";
import { getDataWithPaginationCategories } from "@/app/actions";

import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import CategorySelector from "@/app/components/CategorySelector";
// import Newsletter from "@/components/ui/newsletter";
// import HeroRiservata from "@/app/components/HeroRiservata";
// import ContactUsButton from "@/app/components/ContactUsButton";

async function getData(slug: string) {
  const query = `
      *[_type == 'blog' && limited == true && references(*[_type == 'category' && slug.current == '${slug}']._id) && date < now()] | order(date desc) {
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        categories[]->{name, "slug" : slug.current}
      }
    `;

  const data = await client.fetch(query);

  return data;
}

// In questo caso seleziona solo le categorie presenti tra i post con limited true
async function getCategories() {
  // const query = `
  //       *[_type == 'categorie'] {
  //       name,
  //       "slug" : slug.current
  //       }
  //   `;
  const query = `
    *[_type == "categorie" && count(*[_type == "blog" && limited == true && date < now() && references(^._id)]) > 0] {
    name,
    "slug": slug.current
    }
  `;

  const data = await client.fetch(query);

  return data;
}

export async function generateStaticParams() {
  const query = `
  *[_type == "categorie" && count(*[_type == "blog" && limited == true && date < now() && references(^._id)]) > 0] {
  name,
  "slug" : slug.current
  }
`;

  const data: Categories[] = await client.fetch(query);

  return data.map(({ slug }) => ({ slug }));
}

export const revalidate = 30;

import { getDataWithPaginationCategoriesI18n, getCategoriesDataI18n } from "@/app/actions-i18n";
import CategorySelector from "@/app/components/CategorySelector";
import ArticleList from "@/app/components/ArticleList";
import HeroRiservata from "@/app/components/HeroRiservata";

async function Categorie({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const posts = await getDataWithPaginationCategoriesI18n(slug, 1, 6, locale, true);
  const categoriesData = await getCategoriesDataI18n(locale);

  // Recupera tutti gli articoli nella lingua corrente (limited true)
  const articlesQuery = `*[_type == 'blog' && limited == true && date < now() && language == $locale] { categories[]-> { slug } }`;
  const articles = await import("@/lib/sanity").then(m => m.client.fetch(articlesQuery, { locale }));
  const usedCategorySlugs = Array.from(new Set(
    articles.flatMap((a: any) => (a.categories || []).map((c: any) => c.slug?.current || c.slug))
  ));
  const categories: { name: string, slug: string }[] = usedCategorySlugs.map(slug => {
    const catCurrent = categoriesData.find((c: any) => c.currentSlug === slug && c.language === locale);
    if (catCurrent) return { name: catCurrent.name, slug: catCurrent.currentSlug };
    const catIt = categoriesData.find((c: any) => c.currentSlug === slug && c.language === 'it');
    if (catIt) return { name: catIt.name, slug: catIt.currentSlug };
    return { name: slug, slug };
  });
  const key = locale + '-' + slug + '-' + (typeof window !== 'undefined' ? window.location.pathname : '');

  return (
    <>
      <HeroRiservata key={key} />
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <section className="col-span-8">
              <hr className="border border-secondary" />
              <div className="flex flex-col items-center justify-between gap-4 my-2 lg:flex-row">
                <div className="flex items-center justify-end gap-4">
                  <h2 className="text-lg font-bold md:whitespace-nowrap">Scorri gli articoli in basso o seleziona una categoria</h2>
                  <CategorySelector key={key} categories={categories} selected={slug} limited={true} />
                </div>
              </div>
              <hr className="border border-secondary" />
            </section>
            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts}
              </div>
              <ArticleList key={key} category={slug} limited={true} locale={locale} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export default Categorie;
