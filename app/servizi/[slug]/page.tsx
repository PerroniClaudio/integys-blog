export const dynamic = "force-dynamic";

import Navbar from "@/app/components/Navbar";
import NavbarServizi from "@/app/components/NavbarServizi";
import { fullService } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import ContactUs from "@/components/ui/contact-us";
import { PortableText } from "@portabletext/react";
import { Metadata } from "next";
import Image from "next/image";

async function getData(slug: string) {
  // && date < now()
  const query = `
        *[_type == 'servizi' && slug.current == '${slug}'] {
            title,
            short,
            smallDescription,
            titleImage,
            body,
            "currentSlug": slug.current,
        }[0]
    `;

  const data = await client.fetch(query);

  return data;
}

export async function generateStaticParams() {
  const query = `
    *[_type == 'servizi'] {
      title,
      short,
      smallDescription,
      titleImage,
      body,
      "currentSlug": slug.current,
    }
  `;

  const data: fullService[] = await client.fetch(query);

  return data.map(({ currentSlug }) => currentSlug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data: fullService = await getData(params.slug);

  return {
    title: data.title,
    description: data.smallDescription,
    openGraph: {
      images: [
        {
          url: urlFor(data.titleImage).url(),
          alt: data.title,
        },
      ],
    },
  };
}

export const revalidate = 30;
async function ServicePage({ params }: { params: { slug: string } }) {
  const data: fullService = await getData(params.slug);
  return (
    <>
      <Navbar shouldChangeColor={false} />
      <NavbarServizi isGlobal={false} />

      <div className="relative mt-16 xl:mt-24 w-full h-[30rem] flex justify-center items-center overflow-hidden">
        {/* <div className="absolute inset-0 bg-primary/60 brightness-50 dark:bg-secondary/60 dark:brightness-100 z-10" /> */}
        <div className="relative w-full h-full max-w-[1920px]">
          <Image
        src={urlFor(data.titleImage).url()}
        alt={data.title}
        priority
        layout="fill"
        objectFit="cover"
        className="w-full h-full"
          />
        </div>
      </div>

      <main className="max-w-8xl mx-auto px-4 py-16">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
            {data.title}
          </h1>

          {/* <Image
            src={urlFor(data.titleImage).url()}
            alt={data.title}
            width={800}
            height={800}
            priority
            className="rounded-lg mt-8 border shadow-sm"
          /> */}
          
          <div className="mt-12 prose prose-red prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary w-full xl:max-w-screen-md">
            <PortableText value={data.body} />

            {/* <hr className="border border-secondary my-4" /> */}

            {/* <p className="font-bold text-2xl">
              Prenota una sessione di presentazione dei nostri servizi per sviluppare un piano d&rsquo;azione Cybersecurity personalizzato.
            </p>

            <Link href="/contattaci">
              <Button
                variant={"secondary"}
                className="text-secondary-foreground text-lg py-8 px-12 min-w-16 text-center bg-primary w-full">
                Contattaci
              </Button>
            </Link> */}
          </div>
        </div>
      </main>
      {/* <section className="py-8 border-t border-primary">
        <div className="container mx-auto flex flex-col gap-4 justify-between items-center">
          <h2 className="font-bold text-3xl text-center">
            Prenota una sessione di presentazione dei nostri servizi per sviluppare un piano d&rsquo;azione Cybersecurity personalizzato.
          </h2>

          <Link href="/contattaci">
            <Button
              variant={"secondary"}
              className="text-secondary-foreground text-lg py-8 px-12 min-w-16 text-center bg-primary w-full">
              Contattaci
            </Button>
          </Link>
        </div>
      </section> */}
      <ContactUs />
      {/* <Newsletter /> */}
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

export default ServicePage;
