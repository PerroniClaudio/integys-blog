"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/useTranslation";
import { usePathname } from "next/navigation";

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0 opacity-80 transition-transform duration-200 group-hover:translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function Hero() {
  const { t } = useTranslation();
  const pathname = usePathname() || '';
  
  // Estrai il locale dal pathname
  const segments = pathname.split('/').filter(Boolean);
  const localeFromPath = segments[0];
  const locale = ['it', 'en'].includes(localeFromPath) ? localeFromPath : 'it';

  const audienceBasePath = locale === 'en' ? 'arguments' : 'argomenti';
  const enterprisesSlug = locale === 'en' ? 'enterprises' : 'aziende';
  const publicAdministrationSlug = locale === 'en' ? 'public-administration' : 'pubblica-amministrazione';
  const audienceLinks = [
    {
      href: `/${locale}/${audienceBasePath}/${enterprisesSlug}`,
      icon: "/aziende-logo.webp",
      title: t("home.forEnterprises"),
      subtitle: t("home.enterprisesArticles"),
    },
    {
      href: `/${locale}/${audienceBasePath}/${publicAdministrationSlug}`,
      icon: "/enti-logo.webp",
      title: t("home.forPublicAdministration"),
      subtitle: t("home.publicAdministrationArticles"),
    },
  ];
  
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
      {/* <div className="absolute inset-0 bg-black/30 brightness-100 dark:bg-black/30 dark:brightness-100 z-10" /> */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent from-15% via-50% to-transparent z-10" />
      <section className="w-full pt-12 md:py-24 lg:py-32 xl:py-36 mt-16 relative z-20 ">
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
                className="mx-auto max-w-[700px] md:text-xl font-bold"
                style={{
                  textShadow: "0 0 6px rgba(0,0,0,0.5)",
                }}>
                {t("home.description")}
              </p>
            </div>
            <div className="flex gap-4">
              {/* <Link
                className="text-nowrap w-[200px] sm:w-[220px] inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-2 text-sm sm:text-lg font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-secondary-foreground dark:hover:bg-primary/90 dark:focus-visible:ring-gray-300"
                href={`/${locale}/servizi`}>
                {t("navigation.discoverServices")}
              </Link> */}
              <Link
                className="text-nowrap w-[200px] sm:w-[220px] inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm sm:text-lg font-medium text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/80 hover:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                href={`/${locale}/contattaci`}>
                {t("cta.contactUs")}
              </Link>
            </div>
          </div>
          
          <div className="mt-24 flex flex-col items-center justify-center gap-3 py-4 sm:flex-row xl:gap-12">
            {audienceLinks.map((link) => (
              <Link
                key={link.href}
                className="group inline-flex h-[7rem] w-full items-center justify-between gap-4 rounded-md bg-primary px-4 py-3 text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/80 hover:shadow-xl sm:w-[22rem]"
                href={link.href}
              >
                <span className="flex min-w-0 items-center gap-3 text-left">
                  <span className="shrink-0">
                    <Image
                      alt=""
                      aria-hidden="true"
                      height={75}
                      src={link.icon}
                      width={75}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-tight sm:text-base">
                      {link.title}
                    </span>
                    <span className="block text-xs text-primary-foreground/80 sm:text-sm">
                      {link.subtitle}
                    </span>
                  </span>
                </span>
                <ChevronRightIcon />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
export default Hero;
