'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type UserPreferences = {
  all: boolean;
  isChoiceDone: boolean;
  values: {
    necessary: boolean;
    preferences: boolean;
    statistics: boolean;
    marketing: boolean;
  };
};

type PreferencesContextType = {
  userPreferences: UserPreferences | null;
  setPreferences: (newSettings: UserPreferences) => void;
};

type Props = {
  children: React.ReactNode;
};


export const PreferencesContext = createContext<PreferencesContextType>({
  userPreferences: null,
  setPreferences: () => {}
});

export function PreferencesProvider({children} : Props) {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  
  const setPreferences = (newSettings: UserPreferences) => {
    setUserPreferences(newSettings);
    localStorage.setItem("UserPrefs", JSON.stringify(newSettings));
  }


  useEffect(() => {
    // Check new key first, fallback to old key for backward compatibility
    const localSettingsString = localStorage.getItem("UserPrefs") || localStorage.getItem("CookieConsent");
    const localSettings = localSettingsString && JSON.parse(localSettingsString);
    if (localSettings){
      setUserPreferences(localSettings);
      // Migrate old key to new key if needed
      if (!localStorage.getItem("UserPrefs") && localStorage.getItem("CookieConsent")) {
        localStorage.setItem("UserPrefs", JSON.stringify(localSettings));
      }
    }
  }, []);

  return (
    <PreferencesContext.Provider value={{userPreferences, setPreferences}}>
      {children}
    </PreferencesContext.Provider>
  );
}
