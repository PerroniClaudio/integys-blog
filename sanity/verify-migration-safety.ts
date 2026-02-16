/**
 * Script di verifica SOLO LETTURA - non modifica nulla
 * Eseguire con: pnpm sanity exec verify-migration-safety.ts --non-interactive
 */

import {createClient} from '@sanity/client'

// Client in SOLA LETTURA (senza token)
const readOnlyClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'development',
  apiVersion: '2022-06-06',
  useCdn: false
  // volutamente SENZA token = solo lettura
})

async function verifyMigrationSafety() {
  console.log('🔍 VERIFICA SICUREZZA MIGRAZIONE (solo lettura)\n')
  
  try {
    console.log('📊 Stato attuale dataset development:')
    
    const blogCount = await readOnlyClient.fetch(`count(*[_type == "blog"])`)
    const categoriesCount = await readOnlyClient.fetch(`count(*[_type == "categorie"])`)
    const servicesCount = await readOnlyClient.fetch(`count(*[_type == "servizi"])`)
    
    console.log(`   - Blog: ${blogCount} documenti`)
    console.log(`   - Categorie: ${categoriesCount} documenti`)
    console.log(`   - Servizi: ${servicesCount} documenti`)
    
    const blogWithLanguage = await readOnlyClient.fetch(`count(*[_type == "blog" && defined(language)])`)
    const categoriesWithLanguage = await readOnlyClient.fetch(`count(*[_type == "categorie" && defined(language)])`)
    const servicesWithLanguage = await readOnlyClient.fetch(`count(*[_type == "servizi" && defined(language)])`)
    
    console.log('\n🏷️  Documenti con campo language:')
    console.log(`   - Blog: ${blogWithLanguage}/${blogCount}`)
    console.log(`   - Categorie: ${categoriesWithLanguage}/${categoriesCount}`)
    console.log(`   - Servizi: ${servicesWithLanguage}/${servicesCount}`)
    
    if (blogWithLanguage === 0 && categoriesWithLanguage === 0 && servicesWithLanguage === 0) {
      console.log('\n✅ MIGRAZIONE NECESSARIA: Nessun documento ha il campo language')
      console.log('📝 La migrazione aggiungerà language: "it" a tutti i documenti esistenti')
    } else if (blogWithLanguage === blogCount && categoriesWithLanguage === categoriesCount && servicesWithLanguage === servicesCount) {
      console.log('\n🎉 MIGRAZIONE GIÀ COMPLETATA: Tutti i documenti hanno il campo language')
    } else {
      console.log('\n⚠️  MIGRAZIONE PARZIALE: Solo alcuni documenti hanno il campo language')
      console.log('📝 La migrazione completerà i documenti mancanti')
    }
    
    console.log('\n🔒 Questa verifica è stata eseguita in SOLA LETTURA')
    console.log('   Non è stato modificato nulla nel database')
    
  } catch (error) {
    console.error('❌ Errore durante la verifica:', error)
  }
}

// Esegui verifica
verifyMigrationSafety()
  .then(() => {
    console.log('\n🏁 Verifica completata!')
    process.exit(0)
  })
  .catch(err => {
    console.error('💥 Errore durante la verifica:', err)
    process.exit(1)
  })