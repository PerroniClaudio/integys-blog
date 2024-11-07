"use server";
import { client } from "./lib/sanity";
import ArticleCard from "./components/ArticleCard";
import { simpleBlogCard } from "./lib/interface";

export async function getDataWithPagination(page: number, pageSize: number, limited:boolean = false) {
  const query = `
      *[_type == 'blog' && limited == ${limited} && date < now()] | order(date desc) {
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
    <ArticleCard key={post.id} article={post} index={index} limited={limited} />
  ));
}

export async function getDataWithPaginationCategories(
  slug: string,
  page: number,
  pageSize: number,
  limited:boolean = false
) {
  const query = `
      *[_type == 'blog' && limited == ${limited} && date < now() && '${slug}' in categories[]->slug.current] | order(date desc) {
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
    <ArticleCard key={post.id} article={post} index={index} limited={limited} />
  ));
}

export async function getData(limited:boolean = false) {
  const query = `
    *[_type == 'blog' && limited == ${limited} && date < now()] | order(date desc) {
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

export async function getServicesData() {
  const query = `
      *[_type == 'servizi'] | order(order asc) {
        "id": _id,
        title,
        "currentSlug": slug.current,
        short,
        smallDescription,
        titleImage,
        body, 
        order
      }
    `;

  const data = await client.fetch(query);

  return data;
}
