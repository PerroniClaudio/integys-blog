import { simpleBlogCard } from "../lib/interface";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { urlFor } from "@/app/lib/sanity";
import { MotionDiv } from "./MotionDiv";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function ArticleCard({
  article,
  index,
  limited = false
}: {
  article: simpleBlogCard;
  index: number;
  limited?: boolean;
}) {
  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.25, duration: 0.5, ease: "easeInOut" }}
      viewport={{ amount: 0 }}>
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
            <Link href={limited ? `/riservata/post/${article.currentSlug}` : `/news/${article.currentSlug}`}>
              Continua a leggere
            </Link>
          </Button>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
export default ArticleCard;
