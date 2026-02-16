/**
 * Debug Environment Variables
 * Verifica se le variabili di ambiente vengono lette correttamente
 */

console.log('🔍 Debug variabili ambiente...\n')

console.log('📂 Directory corrente:', process.cwd())
console.log('📄 NODE_ENV:', process.env.NODE_ENV || 'undefined')

console.log('\n🔑 Variabili Sanity:')
console.log('   SANITY_API_TOKEN:', process.env.SANITY_API_TOKEN ? 
  `${process.env.SANITY_API_TOKEN.substring(0, 20)}...` : 
  '❌ NON TROVATO')

console.log('   PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ NON TROVATO')
console.log('   DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ NON TROVATO')
console.log('   API_VERSION:', process.env.NEXT_PUBLIC_SANITY_API_VERSION || '❌ NON TROVATO')

console.log('\n📋 Tutte le variabili che iniziano con "SANITY":')
Object.keys(process.env)
  .filter(key => key.includes('SANITY'))
  .forEach(key => {
    const value = process.env[key]
    console.log(`   ${key}: ${value ? (value.length > 50 ? `${value.substring(0, 30)}...` : value) : '❌ VUOTO'}`)
  })

console.log('\n🏁 Debug completato!')