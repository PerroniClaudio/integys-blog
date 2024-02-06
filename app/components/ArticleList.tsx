import { simpleBlogCard } from "../lib/interface";
import ArticleCard from "./ArticleCard";

function ArticleList({ data }: { data: simpleBlogCard[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-5">
      {data.map((post, idx) => (
        <div key={idx}>
          <ArticleCard article={post} />
        </div>
      ))}
    </div>
  );
}
export default ArticleList;
