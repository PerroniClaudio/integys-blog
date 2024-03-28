"use server";
import { client } from "./lib/sanity";
import ArticleCard from "./components/ArticleCard";
import { simpleBlogCard } from "./lib/interface";

export async function getDataWithPagination(page: number, pageSize: number) {
  const query = `
      *[_type == 'blog' && date < now()] | order(_createdAt desc) {
        "id": _id,
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        categories[]->{name, "slug" : slug.current}
      }[${(page - 1) * pageSize}...${page * pageSize}]
    `;

  const data = await client.fetch(query);

  return data.map((post: simpleBlogCard, index: number) => (
    <ArticleCard key={post.id} article={post} index={index} />
  ));
}

export async function getDataWithPaginationCategories(
  slug: string,
  page: number,
  pageSize: number
) {
  const query = `
      *[_type == 'blog' && date < now() && '${slug}' in categories[]->slug.current] | order(_createdAt desc) {
        "id": _id,
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        categories[]->{name, "slug" : slug.current}
      }[${(page - 1) * pageSize}...${page * pageSize}]
    `;

  const data = await client.fetch(query);

  return data.map((post: simpleBlogCard, index: number) => (
    <ArticleCard key={post.id} article={post} index={index} />
  ));
}

export async function getData() {
  const query = `
    *[_type == 'blog' && date < now()] | order(_createdAt desc) {
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
