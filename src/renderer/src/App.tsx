import { type ReactElement, useState } from 'react';
import { AppProviders } from './components/AppProviders';
import { ClockFace } from './components/ClockFace';
import {
  FeatureToolsButton,
  type AppViewMode,
} from './components/FeatureToolsButton';
import { FeatureWorkspace } from './components/FeatureWorkspace';
import { LiquidGlassSurface } from './glass/LiquidGlassSurface';
import { useClockSettings } from './settings/ClockSettingsProvider';
import { SettingsButton } from './settings/SettingsButton';
import { useTranslation } from './i18n/useTranslation';

function ClockApp(): ReactElement {
  const {
    autoTextContrast,
    effectiveLanguage,
    setTextContrastTone,
    textContrastTone,
  } = useClockSettings();
  const t = useTranslation();
  const [viewMode, setViewMode] = useState<AppViewMode>('clock');

  return (
    <main className="clock-shell">
      <LiquidGlassSurface
        className="clock-glass settings-glass"
        autoTextContrast={autoTextContrast}
        textContrastTone={textContrastTone}
        onTextContrastToneChange={setTextContrastTone}
      >
        {viewMode === 'clock' ? (
          <ClockFace
            currentTimeLabel={t.clock.currentTime}
            language={effectiveLanguage}
          />
        ) : (
          <FeatureWorkspace
            language={effectiveLanguage}
            mode={viewMode}
            onBack={() => setViewMode('clock')}
          />
        )}
      </LiquidGlassSurface>
      {viewMode === 'clock' && (
        <>
          <FeatureToolsButton
            activeMode={viewMode}
            onSelectMode={setViewMode}
          />
          <SettingsButton />
        </>
      )}
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
