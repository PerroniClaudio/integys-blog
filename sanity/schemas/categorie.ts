export default {
  name: 'categorie',
  title: 'Categorie',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nome',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug (URL)',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      type: 'text',
      title: 'Descrizione',
    },
  ],
}
