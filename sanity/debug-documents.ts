import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function debugDocuments() {
  console.log('🔍 Debug approfondito dei documenti...\n')

  type BlogDocument = {
    _id: string;
    _type: string;
    title?: string;
    language?: string;
    hasLanguageDefined?: boolean;
  };

  try {
    // Query semplificata per vedere cosa c'è nei primi documenti
    const sampleBlogs = await client.fetch(`*[_type == 'blog'] | order(_createdAt desc) [0...3] {
      _id,
      _type,
      title,
      language,
      "hasLanguageDefined": defined(language)
    }`);

    console.log(`📊 Esempi di documenti blog:\n`)
    sampleBlogs.forEach((doc: BlogDocument, index: number) => {
      console.log(`🔖 Documento ${index + 1}:`)
      console.log(`   ID: ${doc._id}`)
      console.log(`   Titolo: ${doc.title?.substring(0, 50)}...`)
      console.log(`   Language: ${JSON.stringify(doc.language)}`)
      console.log(`   Has language defined: ${doc.hasLanguageDefined}`)
      console.log('')
    })

    // Query per contare documenti per diversi stati del campo language
    const stats = await client.fetch(`{
      "total": count(*[_type == 'blog']),
      "withLanguageUndefined": count(*[_type == 'blog' && !defined(language)]),
      "withLanguageDefined": count(*[_type == 'blog' && defined(language)]),
      "withLanguageIt": count(*[_type == 'blog' && language == "it"]),
      "withLanguageEn": count(*[_type == 'blog' && language == "en"])
    }`)

    console.log('📊 Statistiche campo language:')
    console.log(`   Totali: ${stats.total}`)
    console.log(`   Language undefined: ${stats.withLanguageUndefined}`)
    console.log(`   Language defined: ${stats.withLanguageDefined}`)
    console.log(`   Language == "it": ${stats.withLanguageIt}`)
    console.log(`   Language == "en": ${stats.withLanguageEn}`)

    // Verifica su quale dataset stiamo operando
    console.log('\n🔧 Info configurazione:')
    const config = client.config()
    console.log(`   Dataset: ${config.dataset || 'Non specificato'}`)
    console.log(`   Project ID: ${config.projectId}`)

  } catch (error) {
    const err = error as any;
    console.error('❌ Errore durante il debug:', err.message || err)
    if (err.details?.query) {
      console.log('Query problematica:', err.details.query)
    }
  }

  console.log('\n🏁 Debug completato!')
}

debugDocuments().catch(console.error)