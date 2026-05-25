import { type ReactNode, type ReactElement } from 'react';
import { ClockSettingsProvider } from '../settings/ClockSettingsProvider';
import { ScreenCaptureProvider } from '../glass/ScreenCaptureProvider';
import { GlassModeProvider } from '../glass/GlassModeProvider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps): ReactElement {
  return (
    <ClockSettingsProvider>
      <ScreenCaptureProvider>
        <GlassModeProvider>{children}</GlassModeProvider>
      </ScreenCaptureProvider>
    </ClockSettingsProvider>
  );
}
