import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './schemas'
import {itITLocale} from '@sanity/locale-it-it'
import {documentInternationalization} from '@sanity/document-internationalization'
import {languageFilter} from '@sanity/language-filter'
import {visionTool} from '@sanity/vision'

const supportedLanguages = [
  {id: 'it', title: 'Italiano', isDefault: true},
  {id: 'en', title: 'English'},
]

export default defineConfig({
  name: 'default',
  title: 'integys',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'development',

  plugins: [
    structureTool(),
    visionTool(),
    itITLocale(),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: ['blog', 'categorie', 'servizi'],
    }),
    languageFilter({
      supportedLanguages,
      defaultLanguages: ['it'],
      documentTypes: ['blog', 'categorie', 'servizi'],
      filterField: (enclosingType, member, selectedLanguageIds) => {
        // Sempre mostra questi campi (indipendenti dalla lingua)
        if (member.name === '_id' || 
            member.name === '_type' || 
            member.name === '_createdAt' || 
            member.name === '_updatedAt' ||
            member.name === '_rev' ||
            member.name === 'language' ||
            member.name === '__i18n_lang' ||
            member.name === '__i18n_refs') {
          return true
        }
        return !selectedLanguageIds.length || selectedLanguageIds.includes('it')
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
