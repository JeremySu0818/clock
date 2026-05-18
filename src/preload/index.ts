import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { SupportedLocale } from "../shared/i18n";

const WINDOW_METRICS_CHANNEL = "desktop-glass:window-metrics";
const GET_WINDOW_METRICS_CHANNEL = "desktop-glass:get-window-metrics";
const TOGGLE_SETTINGS_CHANNEL = "clock:toggle-settings";
const CLOSE_SETTINGS_CHANNEL = "clock:close-settings";
const GET_SETTINGS_CHANNEL = "clock:get-settings";
const SET_SETTINGS_CHANNEL = "clock:set-settings";
const SETTINGS_CHANGED_CHANNEL = "clock:settings-changed";
const GET_SETTINGS_VISIBILITY_CHANNEL = "clock:get-settings-visibility";
const SETTINGS_VISIBILITY_CHANGED_CHANNEL = "clock:settings-visibility-changed";

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

type GlassAppearance = "liquid" | "frosted";
type TextContrastTone = "light" | "dark";

type ClockSettings = {
  autoTextContrast: boolean;
  appearance: GlassAppearance;
  language: SupportedLocale;
  textContrastTone: TextContrastTone;
};

contextBridge.exposeInMainWorld("electron", electronAPI);
contextBridge.exposeInMainWorld("desktopGlass", {
  getWindowMetrics: () => ipcRenderer.invoke(GET_WINDOW_METRICS_CHANNEL) as Promise<DesktopGlassMetrics>,
  onWindowMetrics: (listener: (metrics: DesktopGlassMetrics) => void) => {
    const subscription = (_event: unknown, metrics: DesktopGlassMetrics): void => {
      listener(metrics);
    };

    ipcRenderer.on(WINDOW_METRICS_CHANNEL, subscription);

    return (): void => {
      ipcRenderer.removeListener(WINDOW_METRICS_CHANNEL, subscription);
    };
  }
});
contextBridge.exposeInMainWorld("clockSettings", {
  closeSettings: () => ipcRenderer.send(CLOSE_SETTINGS_CHANNEL),
  getSettings: () => ipcRenderer.invoke(GET_SETTINGS_CHANNEL) as Promise<ClockSettings>,
  getSettingsVisible: () => ipcRenderer.invoke(GET_SETTINGS_VISIBILITY_CHANNEL) as Promise<boolean>,
  onSettingsChanged: (listener: (settings: ClockSettings) => void) => {
    const subscription = (_event: unknown, settings: ClockSettings): void => {
      listener(settings);
    };

    ipcRenderer.on(SETTINGS_CHANGED_CHANNEL, subscription);

    return (): void => {
      ipcRenderer.removeListener(SETTINGS_CHANGED_CHANNEL, subscription);
    };
  },
  onSettingsVisibilityChanged: (listener: (visible: boolean) => void) => {
    const subscription = (_event: unknown, visible: boolean): void => {
      listener(visible);
    };

    ipcRenderer.on(SETTINGS_VISIBILITY_CHANGED_CHANNEL, subscription);

    return (): void => {
      ipcRenderer.removeListener(SETTINGS_VISIBILITY_CHANGED_CHANNEL, subscription);
    };
  },
  setSettings: (settings: Partial<ClockSettings>) =>
    ipcRenderer.invoke(SET_SETTINGS_CHANNEL, settings) as Promise<ClockSettings>,
  toggleSettings: () => ipcRenderer.send(TOGGLE_SETTINGS_CHANNEL)
});
