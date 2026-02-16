"use client";

import NewsletterButton from "./newsletter-button";
import { useTranslation } from "@/lib/useTranslation";

type Props = {};

function Newsletter({}: Props) {
  const { t } = useTranslation();

  return (
    <section className="py-8 border-t border-primary">
      <div className="container mx-auto flex flex-col gap-4 justify-between items-center">
        <h2 className="font-bold text-3xl text-center">
            {t("cta.exclusiveContent")}
        </h2>
        <h3 className="text-center font-semibold text-xl">
            {t("cta.expandKnowledge")}
        </h3>

        <NewsletterButton className="text-secondary-foreground text-lg py-8 px-20 min-w-16 text-center bg-primary" />
      </div>
    </section>
  );
}

export default Newsletter;
