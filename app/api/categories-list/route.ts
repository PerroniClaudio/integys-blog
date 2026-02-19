// API route Next.js per restituire la lista delle categorie dal dataset Sanity
// Usa un token di sola lettura lato server, mai esposto al client

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_READ_TOKEN, // Token di sola lettura
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-27',
  useCdn: false,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    if (!language || (language !== 'it' && language !== 'en')) {
      return new Response(JSON.stringify({ success: false, error: 'Parametro language mancante o non valido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // Filtro: solo categorie la cui categoryIdMultilingua è presente tra quelle associate ad almeno un articolo nella lingua richiesta
    const query = `
      *[_type == 'categorie' && language == $language &&
        categoryIdMultilingua in (
          select(
            *[_type == 'blog' && language == $language && defined(categories[0])].categories[]->categoryIdMultilingua
          )
        )
      ] | order(order asc) {
        "id": _id,
        name,
        description,
        "slug": slug.current,
        language
      }
    `;
    const data = await client.fetch(query, { language });
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, error: errMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
