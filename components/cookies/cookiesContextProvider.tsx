'use client';

import { createContext, useContext, useEffect, useState } from 'react';

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
};

type Props = {
  children: React.ReactNode;
};


export const CookiesContext = createContext<CookiesContextType>({
  cookiesSettings: null,
  setCookies: () => {}
});

export function CookiesContextProvider({children} : Props) {
  const [cookiesSettings, setCookiesSettings] = useState<CookieConsent | null>(null);
  
  const setCookies = (newSettings: CookieConsent) => {
    setCookiesSettings(newSettings);
    localStorage.setItem("CookieConsent", JSON.stringify(newSettings));
  }


  useEffect(() => {
    const localSettingsString = localStorage.getItem("CookieConsent");
    const localSettings = localSettingsString && JSON.parse(localSettingsString);
    if (localSettings){
      setCookiesSettings(localSettings);
    }
  }, []);

  return (
    <CookiesContext.Provider value={{cookiesSettings, setCookies}}>
      {children}
    </CookiesContext.Provider>
  );
}