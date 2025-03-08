import { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
  calculationMethod: 2, // 1-7 (1: MWL, 2: ISNA, etc.)
  timeFormat: '12h', // 12h or 24h
  adjustments: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
  notifications: {
    enabled: false, // Ensure this is false by default
    beforePrayer: 15, // minutes
  },
  theme: 'light',
  language: 'en',
};


export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('adhanSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('adhanSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateAdjustment = (prayer, minutes) => {
    setSettings(prev => ({
      ...prev,
      adjustments: {
        ...prev.adjustments,
        [prayer]: minutes,
      }
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateAdjustment,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
