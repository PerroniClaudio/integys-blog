import { Card, CardContent } from "@/components/ui/card";
import { simpleBlogCard } from "./lib/interface";
import { client } from "./lib/sanity";
import ArticleList from "./components/ArticleList";

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
      <ArticleList data={data} />
    </>
  );
}
