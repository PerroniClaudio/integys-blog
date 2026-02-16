import {createClient} from '@sanity/client'

// Forzare l'uso del dataset development
const developmentClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: 'development',
  apiVersion: '2022-06-06',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

// Anche client per production per confronto
const productionClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2022-06-06',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

async function compareDatasets() {
  console.log('🔍 Confronto dataset production vs development...\n')

  type BlogDocument = {
    _id: string;
    title?: string;
    language?: string;
    hasLanguageDefined?: boolean;
  };

  try {
    // Stats development
    const devStats = await developmentClient.fetch(`{
      "total": count(*[_type == 'blog']),
      "withLanguageUndefined": count(*[_type == 'blog' && !defined(language)]),
      "withLanguageDefined": count(*[_type == 'blog' && defined(language)]),
      "withLanguageIt": count(*[_type == 'blog' && language == "it"])
    }`)

    // Stats production
    const prodStats = await productionClient.fetch(`{
      "total": count(*[_type == 'blog']),
      "withLanguageUndefined": count(*[_type == 'blog' && !defined(language)]),
      "withLanguageDefined": count(*[_type == 'blog' && defined(language)]),
      "withLanguageIt": count(*[_type == 'blog' && language == "it"])
    }`)

    console.log('📊 DEVELOPMENT dataset:')
    console.log(`   Totali: ${devStats.total}`)
    console.log(`   Language undefined: ${devStats.withLanguageUndefined}`)
    console.log(`   Language defined: ${devStats.withLanguageDefined}`)
    console.log(`   Language == "it": ${devStats.withLanguageIt}`)

    console.log('\n📊 PRODUCTION dataset:')
    console.log(`   Totali: ${prodStats.total}`)
    console.log(`   Language undefined: ${prodStats.withLanguageUndefined}`)
    console.log(`   Language defined: ${prodStats.withLanguageDefined}`)
    console.log(`   Language == "it": ${prodStats.withLanguageIt}`)

    // Esempi da development
    const devSample = await developmentClient.fetch(`*[_type == 'blog'] | order(_createdAt desc) [0...2] {
      _id,
      title,
      language,
      "hasLanguageDefined": defined(language)
    }`)

    console.log('\n📝 Esempi da DEVELOPMENT:')
    devSample.forEach((doc: BlogDocument, index: number) => {
      console.log(`   ${index + 1}. ${doc.title?.substring(0, 40)}... (lang: ${doc.language || 'NULL'})`)
    })

    console.log('\n🎯 CONCLUSIONE:')
    if (devStats.withLanguageDefined > 0) {
      console.log('✅ La migrazione su DEVELOPMENT è avvenuta con successo!')
      console.log('✅ L\'applicazione frontend usa DEVELOPMENT dataset - tutto a posto!')
    } else {
      console.log('❌ Problema: anche DEVELOPMENT non ha i campi language!')
    }

    if (prodStats.withLanguageUndefined === prodStats.total) {
      console.log('⚠️  PRODUCTION non è stato migrato (normale se usiamo only development)')
    }

  } catch (error) {
    const err = error as Error;
    console.error('❌ Errore durante il confronto:', err.message || err)
  }

  console.log('\n🏁 Confronto completato!')
}

compareDatasets().catch(console.error)