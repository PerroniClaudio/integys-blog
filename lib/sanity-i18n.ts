import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'

export interface SanityLocaleProps {
  locale: string;
}

// Helper per costruire query con supporto multilingua
export function buildLocalizedQuery(baseQuery: string, locale: string = 'it') {
  // Se il locale è italiano (default), usa la query base
  if (locale === 'it') {
    return baseQuery;
  }
  
  // Per altre lingue, filtra per il locale specifico
  return baseQuery.replace(
    /\*\[_type\s*==\s*"([^"]+)"\]/g,
    `*[_type == "$1" && language == "${locale}"]`
  );
}

// Helper per ottenere contenuti con fallback
export async function getLocalizedContent<T>(
  query: string, 
  params: any = {}, 
  locale: string = 'it'
): Promise<T[]> {
  try {
    // Prova prima con la lingua richiesta
    const localizedQuery = buildLocalizedQuery(query, locale);
    const results = await client.fetch<T[]>(localizedQuery, params);
    
    // Se non ci sono risultati e non è italiano, prova con l'italiano come fallback
    if (results.length === 0 && locale !== 'it') {
      const fallbackQuery = buildLocalizedQuery(query, 'it');
      return await client.fetch<T[]>(fallbackQuery, params);
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching localized content:', error);
    return [];
  }
}

// Query di esempio per blog localizzato
export const localizedBlogQuery = groq`
*[_type == "blog" && defined(slug.current)] | order(date desc, _createdAt desc) {
  _id,
  title,
  slug,
  titleImage,
  smallDescription,
  date,
  highlighted,
  limited,
  order,
  language,
  categories[]-> {
    name,
    slug,
    language
  }
}`;

// Query di esempio per categorie localizzate
export const localizedCategoriesQuery = groq`
*[_type == "categorie"] | order(name asc) {
  _id,
  name,
  slug,
  description,
  language
}`;

// Query di esempio per servizi localizzati
export const localizedServicesQuery = groq`
*[_type == "servizi"] | order(order asc, _createdAt desc) {
  _id,
  title,
  slug,
  titleImage,
  short,
  smallDescription,
  body,
  order,
  language
}`;

// Helper per ottenere la versione tradotta di un documento
export async function getTranslatedDocument<T>(
  documentId: string, 
  targetLocale: string = 'en'
): Promise<T | null> {
  const query = groq`
    *[_type in ["blog", "categorie", "servizi"] && __i18n_refs[].ref._ref match "${documentId}" && language == "${targetLocale}"][0]
  `;
  
  try {
    return await client.fetch<T>(query);
  } catch (error) {
    console.error('Error fetching translated document:', error);
    return null;
  }
}