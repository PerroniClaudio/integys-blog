import { createClient } from "next-sanity";

// Usa esattamente la stessa configurazione del frontend
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-27',
  // Note: Il frontend NON ha access al SANITY_API_TOKEN (non ha NEXT_PUBLIC_)
});

async function testFrontendQueries() {
  console.log('🧪 Test delle query del frontend (SENZA token)...\n')

  try {
    console.log('🔧 Configurazione client frontend:')
    const config = client.config()
    console.log(`   Project ID: ${config.projectId}`)
    console.log(`   Dataset: ${config.dataset}`)
    console.log(`   API Version: ${config.apiVersion}`)
    console.log(`   Token: ${config.token ? 'Present' : 'NOT SET (normale per frontend)'}`)
    console.log('')

    // Test 1: Query base senza filtri (come homepage iniziale)
    console.log('📖 Test 1 - Query base senza filtri lingua:')
    try {
      const basicQuery = `*[_type == 'blog' 
        && limited == false 
        && date < now()
        && highlighted != true] 
      | order(order asc, date desc) [0...6] {
        "id": _id,
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        categories[]->{name, "slug" : slug.current}
      }`
      
      const basicResult = await client.fetch(basicQuery)
      console.log(`   ✅ SUCCESS: ${basicResult.length} documenti trovati`)
      if (basicResult.length > 0) {
        console.log(`   Primo risultato: ${basicResult[0].title?.substring(0, 40)}...`)
      }
    } catch (error) {
      const err = error as any;
      console.log(`   ❌ FAILED: ${err.message || err}`)
      console.log(`   Status: ${err.statusCode || 'N/A'}`)
    }

    console.log('')

    // Test 2: Query con filtro lingua (quella che causa 403)
    console.log('📖 Test 2 - Query CON filtro lingua:')
    try {
      const languageQuery = `*[_type == 'blog' 
        && limited == false 
        && language == "it"
        && date < now()
        && highlighted != true] 
      | order(order asc, date desc) [0...6] {
        "id": _id,
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        language,
        categories[]->{name, "slug" : slug.current}
      }`
      
      const languageResult = await client.fetch(languageQuery)
      console.log(`   ✅ SUCCESS: ${languageResult.length} documenti trovati`)
      if (languageResult.length > 0) {
        console.log(`   Primo risultato: ${languageResult[0].title?.substring(0, 40)}... (${languageResult[0].language})`)
      }
    } catch (error) {
      const err = error as any;
      console.log(`   ❌ FAILED: ${err.message || err}`)
      console.log(`   Status: ${err.statusCode || 'N/A'}`)
      if (err.statusCode === 403) {
        console.log('   🔍 PROBLEMA IDENTIFICATO: Il frontend non ha permessi per leggere il campo "language"')
      }
    }

    console.log('')

    // Test 3: Test accesso al campo language
    console.log('📖 Test 3 - Solo accesso campo language:')
    try {
      const fieldTest = await client.fetch(`*[_type == 'blog'][0] { language }`)
      console.log(`   ✅ SUCCESS: Campo language accessibile`)
      console.log(`   Valore: ${fieldTest.language}`)
    } catch (error) {
      const err = error as any;
      console.log(`   ❌ FAILED: ${err.message || err}`)
      if (err.statusCode === 403) {
        console.log('   🔍 Il campo "language" richiede autenticazione!')
      }
    }

  } catch (error) {
    const err = error as Error;
    console.error('💥 Errore generale:', err.message || err)
  }

  console.log('\n🏁 Test frontend completato!')
}

testFrontendQueries().catch(console.error)