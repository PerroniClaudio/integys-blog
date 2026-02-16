"use client";

import { useTranslation } from "@/lib/useTranslation";


export default function ServicesPageSubtitle() {
  const { t } = useTranslation();

  return (
    <p className="text-xl lg:text-2xl font-semibold text-gray-50 mb-8 flex flex-col gap-2">
      <span>{t("services.pageSubtitle")}</span>
      <span>{t("cta.bookSession")}</span>
    </p>
  );
}