export const dynamic = "force-dynamic";

import ArticlesList from "@/app/components/admin/ArticlesList";
import FilesList from "@/app/components/FilesList";
import Navbar from "@/app/components/Navbar";
import { blogCardListElement, Categories, fullBlog, simpleBlogCard } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import Newsletter from "@/components/ui/newsletter";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Questa pagina serve a vedere la lista degli articoli per poi accedere all'anteprima di ciascuno

// type blogCardListElement = {
//   id: string;
//   title: string;
//   currentSlug: string;
//   titleImage: any;
//   categories: Categories[];
// }

async function getData() {
  const query = `
    *[_type == 'blog'] {
      title,
      titleImage,
      "currentSlug": slug.current,
      categories,
    }
  `;

  const data = await client.fetch(query);

  return data;
}

// export async function generateStaticParams() {
//   const query = `
//     *[_type == 'blog'] | order(date desc) {
//       title,
//       titleImage,
//       "currentSlug": slug.current,
//       categories[]->{name, "slug" : slug.current}
//     }
//   `;

//   const data: blogCardListElement[] = await client.fetch(query);

//   return data.map(({ currentSlug }) => currentSlug);
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }): Promise<Metadata> {
//   const data: fullBlog = await getData(params.slug);

//   return {
//     title: data.title,
//     description: data.smallDescription,
//     openGraph: {
//       images: [
//         {
//           url: urlFor(data.titleImage).url(),
//           alt: data.title,
//         },
//       ],
//     },
//   };
// }

export const revalidate = 30;
async function BlogArticleList() {
  const data: blogCardListElement[] = await getData();
  return (
    <>
      <Navbar shouldChangeColor={false} />
      <main className="max-w-8xl mx-auto px-4 py-16">
        <div className="mt-8 w-full flex flex-col items-center">
          <h1 className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
            Lista articoli
          </h1>
          {!data ? <div className="loading loading-spinner loading-lg text-primary" /> :
            <ArticlesList data={data} />
          }
          
        </div>
      </main>
    </>
  );
}




export default BlogArticleList;
