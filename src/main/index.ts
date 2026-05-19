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
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  DEFAULT_LANGUAGE_PREFERENCE,
  isLanguagePreference,
} from '../shared/i18n';
import type { 
  ClockSettings, 
  GlassAppearance, 
  TextContrastTone 
} from '../shared/types';

const CLOCK_WINDOW_WIDTH = 360;
const CLOCK_WINDOW_HEIGHT = 150;
const SETTINGS_WINDOW_WIDTH = 360;
const SETTINGS_WINDOW_HEIGHT = 360;
const SETTINGS_WINDOW_GAP = 8;
const WINDOW_MARGIN = 20;
const WINDOW_METRICS_CHANNEL = 'desktop-glass:window-metrics';
const GET_WINDOW_METRICS_CHANNEL = 'desktop-glass:get-window-metrics';
const TOGGLE_SETTINGS_CHANNEL = 'clock:toggle-settings';
const CLOSE_SETTINGS_CHANNEL = 'clock:close-settings';
const GET_SETTINGS_CHANNEL = 'clock:get-settings';
const SET_SETTINGS_CHANNEL = 'clock:set-settings';
const SETTINGS_CHANGED_CHANNEL = 'clock:settings-changed';
const GET_SETTINGS_VISIBILITY_CHANNEL = 'clock:get-settings-visibility';
const SETTINGS_VISIBILITY_CHANGED_CHANNEL = 'clock:settings-visibility-changed';
const LINUX_AUTOSTART_FILE_NAME = 'clock.desktop';

app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-gpu-compositing');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('disable-software-rasterizer');
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

const DEFAULT_CLOCK_SETTINGS: ClockSettings = {
  autoTextContrast: true,
  appearance: 'liquid',
  language: DEFAULT_LANGUAGE_PREFERENCE,
  launchAtLogin: true,
  textContrastTone: 'light',
};

let clockSettings: ClockSettings = DEFAULT_CLOCK_SETTINGS;
let clockWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

function isGlassAppearance(value: unknown): value is GlassAppearance {
  return value === 'liquid' || value === 'frosted';
}

function isTextContrastTone(value: unknown): value is TextContrastTone {
  return value === 'light' || value === 'dark';
}

function readClockSettings(
  value: unknown,
  fallback: ClockSettings,
): ClockSettings {
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const candidate = value as Partial<ClockSettings>;

  return {
    autoTextContrast:
      typeof candidate.autoTextContrast === 'boolean'
        ? candidate.autoTextContrast
        : fallback.autoTextContrast,
    appearance: isGlassAppearance(candidate.appearance)
      ? candidate.appearance
      : fallback.appearance,
    language: isLanguagePreference(candidate.language)
      ? candidate.language
      : fallback.language,
    launchAtLogin:
      typeof candidate.launchAtLogin === 'boolean'
        ? candidate.launchAtLogin
        : fallback.launchAtLogin,
    textContrastTone: isTextContrastTone(candidate.textContrastTone)
      ? candidate.textContrastTone
      : fallback.textContrastTone,
  };
}

function getClockSettingsPath(): string {
  return join(app.getPath('userData'), 'clock-settings.json');
}

function getAppIconPath(): string {
  const iconFileName = process.platform === 'linux' ? 'icon.png' : 'icon.ico';
  return join(app.getAppPath(), `build/${iconFileName}`);
}

function getLinuxAutostartPath(): string {
  const configHome = process.env.XDG_CONFIG_HOME || join(app.getPath('home'), '.config');
  return join(configHome, 'autostart', LINUX_AUTOSTART_FILE_NAME);
}

function quoteDesktopExec(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/%/g, '%%')}"`;
}

function getLinuxAutostartEntry(): string {
  const executablePath = process.env.APPIMAGE || process.execPath;

  return [
    '[Desktop Entry]',
    'Type=Application',
    'Name=Clock',
    `Exec=${quoteDesktopExec(executablePath)}`,
    'Terminal=false',
    'X-GNOME-Autostart-enabled=true',
    'NoDisplay=false',
    '',
  ].join('\n');
}

async function getLaunchAtLoginEnabled(): Promise<boolean> {
  if (process.platform === 'darwin') {
    return app.getLoginItemSettings().openAtLogin;
  }

  if (process.platform === 'win32') {
    return app.getLoginItemSettings({ path: process.execPath }).openAtLogin;
  }

  if (process.platform === 'linux') {
    try {
      await readFile(getLinuxAutostartPath(), 'utf8');
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

async function setLaunchAtLoginEnabled(enabled: boolean): Promise<void> {
  if (process.platform === 'darwin') {
    app.setLoginItemSettings({ openAtLogin: enabled });
    return;
  }

  if (process.platform === 'win32') {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: process.execPath,
    });
    return;
  }

  if (process.platform === 'linux') {
    const autostartPath = getLinuxAutostartPath();

    if (enabled) {
      await mkdir(dirname(autostartPath), { recursive: true });
      await writeFile(autostartPath, getLinuxAutostartEntry(), 'utf8');
      return;
    }

    try {
      await unlink(autostartPath);
    } catch {
      return;
    }
  }
}

async function reconcileLaunchAtLoginEnabled(enabled: boolean): Promise<boolean> {
  try {
    await setLaunchAtLoginEnabled(enabled);
  } catch {
    // Best effort only: the app should still open even if login-item setup fails.
  }

  return getLaunchAtLoginEnabled();
}

async function loadClockSettings(): Promise<void> {
  let nextSettings = DEFAULT_CLOCK_SETTINGS;
  let hasSavedSettings = true;

  try {
    const settingsJson = await readFile(getClockSettingsPath(), 'utf8');
    nextSettings = readClockSettings(
      JSON.parse(settingsJson),
      DEFAULT_CLOCK_SETTINGS,
    );
  } catch {
    hasSavedSettings = false;
    nextSettings = DEFAULT_CLOCK_SETTINGS;
  }

  if (!hasSavedSettings && nextSettings.launchAtLogin) {
    nextSettings.launchAtLogin = await reconcileLaunchAtLoginEnabled(true);
  }

  clockSettings = {
    ...nextSettings,
    launchAtLogin: await getLaunchAtLoginEnabled(),
  };
}

async function saveClockSettings(): Promise<void> {
  const settingsPath = getClockSettingsPath();
  await mkdir(dirname(settingsPath), { recursive: true });
  await writeFile(settingsPath, JSON.stringify(clockSettings, null, 2), 'utf8');
}

function publishClockSettings(): void {
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) {
      window.webContents.send(SETTINGS_CHANGED_CHANNEL, clockSettings);
    }
  }
}

function isSettingsVisible(): boolean {
  return Boolean(settingsWindow && !settingsWindow.isDestroyed());
}

function publishSettingsVisibility(): void {
  const visible = isSettingsVisible();

  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) {
      window.webContents.send(SETTINGS_VISIBILITY_CHANGED_CHANNEL, visible);
    }
  }
}

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
  const currentBounds = window.getBounds();

  window.setBounds(
    getVisibleWindowBounds({
      x: currentBounds.x,
      y: currentBounds.y,
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

function positionSettingsWindow(): void {
  if (!clockWindow || clockWindow.isDestroyed()) {
    return;
  }

  if (!settingsWindow || settingsWindow.isDestroyed()) {
    return;
  }

  const parentBounds = clockWindow.getBounds();
  settingsWindow.setBounds(
    getVisibleWindowBounds({
      width: SETTINGS_WINDOW_WIDTH,
      height: SETTINGS_WINDOW_HEIGHT,
      x: Math.round(
        parentBounds.x + (parentBounds.width - SETTINGS_WINDOW_WIDTH) / 2,
      ),
      y: Math.round(parentBounds.y + parentBounds.height + SETTINGS_WINDOW_GAP),
    }),
  );
  publishDesktopGlassMetrics(settingsWindow);
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

  const win = new BrowserWindow({
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
    skipTaskbar: true,
    alwaysOnTop: true,
    show: true,
    icon: getAppIconPath(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setMenuBarVisibility(false);
  win.setContentProtection(true);

  let metricsThrottleTimer: ReturnType<typeof setTimeout> | null = null;
  const throttledPublishMetrics = (): void => {
    if (metricsThrottleTimer !== null) {
      return;
    }
    metricsThrottleTimer = setTimeout(() => {
      metricsThrottleTimer = null;
      publishDesktopGlassMetrics(win);
      positionSettingsWindow();
    }, 4);
  };

  win.once('ready-to-show', () => {
    revealClockWindow(win);
  });

  win.on('move', throttledPublishMetrics);
  win.on('resize', throttledPublishMetrics);

  win.webContents.on('did-finish-load', () => {
    revealClockWindow(win);
    publishDesktopGlassMetrics(win);
    publishClockSettings();
    publishSettingsVisibility();
  });

  win.on('closed', () => {
    clockWindow = null;

    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.close();
    }
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    void win.loadURL(rendererUrl);
  } else {
    void win.loadFile(join(__dirname, '../renderer/index.html'));
  }

  clockWindow = win;

  return win;
}

function createSettingsWindow(): BrowserWindow | null {
  if (!clockWindow || clockWindow.isDestroyed()) {
    return null;
  }

  const parentBounds = clockWindow.getBounds();
  const initialBounds = getVisibleWindowBounds({
    width: SETTINGS_WINDOW_WIDTH,
    height: SETTINGS_WINDOW_HEIGHT,
    x: Math.round(
      parentBounds.x + (parentBounds.width - SETTINGS_WINDOW_WIDTH) / 2,
    ),
    y: Math.round(parentBounds.y + parentBounds.height + SETTINGS_WINDOW_GAP),
  });

  const win = new BrowserWindow({
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
    skipTaskbar: true,
    alwaysOnTop: true,
    show: true,
    icon: getAppIconPath(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setMenuBarVisibility(false);
  win.setContentProtection(true);

  let metricsThrottleTimer: ReturnType<typeof setTimeout> | null = null;
  const throttledPublishMetrics = (): void => {
    if (metricsThrottleTimer !== null) {
      return;
    }
    metricsThrottleTimer = setTimeout(() => {
      metricsThrottleTimer = null;
      publishDesktopGlassMetrics(win);
    }, 4);
  };

  win.once('ready-to-show', () => {
    positionSettingsWindow();
  });

  win.on('move', throttledPublishMetrics);
  win.on('resize', throttledPublishMetrics);

  win.webContents.on('did-finish-load', () => {
    positionSettingsWindow();
    publishClockSettings();
  });

  win.on('closed', () => {
    settingsWindow = null;
    publishSettingsVisibility();
  });

  const rendererUrl = process.env.ELECTRON_RENDERER_URL;
  if (rendererUrl) {
    void win.loadURL(`${rendererUrl}/settings.html`);
  } else {
    void win.loadFile(join(__dirname, '../renderer/settings.html'));
  }

  settingsWindow = win;
  publishSettingsVisibility();

  return win;
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  await loadClockSettings();
  await registerDisplayCaptureHandler();

  ipcMain.handle(GET_WINDOW_METRICS_CHANNEL, (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (!window) {
      throw new Error('Unable to resolve BrowserWindow for renderer.');
    }

    return getDesktopGlassMetrics(window);
  });

  ipcMain.handle(GET_SETTINGS_CHANNEL, () => clockSettings);

  ipcMain.handle(
    SET_SETTINGS_CHANNEL,
    async (_event, nextSettings: unknown) => {
      const previousLaunchAtLogin = clockSettings.launchAtLogin;
      clockSettings = readClockSettings(nextSettings, clockSettings);

      if (clockSettings.launchAtLogin !== previousLaunchAtLogin) {
        clockSettings.launchAtLogin = await reconcileLaunchAtLoginEnabled(
          clockSettings.launchAtLogin,
        );
      }

      await saveClockSettings();
      publishClockSettings();
      return clockSettings;
    },
  );

  ipcMain.handle(GET_SETTINGS_VISIBILITY_CHANNEL, () => isSettingsVisible());

  createClockWindow();

  ipcMain.on(TOGGLE_SETTINGS_CHANNEL, (event) => {
    const senderWindow = BrowserWindow.fromWebContents(event.sender);

    if (senderWindow === clockWindow) {
      if (settingsWindow && !settingsWindow.isDestroyed()) {
        settingsWindow.close();
      } else {
        createSettingsWindow();
      }
    }
  });

  ipcMain.on(CLOSE_SETTINGS_CHANNEL, () => {
    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.close();
    }
  });

  globalShortcut.register('CommandOrControl+Alt+Space', () => {
    if (!clockWindow || clockWindow.isDestroyed()) {
      return;
    }

    revealClockWindow(clockWindow);
    clockWindow.focus();
    positionSettingsWindow();
  });

  screen.on('display-metrics-changed', () => {
    if (clockWindow && !clockWindow.isDestroyed()) {
      resetWindowToVisibleArea(clockWindow);
      publishDesktopGlassMetrics(clockWindow);
    }

    positionSettingsWindow();
  });

  app.on('activate', () => {
    if (!clockWindow || clockWindow.isDestroyed()) {
      createClockWindow();
    }
  });
});

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!clockWindow || clockWindow.isDestroyed()) {
      return;
    }

    resetWindowToVisibleArea(clockWindow);
    revealClockWindow(clockWindow);
    clockWindow.focus();
    positionSettingsWindow();
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
