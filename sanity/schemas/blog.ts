import { Rule } from "@sanity/types";

export default {
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'postIdMultilingua',
      title: 'ID Multilingua',
      type: 'string',
      description: 'Identificatore comune per tutte le versioni linguistiche di questo articolo',
      validation: (Rule: Rule) => Rule.required().error('L\'ID multilingua è obbligatorio. Usa lo stesso valore per tutte le versioni linguistiche.'),
    },
    {
      name: 'title',
      type: 'string',
      title: 'Titolo',
      validation: (Rule: Rule) => Rule.required().error('Il titolo è obbligatorio.'),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug (URL)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: Rule) => Rule.required().error('Lo slug è obbligatorio e deve essere unico.'),
    },
    {
      name: 'titleImage',
      type: 'image',
      title: 'Immagine di copertina',
      validation: (Rule: Rule) => Rule.required().error('L\'immagine di copertina è obbligatoria.'),
    },
    {
      name: 'highlighted',
      title: 'Evidenziato',
      type: 'boolean',
      initialValue: false,
      description: 'Se selezionato, l\'articolo sarà tra quelli in evidenza.',
    },
    {
      name: 'order',
      type: 'number',
      title: 'Ordine',
      description: 'Gli articoli con numero più basso vengono visualizzati per primi. Senza numero vengono visualizzati dopo, in ordine di pubblicazione. L\'ordine vale anche per quelli in evidenza e limitati.',
    },
    {
      name: 'limited',
      title: 'Limited',
      type: 'boolean',
      initialValue: false, // imposta il valore di default su false
      description: 'Se selezionato, l\'articolo sarà visibile solo agli utenti registrati (area riservata).',
    },
    {
      name: 'smallDescription',
      type: 'text',
      title: 'Descrizione breve',
      description: 'Questa descrizione sarà visibile nella card dell\'articolo, sotto il titolo dell\'articolo.',
      validation: (Rule: Rule) => Rule.required().error('La descrizione breve è obbligatoria.'),
    },
    {
      name: 'body',
      type: 'array',
      title: 'Contenuto',
      of: [
        {type: 'block'},
        {type: 'image'}
      ],
    },
    {
      name: 'date',
      type: 'datetime',
      title: 'Data di pubblicazione',
    },
    {
      title: 'Categorie',
      name: 'categories',
      type: 'array',
      description: 'Seleziona solo le categorie in italiano: le traduzioni vengono gestite automaticamente dal sistema.',
      of: [
        {
          type: 'reference',
          to: [{type: 'categorie'}],
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1).error('Devi selezionare almeno una categoria.'),
    },
    {
      title: 'Files',
      name: 'files',
      type: 'array',
      of: [
        {
          type: 'file',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Titolo',
            },
          ],
        },
      ],
    },
    {
      name: 'show_preview',
      type: 'boolean',
      title: 'Mostra Preview',
      initialValue: false, // imposta il valore di default su false
      description: 'Se l\'articolo è limitato (solo area riservata), impostando questo flag sarà visibile la preview nell\'area pubblica.',
    },
    {
      name: 'preview_text',
      type: 'array',
      title: 'Testo Preview',
      of: [
        {type: 'block'}
      ],
      description: 'Se l\'articolo è limitato (solo area riservata) e Mostra Preview è attivo, questo testo sarà visibile nella preview dell\'articolo, nell\'area pubblica.',
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
      postIdMultilingua: 'postIdMultilingua',
    },
    prepare(selection: any) {
      const { title, language, postIdMultilingua } = selection;
      return {
        title: `${title}`,
        subtitle: `Lingua: ${language} | ID Multilingua: ${postIdMultilingua}`,
      };
    },
  },
  orderings: [
    {
      name: 'multilinguaAsc',
      title: 'ID Multilingua + Lingua',
      by: [
        { field: 'postIdMultilingua', direction: 'asc' },
        { field: 'language', direction: 'asc' },
      ],
    },
  ],
}
