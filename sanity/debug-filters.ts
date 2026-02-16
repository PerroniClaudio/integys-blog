import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function debugFilters() {
  console.log('🔍 Debug dei filtri uno per uno...\n')

  type BlogQueryResult = {
    id: string;
    title: string;
    limited: boolean;
    highlighted: boolean;
    language?: string;
    currentSlug?: string;
  };

  try {
    // Test 1: Solo tipo e lingua
    console.log('🧪 Test 1 - Solo _type e language:')
    const test1 = await client.fetch(`count(*[_type == 'blog' && language == "it"])`)
    console.log(`   Risultato: ${test1} documenti\n`)

    // Test 2: Aggiungo filtro date
    console.log('🧪 Test 2 - Con filtro date:')
    const test2 = await client.fetch(`count(*[_type == 'blog' && language == "it" && date < now()])`)
    console.log(`   Risultato: ${test2} documenti\n`)

    // Test 3: Aggiungo filtro limited
    console.log('🧪 Test 3 - Con limited == false:')
    const test3 = await client.fetch(`count(*[_type == 'blog' && language == "it" && date < now() && limited == false])`)
    console.log(`   Risultato: ${test3} documenti\n`)

    // Test 4: Controllo valori del campo limited
    console.log('🧪 Test 4 - Valori campo limited:')
    const limitedStats = await client.fetch(`{
      "limitedTrue": count(*[_type == 'blog' && limited == true]),
      "limitedFalse": count(*[_type == 'blog' && limited == false]),
      "limitedUndefined": count(*[_type == 'blog' && !defined(limited)])
    }`)
    console.log(`   Limited true: ${limitedStats.limitedTrue}`)
    console.log(`   Limited false: ${limitedStats.limitedFalse}`)
    console.log(`   Limited undefined: ${limitedStats.limitedUndefined}\n`)

    // Test 5: Controllo valori campo highlighted
    console.log('🧪 Test 5 - Valori campo highlighted:')
    const highlightedStats = await client.fetch(`{
      "highlightedTrue": count(*[_type == 'blog' && highlighted == true]),
      "highlightedFalse": count(*[_type == 'blog' && highlighted == false]),
      "highlightedUndefined": count(*[_type == 'blog' && !defined(highlighted)])
    }`)
    console.log(`   Highlighted true: ${highlightedStats.highlightedTrue}`)
    console.log(`   Highlighted false: ${highlightedStats.highlightedFalse}`)
    console.log(`   Highlighted undefined: ${highlightedStats.highlightedUndefined}\n`)

    // Test 6: Query corretta senza filtri problematici
    console.log('🧪 Test 6 - Query semplificata:')
    const simpleQuery = await client.fetch(`*[_type == 'blog' 
      && language == "it" 
      && date < now()] 
    | order(order asc, date desc) [0...3] {
      "id": _id,
      title,
      limited,
      highlighted,
      language,
      "currentSlug": slug.current
    }`)
    
    console.log(`   Risultato: ${simpleQuery.length} documenti`)
    simpleQuery.forEach((doc: BlogQueryResult) => {
      console.log(`   - ${doc.title.substring(0, 40)}... (limited: ${doc.limited}, highlighted: ${doc.highlighted})`)
    })

  } catch (error) {
    const err = error as Error;
    console.error('❌ Errore durante debug:', err.message || err)
  }

  console.log('\n🏁 Debug completato!')  
}

debugFilters().catch(console.error)