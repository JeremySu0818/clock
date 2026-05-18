import { memo, type ReactElement } from "react";
import type { SupportedLocale } from "../../shared/i18n";
import { LiquidGlassSurface } from "./glass/LiquidGlassSurface";
import { GlassModeProvider } from "./glass/GlassModeProvider";
import { ScreenCaptureProvider } from "./glass/ScreenCaptureProvider";
import { useClock } from "./hooks/useClock";
import { useTranslation } from "./i18n/useTranslation";
import { ClockSettingsProvider, useClockSettings } from "./settings/ClockSettingsProvider";
import { SettingsButton } from "./settings/SettingsButton";

type ClockFaceProps = {
  currentTimeLabel: string;
  language: SupportedLocale;
};

const ClockFace = memo(function ClockFace({ currentTimeLabel, language }: ClockFaceProps): ReactElement {
  const { time, date } = useClock(language);

  return (
    <div className="clock-face" aria-label={`${currentTimeLabel} ${time}`}>
      <div className="clock-time" aria-hidden="true" data-contrast-sample>
        {time}
      </div>
      <div className="clock-date" aria-hidden="true">
        {date}
      </div>
    </div>
  );
});


function ClockApp(): ReactElement {
  const {
    autoTextContrast,
    language,
    setTextContrastTone,
    textContrastTone
  } = useClockSettings();
  const t = useTranslation();

  return (
    <GlassModeProvider>
      <main className="clock-shell">
        <LiquidGlassSurface
          className="clock-glass"
          autoTextContrast={autoTextContrast}
          textContrastTone={textContrastTone}
          onTextContrastToneChange={setTextContrastTone}
        >
          <ClockFace currentTimeLabel={t.clock.currentTime} language={language} />
        </LiquidGlassSurface>
        <SettingsButton />
      </main>
    </GlassModeProvider>
  );
}

export default function App(): ReactElement {
  return (
    <ClockSettingsProvider>
      <ScreenCaptureProvider>
        <ClockApp />
      </ScreenCaptureProvider>
    </ClockSettingsProvider>
  );
}
