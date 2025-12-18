"use client";

import ArticleCard from "./ArticleCard";
import {
  // getDataWithPagination,
  // getDataWithPaginationCategories,
  getPreviewCards,
} from "../actions";
// import { useInView } from "react-intersection-observer";
import { useState, useEffect, ReactElement } from "react";

type Props = {
  category?: string;
  limited?: boolean;
};

export type ArticleCard = ReactElement;

function ArticleList({ category, limited = false }: Props) {
  const [data, setData] = useState<ArticleCard[]>([]);

  // Per ora senza limitare la categoria. poi vediamo se ci sono abbastanza articoli da permetterci di farlo (almeno 3 articoli in area riservata per categoria)
  getPreviewCards().then((data) => {
      setData(data);
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{data}</div>
    </>
  );
}
export default ArticleList;
