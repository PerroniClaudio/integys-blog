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
  firstArticles?: ArticleCard[];
};

export type ArticleCard = JSX.Element;

function AdditiveArticleList({ category, limited = false, firstArticles }: Props) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<ArticleCard[]>(firstArticles ?? []);
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

  const getClassNames = (index: number) => {
    // Determina se l'elemento deve occupare 2 colonne
    if (index % 10 === 0 || (index - 6) % 10 === 0) {
      // return 'lg:col-span-2';
      return 'lg:w-2/3';
    }
    return 'lg:w-1/3';
  };

  useEffect(() => {
    if (inView) {
      if(page > 0) {
        fetchData();
      }
    }
  }, [inView, data, category, limited]);

  return (
    // Poi si decide sa ordinarli direttamente da qui o dal genitore (grid ecc.)
    <>
      {data.map((post, index) => (
        <div className={`h-full w-full md:w-1/2 ${getClassNames(index)}`} key={index}>
          {post}
        </div>  
      ))}

      <section className="flex justify-center items-center w-full col-span-3">
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
export default AdditiveArticleList;
