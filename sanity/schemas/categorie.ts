import { Rule } from "@sanity/types";

export default {
  name: 'categorie',
  title: 'Categorie',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nome',
      validation: (Rule: Rule) => Rule.required().error('Il nome è obbligatorio.'),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug (URL)',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: Rule) => Rule.required().error('Lo slug è obbligatorio e deve essere unico.'),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Descrizione',
    },
  ],
}
