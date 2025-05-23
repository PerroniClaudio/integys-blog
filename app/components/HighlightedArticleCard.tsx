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

function HighlightedArticleCard({
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
    <div className="m-auto w-11/12 lg:w-2/3 2xl:w-1/2 h-full">
      <Card className="h-full p-6">
        <Image
          src={article.titleImage ? (urlFor(article.titleImage)?.url() || "/opengraph-integys.png") : "/opengraph-integys.png"}
          alt={article.title}
          width={500}
          height={500}
          className="rounded-lg h-[200px] md:h-[300px] lg:h-[400px] w-full object-cover"
        />
        {/* Se si vogliono differenziare penso basti questa riga. da decidere il testo all'interno */}
        {/* {!!isPreview &&  
          <div className="text-center bg-metallic-silver text-gray-700 font-semibold " >Preview</div>
        } */}
        <CardContent className="mt-5 p-0 flex-1 flex flex-col justify-between gap-7">
          <div>
            <h3 className="text-lg lg:text-3xl font-bold text-center">{article.title}</h3>
            {/* <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
              {article.smallDescription}
            </p> */}
          </div>
          {/* <Button asChild className="w-full"> */}
          <Button asChild className="w-fit py-6 px-12 text-lg m-auto">
            {/* Se l'articolo è limited allora siamo in area riservata. A meno che non sia una preview */}
            <Link href={isPreview 
              ?  `/preview/${article.currentSlug}`  
              : ( limited 
                  ? `/riservata/post/${article.currentSlug}`
                  : `/news/${article.currentSlug}`) 
              }>
              Scopri di più
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default HighlightedArticleCard;
