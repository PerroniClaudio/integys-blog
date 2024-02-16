export interface simpleBlogCard {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: any;
  categories: Categories[];
}

export interface Categories {
  name: string;
  slug: string;
}

export interface fullBlog {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: any;
  body: any;
  date: string;
}
