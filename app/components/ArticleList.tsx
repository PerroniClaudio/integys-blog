"use client";

import ArticleCard from "./ArticleCard";
import {
  getDataWithPaginationI18n,
  getDataWithPaginationCategoriesI18n,
  getDataWithPaginationCategoryFiltersI18n,
} from "@/app/actions-i18n";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, useRef, ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/useTranslation";

type Props = {
  category?: string;
  fixedCategoryIdMultilingua?: string;
  limited?: boolean;
  locale?: string;
};

export type ArticleCard = ReactElement;

function ArticleList({ category, fixedCategoryIdMultilingua, limited = false, locale = 'it' }: Props) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<ArticleCard[]>([]);
  const [page, setPage] = useState<number>(2);
  const { t } = useTranslation();
  
  const isFetching = useRef(false);

  const fetchData = async () => {
    if (isFetching.current || page === 0) return;

    isFetching.current = true;
    try {
      const result = fixedCategoryIdMultilingua
        ? await getDataWithPaginationCategoryFiltersI18n(fixedCategoryIdMultilingua, category, page, 6, locale, limited, true)
        : category
          ? await getDataWithPaginationCategoriesI18n(category, page, 6, locale, limited, true)
          : await getDataWithPaginationI18n(page, 6, locale, limited, true);

      if (result.length > 0) {
        setData((prev) => [...prev, ...result]);
        setPage((currentPage) => currentPage + 1);
      } else {
        setPage(0);
      }
    } finally {
      isFetching.current = false;
    }
  }

  useEffect(() => {
    if (inView && page > 0 && page <= 3) {
      fetchData();
    }
  }, [inView, page, category, fixedCategoryIdMultilingua, limited, locale]);

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
