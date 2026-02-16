"use client";

import { useTranslation } from "@/lib/useTranslation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ContactUsButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  href?: string;
}

export default function ContactUsButton({ 
  variant = "default", 
  className = "", 
  href = "/contattaci" 
}: ContactUsButtonProps) {
  const { t } = useTranslation();

  return (
    <Link href={href}>
      <Button variant={variant} className={className}>
        {t("cta.contactUs")}
      </Button>
    </Link>
  );
}