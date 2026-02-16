# 🗃️ Migrazione Database Sanity: Produzione → Sviluppo

## 🚨 **ATTENZIONE**: Backup di Sicurezza
Prima di iniziare, assicurati di avere un backup del dataset di sviluppo se contiene dati importanti.

## 📋 **Procedura Completa**

### 1️⃣ **Export e Import Database**

**Opzione A - Linux/Mac/WSL:**
```bash
chmod +x migrate-db.sh
./migrate-db.sh
```

**Opzione B - Windows:**
```cmd
migrate-db.bat
```

**Opzione C - Manuale:**
```bash
cd sanity

# Export produzione
pnpm sanity dataset export production production-backup.ndjson

# Pulisci sviluppo (⚠️ CANCELLA TUTTO!)
pnpm sanity dataset delete development --force

# Ricrea dataset sviluppo
pnpm sanity dataset create development

# Import in sviluppo
pnpm sanity dataset import production-backup.ndjson development --replace
```

### 2️⃣ **Aggiornamento Schema per i18n** ⭐ **OBBLIGATORIO**

```bash
cd sanity
pnpm sanity exec migration-add-language.ts --non-interactive
```

Questo script:
- ✅ Aggiunge `language: 'it'` a tutti i documenti esistenti
- ✅ Prepara i documenti per il sistema multilingua
- ✅ Verifica che la migrazione sia completata correttamente

### 3️⃣ **Traduzioni Automatiche** (Opzionale)

Per creare traduzioni automatiche di test in inglese:

```bash
cd sanity
pnpm add uuid @types/uuid  # Se non già installato
pnpm sanity exec create-auto-translations.ts --non-interactive
```

Questo script crea:
- 🌍 Traduzioni automatiche di categorie e servizi 
- 📝 Template di blog post in inglese (da completare manualmente)
- 🔗 Collegamenti tra versioni italiane e inglesi

### 4️⃣ **Verifica e Completamento**

1. **Avvia Sanity Studio:**
   ```bash
   cd sanity
   pnpm dev
   ```

2. **Verifica lo Studio:**
   - ✅ Filtro lingua attivo nel menu
   - ✅ Plugin internazionalizzazione funzionante  
   - ✅ Documenti con flag lingua italiana

3. **Crea contenuti di test:**
   - Crea una nuova categoria in inglese
   - Crea un servizio in inglese
   - Traduci manualmente alcuni contenuti

### 5️⃣ **Test Frontend**

```bash
# Nel progetto principale
pnpm dev
```

Verifica:
- 🌐 http://localhost:3000 (italiano)
- 🌐 http://localhost:3000/en (inglese)
- 🔄 Cambio lingua funzionante

## 📊 **Cosa Aspettarsi**

### Dopo Export/Import:
- 📦 Tutti i contenuti di produzione in sviluppo
- 📝 Documenti identici a produzione

### Dopo Migrazione i18n:
- 🏷️ Tutti i documenti hanno `language: 'it'`
- 🔌 Plugin internazionalizzazione attivi
- 📋 Studio pronto per traduzioni

### Dopo Traduzioni Auto:
- 🇮🇹➡️🇬🇧 Categorie e servizi tradotti automaticamente
- 📑 Template blog in inglese da completare
- 🔗 Collegamenti tra versioni linguistiche

## ⚠️ **Note Importanti**

1. **Dataset Environment**: I comandi usano il dataset `development` come configurato nel tuo `sanity.config.ts`

2. **Traduzioni Automatiche**: Sono semplici e richiedono revisione manuale

3. **Contenuti Complessi**: Body dei blog e descrizioni lunghe vanno tradotti manualmente

4. **Backup**: Il file `production-backup.ndjson` viene creato nella cartella `sanity/`

## 🔧 **Risoluzione Problemi**

### Errore di permessi:
```bash
chmod +x migrate-db.sh
```

### Errore dataset non esiste:
```bash
cd sanity
pnpm sanity dataset create development
```

### Plugin non attivi:
Verifica in `sanity.config.ts` che i plugin siano elencati correttamente.

### Traduzioni non visibili:
Assicurati che il filtro lingua nel Studio sia impostato correttamente.

## 🎯 **Risultato Finale**

Dopo questa procedura avrai:
- 📊 Database di sviluppo = Database di produzione
- 🌍 Supporto multilingua completo
- 🇮🇹 Contenuti italiani esistenti preservati
- 🇬🇧 Base per traduzioni inglesi
- 🔧 Sistema pronto per traduzione contenuti