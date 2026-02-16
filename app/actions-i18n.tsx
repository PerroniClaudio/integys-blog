"use server";
import { client } from "@/lib/sanity";
import ArticleCard from "./components/ArticleCard";
import { simpleBlogCard } from "@/lib/interface";

// Versioni delle actions con supporto multilingua

export async function getDataWithPaginationI18n(
  page: number, 
  pageSize: number, 
  locale: string = 'it', 
  limited: boolean = false, 
  includeHighlighted: boolean = true
) {
  const query = `
    *[_type == 'blog' && limited == ${limited} && date < now()
      ${includeHighlighted ? '' : (' && highlighted != true')}
      ${locale !== 'it' ? ` && language == "${locale}"` : ''}] 
    | order(order asc, date desc) {
      "id": _id,
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current, language}
    }[${(page - 1) * pageSize}...${page * pageSize}]
  `;

  try {
    const data = await client.fetch(query);
    
    // Se non ci sono dati per la lingua richiesta e non è italiano, prova con italiano
    if (data.length === 0 && locale !== 'it') {
      const fallbackQuery = `
        *[_type == 'blog' && limited == ${limited} && date < now()
          ${includeHighlighted ? '' : (' && highlighted != true')}] 
        | order(order asc, date desc) {
          "id": _id,
          title,
          smallDescription,
          titleImage,
          "currentSlug": slug.current,
          language,
          categories[]->{name, "slug" : slug.current, language}
        }[${(page - 1) * pageSize}...${page * pageSize}]
      `;
      const fallbackData = await client.fetch(fallbackQuery);
      
      return fallbackData.map((post: simpleBlogCard, index: number) => (
        <ArticleCard key={post.id} article={post} index={index} limited={limited} />
      ));
    }

    return data.map((post: simpleBlogCard, index: number) => (
      <ArticleCard key={post.id} article={post} index={index} limited={limited} />
    ));
  } catch (error) {
    console.error('Error fetching paginated data:', error);
    return [];
  }
}

export async function getHighlightedPostsDataI18n(
  locale: string = 'it',
  limited: boolean = false
) {
  const query = `
    *[_type == 'blog' && limited == ${limited} && highlighted == true && date < now()
      ${locale !== 'it' ? ` && language == "${locale}"` : ''}] 
    | order(order asc, date desc) {
      "id": _id,
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current, language}
    }[0...10]
  `;

  try {
    const data = await client.fetch(query);
    
    // Fallback per italiano se necessario
    if (data.length === 0 && locale !== 'it') {
      const fallbackQuery = `
        *[_type == 'blog' && limited == ${limited} && highlighted == true && date < now()]
        | order(order asc, date desc) {
          "id": _id,
          title,
          smallDescription,
          titleImage,
          "currentSlug": slug.current,
          language,
          categories[]->{name, "slug" : slug.current, language}
        }[0...10]
      `;
      return await client.fetch(fallbackQuery);
    }

    return data;
  } catch (error) {
    console.error('Error fetching highlighted posts:', error);
    return [];
  }
}

export async function getDataWithPaginationCategoriesI18n(
  slug: string,
  page: number,
  pageSize: number,
  locale: string = 'it',
  limited: boolean = false
) {
  const query = `
    *[_type == 'blog' && limited == $limited && date < now() 
      && references(*[_type == 'categorie' && slug.current == $slug]._id)
      && language == $locale] 
    | order(date desc) {
      "id": _id,
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current, language}
    }[${(page - 1) * pageSize}...${page * pageSize}]
  `;

  try {
    const data = await client.fetch(query, { slug, locale, limited });
    
    return data.map((post: simpleBlogCard, index: number) => (
      <ArticleCard key={post.id} article={post} index={index} limited={limited} />
    ));
  } catch (error) {
    console.error('Error fetching category data:', error);
    return [];
  }
}

export async function getServicesDataI18n(locale: string = 'it') {
  const query = `
    *[_type == 'servizi' && language == "${locale}"] 
    | order(order asc) {
      "id": _id,
      title,
      "currentSlug": slug.current,
      short,
      smallDescription,
      titleImage,
      body, 
      order,
      language
    }
  `;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getCategoriesDataI18n(locale: string = 'it') {
  let query;
  if (locale === 'it') {
    query = `
      *[_type == 'categorie' && language == "it"] 
      | order(name asc) {
        "id": _id,
        name,
        "currentSlug": slug.current,
        description,
        language
      }
    `;
  } else {
    query = `
      *[_type == 'categorie' && (language == "${locale}" || language == "it")] 
      | order(name asc) {
        "id": _id,
        name,
        "currentSlug": slug.current,
        description,
        language
      }
    `;
  }

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getDataI18n(locale: string = 'it', limited: boolean = false) {
  const query = `
    *[_type == 'blog' && limited == ${limited} && date < now()
      ${locale !== 'it' ? ` && language == "${locale}"` : ''}] 
    | order(date desc) {
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current, language},
      preview_text,
    }
  `;

  try {
    const data = await client.fetch(query);
    
    // Fallback per italiano se necessario
    if (data.length === 0 && locale !== 'it') {
      const fallbackQuery = `
        *[_type == 'blog' && limited == ${limited} && date < now()] 
        | order(date desc) {
          title,
          smallDescription,
          titleImage,
          "currentSlug": slug.current,
          language,
          categories[]->{name, "slug" : slug.current, language},
          preview_text,
        }
      `;
      return await client.fetch(fallbackQuery);
    }

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Funzione per ottenere un singolo articolo con supporto multilingua
export async function getBlogPostI18n(slug: string, locale: string = 'it') {
  const query = `
    *[_type == 'blog' && slug.current == '${slug}'${locale !== 'it' ? ` && language == "${locale}"` : ''}][0] {
      "id": _id,
      title,
      smallDescription,
      titleImage,
      body,
      date,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current, language},
      files[]{
        asset->{
          url,
          originalFilename
        },
        title
      }
    }
  `;

  try {
    const data = await client.fetch(query);
    
    // Fallback per italiano se necessario
    if (!data && locale !== 'it') {
      const fallbackQuery = `
        *[_type == 'blog' && slug.current == '${slug}'][0] {
          "id": _id,
          title,
          smallDescription,
          titleImage,
          body,
          date,
          "currentSlug": slug.current,
          language,
          categories[]->{name, "slug" : slug.current, language},
          files[]{
            asset->{
              url,
              originalFilename
            },
            title
          }
        }
      `;
      return await client.fetch(fallbackQuery);
    }

    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}