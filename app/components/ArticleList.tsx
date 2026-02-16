"use client";

import ArticleCard from "./ArticleCard";
import {
  getDataWithPaginationI18n,
  getDataWithPaginationCategoriesI18n,
} from "@/app/actions-i18n";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/useTranslation";

type Props = {
  category?: string;
  limited?: boolean;
  locale?: string;
};

export type ArticleCard = ReactElement;

function ArticleList({ category, limited = false, locale = 'it' }: Props) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<ArticleCard[]>([]);
  const [page, setPage] = useState<number>(2);
  const { t } = useTranslation();
  
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchData = async () => {
    setIsFetching(true);
    if (category) {
      const result = await getDataWithPaginationCategoriesI18n(category, page, 6, locale, limited);
      if(result.length > 0) {
        setData((prev) => [...prev, ...result]);
        setPage(prev => prev + 1);
      } else {
        setPage(0);
        console.log("no more data");
      }
    } else {
      const result = await getDataWithPaginationI18n(page, 6, locale, limited);
      if(result.length > 0) {
        setData((prev) => [...prev, ...result]);
        setPage(prev => prev + 1);
      } else {
        setPage(0);
        console.log("no more data");
      }
    }
    setIsFetching(false);
  }

  useEffect(() => {
    if (inView) {
      if(page > 0) {
        fetchData();
      }
    }
  }, [inView, data, category, limited, locale]);

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
              {locale === 'it' ? 'Carica altri articoli' : 'Load more articles'}
            </Button>
          </div>
        }
      </section>
    </>
  );
}
export default ArticleList;
