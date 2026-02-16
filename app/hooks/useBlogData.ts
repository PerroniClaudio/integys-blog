'use client';

import { useEffect, useState } from 'react';
// import { client } from '@/lib/sanity';
import { simpleBlogCard } from '@/lib/interface';
import { useTranslation } from '@/lib/useTranslation';

interface UseBlogDataOptions {
  page?: number;
  pageSize?: number; 
  limited?: boolean;
  includeHighlighted?: boolean;
}

export function useBlogData(options: UseBlogDataOptions = {}) {
  const { i18n } = useTranslation();
  const [data, setData] = useState<simpleBlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    pageSize = 6,
    limited = false,
    includeHighlighted = true
  } = options;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const currentLanguage = i18n.language || 'it';
        const query = `
          *[_type == 'blog' 
            && limited == ${limited} 
            && language == "${currentLanguage}"
            && date < now()
            ${includeHighlighted ? '' : (' && highlighted != true')}] 
          | order(order asc, date desc) {
            "id": _id,
            title,
            smallDescription,
            titleImage,
            "currentSlug": slug.current,
            language,
            categories[]->{name, "slug" : slug.current}
          }[${(page - 1) * pageSize}...${page * pageSize}]
        `;

        // Usa la nuova API route per recuperare i dati dal server
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          limited: String(limited),
          includeHighlighted: String(includeHighlighted),
          language: currentLanguage
        });
        const res = await fetch(`/api/blog-list?${params.toString()}`);
        if (!res.ok) throw new Error('Errore nella fetch API blog-list');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [i18n.language, page, pageSize, limited, includeHighlighted]);

  return { data, loading, error };
}

export function useHighlightedBlogData(limited: boolean = false) {
  const { i18n } = useTranslation();
  const [data, setData] = useState<simpleBlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Temporaneamente disabilito filtri lingua per debug 403 errors
        const currentLanguage = i18n.language || 'it';
        const query = `
          *[_type == 'blog' 
            && limited == ${limited} 
            && language == "${currentLanguage}"
            && highlighted == true 
            && date < now()] 
          | order(order asc, date desc) {
            "id": _id,
            title,
            smallDescription,
            titleImage,
            "currentSlug": slug.current,
            language,
            categories[]->{name, "slug" : slug.current}
          }[0...10]
        `;

        // Usa la nuova API route per recuperare i dati dal server
        const params = new URLSearchParams({
          page: '1',
          pageSize: '10',
          limited: String(limited),
          includeHighlighted: 'true',
          language: currentLanguage
        });
        const res = await fetch(`/api/blog-list?${params.toString()}`);
        if (!res.ok) throw new Error('Errore nella fetch API blog-list');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching highlighted blog data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [i18n.language, limited]);

  return { data, loading, error };
}