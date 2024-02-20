import { simpleBlogCard } from "./lib/interface";
import { client } from "./lib/sanity";
import ArticleList from "./components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { getData, getDataWithPagination } from "./actions";

export async function generateStaticParams() {
  const query = `
    *[_type == 'blog'] | order(_createdAt desc) {
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      categories[]->{name, "slug" : slug.current}
    }
  `;

  const data: simpleBlogCard[] = await client.fetch(query);

  return data.map(({ currentSlug }) => currentSlug);
}

export const revalidate = 30;

export default async function Home() {
  const data: simpleBlogCard[] = await getData();
  const posts = await getDataWithPagination(1, 4);

  let categories = data
    .map((post) => post.categories)
    .flat()
    .filter((category, idx, self) => {
      return idx === self.findIndex((c) => c.slug === category.slug);
    });

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
              <ArticleList />
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
