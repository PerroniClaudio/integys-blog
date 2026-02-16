export const dynamic = "force-dynamic";

import { simpleBlogCard } from "@/lib/interface";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import { getDataI18n, getDataWithPaginationI18n, getHighlightedPostsDataI18n, getCategoriesDataI18n } from "@/app/actions-i18n";
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
  
  const data: simpleBlogCard[] = await getDataI18n(locale);
  const posts = await getDataWithPaginationI18n(1, 6, locale);
  const highlightedPosts: simpleBlogCard[] = await getHighlightedPostsDataI18n(locale);

  // Recupera tutte le categorie (lingua corrente + it)
  const categoriesData = await getCategoriesDataI18n(locale);

  // Recupera tutti gli articoli nella lingua corrente
  const articlesQuery = `*[_type == 'blog' && limited == false && date < now() && language == $locale] { categories[]-> { slug } }`;
  const articles = await import("@/lib/sanity").then(m => m.client.fetch(articlesQuery, { locale }));
  // Ottieni la lista degli slug delle categorie effettivamente usate
  const usedCategorySlugs = Array.from(new Set(
    articles.flatMap((a: any) => (a.categories || []).map((c: any) => c.slug?.current || c.slug))
  ));

  // Fai fallback: per ogni slug usato, prendi la categoria nella lingua corrente se esiste, altrimenti quella italiana
  const categories: { name: string, slug: string }[] = usedCategorySlugs.map(slug => {
    // cerca prima la categoria nella lingua corrente
    const catCurrent = categoriesData.find((c: any) => c.currentSlug === slug && c.language === locale);
    if (catCurrent) return { name: catCurrent.name, slug: catCurrent.currentSlug };
    // fallback: cerca la categoria in italiano
    const catIt = categoriesData.find((c: any) => c.currentSlug === slug && c.language === 'it');
    if (catIt) return { name: catIt.name, slug: catIt.currentSlug };
    // fallback estremo: solo slug
    return { name: slug, slug };
  });

  // Converti i posts da JSX a data per il fallback
  const fallbackPostsData = await getDataWithPaginationI18n(1, 6, locale);

  return (
    <div> 
      <Navbar shouldChangeColor={true} />
      <Hero key={locale} />
      
      <main className="max-w-screen-2xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <HomeContent key={locale} categories={categories} />
          </div>
        </div>
      </main>

      {/* Contenuto dinamico che si aggiorna in base alla lingua */}
      {/* Forza il remount anche se la route cambia senza ricaricare la pagina */}
      <DynamicBlogContent 
        key={locale + '-' + (typeof window !== 'undefined' ? window.location.pathname : '')}
        fallbackData={data.slice(0, 6)} 
        fallbackHighlighted={highlightedPosts} 
      />
      
      <Newsletter />
      <Footer />
    </div>
  );
}
