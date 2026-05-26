"use client";

import { useContext } from "react";
import { CookiesContext } from "./cookiesContextProvider";
import { useTranslation } from "@/lib/useTranslation";

function CookiesPreferencesButton() {
  const { openBanner } = useContext(CookiesContext);
  const { t } = useTranslation();

  return (
    <button
      className="bg-primary text-white px-1 rounded-md shadow-lg"
      onClick={openBanner}
      type="button"
    >
      {t("cookiesBanner.preferencesButton")}
    </button>
  );
}

export default CookiesPreferencesButton;
