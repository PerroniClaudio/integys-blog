"use client";

import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Cookie, X } from "lucide-react";
import { CookiesContext } from "../cookies/cookiesContextProvider";
import { useTranslation } from "@/lib/useTranslation";
import { I18nText } from "@/components/ui/I18nText";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

function CookiesBanner() {
  const { t } = useTranslation();
  const { cookiesSettings, setCookies, isBannerOpen, isReady } =
    useContext(CookiesContext);

  const [showDetails, setShowDetails] = useState(false);
  const [detailsId, setDetailsId] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [values, setValues] = useState({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  });

  useEffect(() => {
    if (cookiesSettings) {
      setValues(cookiesSettings.values);
    }
  }, [cookiesSettings]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const body = document.body;
    if (isBannerOpen) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }

    return () => {
      body.classList.remove("overflow-hidden");
    };
  }, [isBannerOpen]);

  async function handleSubmit(e: React.MouseEvent, choice: string) {
    e.preventDefault();
    setCookies({
      all:
        choice === "all"
          ? true
          : choice === "none"
            ? false
            : Object.values(values).every((value) => value === true),
      isChoiceDone: true,
      values:
        choice === "all"
          ? {
              necessary: true,
              preferences: true,
              statistics: true,
              marketing: true,
            }
          : choice === "none"
            ? {
                necessary: true,
                preferences: false,
                statistics: false,
                marketing: false,
              }
            : values,
    });
  }

  if (!isMounted || !isReady) {
    return null;
  }

  return createPortal(
    <>
      <div
        className={`fixed inset-0 bg-black opacity-30 z-[99] ${
          !isBannerOpen ? "hidden" : ""
        }`}
      />
      <div
        id="cookies-popup"
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] select-none bg-background px-1 sm:px-6
          rounded-md border-[1px] border-foreground outline outline-2 outline-background
          w-fit max-w-[calc(100vw-1.5rem)]
          ${!isBannerOpen ? "hidden" : ""}
        `}
      >
        <Cookie
          size={52}
          strokeWidth={2}
          absoluteStrokeWidth
          className="text-foreground absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3/4 sm:-translate-x-1/2 p-1 bg-background rounded-full border-[1px] border-foreground outline outline-4 outline-background"
        />
        <div className="w-fit sm:max-w-full m-auto flex flex-col justify-center items-center py-3 px-3 gap-8 lg:flex-row max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-1 text-foreground text-xs sm:text-sm">
            <div
              className={`flex justify-start gap-8 font-semibold ${
                showDetails ? "px-4" : ""
              } sm:p-0`}
            >
              {t("cookiesBanner.shortNoticeTitle")}
            </div>
            <p className={`${showDetails ? "px-4" : ""} sm:p-0`}>
              <I18nText
                i18nKey="cookiesBanner.shortNoticeDescription"
                values={{
                  link: (
                    <a
                      key="cookie-policy-link-1"
                      href={t("cookiesBanner.cookiePolicyUrl")}
                      target="_blank"
                      className="font-semibold text-neutral-600 dark:text-neutral-300"
                    >
                      {t("cookiesBanner.cookiePolicy")}
                    </a>
                  ),
                }}
              />
            </p>
            <p>
              <I18nText
                i18nKey="cookiesBanner.seePolicy"
                values={{
                  link: (
                    <a
                      key="cookie-policy-link-2"
                      href={t("cookiesBanner.cookiePolicyUrl")}
                      target="_blank"
                      className="font-semibold text-neutral-600 dark:text-neutral-300"
                    >
                      {t("cookiesBanner.cookiePolicy")}
                    </a>
                  ),
                  br: <br key="br-1" />,
                }}
              />
            </p>
            <form
              className={`flex flex-col gap-2 text-xs sm:flex-row sm:gap-4 sm:text-sm sm:p-0 ${
                showDetails ? "px-4" : ""
              }`}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="necessary"
                  id="necessary"
                  checked={true}
                  readOnly
                />
                <label htmlFor="necessary">{t("cookiesBanner.necessary")}</label>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="preferences"
                  id="preferences"
                  checked={values.preferences}
                  onChange={() =>
                    setValues({ ...values, preferences: !values.preferences })
                  }
                />
                <label htmlFor="preferences">
                  {t("cookiesBanner.preferences")}
                </label>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="statistics"
                  id="statistics"
                  checked={values.statistics}
                  onChange={() =>
                    setValues({ ...values, statistics: !values.statistics })
                  }
                />
                <label htmlFor="statistics">
                  {t("cookiesBanner.statistics")}
                </label>
              </div>
              <div className="flex gap-1">
                <input
                  type="checkbox"
                  name="marketing"
                  id="marketing"
                  checked={values.marketing}
                  onChange={() =>
                    setValues({ ...values, marketing: !values.marketing })
                  }
                />
                <label htmlFor="marketing">{t("cookiesBanner.marketing")}</label>
              </div>
              <button
                className="underline self-start text-sm hidden lg:block"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDetails(!showDetails);
                }}
              >
                {t("cookiesBanner.details")}
              </button>
            </form>
            <button
              className="underline self-start text-sm lg:hidden"
              onClick={(e) => {
                e.preventDefault();
                setShowDetails(!showDetails);
              }}
            >
              {t("cookiesBanner.details")}
            </button>
            <div className={`flex flex-col text-sm ${!showDetails ? "hidden" : ""}`}>
              <div className="flex w-fit text-xs text-neutral-600 pr-2 sm:text-sm">
                <button
                  className={`font-semibold px-1 rounded-t-md sm:px-4 ${
                    detailsId === 1
                      ? "bg-foreground text-background"
                      : "bg-transparent text-foreground"
                  }`}
                  onClick={() => setDetailsId(1)}
                >
                  {t("cookiesBanner.necessary")}
                </button>
                <button
                  className={`font-semibold px-1 rounded-t-md sm:px-4 ${
                    detailsId === 2
                      ? "bg-foreground text-background"
                      : "bg-transparent text-foreground"
                  }`}
                  onClick={() => setDetailsId(2)}
                >
                  {t("cookiesBanner.preferences")}
                </button>
                <button
                  className={`font-semibold px-1 rounded-t-md sm:px-4 ${
                    detailsId === 3
                      ? "bg-foreground text-background"
                      : "bg-transparent text-foreground"
                  }`}
                  onClick={() => setDetailsId(3)}
                >
                  {t("cookiesBanner.statistics")}
                </button>
                <button
                  className={`font-semibold px-1 rounded-t-md sm:px-4 ${
                    detailsId === 4
                      ? "bg-foreground text-background"
                      : "bg-transparent text-foreground"
                  }`}
                  onClick={() => setDetailsId(4)}
                >
                  {t("cookiesBanner.marketing")}
                </button>
              </div>
              <div
                className="bg-foreground p-4 rounded-md text-xs text-background sm:text-sm"
                style={{
                  borderTopLeftRadius: detailsId === 1 ? "0px" : "0.375rem",
                }}
              >
                <p className={`${detailsId !== 1 ? "hidden" : ""}`}>
                  {t("cookiesBanner.necessaryDetails")}
                </p>
                <p className={`${detailsId !== 2 ? "hidden" : ""}`}>
                  {t("cookiesBanner.preferencesDetails")}
                </p>
                <p className={`${detailsId !== 3 ? "hidden" : ""}`}>
                  {t("cookiesBanner.statisticsDetails")}
                </p>
                <p className={`${detailsId !== 4 ? "hidden" : ""}`}>
                  {t("cookiesBanner.marketingDetails")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-4 text-xs lg:text-sm md:whitespace-nowrap lg:flex-col">
            <button
              onClick={(e) => {
                handleSubmit(e, "all");
              }}
              id="cookies-close"
              className="px-4 py-2 bg-primary text-white font-medium rounded-md shadow-lg hover:scale-105 lg:px-2"
            >
              {t("cookiesBanner.acceptAll")}
            </button>
            <button
              onClick={(e) => {
                handleSubmit(e, "selected");
              }}
              id="cookies-close"
              className="px-4 py-2 bg-primary text-white font-medium rounded-md shadow-lg hover:scale-105 lg:px-2"
            >
              {t("cookiesBanner.acceptSelected")}
            </button>
            <button
              onClick={(e) => {
                handleSubmit(e, "none");
              }}
              id="cookies-close"
              className="px-4 py-2 bg-primary text-white font-medium rounded-md shadow-lg hover:scale-105 lg:px-2"
            >
              {t("cookiesBanner.closeWithoutAccepting")}
            </button>
          </div>
        </div>
        <div className="absolute top-1 right-0 flex gap-2 items-center z-[150]">
          <div className="relative z-[150]">
            <LanguageSwitcher />
          </div>
          <button
            onClick={(e) => {
              handleSubmit(e, "none");
            }}
            id="cookies-close"
            className="p-1 w-fit text-foreground font-medium rounded-md text-xl mt-[-0.25rem]"
          >
            <X />
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

export default CookiesBanner;
