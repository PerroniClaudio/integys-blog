import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function testCurrentQueries() {
  console.log('🧪 Test delle query attuali del frontend...\n')

  try {
    // Test query italiana (come attualmente nel frontend)  
    console.log('🇮🇹 Query italiana (language == "it"):')
    const italianQuery = `*[_type == 'blog' 
      && limited == false 
      && language == "it"
      && date < now()
      && highlighted != true] 
    | order(order asc, date desc) {
      "id": _id,
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current}
    }[0...6]`

    const italianResults = await client.fetch(italianQuery)
    console.log(`   Trovati: ${italianResults.length} articoli`)
    italianResults.slice(0, 2).forEach((doc: { title: string; language: string }) => {
      console.log(`   - ${doc.title.substring(0, 50)}... (lang: ${doc.language})`)
    })

    // Test query inglese (dovrebbe essere vuota per ora)
    console.log('\n🇬🇧 Query inglese (language == "en"):')
    const englishQuery = `*[_type == 'blog' 
      && limited == false 
      && language == "en"
      && date < now()
      && highlighted != true] 
    | order(order asc, date desc) {
      "id": _id,
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current}
    }[0...6]`

    const englishResults = await client.fetch(englishQuery)
    console.log(`   Trovati: ${englishResults.length} articoli`)
    if (englishResults.length === 0) {
      console.log('   ⚠️  Nessun articolo in inglese - normale per ora')
    }

    // Test highlighted articles italiana
    console.log('\n⭐ Query highlighted italiana:')
    const highlightedQuery = `*[_type == 'blog' 
      && limited == false 
      && language == "it"
      && highlighted == true 
      && date < now()] 
    | order(order asc, date desc) {
      "id": _id,
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      language,
      categories[]->{name, "slug" : slug.current}
    }[0...10]`

    const highlightedResults = await client.fetch(highlightedQuery)
    console.log(`   Trovati: ${highlightedResults.length} articoli highlighted`)

  } catch (error) {
    console.error('❌ Errore nelle query:', error)
  }

  console.log('\n🏁 Test completato!')
}

testCurrentQueries().catch(console.error)