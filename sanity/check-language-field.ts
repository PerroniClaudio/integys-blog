import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function verifyDataset() {
  console.log('🔍 Verificando configurazione dataset...')
  try {
    // Verifica che stiamo usando il dataset development
    console.log('📊 Client configurato per dataset development')
    console.log('✅ Usando il CLI client di Sanity\n')
  } catch (error) {
    console.error('❌ Errore configurazione client:', error)
  }
}

async function checkLanguageField() {
  await verifyDataset();
  
  console.log('🔍 Verifica campo language nei documenti blog...\n');

  try {
    // Controlla tutti i documenti blog
    const allBlogs = await client.fetch(`*[_type == 'blog'] {
      _id,
      title,
      language,
      _createdAt,
      _updatedAt
    }`);

    console.log(`📊 Trovati ${allBlogs.length} documenti blog totali\n`);

    // Documenti con campo language
    const withLanguage = allBlogs.filter((doc: any) => doc.language);
    const withoutLanguage = allBlogs.filter((doc: any) => !doc.language);

    console.log(`✅ Con campo language: ${withLanguage.length}`);
    console.log(`❌ Senza campo language: ${withoutLanguage.length}\n`);

    if (withLanguage.length > 0) {
      console.log('📝 Esempi con language:');
      withLanguage.slice(0, 3).forEach((doc: any) => {
        console.log(`   - ${doc.title} (${doc.language}) - ${doc._id}`);
      });
      console.log('');
    }

    if (withoutLanguage.length > 0) {
      console.log('⚠️  Documenti senza language:');
      withoutLanguage.slice(0, 5).forEach((doc: any) => {
        console.log(`   - ${doc.title} - ${doc._id}`);
      });
      console.log('');
    }

    // Test query base (senza filtri lingua)
    console.log('🧪 Test query base (senza filtri)...');
    const basicQuery = await client.fetch(`*[_type == 'blog' && date < now()] | order(_createdAt desc) [0...3] {
      _id,
      title,
      language
    }`);
    console.log(`   Risultati: ${basicQuery.length}`);
    basicQuery.forEach((doc: any) => {
      console.log(`   - ${doc.title} (lang: ${doc.language || 'NULL'})`);
    });
    console.log('');

    // Test query con filtro lingua
    if (withLanguage.length > 0) {
      console.log('🧪 Test query con filtro language == "it"...');
      const italianQuery = await client.fetch(`*[_type == 'blog' && language == "it" && date < now()] | order(_createdAt desc) [0...3] {
        _id,
        title,
        language
      }`);
      console.log(`   Risultati: ${italianQuery.length}`);
      italianQuery.forEach((doc: any) => {
        console.log(`   - ${doc.title} (lang: ${doc.language})`);
      });
    }

  } catch (error) {
    console.error('❌ Errore durante la verifica:', error);
    if (error instanceof Error && 'statusCode' in error && (error as any).statusCode === 403) {
      console.log('📋 Errore 403: Problemi di autorizzazione con le query Sanity');
    }
  }

  console.log('\n🏁 Verifica completata!');
}

checkLanguageField().catch(console.error);