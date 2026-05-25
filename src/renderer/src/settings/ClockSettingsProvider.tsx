import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LANGUAGE_PREFERENCE,
  LOCALE_DIRECTIONS,
  resolveSupportedLocale,
  type LanguagePreference,
  type SupportedLocale,
} from '../../../shared/i18n';
import type {
  ClockSettings,
  GlassAppearance,
  TextContrastTone,
  TimeFormat,
} from '../../../shared/types';

type ClockSettingsContextValue = ClockSettings & {
  effectiveLanguage: SupportedLocale;
  setAutoTextContrast: (enabled: boolean) => void;
  setAppearance: (appearance: GlassAppearance) => void;
  setLanguage: (language: LanguagePreference) => void;
  setLaunchAtLogin: (enabled: boolean) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setTextContrastTone: (tone: TextContrastTone) => void;
};

const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  autoTextContrast: true,
  appearance: 'liquid',
  language: DEFAULT_LANGUAGE_PREFERENCE,
  launchAtLogin: true,
  timeFormat: '24h',
  textContrastTone: 'light',
};

const ClockSettingsContext = createContext<ClockSettingsContextValue | null>(
  null,
);

type ClockSettingsProviderProps = {
  children: ReactNode;
};

function getBrowserLanguages(): string[] {
  if (navigator.languages.length > 0) {
    return [...navigator.languages];
  }

  return [navigator.language];
}

export function ClockSettingsProvider({
  children,
}: ClockSettingsProviderProps): ReactElement {
  const [settings, setSettings] = useState<ClockSettings>(
    DEFAULT_CLOCK_SETTINGS,
  );
  const [systemLanguages, setSystemLanguages] =
    useState<string[]>(getBrowserLanguages);

  const effectiveLanguage = useMemo<SupportedLocale>(() => {
    return settings.language === 'auto'
      ? resolveSupportedLocale(systemLanguages)
      : settings.language;
  }, [settings.language, systemLanguages]);

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
    const updateSystemLanguages = (): void => {
      setSystemLanguages(getBrowserLanguages());
    };

    window.addEventListener('languagechange', updateSystemLanguages);

    return () => {
      window.removeEventListener('languagechange', updateSystemLanguages);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = effectiveLanguage;
    document.documentElement.dir = LOCALE_DIRECTIONS[effectiveLanguage];
  }, [effectiveLanguage]);

  const setAutoTextContrast = useCallback((enabled: boolean): void => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      autoTextContrast: enabled,
    }));
    void window.clockSettings
      ?.setSettings({ autoTextContrast: enabled })
      .catch(() => {});
  }, []);

  const setAppearance = useCallback((appearance: GlassAppearance): void => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      appearance,
    }));
    void window.clockSettings?.setSettings({ appearance }).catch(() => {});
  }, []);

  const setLanguage = useCallback((language: LanguagePreference): void => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      language,
    }));
    void window.clockSettings?.setSettings({ language }).catch(() => {});
  }, []);

  const setLaunchAtLogin = useCallback((enabled: boolean): void => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      launchAtLogin: enabled,
    }));
    void window.clockSettings
      ?.setSettings({ launchAtLogin: enabled })
      .catch(() => {});
  }, []);

  const setTimeFormat = useCallback((timeFormat: TimeFormat): void => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      timeFormat,
    }));
    void window.clockSettings?.setSettings({ timeFormat }).catch(() => {});
  }, []);

  const setTextContrastTone = useCallback(
    (textContrastTone: TextContrastTone): void => {
      setSettings((currentSettings) => {
        if (currentSettings.textContrastTone === textContrastTone) {
          return currentSettings;
        }

        return {
          ...currentSettings,
          textContrastTone,
        };
      });
      void window.clockSettings
        ?.setSettings({ textContrastTone })
        .catch(() => {});
    },
    [],
  );

  const value = useMemo<ClockSettingsContextValue>(
    () => ({
      ...settings,
      effectiveLanguage,
      setAutoTextContrast,
      setAppearance,
      setLanguage,
      setLaunchAtLogin,
      setTimeFormat,
      setTextContrastTone,
    }),
    [
      effectiveLanguage,
      setAppearance,
      setAutoTextContrast,
      setLanguage,
      setLaunchAtLogin,
      setTimeFormat,
      setTextContrastTone,
      settings,
    ],
  );

  return (
    <ClockSettingsContext.Provider value={value}>
      {children}
    </ClockSettingsContext.Provider>
  );
}

export function useClockSettings(): ClockSettingsContextValue {
  const context = useContext(ClockSettingsContext);

  if (!context) {
    throw new Error(
      'useClockSettings must be used within ClockSettingsProvider.',
    );
  }

  return context;
}
