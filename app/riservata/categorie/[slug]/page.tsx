import { Categories, simpleBlogCard } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import ArticleList from "@/app/components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import { getDataWithPaginationCategories } from "@/app/actions";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import CategorySelector from "@/app/components/CategorySelector";
import Newsletter from "@/components/ui/newsletter";

async function getData(slug: string) {
  const query = `
      *[_type == 'blog' && limited == true && '${slug}' in categories[]->slug.current  && date < now()] | order(date desc) {
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
    *[_type == "categorie" && count(*[_type == "blog" && limited == true && references(^._id)]) > 0] {
    name,
    "slug": slug.current
    }
  `;

  const data = await client.fetch(query);

  return data;
}

export async function generateStaticParams() {
  const query = `
  *[_type == 'categorie'] {
  name,
  "slug" : slug.current
  }
`;

  const data: Categories[] = await client.fetch(query);

  return data.map(({ slug }) => slug);
}

export const revalidate = 30;

async function Categorie({ params }: { params: { slug: string } }) {
  const posts = await getDataWithPaginationCategories(params.slug, 1, 6, true);
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
                <Link href="/contattaci" className="justify-self-start">
                  <Button
                    variant={"secondary"}
                    // className="text-secondary-foreground text-sm py-1 px-2 min-w-16 text-center">
                    className="text-secondary-foreground text-lg py-4 px-12 min-w-16 text-center bg-primary w-full">
                    Contattaci
                  </Button>
                </Link>
                <div className="flex items-center justify-end gap-4">
                  <h2 className="text-lg font-bold md:whitespace-nowrap">Scorri gli articoli in basso o seleziona una categoria</h2>
                  <CategorySelector categories={categories} selected={params.slug} limited={true} />
                </div>
              </div>
              <hr className="border border-secondary" />
            </section>

            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts}
              </div>
              <ArticleList category={params.slug} limited={true} />
            </div>

          </div>
        </div>
      </main>
      <Newsletter />
    </>
  );
}
export default Categorie;
