import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const WINDOW_METRICS_CHANNEL = "desktop-glass:window-metrics";
const GET_WINDOW_METRICS_CHANNEL = "desktop-glass:get-window-metrics";

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
