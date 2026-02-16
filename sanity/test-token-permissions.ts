/**
 * Test Token Permissions - Verifica rapida permessi Sanity
 * Questo test prova a fare una piccola modifica per verificare i permessi
 */

import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset:  process.env.SANITY_STUDIO_DATASET || 'development',
  apiVersion: '2024-11-27',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || undefined
})

console.log('Project ID:', process.env.SANITY_STUDIO_PROJECT_ID);
console.log('Dataset:', process.env.SANITY_STUDIO_DATASET);

async function testTokenPermissions() {
  console.log('🔓 Test permessi token Sanity...\n')
  
  // 1. Verifica connessione e lettura su blog, categorie, servizi
  const typesToTest = ['blog', 'categorie', 'servizi'];
  for (const type of typesToTest) {
    try {
      const readTest = await client.fetch(`*[_type == "${type}"][0..2]`)
      console.log(`✅ LETTURA (${type}): OK - Token può leggere documenti`)
      console.log(`   Trovati ${readTest.length} documenti di test\n`)
    } catch (error) {
      console.error(`❌ LETTURA (${type}): FAILED -`, error)
      return
    }
  }

  // 2. Test permessi di scrittura con una patch sicura su tutti i tipi
  for (const type of typesToTest) {
    try {
      // Trova un documento esistente senza testField
      const testDoc = await client.fetch(`*[_type == "${type}" && !defined(testField)][0]`)
      if (!testDoc) {
        console.log(`⚠️  Nessun documento disponibile per test scrittura (${type})`)
        continue;
      }
      console.log(`🔧 Test SCRITTURA su documento (${type}): ${testDoc._id}`)
      // Prova ad aggiungere un campo temporaneo di test
      await client.patch(testDoc._id).set({ testField: 'test-permission-check' }).commit()
      console.log(`✅ SCRITTURA (${type}): OK - Token può modificare documenti`)
      // Rimuovi immediatamente il campo di test
      await client.patch(testDoc._id).unset(['testField']).commit()
      console.log('🧹 Campo di test rimosso\n')
    } catch (error) {
      console.error(`❌ SCRITTURA (${type}): FAILED`)
      console.error('   Errore:', (error instanceof Error ? error.message : String(error)) || error)
      console.error('   StatusCode:', (error as any)?.statusCode || 'N/A')
      if ((error as any)?.statusCode === 403) {
        console.log(`\n🔑 Il token NON ha permessi di scrittura su ${type}!`)
        console.log('   Soluzione: Verifica che il token sia "Editor" non "Viewer" e abbia permessi sul dataset')
      }
      return;
    }
  }

  // 3. Se siamo arrivati qui, il token funziona!
  console.log('🎉 TOKEN VALIDO!')
  console.log('   ✅ Lettura: OK su tutti i tipi')
  console.log('   ✅ Scrittura: OK su tutti i tipi')
  console.log('   ✅ Pronto per migrazione completa')

    // Test update reale su una categoria esistente
    try {
      const cat = await client.fetch("*[_type == 'categorie'][0]{_id, name, categoryIdMultilingua}");
      if (cat && cat._id) {
        const oldValue = cat.categoryIdMultilingua;
        const testValue = `test-update-${Math.random().toString(36).slice(2, 6)}`;
        await client.patch(cat._id).set({ categoryIdMultilingua: testValue }).commit();
        await client.patch(cat._id).set({ categoryIdMultilingua: oldValue }).commit();
        console.log(`\n✅ Test update su categoria esistente (${cat.name}) riuscito!`);
      } else {
        console.log("⚠️ Nessuna categoria trovata per test update.");
      }
    } catch (error) {
      console.error("❌ Test update su categoria esistente fallito:", (error instanceof Error ? error.message : String(error)) || error);
    }
}

testTokenPermissions()
  .then(() => {
    console.log('\n🏁 Test completato!')
    process.exit(0)
  })
  .catch(err => {
    console.error('\n💥 Errore durante test:', err)
    process.exit(1)
  })