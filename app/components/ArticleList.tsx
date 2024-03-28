"use client";

import ArticleCard from "./ArticleCard";
import {
  getDataWithPagination,
  getDataWithPaginationCategories,
} from "../actions";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

export type ArticleCard = JSX.Element;

function ArticleList({ category }: { category?: string }) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<ArticleCard[]>([]);
  const [page, setPage] = useState<number>(2);

  useEffect(() => {
    if (inView) {
      if (category) {
        getDataWithPaginationCategories(category, page, 6).then((data) => {
          setData((prev) => [...prev, ...data]);
          setPage(prev => prev + 1);
        });
      } else {
        getDataWithPagination(page, 6).then((data) => {
          setData((prev) => [...prev, ...data]);
          setPage(prev => prev + 1);
        });
      }
    }
  }, [inView, data, category]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{data}</div>

      <section className="flex justify-center items-center w-full col-span-2">
        <div ref={ref}>
          <div className="loading loading-spinner loading-lg text-primary" />
        </div>
      </section>
    </>
  );
}
export default ArticleList;
