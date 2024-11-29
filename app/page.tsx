export const dynamic = "force-dynamic";

import { simpleBlogCard } from "./lib/interface";
import { client } from "./lib/sanity";
import ArticleList from "./components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Hero2 from "@/app/components/Hero2";

import { getData, getDataWithPagination } from "./actions";
import CategorySelector from "./components/CategorySelector";
import Newsletter from "@/components/ui/newsletter";
import NewsletterButton from "@/components/ui/newsletter-button";
import Footer from "./components/Footer";
import Link from "next/link";

export async function generateStaticParams() {
  const query = `
    *[_type == 'blog' && limited == false && date < now()] | order(date desc) {
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
    <div className="pb-44"> {/* pb-44 is the padding-bottom of the footer */}
      <Navbar shouldChangeColor={true} />
      <Hero />
      {/* <Hero2 /> */}
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            

            <section className="col-span-8">
              <hr className="border border-secondary" />
              <div className="flex flex-col items-center justify-between gap-4 my-2 xl:flex-row">
                <div className="flex gap-4">
                  <NewsletterButton/>
                  {/* <Link
                    className="text-nowrap inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-1 text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                    href="/servizi">
                    Scopri i nostri servizi
                  </Link> */}
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
      <Footer />
    </div>
  );
}
