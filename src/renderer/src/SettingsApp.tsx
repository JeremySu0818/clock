import { type ReactElement } from 'react';
import { AppProviders } from './components/AppProviders';
import { LiquidGlassSurface } from './glass/LiquidGlassSurface';
import { useClockSettings } from './settings/ClockSettingsProvider';
import { SettingsPanel } from './settings/SettingsPanel';
import './shared.css';
import './styles.css';
import './settings-styles.css';

function SettingsAppContent(): ReactElement {
  const { textContrastTone } = useClockSettings();

  return (
    <LiquidGlassSurface
      className="settings-glass"
      autoTextContrast={false}
      textContrastTone={textContrastTone}
    >
      <SettingsPanel />
    </LiquidGlassSurface>
  );
}

export default function SettingsApp(): ReactElement {
  return (
    <AppProviders>
      <SettingsAppContent />
    </AppProviders>
  );
}
