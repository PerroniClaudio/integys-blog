import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: 'development',
  apiVersion: '2024-11-27',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || undefined
})

async function inspectDocuments() {
  console.log('🔍 Ispezione campi dei documenti blog...\n')

  try {
    // Prendiamo alcuni documenti di esempio per vedere tutti i campi
    const sampleDocs = await client.fetch(`*[_type == 'blog'] | order(_createdAt desc) [0...5] {
      _id,
      title,
      language,
      limited,
      highlighted,
      date,
      "hasDate": defined(date),
      "hasLimited": defined(limited),
      "hasHighlighted": defined(highlighted),
      "hasLanguage": defined(language)
    }`)

    console.log('📊 Esempi di documenti:')
    interface BlogDocument {
      _id: string
      title: string
      language: string
      limited: boolean
      highlighted: boolean
      date: string
      hasDate: boolean
      hasLimited: boolean
      hasHighlighted: boolean
      hasLanguage: boolean
    }

    sampleDocs.forEach((doc: BlogDocument, i: number) => {
      console.log(`\n📝 Documento ${i + 1}:`)
      console.log(`   Titolo: ${doc.title?.substring(0, 50)}...`)
      console.log(`   Language: ${doc.language} (defined: ${doc.hasLanguage})`)
      console.log(`   Limited: ${doc.limited} (defined: ${doc.hasLimited})`)
      console.log(`   Highlighted: ${doc.highlighted} (defined: ${doc.hasHighlighted})`)
      console.log(`   Date: ${doc.date} (defined: ${doc.hasDate})`)
    })

    // Statistiche generali
    const stats = await client.fetch(`{
      "total": count(*[_type == 'blog']),
      "withLanguageIt": count(*[_type == 'blog' && language == "it"]),
      "withDate": count(*[_type == 'blog' && defined(date)]),
      "withValidDate": count(*[_type == 'blog' && date < now()]),
      "limitedFalse": count(*[_type == 'blog' && limited == false]),
      "limitedUndefined": count(*[_type == 'blog' && !defined(limited)]),
      "highlightedFalse": count(*[_type == 'blog' && highlighted == false]),
      "highlightedUndefined": count(*[_type == 'blog' && !defined(highlighted)])
    }`)

    console.log('\n📈 Statistiche generali:')
    console.log(`   Totali: ${stats.total}`)
    console.log(`   Con language="it": ${stats.withLanguageIt}`)
    console.log(`   Con campo date definito: ${stats.withDate}`)
    console.log(`   Con date < now(): ${stats.withValidDate}`)
    console.log(`   Con limited=false: ${stats.limitedFalse}`)
    console.log(`   Con limited undefined: ${stats.limitedUndefined}`)
    console.log(`   Con highlighted=false: ${stats.highlightedFalse}`)
    console.log(`   Con highlighted undefined: ${stats.highlightedUndefined}`)

    // Test della query completa attuale (quella che dovrebbe funzionare)
    console.log('\n🧪 Test query completa attuale:')
    const fullQuery = await client.fetch(`count(*[_type == 'blog' 
      && limited == false 
      && language == "it"
      && date < now()
      && highlighted != true])`)
    
    console.log(`   Risultato query completa: ${fullQuery} documenti`)

    if (fullQuery === 0) {
      console.log('\n❗ La query restituisce 0 - ora testo rimuovendo un filtro alla volta:')
      
      const testWithoutHighlighted = await client.fetch(`count(*[_type == 'blog' 
        && limited == false 
        && language == "it"
        && date < now()])`)
      console.log(`   Senza filtro highlighted: ${testWithoutHighlighted}`)
      
      const testWithoutDate = await client.fetch(`count(*[_type == 'blog' 
        && limited == false 
        && language == "it"])`)
      console.log(`   Senza filtro date: ${testWithoutDate}`)
      
      const testWithoutLimited = await client.fetch(`count(*[_type == 'blog' 
        && language == "it"
        && date < now()])`)
      console.log(`   Senza filtro limited: ${testWithoutLimited}`)
    }

  } catch (error) {
    console.error('❌ Errore durante ispezione:', error)
  }

  console.log('\n🏁 Ispezione completata!')
}

inspectDocuments().catch(console.error)