export interface simpleBlogCard {
  id: string;
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
  categories?: Categories[];
  files?: any[];
}

export interface fullBlogPreview {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: any;
  date: string;
  categories?: Categories[];
  limited: boolean;
  show_preview: boolean;
  preview_text: any;
}

export interface fullService {
  id: string;
  title: string;
  currentSlug: string;
  short: string;
  smallDescription: any;
  titleImage: any;
  body: any;
  order: number;
}
