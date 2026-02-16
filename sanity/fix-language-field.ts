import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: 'development',
  apiVersion: '2024-11-27',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || undefined
})

interface BlogDoc {
  _id: string
  title?: string
}

async function fixLanguageField() {
  console.log('🔧 Fix diretto del campo language...\n')

  try {
    // Prendi tutti i documenti blog senza language
    const docsToUpdate = await client.fetch<BlogDoc[]>(`*[_type == 'blog' && (!defined(language) || language == null)] {
      _id,
      title
    }`)

    console.log(`📊 Trovati ${docsToUpdate.length} documenti da aggiornare\n`)

    if (docsToUpdate.length === 0) {
      console.log('✅ Tutti i documenti hanno già il campo language')
      return
    }

    // Aggiorna tutti i documenti in batch
    const transaction = client.transaction()
    
    docsToUpdate.forEach((doc: BlogDoc) => {
      console.log(`   🔄 Aggiornando: ${doc.title?.substring(0, 50)}...`)
      transaction.patch(doc._id, {
        set: {
          language: 'it'
        }
      })
    })

    console.log('\n💾 Eseguendo aggiornamento...')
    const result = await transaction.commit()
    console.log(`✅ Aggiornati ${docsToUpdate.length} documenti`)

    // Verifica
    const updated = await client.fetch<number>(`count(*[_type == 'blog' && language == "it"])`)
    console.log(`\n🎯 Verifica: ${updated} documenti ora hanno language="it"`)

  } catch (error) {
    console.error('❌ Errore durante fix:', error)
  }

  console.log('\n🏁 Fix completato!')
}

fixLanguageField().catch(console.error)