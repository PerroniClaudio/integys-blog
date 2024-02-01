import { fullBlog } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

async function getData(slug: string) {
  const query = `
        *[_type == 'blog' && slug.current == '${slug}'] {
            title,
            smallDescription,
            titleImage,
            body,
            "currentSlug": slug.current,
        }[0]
    `;

  const data = await client.fetch(query);

  return data;
}
export const revalidate = 30;
async function BlogArticle({ params }: { params: { slug: string } }) {
  const data: fullBlog = await getData(params.slug);
  return (
    <div className="mt-8">
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

      <div className="mt-16 prose prose-red prose-lg dark:prose-invert prose-li:marker:text-primary prose-a:text-primary">
        <PortableText value={data.body} />
      </div>
    </div>
  );
}
export default BlogArticle;
