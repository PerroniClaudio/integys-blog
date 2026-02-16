"use client";

import { useTranslation } from "@/lib/useTranslation";
import Link from "next/link";

interface ContactUsLinkProps {
  className?: string;
  href?: string;
}

export default function ContactUsLink({ 
  className = "", 
  href = "/contattaci" 
}: ContactUsLinkProps) {
  const { t } = useTranslation();

  return (
    <Link href={href} className={className}>
      {t("cta.contactUs")}
    </Link>
  );
}