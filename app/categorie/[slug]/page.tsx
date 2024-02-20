import { Categories, simpleBlogCard } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import ArticleList from "@/app/components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import { getDataWithPaginationCategories } from "@/app/actions";

import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getData(slug: string) {
  const query = `
      *[_type == 'blog' && '${slug}' in categories[]->slug.current] | order(_createdAt desc) {
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

async function getCategories() {
  const query = `
        *[_type == 'categorie'] {
        name,
        "slug" : slug.current
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
  const posts = await getDataWithPaginationCategories(params.slug, 1, 4);
  const categories: Categories[] = await getCategories();

  return (
    <>
      <Navbar shouldChangeColor={true} />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <div className="col-span-5 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {posts}
              </div>
              <ArticleList category={params.slug} />
            </div>

            <aside className="col-span-3 hidden lg:block">
              <div className="sticky top-[117px] w-full">
                <div className="min-h-32 rounded p-8">
                  <h2 className="text-lg font-bold mb-4">Voglio leggere di</h2>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((category, idx) => (
                      <Link href={`/categorie/${category.slug}`} key={idx}>
                        <Button className="rounded-full text-primary-foreground text-sm py-1 px-2 w-full text-center">
                          {category.name}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  <hr className="border border-secondary my-4" />

                  <Link href="/contattaci">
                    <Button
                      variant={"secondary"}
                      className="text-secondary-foreground text-sm py-1 px-2 min-w-16 text-center">
                      Contattaci
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
export default Categorie;
