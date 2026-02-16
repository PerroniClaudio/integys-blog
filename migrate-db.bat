@echo off
REM 🚀 Script per migrazione database Sanity da Produzione a Sviluppo (Windows)

echo "🔄 Migrazione Database Sanity: Produzione → Sviluppo"

REM 1️⃣ Export dal dataset di produzione
echo "📥 Esportando dal dataset di produzione..."
cd sanity
call pnpm sanity dataset export production production-backup.ndjson

REM 2️⃣ Pulizia dataset di sviluppo (ATTENZIONE: cancella tutto!)
echo "🧹 Pulendo il dataset di sviluppo..."
call pnpm sanity dataset delete development --force

REM 3️⃣ Ricrea dataset di sviluppo  
echo "🏗️  Ricreando il dataset di sviluppo..."
call pnpm sanity dataset create development

REM 4️⃣ Import nel dataset di sviluppo
echo "📤 Importando nel dataset di sviluppo..."
call pnpm sanity dataset import production-backup.ndjson development --replace

echo "✅ Migrazione completata!"
echo "🔧 Ora esegui lo script di aggiornamento per i18n..."
echo "call pnpm sanity exec migration-add-language.ts --non-interactive"

pause