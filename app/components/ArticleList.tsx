"use client";

import ArticleCard from "./ArticleCard";
import {
  getDataWithPagination,
  getDataWithPaginationCategories,
} from "../actions";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  category?: string;
  limited?: boolean;
};

export type ArticleCard = JSX.Element;

function ArticleList({ category, limited = false }: Props) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<ArticleCard[]>([]);
  const [page, setPage] = useState<number>(2);
  
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchData = async () => {
    setIsFetching(true);
    if (category) {
      getDataWithPaginationCategories(category, page, 6, limited).then((data) => {
        if(data.length > 0) {
          setData((prev) => [...prev, ...data]);
          setPage(prev => prev + 1);
        } else {
          setPage(0);
          console.log("no more data");
        }
      });
    } else {
      getDataWithPagination(page, 6, limited).then((data) => {
        if(data.length > 0) {
          setData((prev) => [...prev, ...data]);
          setPage(prev => prev + 1);
        } else {
          setPage(0);
          console.log("no more data");
        }
      });
    }
    setIsFetching(false);
  }

  useEffect(() => {
    if (inView) {
      if(page > 0) {
        fetchData();
      }
    }
  }, [inView, data, category, limited]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{data}</div>

      <section className="flex justify-center items-center w-full col-span-2">
        {page <= 3 &&
          <div ref={ref}>
            <div className="loading loading-spinner loading-lg text-primary" />
          </div>
        }
        {page > 3 &&
          <div className="mt-8" >
            <Button onClick={fetchData} className="btn btn-primary font-semibold">
              Carica altri articoli
            </Button>
          </div>
        }
      </section>
    </>
  );
}
export default ArticleList;
