import { client } from '@/lib/sanity';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale');

  if (!slug || !locale) {
    return NextResponse.json({ error: 'Missing slug or locale' }, { status: 400 });
  }

  try {
    // Prima ottieni l'articolo corrente per prendere il postIdMultilingua
    const currentArticleQuery = `
      *[_type == 'blog' && slug.current == $slug && language == $locale][0] {
        postIdMultilingua
      }
    `;

    const currentArticle = await client.fetch(currentArticleQuery, { slug, locale });

    if (!currentArticle || !currentArticle.postIdMultilingua) {
      return NextResponse.json({ versions: [] });
    }

    // Poi ottieni tutte le versioni con lo stesso postIdMultilingua
    const versionsQuery = `
      *[_type == 'blog' && postIdMultilingua == $postIdMultilingua] {
        language,
        "slug": slug.current
      }
    `;

    const versions = await client.fetch(versionsQuery, { 
      postIdMultilingua: currentArticle.postIdMultilingua 
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Error fetching article versions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
