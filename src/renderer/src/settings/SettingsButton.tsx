import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { FrostedGlassProvider } from '../glass/FrostedGlassProvider';
import { LiquidGlassProvider } from '../glass/LiquidGlassProvider';
import { LiquidGlassSurface } from '../glass/LiquidGlassSurface';
import { useTranslation } from '../i18n/useTranslation';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { useClockSettings } from './ClockSettingsProvider';

export function SettingsButton(): ReactElement {
  const { appearance } = useClockSettings();
  const t = useTranslation();
  const [settingsVisible, setSettingsVisible] = useState(false);

  const GlassProvider =
    appearance === 'frosted' ? FrostedGlassProvider : LiquidGlassProvider;

  const glassConfig = useMemo(() => {
    return {
      radius: 16,
      bezelWidth: 0,
      glassThickness: appearance === 'frosted' ? 100 : 150,
      surface: 'convexCircle' as const,
    };
  }, [appearance]);

  const handleClick = (): void => {
    window.clockSettings?.toggleSettings();
  };

  useEffect(() => {
    const settingsApi = window.clockSettings;

    if (!settingsApi) {
      return undefined;
    }

    let active = true;

    void settingsApi
      .getSettingsVisible()
      .then((visible) => {
        if (active) {
          setSettingsVisible(visible);
        }
      })
      .catch(() => {});

    const unsubscribe = settingsApi.onSettingsVisibilityChanged((visible) => {
      setSettingsVisible(visible);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <button
      type="button"
      className="settings-button"
      aria-label={t.settings.settingsButtonLabel}
      aria-pressed={settingsVisible}
      onClick={handleClick}
    >
      <GlassProvider config={glassConfig}>
        <LiquidGlassSurface
          as="span"
          className="settings-button-glass"
          autoTextContrast={true}
        >
          <SettingsIcon />
        </LiquidGlassSurface>
      </GlassProvider>
    </button>
  );
}
