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

export type GlassAppearance = "liquid" | "frosted";

type ClockSettings = {
  autoTextContrast: boolean;
  appearance: GlassAppearance;
};

type ClockSettingsContextValue = ClockSettings & {
  setAutoTextContrast: (enabled: boolean) => void;
  setAppearance: (appearance: GlassAppearance) => void;
};

const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  autoTextContrast: true,
  appearance: "liquid"
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

  const value = useMemo<ClockSettingsContextValue>(
    () => ({
      ...settings,
      setAutoTextContrast,
      setAppearance
    }),
    [setAppearance, setAutoTextContrast, settings]
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
