import { simpleBlogCard } from "./lib/interface";
import { client } from "./lib/sanity";
import ArticleList from "./components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";

async function getData() {
  const query = `
    *[_type == 'blog'] | order(_createdAt desc) {
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

export const revalidate = 30;

export default async function Home() {
  const data: simpleBlogCard[] = await getData();
  return (
    <>
      <Navbar shouldChangeColor={true} />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <ArticleList data={data} />
      </main>
    </>
  );
}
