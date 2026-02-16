// Test patch su una categoria specifica tramite @sanity/client
// Esegui con: node sanity/test-patch-category.js


const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2024-11-27',
  useCdn: false,
});

async function assegnaCategoryIdMultilingua() {
  console.log('🔍 Recupero tutte le categorie...');
  const categories = await client.fetch(`*[_type == 'categorie'] | order(name asc) {
    _id,
    name,
    slug,
    language,
    categoryIdMultilingua
  }`);
  console.log(`📊 Trovate ${categories.length} categorie\n`);

  console.log('📝 Sovrascrittura categoryIdMultilingua con lo slug:\n');

  let updatedCount = 0;
  let errorCount = 0;

  for (const category of categories) {
    const slugValue = category.slug.current;
    console.log(`→ ${category.name} (${category.language}) | slug: ${slugValue}`);
    try {
      await client.patch(category._id).set({ categoryIdMultilingua: slugValue }).commit();
      console.log('   ✅ Aggiornata con successo!');
      updatedCount++;
    } catch (error) {
      errorCount++;
      const errMsg = (error instanceof Error) ? error.message : String(error);
      console.error(`   ❌ Errore durante aggiornamento categoria ${category.name} (${category._id}):`, errMsg);
    }
  }

  if (updatedCount === 0) {
    console.log('\n⚠️ Nessuna categoria aggiornata!');
    return;
  }

  console.log(`\n🚀 Aggiornamento completato. Categorie aggiornate: ${updatedCount}, errori: ${errorCount}`);

  // Verifica finale
  console.log('\n🔍 Verifica finale...\n');
  const updatedCategories = await client.fetch(`*[_type == 'categorie'] | order(categoryIdMultilingua asc, language asc) {
    name,
    language,
    categoryIdMultilingua,
    "slug": slug.current
  }`);
  updatedCategories.forEach(cat => {
    console.log(`✓ ${cat.name.padEnd(30)} | ${cat.language} | ${cat.categoryIdMultilingua} | ${cat.slug}`);
  });
  console.log('\n✅ Completato!');
}

assegnaCategoryIdMultilingua();
