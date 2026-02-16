import { Rule } from "@sanity/types";

export default {
  name: 'categorie',
  title: 'Categorie',
  type: 'document',
  fields: [
    {
      name: 'categoryIdMultilingua',
      title: 'ID Multilingua Categoria',
      type: 'string',
      description: 'Identificatore comune per tutte le versioni linguistiche di questa categoria (es: tech-01, business-01)',
      validation: (Rule: Rule) => Rule.required().error('L\'ID multilingua è obbligatorio. Usa lo stesso valore per tutte le versioni linguistiche.'),
    },
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
    {
      name: 'language',
      type: 'string',
      title: 'Lingua',
      initialValue: 'it',
      options: {
        list: [
          {title: 'Italiano', value: 'it'},
          {title: 'English', value: 'en'}
        ]
      },
      validation: (Rule: Rule) => Rule.required(),
      description: 'Seleziona la lingua dell\'articolo.'
    },
  ],
  preview: {
    select: {
      title: 'name',
      language: 'language',
      categoryIdMultilingua: 'categoryIdMultilingua',
    },
    prepare(selection: any) {
      const { title, language, categoryIdMultilingua } = selection;
      return {
        title: `${title}`,
        subtitle: `Lingua: ${language} | ID: ${categoryIdMultilingua}`,
      };
    },
  },
  orderings: [
    {
      name: 'multilinguaAsc',
      title: 'ID Multilingua + Lingua',
      by: [
        { field: 'categoryIdMultilingua', direction: 'asc' },
        { field: 'language', direction: 'asc' },
      ],
    },
  ],
}
