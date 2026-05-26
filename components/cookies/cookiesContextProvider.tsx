'use client';

import { createContext, useEffect, useState } from 'react';

type CookieConsent = {
  all: boolean;
  isChoiceDone: boolean;
  values: {
    necessary: boolean;
    preferences: boolean;
    statistics: boolean;
    marketing: boolean;
  };
};

type CookiesContextType = {
  cookiesSettings: CookieConsent | null;
  setCookies: (newSettings: CookieConsent) => void;
  isBannerOpen: boolean;
  openBanner: () => void;
  closeBanner: () => void;
  isReady: boolean;
};

type Props = {
  children: React.ReactNode;
};

export const CookiesContext = createContext<CookiesContextType>({
  cookiesSettings: null,
  setCookies: () => {},
  isBannerOpen: false,
  openBanner: () => {},
  closeBanner: () => {},
  isReady: false,
});

export function CookiesContextProvider({ children }: Props) {
  const [cookiesSettings, setCookiesSettings] = useState<CookieConsent | null>(null);
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const setCookies = (newSettings: CookieConsent) => {
    setCookiesSettings(newSettings);
    localStorage.setItem("CookieConsent", JSON.stringify(newSettings));
    setIsBannerOpen(false);
  };

  const openBanner = () => {
    setIsBannerOpen(true);
  };

  const closeBanner = () => {
    setIsBannerOpen(false);
  };

  useEffect(() => {
    try {
      const localSettingsString = localStorage.getItem("CookieConsent");
      const localSettings = localSettingsString ? JSON.parse(localSettingsString) : null;

      if (localSettings?.isChoiceDone) {
        setCookiesSettings(localSettings);
        setIsBannerOpen(false);
      } else {
        setIsBannerOpen(true);
      }
    } catch {
      setIsBannerOpen(true);
    } finally {
      setIsReady(true);
    }
  }, []);

  return (
    <CookiesContext.Provider
      value={{
        cookiesSettings,
        setCookies,
        isBannerOpen,
        openBanner,
        closeBanner,
        isReady,
      }}
    >
      {children}
    </CookiesContext.Provider>
  );
}
