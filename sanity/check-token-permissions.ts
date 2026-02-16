import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function checkTokenPermissions() {
  console.log('🔐 Verifica permessi token Sanity...\n')

  try {
    // Test 1: Lettura documenti (dovrebbe sempre funzionare)
    console.log('📖 Test lettura documenti...')
    const readTest = await client.fetch(`count(*[_type == 'blog'])`)
    console.log(`   ✅ Lettura: OK - Trovati ${readTest} documenti\n`)

    // Test 2: Creazione documento di test
    console.log('🆕 Test creazione documento...')
    try {
      const createTest = await client.create({
        _type: 'blog',
        title: 'TEST PERMESSI - DA CANCELLARE',
        language: 'it',
        date: new Date().toISOString(),
        limited: false,
        highlighted: false
      })
      console.log(`   ✅ Creazione: OK - Documento creato: ${createTest._id}`)
      
      // Test 3: Modifica documento di test
      console.log('📝 Test modifica documento...')
      const updateTest = await client.patch(createTest._id).set({
        title: 'TEST PERMESSI - MODIFICATO'
      }).commit()
      console.log(`   ✅ Modifica: OK - Documento aggiornato`)

      // Test 4: Cancellazione documento di test
      console.log('🗑️  Test cancellazione documento...')
      await client.delete(createTest._id)
      console.log(`   ✅ Cancellazione: OK - Documento rimosso\n`)

      console.log('🎉 TUTTI I PERMESSI DISPONIBILI!')
      console.log('   ✅ Lettura: OK')
      console.log('   ✅ Creazione: OK')
      console.log('   ✅ Modifica: OK')
      console.log('   ✅ Cancellazione: OK')

    } catch (createError) {
      const error = createError as Error;
      console.log(`   ❌ Creazione: FALLITA`)
      console.log(`   Errore: ${error.message || error}`)
      
      if (error.message?.includes('Insufficient permissions')) {
        console.log('\n⚠️  Il token ha solo permessi di LETTURA')
        console.log('💡 Per la migrazione servono permessi di SCRITTURA (Editor/Admin)')
      }
    }

    // Test 5: Info sul dataset e progetto
    console.log('\n📊 Info configurazione:')
    const config = client.config()
    console.log(`   Project ID: ${config.projectId}`)
    console.log(`   Dataset: ${config.dataset}`)
    console.log(`   API Version: ${config.apiVersion}`)

  } catch (error) {
    const err = error as Error;
    console.error('❌ Errore durante verifica permessi:', err.message || err)
  }

  console.log('\n🏁 Verifica permessi completata!')
}

checkTokenPermissions().catch(console.error)