import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode
} from "react";
import {
  DEFAULT_LANGUAGE,
  LOCALE_DIRECTIONS,
  type SupportedLocale
} from "../../../shared/i18n";
import type { 
  ClockSettings, 
  GlassAppearance, 
  TextContrastTone 
} from "../../../shared/types";

type ClockSettingsContextValue = ClockSettings & {
  setAutoTextContrast: (enabled: boolean) => void;
  setAppearance: (appearance: GlassAppearance) => void;
  setLanguage: (language: SupportedLocale) => void;
  setTextContrastTone: (tone: TextContrastTone) => void;
};

const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  autoTextContrast: true,
  appearance: "liquid",
  language: DEFAULT_LANGUAGE,
  textContrastTone: "light"
};

const ClockSettingsContext = createContext<ClockSettingsContextValue | null>(null);

type ClockSettingsProviderProps = {
  children: ReactNode;
};

export function ClockSettingsProvider({ children }: ClockSettingsProviderProps): ReactElement {
  const [settings, setSettings] = useState<ClockSettings>(DEFAULT_CLOCK_SETTINGS);

  useEffect(() => {
    const settingsApi = window.clockSettings;

    if (!settingsApi) {
      return undefined;
    }

    let active = true;

    void settingsApi
      .getSettings()
      .then((nextSettings) => {
        if (active) {
          setSettings(nextSettings);
        }
      })
      .catch(() => {});

    const unsubscribe = settingsApi.onSettingsChanged((nextSettings) => {
      setSettings(nextSettings);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = LOCALE_DIRECTIONS[settings.language];
  }, [settings.language]);

  const setAutoTextContrast = useCallback((enabled: boolean): void => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      autoTextContrast: enabled
    }));
    void window.clockSettings?.setSettings({ autoTextContrast: enabled }).catch(() => {});
  }, []);

  const setAppearance = useCallback((appearance: GlassAppearance): void => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      appearance
    }));
    void window.clockSettings?.setSettings({ appearance }).catch(() => {});
  }, []);

  const setLanguage = useCallback((language: SupportedLocale): void => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      language
    }));
    void window.clockSettings?.setSettings({ language }).catch(() => {});
  }, []);

  const setTextContrastTone = useCallback((textContrastTone: TextContrastTone): void => {
    setSettings((currentSettings) => {
      if (currentSettings.textContrastTone === textContrastTone) {
        return currentSettings;
      }

      return {
        ...currentSettings,
        textContrastTone
      };
    });
    void window.clockSettings?.setSettings({ textContrastTone }).catch(() => {});
  }, []);

  const value = useMemo<ClockSettingsContextValue>(
    () => ({
      ...settings,
      setAutoTextContrast,
      setAppearance,
      setLanguage,
      setTextContrastTone
    }),
    [setAppearance, setAutoTextContrast, setLanguage, setTextContrastTone, settings]
  );

  return <ClockSettingsContext.Provider value={value}>{children}</ClockSettingsContext.Provider>;
}

export function useClockSettings(): ClockSettingsContextValue {
  const context = useContext(ClockSettingsContext);

  if (!context) {
    throw new Error("useClockSettings must be used within ClockSettingsProvider.");
  }

  return context;
}
