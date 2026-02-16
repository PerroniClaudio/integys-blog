// Script per sistemare le associazioni delle categorie negli articoli
// Uso: node sanity/fix-category-associations.js [--dry-run]

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2024-11-27',
  useCdn: false,
});

const dryRun = process.argv.includes('--dry-run');

async function main() {
  // 1. Recupera tutte le categorie con id multilingua e lingua
  const categories = await client.fetch(`*[_type == 'categorie']{_id, name, language, categoryIdMultilingua}`);
  // Mappa: { [categoryIdMultilingua]: { it: categoriaIt, en: categoriaEn } }
  const catByMultiId = {};
  for (const cat of categories) {
    if (!cat.categoryIdMultilingua) continue;
    if (!catByMultiId[cat.categoryIdMultilingua]) catByMultiId[cat.categoryIdMultilingua] = {};
    catByMultiId[cat.categoryIdMultilingua][cat.language] = cat;
  }

  // 2. Recupera tutti gli articoli con le categorie (solo id e ref)
  const articles = await client.fetch(`*[_type == 'blog']{_id, title, categories[]->{_id, language, categoryIdMultilingua, name}}`);

  let updated = 0, skipped = 0;
  for (const article of articles) {
    if (!article.categories || article.categories.length === 0) continue;
    let toRemove = [], toAdd = [];
    for (const cat of article.categories) {
      if (cat.language === 'en' && cat.categoryIdMultilingua) {
        const itCat = catByMultiId[cat.categoryIdMultilingua]?.it;
        if (itCat) {
          // Se la categoria italiana non è già associata
          const alreadyHasIt = article.categories.some(c => c._id === itCat._id);
          if (!alreadyHasIt) {
            toRemove.push(cat._id);
            toAdd.push(itCat._id);
          }
        }
      }
    }
    if (toRemove.length > 0 || toAdd.length > 0) {
      if (dryRun) {
        console.log(`Articolo: ${article.title} (${article._id})`);
        if (toRemove.length > 0) console.log('  Rimuovi categorie inglesi:', toRemove);
        if (toAdd.length > 0) console.log('  Aggiungi categorie italiane:', toAdd);
        skipped++;
      } else {
        // Aggiorna le categorie
        const newCatIds = article.categories
          .filter(c => !toRemove.includes(c._id))
          .map(c => c._id)
          .concat(toAdd);
        await client.patch(article._id).set({
          categories: newCatIds.map(id => ({ _type: 'reference', _ref: id }))
        }).commit();
        console.log(`Aggiornato articolo: ${article.title} (${article._id})`);
        updated++;
      }
    }
  }
  console.log(dryRun
    ? `\nDRY RUN completato. Articoli da aggiornare: ${skipped}`
    : `\nAggiornamento completato. Articoli aggiornati: ${updated}`
  );
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
