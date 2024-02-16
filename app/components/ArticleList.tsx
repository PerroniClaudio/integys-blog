import { Button } from "@/components/ui/button";
import { simpleBlogCard, Categories } from "../lib/interface";
import ArticleCard from "./ArticleCard";
import Link from "next/link";

function ArticleList({
  data,
  categories,
}: {
  data: simpleBlogCard[];
  categories: Categories[];
}) {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-5">
        <div className="col-span-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.map((post, idx) => (
              <div key={idx}>
                <ArticleCard article={post} />
              </div>
            ))}
          </div>
        </div>
        <aside className="col-span-3 hidden lg:block">
          <div className="sticky top-[117px] w-full">
            <div className="min-h-32 rounded p-8">
              <h2 className="text-lg font-bold mb-4">Voglio leggere di</h2>
              <div className="grid grid-cols-2 gap-1">
                {categories.map((category, idx) => (
                  <Link href={`/categorie/${category.slug}`} key={idx}>
                    <Button className="rounded-full text-primary-foreground text-sm py-1 px-2 w-full text-center">
                      {category.name}
                    </Button>
                  </Link>
                ))}
              </div>

              <hr className="border border-secondary my-4" />

              <Link href="/contattaci">
                <Button
                  variant={"secondary"}
                  className="text-secondary-foreground text-sm py-1 px-2 min-w-16 text-center">
                  Contattaci
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
export default ArticleList;
