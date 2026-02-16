# 🚀 Comandi Rapidi per Migrazione Database

## ⚡ **Versione Semplificata** (Usa script npm)

```bash
cd sanity

# 1️⃣ Installa dipendenze per migrazione (se necessario)
pnpm install

# 2️⃣ Migrazione completa automatica
pnpm run migrate:full
```

☝️ **Questo comando fa tutto**: export produzione → import sviluppo → aggiungi campi lingua

## 🛠️ **Comandi Individuali** (Per controllo granulare)

```bash
cd sanity

# Export dal dataset di produzione
pnpm run export:prod

# Import nel dataset di sviluppo  
pnpm run import:dev

# Aggiungi campo language ai documenti esistenti
pnpm run migrate:add-language

# Crea traduzioni automatiche di esempio (opzionale)
pnpm run migrate:create-translations
```

## 🎯 **Workflow Raccomandato**

### 1. Migrazione Base:
```bash
cd sanity
pnpm run migrate:full
pnpm dev  # Verifica che funzioni tutto
```

### 2. Traduzioni di Test (Opzionale):
```bash
pnpm run migrate:create-translations
```

### 3. Test Frontend:
```bash
cd ..  # Torna alla root del progetto
pnpm dev  # Testa il sito multilingua
```

## ✅ **Verifica Successo**

Dopo `pnpm run migrate:full` dovresti vedere:
- ✅ "Migrazione completata!"  
- ✅ "Tutti i documenti [tipo] hanno il campo language"
- ✅ Nessun errore nel log

Il tuo database di sviluppo sarà una copia esatta della produzione + supporto i18n! 🎉