import { simpleBlogCard } from "./lib/interface";
import { client } from "./lib/sanity";
import ArticleList from "./components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { getData, getDataWithPagination } from "./actions";
import CategorySelector from "./components/CategorySelector";
import Newsletter from "@/components/ui/newsletter";
import NewsletterButton from "@/components/ui/newsletter-button";

export async function generateStaticParams() {
  const query = `
    *[_type == 'blog' && date < now()] | order(date desc) {
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
  const posts = await getDataWithPagination(1, 6);


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
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            

            <section className="col-span-8">
              <hr className="border border-secondary" />
              <div className="flex flex-col items-center justify-between gap-4 my-2 xl:flex-row">
                <div className="flex gap-4">
                  <Link href="/contattaci" className="justify-self-start">
                    <Button
                      variant={"secondary"}
                      className="text-secondary-foreground text-lg py-4 px-12 min-w-16 text-center bg-primary w-full">
                      Contattaci
                    </Button>
                  </Link>
                  <NewsletterButton/>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <h2 className="text-lg font-bold md:whitespace-nowrap">Scorri gli articoli in basso o seleziona una categoria</h2>
                  <CategorySelector categories={categories} selected={""} />
                </div>
              </div>
              <hr className="border border-secondary" />
            </section>


            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts}
              </div>
              <ArticleList />
            </div>

          </div>
        </div>
      </main>
      <Newsletter />
    </>
  );
}
