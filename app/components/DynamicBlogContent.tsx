'use client';

import { useBlogData, useHighlightedBlogData } from '../hooks/useBlogData';
import { useLanguageFromURL } from '../hooks/useLanguageFromURL';
import ArticleCard from './ArticleCard';
import HighlightedArticles from './HighlightedArticles';
import DynamicArticleList from './DynamicArticleList';

interface DynamicContentProps {
  fallbackData?: any[];
  fallbackHighlighted?: any[];
}

export default function DynamicBlogContent({ fallbackData, fallbackHighlighted }: DynamicContentProps) {
  // Assicurati che la lingua dall'URL sia sincronizzata
  const { isReady } = useLanguageFromURL();
  
  // Fetch dei dati degli articoli per la lingua corrente
  const { data: posts, loading: postsLoading } = useBlogData({
    page: 1,
    pageSize: 6,
    limited: false,
    includeHighlighted: true
  });

  // Fetch degli articoli evidenziati
  const { data: highlightedPosts, loading: highlightedLoading } = useHighlightedBlogData(false);

  // Durante il caricamento iniziale, mostra i dati di fallback
  if (!isReady || postsLoading) {
    return (
      <>
        {!!fallbackHighlighted && (fallbackHighlighted.length > 0) && 
          <HighlightedArticles data={fallbackHighlighted} />
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
                {/* Placeholder per ArticleList durante il caricamento */}
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
      {!!highlightedPosts && (highlightedPosts.length > 0) && 
        <HighlightedArticles data={highlightedPosts} />
      }
      <main className="max-w-screen-2xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <div className="col-span-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post, index) => (
                  <ArticleCard key={post.id} article={post} index={index} limited={false} />
                ))}
              </div>
              {/* ArticleList dinamico che si aggiorna con la lingua */}
              <DynamicArticleList />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}