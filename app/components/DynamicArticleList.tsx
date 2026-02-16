'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/sanity';
import { simpleBlogCard } from '@/lib/interface';
import ArticleCard from './ArticleCard';
import { useTranslation } from '@/lib/useTranslation';

type Props = {
  category?: string;
  limited?: boolean;
};

export default function DynamicArticleList({ category, limited = false }: Props) {
  const { i18n, t } = useTranslation();
  const { ref, inView } = useInView();
  const [data, setData] = useState<simpleBlogCard[]>([]);
  const [page, setPage] = useState<number>(2);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const currentLanguage = i18n.language || 'it';
      
      let query = '';
      
      if (category) {
        query = `
          *[_type == 'blog' 
            && limited == ${limited} 
            && language == "${currentLanguage}"
            && date < now()
            && references(*[_type == 'categorie' && slug.current == "${category}"]._id)] 
          | order(order asc, date desc) {
            "id": _id,
            title,
            smallDescription,
            titleImage,
            "currentSlug": slug.current,
            language,
            postIdMultilingua,
            categories[]->{name, "slug" : slug.current}
          }[${(page - 1) * 6}...${page * 6}]
        `;
      } else {
        query = `
          *[_type == 'blog' 
            && limited == ${limited} 
            && language == "${currentLanguage}"
            && date < now()] 
          | order(order asc, date desc) {
            "id": _id,
            title,
            smallDescription,
            titleImage,
            "currentSlug": slug.current,
            language,
            categories[]->{name, "slug" : slug.current}
          }[${(page - 1) * 6}...${page * 6}]
        `;
      }

      const result = await client.fetch(query);
      
      if (result.length > 0) {
        setData((prev) => [...prev, ...result]);
        setPage(prev => prev + 1);
      } else {
        setPage(0);
        console.log("no more data");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setPage(0);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    if (inView && page > 0 && !isFetching) {
      fetchData();
    }
  }, [inView, page, category, limited, i18n.language]);

  // Reset data quando cambia la lingua o altri parametri
  useEffect(() => {
    setData([]);
    setPage(2); // Reset alla pagina 2 poiché la prima pagina è già caricata nella griglia principale
  }, [i18n.language, category, limited]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((article, index) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            index={index} 
            limited={limited} 
          />
        ))}
      </div>

      <section className="flex justify-center items-center w-full col-span-2">
        {page <= 3 && page > 0 && (
          <div ref={ref}>
            <div className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}
        {page > 3 && (
          <div className="mt-8">
            <Button 
              onClick={fetchData} 
              disabled={isFetching}
              className="btn btn-primary font-semibold"
            >
              {isFetching ? t('home.loading') : t('home.loadMoreArticles')}
            </Button>
          </div>
        )}
      </section>
    </>
  );
}