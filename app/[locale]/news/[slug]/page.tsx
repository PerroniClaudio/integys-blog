export const dynamic = "force-dynamic";

import FilesList from "@/app/components/FilesList";
import Navbar from "@/app/components/Navbar";
import { fullBlog, simpleBlogCard } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import Newsletter from "@/components/ui/newsletter";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";
import ContactUsButton from "@/app/components/ContactUsButton";
import Footer from "@/app/components/Footer";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getData(slug: string, locale: string) {
  const query = `
    *[_type == 'blog' && limited == false && date < now() && slug.current == $slug && language == $locale] {
      _id,
      title,
      smallDescription,
      titleImage,
      body,
      date,
      "currentSlug": slug.current,
      language,
      postIdMultilingua,
      categories,
      files
    }[0]
  `;

  const data = await client.fetch(query, { slug, locale });

  return data;
}

export async function generateStaticParams() {
  const query = `
    *[_type == 'blog' && limited == false && date < now()] | order(date desc) {
      "currentSlug": slug.current,
      language
    }
  `;

  const data = await client.fetch(query);

  return data.map((post: any) => ({
    locale: post.language || 'it',
    slug: post.currentSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data: fullBlog = await getData(slug, locale);

  if (!data) {
    return {
      title: 'Article Not Found',
    };
  }

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

async function BlogArticle({ params }: PageProps) {
  const { locale, slug } = await params;
  const data: fullBlog & { postIdMultilingua?: string; language?: string } = await getData(slug, locale);
  
  if (!data) {
    return (
      <>
        <Navbar shouldChangeColor={false} />
        <main className="max-w-8xl mx-auto px-4 py-16">
          <h1>Article not found</h1>
        </main>
        <Footer />
      </>
    );
  }

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
            <span className="italic text-sm">
              Pubblicato il {new Date(data.date).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB')}
            </span>
          </p>
          
          <div className="mt-16 prose prose-red prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary w-full 
            max-w-4/5 xl:max-w-screen-lg 2xl:max-w-screen-xl lg:text-xl"
          >
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
                {locale === 'it' 
                  ? "Prenota una sessione di presentazione dei nostri servizi per sviluppare un piano d'azione personalizzato."
                  : "Book a session to present our services and develop a personalized action plan."}
              </p>

              <ContactUsButton
                variant={"secondary"}
                className="text-secondary-foreground text-lg py-8 px-20 min-w-16 text-center bg-primary" />
            </div>
          </div>
        </div>
      </main>
      <Newsletter />
      <Footer />
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
