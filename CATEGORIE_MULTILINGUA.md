# 🌍 Gestione Multilingua delle Categorie

## 📋 Come Funziona

Ogni categoria ha:
- ✅ **categoryIdMultilingua**: ID comune per tutte le traduzioni (es: `cat-001`)
- ✅ **language**: Lingua della categoria (`it` o `en`)
- ✅ **name**: Nome tradotto nella lingua specifica
- ✅ **slug**: URL tradotto nella lingua specifica

## 🎯 Workflow: Creare una Nuova Categoria

### 1️⃣ Crea la Categoria in Italiano

```
Nome: Tecnologia
Slug: tecnologia
Language: it
categoryIdMultilingua: tech-01
```

### 2️⃣ Crea la Categoria in Inglese

```
Nome: Technology
Slug: technology
Language: en
categoryIdMultilingua: tech-01  ← STESSO ID!
```

### 3️⃣ Assegna la Categoria agli Articoli

- **Articolo IT**: Seleziona categoria "Tecnologia" (it)
- **Articolo EN** (traduzione): Seleziona categoria "Technology" (en)

Entrambe le categorie hanno `categoryIdMultilingua: tech-01`, quindi logicamente rappresentano la stessa categoria.

## 🔧 Naming Convention per categoryIdMultilingua

Usa un formato leggibile e coerente:

```
tech-01, tech-02       → Categorie tecnologia
business-01            → Categorie business
news-01               → Notizie
tutorial-01           → Tutorial
case-study-01         → Case studies
```

Oppure numerazione progressiva semplice:

```
cat-001, cat-002, cat-003, ...
```

## 🚀 Primo Setup: Popolare le Categorie Esistenti

Se hai già categorie nel CMS senza `categoryIdMultilingua`:

```bash
cd sanity
npx tsx assegna-categoryid-multilingua.ts
```

Lo script:
1. ✅ Trova tutte le categorie
2. ✅ Raggruppa le categorie per slug simile
3. ✅ Assegna lo stesso ID alle versioni IT/EN della stessa categoria
4. ✅ Crea ID univoci per categorie senza corrispondenza

## 📊 Visualizzazione in Sanity Studio

Nel CMS vedrai le categorie ordinate per `categoryIdMultilingua`, così le versioni della stessa categoria sono vicine:

```
✓ Tecnologia        | it | tech-01 | tecnologia
✓ Technology        | en | tech-01 | technology
✓ Business          | it | business-01 | business
✓ Business          | en | business-01 | business
```

## 💡 Vantaggi del Sistema

✅ **Filtraggio corretto**: Le query caricano solo categorie nella lingua giusta
✅ **Ordinamento logico**: Le versioni della stessa categoria sono raggruppate
✅ **Scalabilità**: Facile aggiungere nuove lingue in futuro
✅ **Coerenza**: Stesso pattern di articoli (`postIdMultilingua`) e servizi (`serviceIdMultilingua`)

## 🔍 Come le Categorie Vengono Caricate

### Homepage
```typescript
const categories = await getCategoriesDataI18n('it');
// Restituisce solo categorie con language == 'it'
```

### Pagina Categorie
```typescript
const categories = await getCategoriesDataI18n('en');
// Restituisce solo categorie con language == 'en'
```

### Selettore Categorie
Il componente `CategorySelector` riceve l'array filtrato per lingua e mostra solo le categorie corrette.

## ⚠️ Note Importanti

1. **Non puoi condividere la stessa categoria tra lingue** - Devi creare versioni separate
2. **Usa sempre lo stesso categoryIdMultilingua** per le traduzioni
3. **Il selettore mostra solo categorie nella lingua corrente** della pagina
4. **Gli articoli devono avere categorie nella loro stessa lingua**

## 🎨 Best Practices

### ✅ Corretto
```
Articolo IT → Categoria "Tecnologia" (it, tech-01)
Articolo EN → Categoria "Technology" (en, tech-01)
```

### ❌ Errato
```
Articolo IT → Categoria "Technology" (en, tech-01)  ← Lingua sbagliata!
```

## 🔄 Workflow di Duplicazione Articolo

Quando duplichi un articolo da IT a EN:

1. ✅ Copia il contenuto
2. ✅ Cambia `language` da `it` a `en`
3. ✅ **Riassegna le categorie** selezionando le versioni EN con stesso `categoryIdMultilingua`

**Esempio:**
```
Articolo IT:
- Categoria: "Tecnologia" (tech-01, it)
- Categoria: "Business" (business-01, it)

Articolo EN (duplicato):
- Categoria: "Technology" (tech-01, en)  ← Stesso tech-01
- Categoria: "Business" (business-01, en) ← Stesso business-01
```

## 📝 Script Utili

### Verifica Categorie Senza Multilingua ID
```bash
cd sanity
npx tsx -e "
import { createClient } from '@sanity/client';
const client = createClient({...});
client.fetch(\`*[_type == 'categorie' && !defined(categoryIdMultilingua)]{name, language}\`)
  .then(console.log);
"
```

### Lista Tutte le Categorie Ordinate
```bash
cd sanity
npx tsx -e "
import { createClient } from '@sanity/client';
const client = createClient({...});
client.fetch(\`*[_type == 'categorie'] | order(categoryIdMultilingua asc, language asc){name, language, categoryIdMultilingua}\`)
  .then(cats => cats.forEach(c => console.log(\`\${c.name} | \${c.language} | \${c.categoryIdMultilingua}\`)));
"
```

## 🎯 Riepilogo

1. Ogni categoria ha un **categoryIdMultilingua** condiviso tra le lingue
2. Ogni categoria ha una **lingua specifica** (it/en)
3. Le query filtrano **sempre** per lingua corretta
4. Nel CMS, le versioni della stessa categoria sono **ordinate vicine**
5. Quando duplichi articoli, **riassegni manualmente** le categorie nella nuova lingua

Questo sistema garantisce:
- ✅ Nessuna confusione di lingue
- ✅ Filtraggio corretto in tutte le pagine
- ✅ Gestione scalabile e manutenibile
- ✅ Coerenza con il resto del progetto
