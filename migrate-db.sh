#!/bin/bash

# 🚀 Script per migrazione database Sanity da Produzione a Sviluppo

echo "🔄 Migrazione Database Sanity: Produzione → Sviluppo"

# 1️⃣ Export dal dataset di produzione
echo "📥 Esportando dal dataset di produzione..."
cd sanity
pnpm sanity dataset export production production-backup.ndjson

# 2️⃣ Pulizia dataset di sviluppo (ATTENZIONE: cancella tutto!)
echo "🧹 Pulendo il dataset di sviluppo..."
pnpm sanity dataset delete development --force

# 3️⃣ Ricrea dataset di sviluppo
echo "🏗️  Ricreando il dataset di sviluppo..."
pnpm sanity dataset create development

# 4️⃣ Import nel dataset di sviluppo
echo "📤 Importando nel dataset di sviluppo..."
pnpm sanity dataset import production-backup.ndjson development --replace

echo "✅ Migrazione completata!"
echo "🔧 Ora esegui lo script di aggiornamento per i18n..."
echo "pnpm sanity exec migration-add-language.ts --non-interactive"