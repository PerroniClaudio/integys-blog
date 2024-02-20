"use client";

import ArticleCard from "./ArticleCard";
import { getDataWithPagination } from "../actions";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

export type ArticleCard = JSX.Element;

let page = 2;

function ArticleList() {
  const { ref, inView } = useInView();
  const [data, setData] = useState<ArticleCard[]>([]);

  useEffect(() => {
    if (inView) {
      getDataWithPagination(page, 4).then((data) => {
        setData((prev) => [...prev, ...data]);
        page++;
      });
    }
  }, [inView, data]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{data}</div>

      <section className="flex justify-center items-center w-full col-span-2">
        <div ref={ref}>
          <div className="loading loading-spinner loading-lg text-primary" />
        </div>
      </section>
    </>
  );
}
export default ArticleList;
