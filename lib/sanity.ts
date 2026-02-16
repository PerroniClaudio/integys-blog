import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// Configurazione del client Sanity
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  apiVersion: '2024-01-01', // usa la data corrente in formato YYYY-MM-DD
  useCdn: process.env.NODE_ENV === 'development', // usa CDN in produzione per performance migliori
  token: process.env.SANITY_API_TOKEN, // necessario per operazioni di scrittura
});

// Helper per generare URL delle immagini
const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Tipi TypeScript per i tuoi documenti
export interface BlogPost {
  _id: string;
  _type: 'blog';
  title: string;
  slug: {
    current: string;
  };
  language: string;
  postIdMultilingua: string;
  body: any; // usa il tipo appropriato per il tuo content editor (es. PortableText)
  publishedAt?: string;
  mainImage?: SanityImageSource;
  excerpt?: string;
  author?: {
    name: string;
    image?: SanityImageSource;
  };
}