/**
 * Script di migrazione per aggiungere supporto multilingua ai documenti esistenti
 * Eseguire con: pnpm sanity exec migration-add-language.ts --non-interactive
 */

import {getCliClient} from 'sanity/cli'
import {createClient} from '@sanity/client'

// Tipi di documenti che supportano multilingua
const DOCUMENT_TYPES = ['blog', 'categorie', 'servizi']

// Crea client esplicito per dataset development  
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: 'development',
  apiVersion: '2022-06-06',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || undefined
})

interface SanityDocument {
  _id: string
  _type: string
  _rev: string
  language?: string
}

async function verifyDataset() {
  console.log('🔍 Verificando configurazione dataset...')
  
  // Controlla che stiamo operando sul dataset development
  const config = client.config()
  console.log(`📊 Dataset configurato: ${config.dataset}`)
  
  if (config.dataset !== 'development') {
    console.error('❌ ERRORE: Dataset non è development! Uscita per sicurezza.')
    process.exit(1)
  }
  
  console.log('✅ Confermato: operazioni solo su dataset development\n')
}

async function addLanguageField() {
  console.log('🌍 Avvio migrazione per supporto multilingua...\n')

  // Test di connessione e verifica dataset
  try {
    const testQuery = `count(*[_type == "blog"])`
    const blogCount = await client.fetch(testQuery)
    console.log(`🔗 Connessione OK. Trovati ${blogCount} blog nel dataset development\n`)
  } catch (error) {
    console.error('❌ Errore di connessione al dataset:', error)
    process.exit(1)
  }

  for (const docType of DOCUMENT_TYPES) {
    console.log(`🔄 Processando documenti di tipo: ${docType}`)
    
    // Trova tutti i documenti del tipo corrente che non hanno il campo language
    const query = `*[_type == "${docType}" && !defined(language)]`
    const documents: SanityDocument[] = await client.fetch(query)
    
    console.log(`📊 Trovati ${documents.length} documenti da aggiornare`)

    if (documents.length === 0) {
      console.log(`✅ Nessun documento da aggiornare per ${docType}\n`)
      continue
    }

    // Crea transazione per aggiornare tutti i documenti
    const transaction = client.transaction()

    documents.forEach(doc => {
      console.log(`   📝 Aggiornando: ${doc._id}`)
      
      transaction.patch(doc._id, {
        set: {
          language: 'it' // Tutti i contenuti esistenti sono in italiano
        }
      })
    })

    try {
      await transaction.commit()
      console.log(`✅ Aggiornati ${documents.length} documenti di tipo ${docType}`)
    } catch (error) {
      console.error(`❌ Errore durante l'aggiornamento di ${docType}:`, error)
    }
    
    console.log('')
  }

  console.log('🎉 Migrazione completata!')
  console.log('📋 Riepilogo:')
  console.log('   - Tutti i documenti esistenti ora hanno language: "it"')
  console.log('   - Puoi ora creare traduzioni in inglese tramite Sanity Studio')
  console.log('   - I plugin di internazionalizzazione sono attivi')
}

async function verifyMigration() {
  console.log('\n🔍 Verificando migrazione...')
  
  for (const docType of DOCUMENT_TYPES) {
    const totalDocs = await client.fetch(`count(*[_type == "${docType}"])`)
    const docsWithLanguage = await client.fetch(`count(*[_type == "${docType}" && defined(language)])`)
    const docsWithoutLanguage = await client.fetch(`count(*[_type == "${docType}" && !defined(language)])`)
    
    console.log(`📊 ${docType}:`)
    console.log(`   - Totali: ${totalDocs}`)
    console.log(`   - Con language: ${docsWithLanguage}`)
    console.log(`   - Senza language: ${docsWithoutLanguage}`)
    
    if (docsWithoutLanguage > 0) {
      console.log(`⚠️  Attenzione: ${docsWithoutLanguage} documenti ancora senza campo language`)
    } else {
      console.log(`✅ Tutti i documenti ${docType} hanno il campo language`)
    }
    console.log('')
  }
}

// Esegui migrazione
verifyDataset()
  .then(() => addLanguageField())
  .then(() => verifyMigration())
  .then(() => {
    console.log('🏁 Processo completato!')
    process.exit(0)
  })
  .catch(err => {
    console.error('💥 Errore durante la migrazione:', err)
    process.exit(1)
  })