// Script per rimuovere l'associazione tra la categoria con slug "sicurezza-informatica" e gli articoli associati
// Avviabile con: node remove-sicurezza-informatica-category.js

const { createClient } = require('@sanity/client');
// require('dotenv').config({ path: './sanity/.env.local' });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-01-01',
});

const CATEGORY_SLUG = 'sicurezza-informatica';

async function main() {
  try {
    // Trova la categoria con lo slug richiesto
    const category = await client.fetch(
      `*[_type == "categorie" && slug.current == $slug][0]`,
      { slug: CATEGORY_SLUG }
    );
    if (!category) {
      console.error('Categoria non trovata.');
      process.exit(1);
    }
    const categoryId = category._id;
    console.log('Categoria trovata:', categoryId);

    // Trova tutti gli articoli associati a questa categoria
    const articles = await client.fetch(
      `*[_type == "blog" && references($catId)]{ _id, title, categories }`,
      { catId: categoryId }
    );
    if (!articles.length) {
      console.log('Nessun articolo associato a questa categoria.');
      return;
    }
    console.log(`Trovati ${articles.length} articoli da aggiornare.`);

    // Aggiorna ogni articolo rimuovendo la categoria
    for (const article of articles) {
      const newCategories = (article.categories || []).filter(
        (cat) => cat._ref !== categoryId
      );
      await client.patch(article._id)
        .set({ categories: newCategories })
        .commit();
      console.log(`Aggiornato articolo: ${article._id} (${article.title})`);
    }
    console.log('Rimozione completata.');
  } catch (err) {
    console.error('Errore:', err);
    process.exit(1);
  }
}

main();
