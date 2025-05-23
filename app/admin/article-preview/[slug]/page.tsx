export const dynamic = "force-dynamic";

import FilesList from "@/app/components/FilesList";
import Navbar from "@/app/components/Navbar";
import { fullBlog, simpleBlogCard } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import Newsletter from "@/components/ui/newsletter";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Questa pagina serve a vedere un'anteprima degli articoli prima di pubblicarli, quindi deve recuperare l'articolo anche senza date e a prescindere che sia limited o no

async function getData(slug: string) {
  const query = `
    *[_type == 'blog' && slug.current == '${slug}'] {
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
    *[_type == 'blog'] | order(date desc) {
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
      categories[]->{name, "slug" : slug.current}
    }
  `;

  const data: simpleBlogCard[] = await client.fetch(query);

  return data.map(({ currentSlug }) => currentSlug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data: fullBlog = await getData(params.slug);

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
async function BlogArticle({ params }: { params: { slug: string } }) {
  const data: fullBlog = await getData(params.slug);
  return (
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
              Pubblicato il {data?.date ? new Date(data.date).toLocaleDateString("it-IT") : "Nessuna data di pubblicazione"}
            </span>
          </p>
          
          <div className="mt-16 prose prose-red prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary w-full 
            max-w-4/5 xl:max-w-screen-lg 2xl:max-w-screen-xl lg:text-xl">
            <PortableText value={data.body}
              components={{
                types: {
                  image: ImageBlock, // Per il tipo image utilizza il componente ImageBlock
                },
              }}
            />

            {data.files && 
              <FilesList files={data.files} />
            }

            <hr className="border border-secondary my-4" />

            <div className="flex flex-col items-center">
              <p className="font-bold text-2xl">
                Prenota una sessione di presentazione dei nostri servizi per sviluppare un piano d&rsquo;azione personalizzato.
              </p>

              <Link href="/contattaci">
                <Button
                  variant={"secondary"}
                  className="text-secondary-foreground text-lg py-8 px-20 min-w-16 text-center bg-primary">
                  Contattaci
                </Button>
              </Link>
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
