"use client";

import CookiesBanner from "@/components/cookies/CookiesBanner";
import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";

type FooterProps = {
  isAbsolute?: boolean;
};

function Footer({ isAbsolute = true }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer
      className={
        "w-full py-6 border-t border-primary " +
        (isAbsolute ? " absolute bottom-0 " : "")
      }>
      <div className="container flex items-center justify-between gap-4 px-4 text-sm md:gap-6 min-h-32">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className={`font-bold text-3xl text-primary dark:hidden`}>
            <div className="flex items-center gap-1 ">
              <div className="p-1">
                <img src="/integys.png" alt="Integys" className="h-8 w-auto" />
              </div>

              <span>INTEGYS</span>
            </div>
          </Link>
          <Link
            href="/"
            className={`font-bold text-3xl text-primary hidden dark:block`}>
            <div className="flex items-center gap-1 ">
              <div className="p-1">
                <img
                  src="/integys-white-sphere.png"
                  alt="Integys"
                  className="h-8 w-auto"
                />
              </div>

              <span>INTEGYS</span>
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
          <CookiesBanner />
        </div>
      </div>
    </footer>
  );
}
export default Footer;
