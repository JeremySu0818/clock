import { type ReactElement, type ReactNode } from 'react';
import { FrostedGlassProvider } from './FrostedGlassProvider';
import { LiquidGlassProvider } from './LiquidGlassProvider';
import type { LiquidGlassConfig } from './LiquidGlassProvider';
import { useClockSettings } from '../settings/ClockSettingsProvider';

type GlassModeProviderProps = {
  children: ReactNode;
  config?: Partial<LiquidGlassConfig>;
};

export function GlassModeProvider({
  children,
  config,
}: GlassModeProviderProps): ReactElement {
  const { appearance } = useClockSettings();

  if (appearance === 'frosted') {
    return (
      <FrostedGlassProvider config={config}>{children}</FrostedGlassProvider>
    );
  }

  return <LiquidGlassProvider config={config}>{children}</LiquidGlassProvider>;
}
