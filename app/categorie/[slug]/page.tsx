import { Categories, simpleBlogCard } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import ArticleList from "@/app/components/ArticleList";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";

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

export const revalidate = 30;

async function Categorie({ params }: { params: { slug: string } }) {
  const data: simpleBlogCard[] = await getData(params.slug);
  const categories: Categories[] = await getCategories();

  console.log(categories);

  return (
    <>
      <Navbar shouldChangeColor={true} />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 mb-16">
        <ArticleList data={data} categories={categories} />
      </main>
    </>
  );
}
export default Categorie;
