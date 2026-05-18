import { memo, type ReactElement } from "react";
import { LiquidGlassSurface } from "./glass/LiquidGlassSurface";
import { GlassModeProvider } from "./glass/GlassModeProvider";
import { ScreenCaptureProvider } from "./glass/ScreenCaptureProvider";
import { useClock } from "./hooks/useClock";
import { ClockSettingsProvider, useClockSettings } from "./settings/ClockSettingsProvider";
import { SettingsButton } from "./settings/SettingsButton";

const ClockFace = memo(function ClockFace(): ReactElement {
  const { time, date } = useClock();

  return (
    <div className="clock-face" aria-label={`Current time ${time}`}>
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
    setTextContrastTone,
    textContrastTone
  } = useClockSettings();

  return (
    <GlassModeProvider>
      <main className="clock-shell">
        <LiquidGlassSurface
          className="clock-glass"
          autoTextContrast={autoTextContrast}
          textContrastTone={textContrastTone}
          onTextContrastToneChange={setTextContrastTone}
        >
          <ClockFace />
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
