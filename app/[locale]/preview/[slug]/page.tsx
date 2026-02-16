export const dynamic = "force-dynamic";

import Navbar from "@/app/components/Navbar";
import { fullBlogPreview } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import Newsletter from "@/components/ui/newsletter";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactUsButton from "@/app/components/ContactUsButton";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getData(slug: string, locale: string) {
  // Preview page mostra solo articoli limitati (limited == true) 
  // che sono abilitati alla preview pubblica (show_preview == true)
  // Mostra solo il preview_text, non l'articolo completo
  const query = `
        *[_type == 'blog' && limited == true && show_preview == true && date < now() && slug.current == $slug && language == $locale] {
            _id,
            title,
            smallDescription,
            titleImage,
            date,
            "currentSlug": slug.current,
            language,
            categories,
            limited,
            show_preview,
            preview_text
        }[0]
    `;

  const data = await client.fetch(query, { slug, locale });

  return data;
}

//  && date < now()
// Se non è flaggato show_preview o non è limited non deve esistere la pagina di preview
export async function generateStaticParams() {
  const query = `
    *[_type == 'blog' && limited == true && show_preview == true && date < now()] | order(date desc) {
      "slug": slug.current,
      language
    }
  `;

  const data = await client.fetch(query);

  return data.map((post: any) => ({ 
    locale: post.language || 'it',
    slug: post.slug 
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const data: fullBlogPreview = await getData(slug, locale);

  if (!data) {
    return {
      title: 'Preview Not Found',
    };
  }

  return {
    title: data.title,
    description: data.smallDescription,
    openGraph: {
      images: [
        {
          url: data.titleImage ? (urlFor(data.titleImage).url() || "/opengraph-integys.png") : "/opengraph-integys.png",
          alt: data.title,
        },
      ],
    },
  };
}

export const revalidate = 30;
async function BlogArticle({ params }: PageProps) {
  const { slug, locale } = await params;
  const data: fullBlogPreview = await getData(slug, locale);
  
  if (!data) {
    return notFound();
  }

  const session = await getServerSession();
  // if(session) {
  //   redirect("/riservata/" + slug);
  // }

  // Dato che c'è force-dynamic si deve verificare anche qui se l'articolo è limitato o se show_preview è false
  return (
    // (!data?.limited || !data?.show_preview) ? notFound() :
    <>
      <Navbar shouldChangeColor={false} />
      <main className="max-w-8xl mx-auto px-4 py-16">
        <div className="mt-8 w-full flex flex-col items-center">
          <h1 className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
            {data.title}
          </h1>

          <Image
            src={data.titleImage ? (urlFor(data.titleImage).url() || "/opengraph-integys.png") : "/opengraph-integys.png"}
            alt={data.title}
            width={800}
            height={800}
            priority
            className="rounded-lg mt-8 border shadow-sm"
          />

          <p className="mt-4">
            <span className="italic text-gray-500 text-sm">
              {locale === 'it' 
                ? `Pubblicato il ${new Date(data.date).toLocaleDateString("it-IT")}`
                : `Published on ${new Date(data.date).toLocaleDateString("en-GB")}`
              }
            </span>
          </p>
          
          <div className="mt-16 prose prose-red prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary w-full
            max-w-4/5 xl:max-w-screen-lg 2xl:max-w-screen-xl lg:text-xl">
            <div className="relative" >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none"></div>
              <PortableText value={data.preview_text}
                components={{
                  types: {
                    image: ImageBlock, // Per il tipo image utilizza il componente ImageBlock
                  },
                }}
              />
            </div>

            <div className="font-semibold text-xl flex flex-col items-center">
              <p>
                {locale === 'it'
                  ? "Vuoi vedere l'articolo completo e accedere a altri contenuti speciali?"
                  : "Want to see the full article and access other special content?"
                }
              </p>
              <Link href={`/${locale}/register`}>
                <Button
                  variant={"secondary"}
                  className="text-secondary-foreground text-lg py-4 px-12 min-w-16 text-center bg-primary">
                  {locale === 'it' ? 'Registrati' : 'Sign up'}
                </Button>
              </Link>
            </div>

            <hr className="border border-secondary my-4" />

            <div className="flex flex-col items-center">
              <p className="font-bold text-2xl">
                {locale === 'it'
                  ? "Prenota una sessione di presentazione dei nostri servizi per sviluppare un piano d'azione personalizzato."
                  : "Book a presentation session for our services to develop a personalized action plan."
                }
              </p>

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


const ImageBlock = ({ value }: any) => {
  const { asset } = value;
  if (!asset) {
    // Gestisci il caso in cui l'asset non è disponibile
    return null;
  }

  const imageUrl = urlFor(asset).url();

  return (
    <Image src={imageUrl} alt={value.alt || 'Immagine'} width={800} height={1000} />
  );
};

export default BlogArticle;
