"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";
import { usePathname } from "next/navigation";

function Hero() {
  const { t } = useTranslation();
  const pathname = usePathname() || '';
  
  // Estrai il locale dal pathname
  const segments = pathname.split('/').filter(Boolean);
  const localeFromPath = segments[0];
  const locale = ['it', 'en'].includes(localeFromPath) ? localeFromPath : 'it';
  
  return (
    <div
      className="relative"
      style={{
        // backgroundImage: "url('/ente.jpg')",
        backgroundImage: "url('/mani.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      {/* <div className="absolute inset-0 bg-primary/50 brightness-50 dark:bg-secondary/70 dark:brightness-100 z-10" /> */}
      <div className="absolute inset-0 bg-black/30 brightness-100 dark:bg-black/30 dark:brightness-100 z-10" />
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-36 mt-16 relative z-20">
        <div className="container px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col gap-8 items-center text-center">
            <div className="space-y-8">
              <h1
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary-foreground"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                Integys Information Center
              </h1>
              <p
                className="mx-auto max-w-[700px] text-gray-100 md:text-xl dark:text-gray-300 font-bold"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                {t("home.description")}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                className="text-nowrap w-[200px] sm:w-[220px] inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-sm sm:text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href={`/${locale}/servizi`}>
                {t("navigation.discoverServices")}
              </Link>
              <Link
                className="text-nowrap w-[200px] sm:w-[220px] inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-sm sm:text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href={`/${locale}/contattaci`}>
                {t("cta.contactUs")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Hero;
