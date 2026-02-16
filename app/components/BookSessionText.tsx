"use client";

import { useTranslation } from "@/lib/useTranslation";

export default function BookSessionText() {
  const { t } = useTranslation();

  return (
    <p className="font-bold text-2xl">
      {t("cta.bookSession")}
    </p>
  );
}