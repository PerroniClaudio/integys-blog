import Navbar from "@/app/components/Navbar";
import { fullBlog } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

async function getData(slug: string) {
  const query = `
        *[_type == 'blog' && slug.current == '${slug}'] {
            title,
            smallDescription,
            titleImage,
            body,
            "currentSlug": slug.current,
            categories
        }[0]
    `;

  const data = await client.fetch(query);

  return data;
}
export const revalidate = 30;
async function BlogArticle({ params }: { params: { slug: string } }) {
  const data: fullBlog = await getData(params.slug);
  return (
    <>
      <Navbar shouldChangeColor={false} />
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="mt-8 w-full flex flex-col items-center">
          <h1 className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight sm:text-4xl">
            {data.title}
          </h1>

          <Image
            src={urlFor(data.titleImage).url()}
            alt={data.title}
            width={800}
            height={800}
            priority
            className="rounded-lg mt-8 border shadow-sm"
          />

          <div className="mt-16 prose prose-red prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary w-full">
            <PortableText value={data.body} />

            <hr className="border border-secondary my-4" />

            <p>Vuoi saperne di più?</p>

            <Link href="/contattaci">
              <Button
                variant={"secondary"}
                className="text-secondary-foreground text-sm py-1 px-2 min-w-16 text-center">
                Contattaci
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
export default BlogArticle;
