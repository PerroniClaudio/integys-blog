import { Button } from "@/components/ui/button";
import { simpleBlogCard } from "../lib/interface";
import ArticleCard from "./ArticleCard";

function ArticleList({ data }: { data: simpleBlogCard[] }) {
  let categories = Array.from(
    new Set(
      data.flatMap((post) => post.categories.map((category) => category.name))
    )
  );

  console.log(categories);
  return (
    <div className="py-8">
      <div className="grid grid-cols-8 gap-5">
        <div className="col-span-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.map((post, idx) => (
              <div key={idx}>
                <ArticleCard article={post} />
              </div>
            ))}
          </div>
        </div>
        <aside className="col-span-3">
          <div className="sticky top-[117px] w-full">
            <div className="min-h-32 rounded p-8">
              <h2 className="text-lg font-bold mb-4">Voglio leggere di</h2>
              <div className="flex flex-wrap gap-1">
                {categories.map((category, idx) => (
                  <Button
                    key={idx}
                    className="rounded-full text-primary-foreground text-sm py-1 px-2 min-w-16 text-center">
                    <a href="#">{category}</a>
                  </Button>
                ))}
              </div>

              <hr className="border border-secondary my-8" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
export default ArticleList;

{
  /* <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
      {data.map((post, idx) => (
        <div key={idx}>
          <ArticleCard article={post} />
        </div>
      ))}
    </div> */
}
