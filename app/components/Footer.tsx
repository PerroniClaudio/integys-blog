"use client";

import UserNotice from "@/components/cookies/UserNotice";
import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";
import { usePathname } from "next/navigation";

type FooterProps = {
  isAbsolute?: boolean;
};

function Footer({ isAbsolute = true }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const pathname = usePathname() || '';
  
  // Estrai il locale dal pathname
  const segments = pathname.split('/').filter(Boolean);
  const localeFromPath = segments[0];
  const locale = ['it', 'en'].includes(localeFromPath) ? localeFromPath : 'it';

  return (
    <footer
      className={
        "w-full py-6 border-t border-white " +
        (isAbsolute ? " absolute bottom-0 " : "")
      }>
      <div className="container flex items-center justify-between gap-4 px-4 text-sm md:gap-6 min-h-32">
        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}`}
            className={`font-bold text-3xl text-white dark:hidden`}>
            <div className="flex items-center gap-1 ">
              <img
                src="/integys-white-big-text.png"
                alt="Integys"
                className="h-12 w-auto"
              />
            </div>
          </Link>
          <Link
            href={`/${locale}`}
            className={`font-bold text-3xl text-white hidden dark:block`}>
            <div className="flex items-center gap-1 ">
              <img
                src="/integys-white-big-text.png"
                alt="Integys"
                className="h-12 w-auto"
              />
            </div>
          </Link>
        </div>
        <nav className="flex flex-col items-center gap-2">
          <p>{t("footer.companyInfo")}</p>
          <p>{t("footer.companyDetails")}</p>
          <p>{t("footer.legalAddress")}</p>
          <p>Copyright © {currentYear}. All Rights Reserved.</p>
        </nav>
        <div className="flex flex-col items-right ">
          <Link
            className="text-right"
            href="https://integys.com/privacy-policy/">
            Privacy Policy
          </Link>
          <Link
            className="text-right"
            href="https://integys.com/cookie-policy/">
            Cookie Policy
          </Link>
          <Link className="text-right" href="https://integys.com/note-legali/">
            {t("footer.legalNotes")}
          </Link>
          <UserNotice />
        </div>
      </div>
    </footer>
  );
}
export default Footer;
