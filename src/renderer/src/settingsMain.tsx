import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlassModeProvider } from "./glass/GlassModeProvider";
import { LiquidGlassSurface } from "./glass/LiquidGlassSurface";
import { ScreenCaptureProvider } from "./glass/ScreenCaptureProvider";
import { ClockSettingsProvider } from "./settings/ClockSettingsProvider";
import { SettingsPanel } from "./settings/SettingsPanel";
import "./styles.css";
import "./settingsStyles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ClockSettingsProvider>
      <ScreenCaptureProvider>
        <GlassModeProvider>
          <LiquidGlassSurface className="settings-glass" autoTextContrast={false}>
            <SettingsPanel />
          </LiquidGlassSurface>
        </GlassModeProvider>
      </ScreenCaptureProvider>
    </ClockSettingsProvider>
  </StrictMode>
);
