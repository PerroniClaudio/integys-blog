// Script Sanity: assegna postIdMultilingua agli articoli che non lo hanno, usando lo slug come valore.
// Puoi eseguire questo script con: sanity exec assegna-postid-multilingua.ts --with-user-token

import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function assegnaPostIdMultilingua() {
  // Trova tutti i blog senza postIdMultilingua
  const articoli = await client.fetch(
    `*[_type == "blog" && !defined(postIdMultilingua)]{_id, slug}`
  );

  if (!articoli.length) {
    console.log('Tutti gli articoli hanno già un postIdMultilingua.');
    return;
  }

  for (const articolo of articoli) {
    if (!articolo.slug?.current) {
      console.warn(`Articolo senza slug: ${articolo._id}`);
      continue;
    }
    const nuovoId = articolo.slug.current;
    await client.patch(articolo._id)
      .set({ postIdMultilingua: nuovoId })
      .commit();
    console.log(`Aggiornato ${articolo._id} con postIdMultilingua: ${nuovoId}`);
  }

  console.log('Script completato.');
}

assegnaPostIdMultilingua().catch((err) => {
  console.error('Errore nello script:', err);
  process.exit(1);
});
