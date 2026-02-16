// API route Next.js per restituire la lista degli articoli dal dataset Sanity
// Usa un token di sola lettura lato server, mai esposto al client

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_READ_TOKEN, // Token di sola lettura
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2024-11-27',
  useCdn: false,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { locale = 'it', page = 1, pageSize = 6, highlighted = false } = req.query;
  try {
    const query = `
      *[_type == 'blog' && limited == false && date < now() && language == $locale${highlighted === 'true' ? ' && highlighted == true' : ''}]
      | order(order asc, date desc) {
        "id": _id,
        title,
        smallDescription,
        titleImage,
        "currentSlug": slug.current,
        language,
        categories[]->{name, "slug": slug.current, language}
      }[$start...$end]
    `;
    const start = (Number(page) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    const data = await client.fetch(query, { locale, start, end });
    res.status(200).json({ success: true, data });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ success: false, error: errMsg });
  }
}
