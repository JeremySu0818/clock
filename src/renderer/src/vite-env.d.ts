/// <reference types="vite/client" />

import type { LanguagePreference } from '../../shared/i18n';

type DesktopGlassMetrics = {
  captureExcludesSelf: boolean;
  display: {
    bounds: {
      height: number;
      width: number;
      x: number;
      y: number;
    };
    id: string;
    scaleFactor: number;
  };
  windowBounds: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
};

type GlassAppearance = 'liquid' | 'frosted';
type TextContrastTone = 'light' | 'dark';

type ClockSettings = {
  autoTextContrast: boolean;
  appearance: GlassAppearance;
  language: LanguagePreference;
  launchAtLogin: boolean;
  textContrastTone: TextContrastTone;
};

declare global {
  interface Window {
    electron: unknown;
    desktopGlass: {
      getWindowMetrics: () => Promise<DesktopGlassMetrics>;
      onWindowMetrics: (
        listener: (metrics: DesktopGlassMetrics) => void,
      ) => () => void;
    };
    clockSettings?: {
      closeSettings: () => void;
      getSettings: () => Promise<ClockSettings>;
      getSettingsVisible: () => Promise<boolean>;
      onSettingsChanged: (
        listener: (settings: ClockSettings) => void,
      ) => () => void;
      onSettingsVisibilityChanged: (
        listener: (visible: boolean) => void,
      ) => () => void;
      setSettings: (settings: Partial<ClockSettings>) => Promise<ClockSettings>;
      toggleSettings: () => void;
    };
  }
}

export {};
