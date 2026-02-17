// API route Next.js per restituire la lista degli articoli dal dataset Sanity
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
    const locale = searchParams.get('locale');
    const page = Number(searchParams.get('page') || 1);
    const pageSize = Number(searchParams.get('pageSize') || 6);
    const includeHighlighted = searchParams.get('includeHighlighted') ?? 'true';
    const highlighted = searchParams.get('highlighted') ?? 'false';

    if (locale !== 'it' && locale !== 'en') {
      return new Response(JSON.stringify({ success: false, error: 'Parametro locale mancante o non valido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let filter = `[_type == 'blog' && limited == false && date < now() && language == $locale`;
    if (highlighted === 'true') {
      filter += ' && highlighted == true';
    } else if (includeHighlighted === 'false') {
      filter += ' && highlighted != true';
    }
    filter += ']';
    const query = `*${filter}
      | order(order asc, date desc) {
        "id": _id,
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        language,
        categories[]->{name, "slug": slug.current, language}
      }[$start...$end]
    `;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = await client.fetch(query, { locale, start, end });
    return new Response(JSON.stringify({ success: true, data }), {
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
