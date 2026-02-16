'use client';

import { useBlogData, useHighlightedBlogData } from '../hooks/useBlogData';
import { useLanguageFromURL } from '../hooks/useLanguageFromURL';
import ArticleCard from './ArticleCard';
import HighlightedArticles from './HighlightedArticles';
import DynamicArticleList from './DynamicArticleList';

interface DynamicContentProps {
  locale: string;
  fallbackData?: any[];
  fallbackHighlighted?: any[];
}

export default function DynamicBlogContent({ locale, fallbackData, fallbackHighlighted }: DynamicContentProps) {
  // Fetch dei dati degli articoli per la lingua passata dal server
  const { data: posts, loading: postsLoading } = useBlogData({
    page: 1,
    pageSize: 6,
    limited: false,
    includeHighlighted: true,
    locale
  });

  // Fetch degli articoli evidenziati
  const { data: highlightedPosts, loading: highlightedLoading } = useHighlightedBlogData(false, locale);

  if (postsLoading) {
    return (
      <>
        {!!fallbackHighlighted && (fallbackHighlighted.length > 0) && 
          <HighlightedArticles data={fallbackHighlighted} locale={locale} />
        }
        <main className="max-w-screen-2xl mx-auto px-4 mb-16">
          <div className="pt-4 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
              <div className="col-span-8 flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {fallbackData?.map((post, index) => (
                    <ArticleCard key={post.id || index} article={post} index={index} limited={false} />
                  ))}
                </div>
                <div className="text-center py-8">
                  <div className="loading loading-spinner loading-lg text-primary" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {!!highlightedPosts && Array.isArray(highlightedPosts) && highlightedPosts.length > 0 && 
        <HighlightedArticles data={highlightedPosts} locale={locale} />
      }
      <main className="max-w-screen-2xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(Array.isArray(posts) ? posts : []).map((post, index) => (
                  <ArticleCard key={post.id} article={post} index={index} limited={false} />
                ))}
              </div>
              <DynamicArticleList />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}