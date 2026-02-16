"use client";

import { useTranslation } from "@/lib/useTranslation";


export default function ServicesPageTitle() {
  const { t } = useTranslation();

  return (
    <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-primary-foreground">
      {t("services.pageTitle")}
    </h1>
  );
}