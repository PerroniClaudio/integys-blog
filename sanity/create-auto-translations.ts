/**
 * Script opzionale per creare traduzioni automatiche di test in inglese
 * ATTENZIONE: Crea traduzioni automatiche molto semplici, da rivedere manualmente
 * Eseguire con: pnpm sanity exec create-auto-translations.ts --non-interactive
 */

import {getCliClient} from 'sanity/cli'
import {v4 as uuidv4} from 'uuid'

const client = getCliClient()

// Dizionario di traduzioni semplici per contenuti comuni
const TRANSLATIONS: Record<string, string> = {
  // Categorie comuni
  'Tecnologia': 'Technology',
  'Innovazione': 'Innovation', 
  'Sviluppo': 'Development',
  'Web': 'Web',
  'Mobile': 'Mobile',
  'AI': 'AI',
  'Sicurezza': 'Security',
  'Data': 'Data',
  'Cloud': 'Cloud',
  'DevOps': 'DevOps',
  
  // Servizi comuni
  'Consulenza': 'Consulting',
  'Sviluppo Web': 'Web Development',
  'Sviluppo Mobile': 'Mobile Development',
  'Design': 'Design',
  'Marketing': 'Marketing', 
  'Supporto': 'Support',
  'Manutenzione': 'Maintenance',
  'Formazione': 'Training'
}

function translateText(italianText: string): string {
  // Prova traduzioni dirette dal dizionario
  if (TRANSLATIONS[italianText]) {
    return TRANSLATIONS[italianText]
  }
  
  // Traduzioni parziali per testi più lunghi
  let translated = italianText
  Object.entries(TRANSLATIONS).forEach(([it, en]) => {
    translated = translated.replace(new RegExp(it, 'gi'), en)
  })
  
  return translated
}

function translateSlug(italianSlug: string): string {
  return italianSlug
    .replace(/à/g, 'a')
    .replace(/è/g, 'e')
    .replace(/é/g, 'e')
    .replace(/ì/g, 'i')
    .replace(/ò/g, 'o')
    .replace(/ù/g, 'u')
    .replace(/ç/g, 'c')
    + '-en'
}

async function createAutoTranslations() {
  console.log('🌍 Creazione traduzioni automatiche in inglese...\n')

  // 1. Traduci Categorie
  console.log('📂 Processando categorie...')
  const categories = await client.fetch(`*[_type == "categorie" && language == "it"]`)
  
  for (const category of categories) {
    const englishCategory = {
      _type: 'categorie',
      _id: `${category._id}-en`,
      name: translateText(category.name),
      slug: {
        current: translateSlug(category.slug.current)
      },
      description: category.description ? translateText(category.description) : undefined,
      language: 'en',
      __i18n_lang: 'en',
      __i18n_refs: [{
        _type: 'reference',
        _ref: category._id,
        _key: uuidv4()
      }]
    }
    
    try {
      await client.createOrReplace(englishCategory)
      console.log(`   ✅ Tradotta categoria: ${category.name} → ${englishCategory.name}`)
    } catch (error) {
      console.error(`   ❌ Errore traduzione categoria ${category.name}:`, error)
    }
  }

  // 2. Traduci Servizi
  console.log('\n🛠️  Processando servizi...')
  const services = await client.fetch(`*[_type == "servizi" && language == "it"]`)
  
  for (const service of services) {
    const englishService = {
      _type: 'servizi',
      _id: `${service._id}-en`,
      title: translateText(service.title),
      slug: {
        current: translateSlug(service.slug.current)
      },
      titleImage: service.titleImage, // Mantieni la stessa immagine
      short: service.short ? translateText(service.short) : undefined,
      smallDescription: service.smallDescription, // Mantieni descrizione originale (da tradurre manualmente)
      body: service.body, // Mantieni body originale (da tradurre manualmente) 
      order: service.order,
      language: 'en',
      __i18n_lang: 'en',
      __i18n_refs: [{
        _type: 'reference',
        _ref: service._id,
        _key: uuidv4()
      }]
    }
    
    try {
      await client.createOrReplace(englishService)
      console.log(`   ✅ Tradotto servizio: ${service.title} → ${englishService.title}`)
    } catch (error) {
      console.error(`   ❌ Errore traduzione servizio ${service.title}:`, error)
    }
  }

  // 3. Crea alcuni blog post di esempio in inglese (solo titoli e descrizioni brevi)
  console.log('\n📝 Processando alcune traduzioni di esempio per blog...')
  const sampleBlogs = await client.fetch(`*[_type == "blog" && language == "it"] | order(_createdAt desc)[0...3]`)
  
  for (const blog of sampleBlogs) {
    const englishBlog = {
      _type: 'blog',
      _id: `${blog._id}-en`,
      title: translateText(blog.title),
      slug: {
        current: translateSlug(blog.slug.current)
      },
      titleImage: blog.titleImage, // Mantieni la stessa immagine
      highlighted: blog.highlighted,
      limited: blog.limited,
      order: blog.order,
      smallDescription: translateText(blog.smallDescription),
      body: [{ // Placeholder body in inglese
        _type: 'block',
        _key: uuidv4(),
        style: 'normal',
        children: [{
          _type: 'span',
          _key: uuidv4(),
          text: '[English translation needed] - This is a placeholder for the English version of this article. Please translate the content manually.',
          marks: []
        }]
      }],
      date: blog.date,
      categories: [], // Da collegare manualmente alle categorie tradotte
      language: 'en',
      __i18n_lang: 'en',
      __i18n_refs: [{
        _type: 'reference',
        _ref: blog._id,
        _key: uuidv4()
      }]
    }
    
    try {
      await client.createOrReplace(englishBlog)
      console.log(`   ✅ Creato template blog: ${blog.title} → ${englishBlog.title}`)
    } catch (error) {
      console.error(`   ❌ Errore creazione template blog ${blog.title}:`, error)
    }
  }

  console.log('\n🎉 Traduzioni automatiche completate!')
  console.log('📋 Prossimi passi:')
  console.log('   1. Apri Sanity Studio (pnpm dev)')
  console.log('   2. Rivedi e completa le traduzioni create automaticamente')
  console.log('   3. Collega le categorie ai post del blog tradotti')
  console.log('   4. Traduci manualmente descrizioni e contenuti completi')
  console.log('   5. Aggiungi contenuti originali in inglese')
}

// Aggiungi il modulo uuid se non presente
async function ensureUuidModule() {
  try {
    await import('uuid')
  } catch {
    console.log('📦 Installando dipendenza uuid...')
    const { execSync } = await import('child_process')
    execSync('pnpm add uuid @types/uuid', { stdio: 'inherit' })
  }
}

// Esegui traduzioni
ensureUuidModule()
  .then(() => createAutoTranslations())
  .then(() => {
    console.log('\n🏁 Processo completato!')
    process.exit(0)
  })
  .catch(err => {
    console.error('💥 Errore durante la creazione traduzioni:', err)
    process.exit(1)
  })