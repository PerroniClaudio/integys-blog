export default {
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Titolo',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug (URL)',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'titleImage',
      type: 'image',
      title: 'Immagine di copertina',
    },
    {
      name: 'limited',
      title: 'Limited',
      type: 'boolean',
      initialValue: false, // imposta il valore di default su false
    },
    {
      name: 'smallDescription',
      type: 'text',
      title: 'Descrizione breve',
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
      of: [
        {
          type: 'reference',
          to: [{type: 'categorie'}],
        },
      ],
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
    }
  ],
}
