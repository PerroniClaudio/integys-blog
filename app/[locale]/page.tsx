export const dynamic = "force-dynamic";

import { simpleBlogCard } from "@/lib/interface";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
// import { getDataI18n, getDataWithPaginationI18n, getHighlightedPostsDataI18n, getCategoriesDataI18n } from "@/app/actions-i18n";
import Newsletter from "@/components/ui/newsletter";
import Footer from "@/app/components/Footer";
import HomeContent from "@/app/components/HomeContent";
import DynamicBlogContent from "@/app/components/DynamicBlogContent";

export const revalidate = 30;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params;
  

  // Recupera la lista articoli tramite API route
  const blogParams = new URLSearchParams({
    page: '1',
    pageSize: '6',
    limited: 'false',
    includeHighlighted: 'true',
    locale: locale
  });
  // In SSR, fetch accetta solo path relativo
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(new URL(`/api/blog-list?${blogParams.toString()}`, baseUrl));
  const postsResult = res.ok ? await res.json() : { data: [] };
  const posts = Array.isArray(postsResult.data) ? postsResult.data : [];


  // Recupera articoli evidenziati tramite API route
  const highlightedParams = new URLSearchParams({
    page: '1',
    pageSize: '10',
    limited: 'false',
    includeHighlighted: 'true',
    locale: locale
  });
  const highlightedRes = await fetch(new URL(`/api/blog-list?${highlightedParams.toString()}`, baseUrl));
  const highlightedResult = highlightedRes.ok ? await highlightedRes.json() : { data: [] };
  const highlightedPosts = Array.isArray(highlightedResult.data) ? highlightedResult.data : [];

  // Recupera categorie tramite API route (ipotizzando /api/categories-list)
  const categoriesRes = await fetch(new URL(`/api/categories-list?language=${locale}`, baseUrl));
  const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

  return (
    <div> 
      <Navbar shouldChangeColor={true} />
      <Hero key={locale} />
      
      <main className="max-w-screen-2xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <HomeContent key={locale} categories={categoriesData} />
          </div>
        </div>
      </main>

      {/* Contenuto dinamico che si aggiorna in base alla lingua */}
      {/* Forza il remount anche se la route cambia senza ricaricare la pagina */}
      <DynamicBlogContent 
        key={locale + '-' + (typeof window !== 'undefined' ? window.location.pathname : '')}
        fallbackData={posts.slice(0, 6)} 
        fallbackHighlighted={highlightedPosts} 
      />
      
      <Newsletter />
      <Footer />
    </div>
  );
}
