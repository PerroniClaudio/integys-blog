export const dynamic = "force-dynamic";

import FilesList from "@/app/components/FilesList";
import Navbar from "@/app/components/Navbar";
import { fullBlog, simpleBlogCard } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import Newsletter from "@/components/ui/newsletter";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactUsButton from "@/app/components/ContactUsButton";
import BookSessionText from "@/app/components/BookSessionText";

async function getData(slug: string) {
  // && date < now() DA CAMBIARE PRIMA DELLA PUBBLICAZIONE. va inserito
  const query = `
        *[_type == 'blog' && limited == true && slug.current == '${slug}' && date < now()] {
            title,
            smallDescription,
            titleImage,
            body,
            date,
            "currentSlug": slug.current,
            categories,
            files
        }[0]
    `;

  const data = await client.fetch(query);

  return data;
}

export async function generateStaticParams() {
  const query = `
    *[_type == 'blog' && limited == true && date < now()] | order(date desc) {
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      categories[]->{name, "slug" : slug.current}
    }
  `;

  const data: simpleBlogCard[] = await client.fetch(query);

  return data.map(({ currentSlug }) => ({ slug: currentSlug }));
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const data: fullBlog = await getData(slug);

  return {
    title: data.title,
    description: data.smallDescription,
    openGraph: {
      images: [
        {
          url: data.titleImage ? (urlFor(data.titleImage).url() || (process.env.NEXTAUTH_URL + "/opengraph-integys.png")) : (process.env.NEXTAUTH_URL + "/opengraph-integys.png"),
          alt: data.title,
        },
      ],
    },
  };
}

export const revalidate = 30;
async function BlogLimitedArticle({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const { slug } = await Promise.resolve(params);
  const data: fullBlog = await getData(slug);
  return (
    <>
      <Navbar shouldChangeColor={false} />
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="mt-8 w-full flex flex-col items-center">
          <h1 className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
            {data.title}
          </h1>

          <Image
            src={data.titleImage ? (urlFor(data.titleImage).url() || "/opengraph-integys.png") :  "/opengraph-integys.png"}
            alt={data.title}
            width={800}
            height={800}
            priority
            className="rounded-lg mt-8 border shadow-sm"
          />

          <p className="mt-4">
            <span className="italic text-gray-500 text-sm">
              Pubblicato il {new Date(data.date).toLocaleDateString("it-IT")}
            </span>
          </p>

          <div className="mt-16 prose prose-red prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary w-full 
            max-w-4/5 xl:max-w-screen-lg 2xl:max-w-screen-xl lg:text-xl">
            <PortableText value={data.body} />

            {data.files && 
              <FilesList files={data.files} />
            }

            <hr className="border border-secondary my-4" />

           <div className="flex flex-col items-center">
              <BookSessionText />

              <ContactUsButton
                variant={"secondary"}
                className="text-secondary-foreground text-lg py-8 px-20 min-w-16 text-center bg-primary" />
            </div>
          </div>
        </div>
      </main>
      <Newsletter />
    </>
  );
}
export default BlogLimitedArticle;
