import { app, BrowserWindow, Menu, screen } from "electron";
import { join } from "node:path";

const CLOCK_WINDOW_WIDTH = 540;
const CLOCK_WINDOW_HEIGHT = 220;
const WINDOW_MARGIN = 28;

app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");

function createClockWindow(): BrowserWindow {
  const { workArea } = screen.getPrimaryDisplay();

  const clockWindow = new BrowserWindow({
    width: CLOCK_WINDOW_WIDTH,
    height: CLOCK_WINDOW_HEIGHT,
    x: Math.round(workArea.x + workArea.width - CLOCK_WINDOW_WIDTH - WINDOW_MARGIN),
    y: Math.round(workArea.y + WINDOW_MARGIN),
    transparent: true,
    backgroundColor: "#00000000",
    frame: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    hasShadow: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false
    }
  });

  clockWindow.setAlwaysOnTop(true, "screen-saver");
  clockWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  clockWindow.setMenuBarVisibility(false);

  clockWindow.once("ready-to-show", () => {
    clockWindow.showInactive();
    clockWindow.moveTop();
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    void clockWindow.loadURL(rendererUrl);
  } else {
    void clockWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return clockWindow;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createClockWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createClockWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
