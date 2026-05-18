import { StrictMode, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { GlassModeProvider } from "./glass/GlassModeProvider";
import { LiquidGlassSurface } from "./glass/LiquidGlassSurface";
import { ScreenCaptureProvider } from "./glass/ScreenCaptureProvider";
import { ClockSettingsProvider, useClockSettings } from "./settings/ClockSettingsProvider";
import { SettingsPanel } from "./settings/SettingsPanel";
import "./styles.css";
import "./settingsStyles.css";

function SettingsApp(): ReactElement {
  const { textContrastTone } = useClockSettings();

  return (
    <ScreenCaptureProvider>
      <GlassModeProvider>
        <LiquidGlassSurface
          className="settings-glass"
          autoTextContrast={false}
          textContrastTone={textContrastTone}
        >
          <SettingsPanel />
        </LiquidGlassSurface>
      </GlassModeProvider>
    </ScreenCaptureProvider>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ClockSettingsProvider>
      <SettingsApp />
    </ClockSettingsProvider>
  </StrictMode>
);
