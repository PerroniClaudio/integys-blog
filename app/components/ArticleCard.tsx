import { simpleBlogCard } from "../lib/interface";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { urlFor } from "@/app/lib/sanity";

function ArticleCard({ article }: { article: simpleBlogCard }) {
  return (
    <Card>
      <Image
        src={urlFor(article.titleImage).url()}
        alt={article.title}
        width={500}
        height={500}
        className="rounded-t-lg h-[200px] w-full object-cover"
      />
      <CardContent className="mt-5">
        <h3 className="text-lg line-clamp-2 font-bold">{article.title}</h3>
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
          {article.smallDescription}asd
        </p>
        <Button asChild className="w-full mt-7">
          <Link href={`/news/${article.currentSlug}`}>Continua a leggere</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
export default ArticleCard;
