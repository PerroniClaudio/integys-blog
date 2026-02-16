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

export function useBlogData(options: UseBlogDataOptions & { locale: string }) {
  const [data, setData] = useState<simpleBlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    pageSize = 6,
    limited = false,
    includeHighlighted = true,
    locale
  } = options;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          limited: String(limited),
          includeHighlighted: String(includeHighlighted),
          locale
        });
        if (locale === 'it' || locale === 'en') {
          const res = await fetch(`/api/blog-list?${params.toString()}`);
          if (!res.ok) throw new Error('Errore nella fetch API blog-list');
          const result = await res.json();
          setData(Array.isArray(result.data) ? result.data : []);
        } else {
          throw new Error('Lingua non valida o non presente');
        }
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale, page, pageSize, limited, includeHighlighted]);

  return { data, loading, error };
}

export function useHighlightedBlogData(limited: boolean = false, locale: string) {
  const [data, setData] = useState<simpleBlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: '1',
          pageSize: '10',
          limited: String(limited),
          includeHighlighted: 'true',
          locale
        });
        if (locale === 'it' || locale === 'en') {
          const res = await fetch(`/api/blog-list?${params.toString()}`);
          if (!res.ok) throw new Error('Errore nella fetch API blog-list');
          const result = await res.json();
          setData(Array.isArray(result.data) ? result.data : []);
        } else {
          throw new Error('Lingua non valida o non presente');
        }
      } catch (err) {
        console.error('Error fetching highlighted blog data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale, limited]);

  return { data, loading, error };
}