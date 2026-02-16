import { Rule } from "sanity";

interface Block {
  _key: string;
  _type: string;
  children?: Array<{ text: string }>;
}

export default {
  name: 'servizi',
  title: 'Servizi',
  type: 'document',
  fields: [
    {
      name: 'serviceIdMultilingua',
      title: 'ID Multilingua',
      type: 'string',
      description: 'Identificatore comune per tutte le versioni linguistiche di questo servizio',
      validation: (Rule: Rule) => Rule.required().error('L\'ID multilingua è obbligatorio. Usa lo stesso valore per tutte le versioni linguistiche.'),
    },
    {
      name: 'title',
      type: 'string',
      title: 'Titolo',
      validation: (Rule : Rule) => Rule.required().min(1).max(100).warning('Il titolo è obbligatorio e deve avere al massimo 100 caratteri.'),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug (URL)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule : Rule) => Rule.required().warning('Lo slug è obbligatorio.'),
    },
    {
      name: 'titleImage',
      type: 'image',
      title: 'Immagine di copertina',
      validation: (Rule : Rule) => Rule.required().error('L\'immagine di copertina è obbligatoria.'),
    },
    {
      name: 'short',
      type: 'text',
      title: 'Frase per card (max 100 caratteri)',
      maxLength: 100,
      validation: (Rule : Rule) => Rule.max(100).warning('Massimo 100 caratteri.'),
    },
    {
      name: 'smallDescription',
      type: 'array',
      title: 'Descrizione breve (max 400 caratteri)',
      of: [
        {
          type: 'block',
        }
      ],
      validation: (Rule : Rule) => Rule.custom((blocks : Block[]) => {
        const totalChars = blocks.reduce((acc, block) => {
          return acc + (block.children ? block.children.reduce((childAcc, child) => childAcc + (child.text ? child.text.length : 0), 0) : 0);
        }, 0);
        return totalChars <= 400 || 'La descrizione breve deve avere al massimo 400 caratteri.';
      }),
    },
    {
      name: 'body',
      type: 'array',
      title: 'Descrizione completa',
      of: [
        {type: 'block'}
      ],
    },
    {
      name: 'order',
      type: 'number',
      title: 'Ordine',
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
      title: 'title',
      language: 'language',
      serviceIdMultilingua: 'serviceIdMultilingua',
    },
    prepare(selection: any) {
      const { title, language, serviceIdMultilingua } = selection;
      return {
        title: `${title}`,
        subtitle: `Lingua: ${language} | ID Multilingua: ${serviceIdMultilingua}`,
      };
    },
  },
  orderings: [
    {
      name: 'multilinguaAsc',
      title: 'ID Multilingua + Lingua',
      by: [
        { field: 'serviceIdMultilingua', direction: 'asc' },
        { field: 'language', direction: 'asc' },
      ],
    },
  ],
}