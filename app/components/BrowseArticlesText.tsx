"use client";

import { useTranslation } from "@/lib/useTranslation";

export default function BrowseArticlesText() {
  const { t } = useTranslation();

  return (
    <h2 className="text-lg font-bold md:whitespace-nowrap">
      {t('home.browseArticles')}
    </h2>
  );
}