/**
 * Script per assegnare categoryIdMultilingua alle categorie esistenti
 * 
 * Questo script:
 * 1. Legge tutte le categorie dal CMS
 * 2. Per ogni coppia di categorie (IT/EN) con slug simile, assegna lo stesso categoryIdMultilingua
 * 3. Per le categorie senza corrispondenza, crea un ID unico
 * 
 * UTILIZZO:
 * cd sanity
 * pnpm sanity exec assegna-categoryid-multilingua.ts --non-interactive
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient()

console.log('Project ID:', process.env.SANITY_STUDIO_PROJECT_ID);
console.log('Dataset:', process.env.SANITY_STUDIO_DATASET);
console.log('Token:', process.env.SANITY_API_TOKEN ? 'PRESENTE' : 'MANCANTE');

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  language: string;
  categoryIdMultilingua?: string;
}

async function assignCategoryIdMultilingua() {
  console.log('🔍 Recupero tutte le categorie...');

  // Fetch di tutte le categorie
  const categories: Category[] = await client.fetch(`
    *[_type == 'categorie'] | order(name asc) {
      _id,
      name,
      slug,
      language,
      categoryIdMultilingua
    }
  `);

  console.log(`📊 Trovate ${categories.length} categorie\n`);

  // Raggruppa le categorie per slug base (ignorando variazioni linguistiche)
  const categoryGroups = new Map<string, Category[]>();
  
  categories.forEach((cat: Category) => {
    const baseSlug = cat.slug.current.toLowerCase();
    if (!categoryGroups.has(baseSlug)) {
      categoryGroups.set(baseSlug, []);
    }
    categoryGroups.get(baseSlug)!.push(cat);
  });

  console.log('📝 Assegnazione categoryIdMultilingua:\n');


  let counter = 1;
  let updatedCount = 0;
  let errorCount = 0;

  for (const [baseSlug, group] of categoryGroups.entries()) {
    // Se la categoria ha già un categoryIdMultilingua, lo manteniamo
    const existingId = group.find(c => c.categoryIdMultilingua)?.categoryIdMultilingua;
    const categoryId = existingId || `cat-${String(counter).padStart(3, '0')}`;

    console.log(`\n📁 Gruppo: ${baseSlug}`);
    console.log(`   ID Multilingua: ${categoryId}`);

    for (const category of group) {
      if (category.categoryIdMultilingua === categoryId) {
        console.log(`   ✓ ${category.name} (${category.language}) - già assegnato`);
        continue;
      }

      console.log(`   → ${category.name} (${category.language})`);
      try {
        await client
          .patch(category._id)
          .set({ categoryIdMultilingua: categoryId })
          .commit();
        console.log(`     ✅ Aggiornata con successo!`);
        updatedCount++;
      } catch (error) {
        errorCount++;
        console.error(`     ❌ Errore durante aggiornamento categoria ${category.name} (${category._id}):`, error.message || error);
      }
    }
    if (!existingId) {
      counter++;
    }
  }

  if (updatedCount === 0) {
    console.log('\n✅ Tutte le categorie hanno già un categoryIdMultilingua!');
    return;
  }

  console.log(`\n🚀 Aggiornamento completato. Categorie aggiornate: ${updatedCount}, errori: ${errorCount}`);

  // Verifica finale
  console.log('\n🔍 Verifica finale...\n');
  const updatedCategories: Category[] = await client.fetch(`
    *[_type == 'categorie'] | order(categoryIdMultilingua asc, language asc) {
      name,
      language,
      categoryIdMultilingua,
      "slug": slug.current
    }
  `);

  updatedCategories.forEach((cat: Category) => {
    console.log(`✓ ${cat.name.padEnd(30)} | ${cat.language} | ${cat.categoryIdMultilingua} | ${cat.slug}`);
  });

  console.log('\n✅ Completato!');
}

assignCategoryIdMultilingua().catch(console.error);
