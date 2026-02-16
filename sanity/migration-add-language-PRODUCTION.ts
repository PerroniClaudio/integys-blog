/**
 * VERSIONE PRODUZIONE - Script di migrazione per produzione
 * ATTENZIONE: Usa questo script SOLO per produzione
 * Eseguire con: pnpm sanity exec migration-add-language-PRODUCTION.ts --non-interactive
 */

import {createClient} from '@sanity/client'

// Tipi di documenti che supportano multilingua
const DOCUMENT_TYPES = ['blog', 'categorie', 'servizi']

// ⚠️  ATTENZIONE: Client configurato per PRODUZIONE!
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: 'production',
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
  
  // Controlla che stiamo operando sul dataset production
  const config = client.config()
  console.log(`📊 Dataset configurato: ${config.dataset}`)
  
  if (config.dataset !== 'production') {
    console.error('❌ ERRORE: Dataset non è production! Uscita per sicurezza.')
    process.exit(1)
  }
  
  console.log('⚠️  ATTENZIONE: operazioni su dataset PRODUCTION')
  console.log('🔴 Questo script modificherà il database di PRODUZIONE!\n')
  
  // Pausa di sicurezza di 5 secondi
  console.log('⏱️  Pausa di sicurezza 5 secondi... CTRL+C per annullare!')
  await new Promise(resolve => setTimeout(resolve, 5000))
  console.log('✅ Procedendo con migrazione production...\n')
}

async function addLanguageField() {
  console.log('🌍 Avvio migrazione per supporto multilingua su PRODUCTION...\n')

  // Test di connessione e verifica dataset
  try {
    const testQuery = `count(*[_type == "blog"])`
    const blogCount = await client.fetch(testQuery)
    console.log(`🔗 Connessione OK. Trovati ${blogCount} blog nel dataset production\n`)
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

    // Processa in batch di 100 per sicurezza
    const batchSize = 100
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)
      
      console.log(`   🔄 Processando batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(documents.length/batchSize)} (${batch.length} documenti)`)
      
      const transaction = client.transaction()

      batch.forEach(doc => {
        console.log(`   📝 Aggiornando: ${doc._id}`)
        
        transaction.patch(doc._id, {
          set: {
            language: 'it' // Tutti i contenuti esistenti sono in italiano
          }
        })
      })

      try {
        await transaction.commit()
        console.log(`   ✅ Batch completato (${batch.length} documenti)`)
      } catch (error) {
        console.error(`   ❌ Errore durante l'aggiornamento del batch:`, error)
        process.exit(1) // Ferma tutto se c'è un errore
      }
    }
    
    console.log(`✅ Completato aggiornamento ${documents.length} documenti di tipo ${docType}\n`)
  }

  console.log('🎉 Migrazione produzione completata!')
  console.log('📋 Tutti i documenti esistenti ora hanno language: "it"')
}

async function verifyMigration() {
  console.log('\n🔍 Verificando migrazione su production...')
  
  for (const docType of DOCUMENT_TYPES) {
    const totalDocs = await client.fetch(`count(*[_type == "${docType}"])`)
    const docsWithLanguage = await client.fetch(`count(*[_type == "${docType}" && defined(language)])`)
    const docsWithoutLanguage = await client.fetch(`count(*[_type == "${docType}" && !defined(language)])`)
    
    console.log(`📊 ${docType} (production):`)
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

// Esegui migrazione con extra sicurezza per production
verifyDataset()
  .then(() => addLanguageField())
  .then(() => verifyMigration())
  .then(() => {
    console.log('🏁 Processo production completato!')
    process.exit(0)
  })
  .catch(err => {
    console.error('💥 ERRORE CRITICO su production:', err)
    process.exit(1)
  })