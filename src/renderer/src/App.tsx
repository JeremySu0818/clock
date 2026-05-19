import { type ReactElement } from "react";
import { AppProviders } from "./components/AppProviders";
import { ClockFace } from "./components/ClockFace";
import { LiquidGlassSurface } from "./glass/LiquidGlassSurface";
import { useClockSettings } from "./settings/ClockSettingsProvider";
import { SettingsButton } from "./settings/SettingsButton";
import { useTranslation } from "./i18n/useTranslation";

function ClockApp(): ReactElement {
  const {
    autoTextContrast,
    effectiveLanguage,
    setTextContrastTone,
    textContrastTone
  } = useClockSettings();
  const t = useTranslation();

  return (
    <main className="clock-shell">
      <LiquidGlassSurface
        className="clock-glass"
        autoTextContrast={autoTextContrast}
        textContrastTone={textContrastTone}
        onTextContrastToneChange={setTextContrastTone}
      >
        <ClockFace currentTimeLabel={t.clock.currentTime} language={effectiveLanguage} />
      </LiquidGlassSurface>
      <SettingsButton />
    </main>
  );
}

export default function App(): ReactElement {
  return (
    <AppProviders>
      <ClockApp />
    </AppProviders>
  );
}
