import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {itITLocale} from '@sanity/locale-it-it'

export default defineConfig({
  name: 'default',
  title: 'integys',

  projectId: 't06x8g8r',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), itITLocale()],

  schema: {
    types: schemaTypes,
  },
})
