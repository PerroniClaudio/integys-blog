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
      name: 'smallDescription',
      type: 'text',
      title: 'Descrizione breve',
    },
    {
      name: 'body',
      type: 'array',
      title: 'Contenuto',
      of: [{type: 'block'}],
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
  ],
}
