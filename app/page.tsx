export const dynamic = "force-dynamic";

import { simpleBlogCard } from "@/lib/interface";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import { getData, getDataWithPagination, getHighlightedPostsData } from "@/app/actions";
import Newsletter from "@/components/ui/newsletter";
import Footer from "./components/Footer";
import HomeContent from "./components/HomeContent";
import DynamicBlogContent from "./components/DynamicBlogContent";

export const revalidate = 30;

export default async function Home() {
  const data: simpleBlogCard[] = await getData();
  const posts = await getDataWithPagination(1, 6);
  const highlightedPosts: simpleBlogCard[] = await getHighlightedPostsData(); // DA CAMBIARE PRIMA DELLA PUBBLICAZIONE. true è per i limited e false è per i pubblici

  let categories = data
    .map((post) => post.categories)
    .flat()
    .filter((category, idx, self) => {
      return idx === self.findIndex((c) => c.slug === category.slug);
    });

  // Converti i posts da JSX a data per il fallback
  const fallbackPostsData = await getDataWithPagination(1, 6);

  return (
    <div> {/* pb-44 is the padding-bottom of the footer */}
      <Navbar shouldChangeColor={true} />
      <Hero />
      
      <main className="max-w-screen-2xl mx-auto px-4 mb-16">
        <div className="pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
            <HomeContent categories={categories} />
          </div>
        </div>
      </main>

      {/* Contenuto dinamico che si aggiorna in base alla lingua */}
      <DynamicBlogContent 
        fallbackData={data.slice(0, 6)} 
        fallbackHighlighted={highlightedPosts} 
      />
      
      <Newsletter />
      <Footer />
    </div>
  );
}