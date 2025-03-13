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
  limited = false,
  isPreview = false
}: {
  article: simpleBlogCard;
  index: number;
  limited?: boolean;
  isPreview?: boolean;
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
        {!!isPreview &&  
          // <div className="text-center bg-accent text-accent-foreground font-semibold">Preview</div>
          <div className="text-center bg-metallic-silver text-gray-700 font-semibold " >Preview</div>
        }
        <CardContent className="mt-5 flex-1 flex flex-col justify-between gap-7">
          <div>
            <h3 className="text</MotionDiv>-lg line-clamp-2 font-bold">{article.title}</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
              {article.smallDescription}
            </p>
          </div>
          <Button asChild className="w-full">
            {/* Se l'articolo è limited allora siamo in area riservata. A meno che non sia una preview */}
            <Link href={isPreview 
              ?  `/preview/${article.currentSlug}`  
              : ( limited 
                  ? `/riservata/post/${article.currentSlug}`
                  : `/news/${article.currentSlug}`) 
              }>
              Continua a leggere
            </Link>
          </Button>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
export default ArticleCard;
