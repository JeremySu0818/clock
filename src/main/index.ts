import {
  app,
  BrowserWindow,
  desktopCapturer,
  globalShortcut,
  ipcMain,
  Menu,
  screen,
  session,
} from 'electron';
import { join } from 'node:path';

const CLOCK_WINDOW_WIDTH = 540;
const CLOCK_WINDOW_HEIGHT = 220;
const WINDOW_MARGIN = 28;
const WINDOW_METRICS_CHANNEL = 'desktop-glass:window-metrics';
const GET_WINDOW_METRICS_CHANNEL = 'desktop-glass:get-window-metrics';

app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');

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

function getVisibleWindowBounds(
  bounds: Electron.Rectangle,
): Electron.Rectangle {
  const display = screen.getDisplayMatching(bounds);
  const { workArea } = display;
  const width = Math.min(bounds.width, workArea.width);
  const height = Math.min(bounds.height, workArea.height);
  const maxX = workArea.x + workArea.width - width;
  const maxY = workArea.y + workArea.height - height;

  return {
    x: Math.min(Math.max(bounds.x, workArea.x), maxX),
    y: Math.min(Math.max(bounds.y, workArea.y), maxY),
    width,
    height,
  };
}

function resetWindowToVisibleArea(window: BrowserWindow): void {
  window.setBounds(
    getVisibleWindowBounds({
      x: window.getBounds().x,
      y: window.getBounds().y,
      width: CLOCK_WINDOW_WIDTH,
      height: CLOCK_WINDOW_HEIGHT,
    }),
  );
}

function revealClockWindow(window: BrowserWindow): void {
  if (window.isDestroyed()) {
    return;
  }

  resetWindowToVisibleArea(window);

  if (!window.isVisible()) {
    window.show();
  }

  window.moveTop();
}

function getDesktopGlassMetrics(window: BrowserWindow): DesktopGlassMetrics {
  const bounds = window.getBounds();
  const display = screen.getDisplayMatching(bounds);

  return {
    captureExcludesSelf: process.platform === 'win32',
    display: {
      id: String(display.id),
      scaleFactor: display.scaleFactor,
      bounds: {
        x: display.bounds.x,
        y: display.bounds.y,
        width: display.bounds.width,
        height: display.bounds.height,
      },
    },
    windowBounds: {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    },
  };
}

function publishDesktopGlassMetrics(window: BrowserWindow): void {
  if (window.isDestroyed()) {
    return;
  }

  window.webContents.send(
    WINDOW_METRICS_CHANNEL,
    getDesktopGlassMetrics(window),
  );
}

async function registerDisplayCaptureHandler(): Promise<void> {
  session.defaultSession.setDisplayMediaRequestHandler(
    async (_request, callback) => {
      const focusedWindow =
        BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];

      if (!focusedWindow) {
        callback({});
        return;
      }

      const display = screen.getDisplayMatching(focusedWindow.getBounds());
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: 1,
          height: 1,
        },
      });

      const source =
        sources.find((entry) => entry.display_id === String(display.id)) ??
        sources[0];

      if (!source) {
        callback({});
        return;
      }

      callback({
        video: source,
      });
    },
    { useSystemPicker: false },
  );
}

function createClockWindow(): BrowserWindow {
  const { workArea } = screen.getPrimaryDisplay();
  const initialBounds = getVisibleWindowBounds({
    width: CLOCK_WINDOW_WIDTH,
    height: CLOCK_WINDOW_HEIGHT,
    x: Math.round(
      workArea.x + workArea.width - CLOCK_WINDOW_WIDTH - WINDOW_MARGIN,
    ),
    y: Math.round(workArea.y + WINDOW_MARGIN),
  });

  const clockWindow = new BrowserWindow({
    width: initialBounds.width,
    height: initialBounds.height,
    x: initialBounds.x,
    y: initialBounds.y,
    transparent: true,
    backgroundColor: '#00000000',
    frame: false,
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    hasShadow: false,
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: false,
    alwaysOnTop: true,
    show: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  clockWindow.setAlwaysOnTop(true, 'screen-saver');
  clockWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  clockWindow.setMenuBarVisibility(false);
  clockWindow.setContentProtection(true);

  clockWindow.once('ready-to-show', () => {
    revealClockWindow(clockWindow);
  });

  clockWindow.on('move', () => {
    publishDesktopGlassMetrics(clockWindow);
  });

  clockWindow.on('resize', () => {
    publishDesktopGlassMetrics(clockWindow);
  });

  clockWindow.webContents.on('did-finish-load', () => {
    revealClockWindow(clockWindow);
    publishDesktopGlassMetrics(clockWindow);

    setTimeout(() => {
      void clockWindow.webContents
        .executeJavaScript(
          `
          ({
            bodyBackground: getComputedStyle(document.body).backgroundColor,
            captureState: document.querySelector('.liquid-glass-surface')?.getAttribute('data-capture-state'),
            clockTime: document.querySelector('.clock-time')?.textContent ?? null,
            desktopGlassType: typeof window.desktopGlass,
            rootHtmlLength: document.getElementById('root')?.innerHTML.length ?? 0
          })
        `,
        )
        .then((snapshot) => {})
        .catch((error) => {});
    }, 800);
  });

  clockWindow.webContents.on(
    'console-message',
    (_event, level, message, line, sourceId) => {},
  );

  clockWindow.webContents.on(
    'did-fail-load',
    (_event, code, description, validatedUrl) => {},
  );

  clockWindow.webContents.on('render-process-gone', (_event, details) => {});

  setTimeout(() => {
    revealClockWindow(clockWindow);
  }, 1200);

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    void clockWindow.loadURL(rendererUrl);
  } else {
    void clockWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return clockWindow;
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  await registerDisplayCaptureHandler();

  ipcMain.handle(GET_WINDOW_METRICS_CHANNEL, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (!window) {
      throw new Error('Unable to resolve BrowserWindow for renderer.');
    }

    return getDesktopGlassMetrics(window);
  });

  createClockWindow();

  globalShortcut.register('CommandOrControl+Alt+Space', () => {
    const window = BrowserWindow.getAllWindows()[0];

    if (!window) {
      return;
    }

    revealClockWindow(window);
    window.focus();
  });

  screen.on('display-metrics-changed', () => {
    for (const window of BrowserWindow.getAllWindows()) {
      resetWindowToVisibleArea(window);
      publishDesktopGlassMetrics(window);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createClockWindow();
    }
  });
});

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const window = BrowserWindow.getAllWindows()[0];

    if (!window) {
      return;
    }

    resetWindowToVisibleArea(window);
    revealClockWindow(window);
    window.focus();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
