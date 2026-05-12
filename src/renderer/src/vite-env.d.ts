/// <reference types="vite/client" />

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

interface Window {
  electron: unknown;
  desktopGlass: {
    getWindowMetrics: () => Promise<DesktopGlassMetrics>;
    onWindowMetrics: (listener: (metrics: DesktopGlassMetrics) => void) => () => void;
  };
}
