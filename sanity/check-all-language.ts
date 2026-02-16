import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'development',
  apiVersion: '2024-11-27',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || undefined
})

async function checkAllLanguageFields() {
  console.log('🔍 Controllo completo campo language su tutti i documenti...\n')

  try {
    // Statistiche generali
    const stats = await client.fetch(`{
      "totalBlogs": count(*[_type == 'blog']),
      "withLanguage": count(*[_type == 'blog' && defined(language)]),
      "withLanguageIt": count(*[_type == 'blog' && language == "it"]),
      "withLanguageEn": count(*[_type == 'blog' && language == "en"]),
      "withLanguageNull": count(*[_type == 'blog' && language == null]),
      "withoutLanguage": count(*[_type == 'blog' && !defined(language)])
    }`)

    console.log('📊 STATISTICHE COMPLETE:')
    console.log(`   📝 Documenti blog totali: ${stats.totalBlogs}`)
    console.log(`   ✅ Con campo language definito: ${stats.withLanguage}`)
    console.log(`   🇮🇹 Language = "it": ${stats.withLanguageIt}`)
    console.log(`   🇬🇧 Language = "en": ${stats.withLanguageEn}`)
    console.log(`   ❌ Language = null: ${stats.withLanguageNull}`)
    console.log(`   ⚠️  Senza campo language: ${stats.withoutLanguage}\n`)

    // Se ci sono documenti senza language, mostriamo alcuni esempi
    if (stats.withoutLanguage > 0) {
      console.log('⚠️  Documenti senza campo language:')
      const missingLanguage = await client.fetch(`*[_type == 'blog' && !defined(language)] [0...5] {
        _id,
        title,
        _createdAt
      }`)

      missingLanguage.forEach((doc: any, i: number) => {
        console.log(`   ${i + 1}. ${doc.title.substring(0, 50)}... (${doc._id})`)
      })
      console.log('')
    }

    // Se ci sono documenti con language null, mostriamo esempi
    if (stats.withLanguageNull > 0) {
      console.log('❌ Documenti con language = null:')
      const nullLanguage = await client.fetch(`*[_type == 'blog' && language == null] [0...5] {
        _id,
        title,
        language
      }`)

      nullLanguage.forEach((doc: any, i: number) => {
        console.log(`   ${i + 1}. ${doc.title.substring(0, 50)}... (lang: ${doc.language})`)
      })
      console.log('')
    }

    // Esempi di documenti corretti
    if (stats.withLanguageIt > 0) {
      console.log('✅ Esempi documenti con language="it":')
      const goodDocs = await client.fetch(`*[_type == 'blog' && language == "it"] | order(_createdAt desc) [0...3] {
        _id,
        title,
        language
      }`)

      goodDocs.forEach((doc: any, i: number) => {
        console.log(`   ${i + 1}. ${doc.title.substring(0, 50)}... (lang: ${doc.language})`)
      })
    }

    // Risultato finale
    console.log('\n🎯 RISULTATO:')
    if (stats.withoutLanguage === 0 && stats.withLanguageNull === 0) {
      console.log('🎉 PERFETTO! Tutti i documenti hanno il campo language correttamente impostato')
      console.log(`✅ ${stats.withLanguageIt} documenti pronti con language="it"`)
    } else {
      console.log('❌ PROBLEMA! Alcuni documenti non hanno il campo language impostato')
      console.log(`   📊 Mancanti: ${stats.withoutLanguage + stats.withLanguageNull} su ${stats.totalBlogs}`)
    }

  } catch (error) {
    console.error('❌ Errore durante controllo:', error)
  }

  console.log('\n🏁 Controllo completato!')
}

checkAllLanguageFields().catch(console.error)