"use server";
import { client } from "./lib/sanity";
import ArticleCard from "./components/ArticleCard";
import { simpleBlogCard } from "./lib/interface";

// Prende gli articoli in ordine di ordine (se ce ne sono) e data. 
// Si può decidere se prendere solo quelli limitati o solo quelli non limitati. 
// Si può decidere se includere gli evidenziati o no.
export async function getDataWithPagination(page: number, pageSize: number, limited:boolean = false, includeHighlighted:boolean = true) {
  // ${highlighted ? '' : '&& highlighted == false'}]
  const query = `
      *[_type == 'blog' && limited == ${limited} && date < now() 
        ${includeHighlighted ? '' : (' && highlighted != true')}] | order(order asc, date desc) {
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

// Prende gli articoli evidenziati (limitati o no in base al parametro) in ordine di order e data. Massimo 10 articoli.
export async function getHighlightedPostsData(limited:boolean = false) {
  // && date < now() DA CAMBIARE PRIMA DELLA PUBBLICAZIONE. (va inserito)
  const query = `
      *[_type == 'blog' && limited == ${limited} && highlighted == true && date < now()] | order(order asc, date desc) {
        "id": _id,
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        categories[]->{name, "slug" : slug.current}
      }[0...10]
    `;

  const data = await client.fetch(query);

  return data;
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
      categories[]->{name, "slug" : slug.current},
      preview_text,
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

export async function getPreviewCards() {
  // RICORDARSI DI SOSTITUIRE LA QUERY PER LA PRODUZIONE (uso l'altra perchè non ci sono articoli limitati già pubblicati)
  const query = `
      *[_type == 'blog' && limited == true && show_preview == true && date < now()] | order(date desc) {
        "id": _id,
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        categories[]->{name, "slug" : slug.current}
        
      }[0...3]
    `;
  // // Query per sviluppo
  // const query = `
  //     *[_type == 'blog' && limited == true && show_preview == true] | order(date desc) {
  //       "id": _id,
  //       title,
  //       smallDescription,
  //       titleImage,
  //       "currentSlug": slug.current,
  //       categories[]->{name, "slug" : slug.current}
        
  //     }[0...3]
  //   `;

  const data = await client.fetch(query);

  return data.map((post: simpleBlogCard, index: number) => (
    <ArticleCard key={post.id} article={post} index={index} limited={false} isPreview={true} />
  ));
}
