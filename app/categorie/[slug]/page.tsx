export const dynamic = "force-dynamic";

import { Categories } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import ArticleList from "@/app/components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import { getDataWithPaginationCategories } from "@/app/actions";

import CategorySelector from "@/app/components/CategorySelector";
import Newsletter from "@/components/ui/newsletter";
import NewsletterButton from "@/components/ui/newsletter-button";

async function getData(slug: string) {
  const query = `
      *[_type == 'blog' && limited == false && references(*[_type == 'category' && slug.current == '${slug}']._id) && date < now()] | order(date desc) {
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

// In questo caso seleziona solo le categorie presenti tra i post già pubblicati,  e con limited false
async function getCategories() {
  const query = `
      *[_type == 'categorie' && count(*[_type == 'blog' && limited == false && date < now() &&  references(^._id)]) > 0] {
      name,
      "slug": slug.current
      }
    `;

  const data = await client.fetch(query);

  return data;
}

export async function generateStaticParams() {
  const query = `
    *[_type == 'categorie' && count(*[_type == 'blog' && limited == false && date < now() &&  references(^._id)]) > 0] {
    name,
    "slug" : slug.current
    }
  `;

  const data: Categories[] = await client.fetch(query);

  return data.map(({ slug }) => ({ slug }));
}

export const revalidate = 30;

async function Categorie({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getDataWithPaginationCategories(slug, 1, 6);
  const categories: Categories[] = await getCategories();

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
                <NewsletterButton/>
                <div className="flex items-center justify-end gap-4">
                  <h2 className="text-lg font-bold md:whitespace-nowrap">Scorri gli articoli in basso o seleziona una categoria</h2>
                  <CategorySelector categories={categories} selected={slug} />
                </div>
              </div>
              <hr className="border border-secondary" />
            </section>

            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts}
              </div>
              <ArticleList category={slug} />
            </div>

          </div>
        </div>
      </main>
      <Newsletter />
    </>
  );
}
export default Categorie;
