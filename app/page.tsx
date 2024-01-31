import { Card, CardContent } from "@/components/ui/card";
import { simpleBlogCard } from "./lib/interface";
import { client, urlFor } from "./lib/sanity";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData() {
  const query = `
    *[_type == 'blog'] | order(_createdAt desc) {
      title,
      smallDescription,
      titleImage,
      "currentSlug": slug.current,
    }
  `;

  const data = await client.fetch(query);

  return data;
}

export default async function Home() {
  const data: simpleBlogCard[] = await getData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
      {data.map((post, idx) => {
        return (
          <Card key={idx}>
            <Image
              src={urlFor(post.titleImage).url()}
              alt={post.title}
              width={500}
              height={500}
              className="rounded-t-lg h-[200px] w-full object-cover"
            />
            <CardContent className="mt-5">
              <h3 className="text-lg line-clamp-2 font-bold">{post.title}</h3>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
                {post.smallDescription}
              </p>

              <Button asChild className="w-full mt-7">
                <Link href={`/blog/${post.currentSlug}`}>
                  Continua a leggere
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}