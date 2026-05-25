import { type ReactElement, useEffect, useRef, useState } from 'react';
import { SettingsGlass } from '../settings/SettingsGlass';
import { FeatureToolsIcon } from './icons/FeatureToolsIcon';
import { LiquidGlassProvider } from '../glass/LiquidGlassProvider';
import { LiquidGlassSurface } from '../glass/LiquidGlassSurface';
import { FrostedGlassProvider } from '../glass/FrostedGlassProvider';
import { useClockSettings } from '../settings/ClockSettingsProvider';

export type AppViewMode = 'clock' | 'world-clock' | 'alarm';
export type FeatureViewMode = Exclude<AppViewMode, 'clock'>;

type FeatureToolsButtonProps = {
  activeMode: AppViewMode;
  onSelectMode: (mode: FeatureViewMode) => void;
};

type MenuItem = {
  mode: FeatureViewMode;
  label: string;
};

const MENU_ITEMS: MenuItem[] = [
  { mode: 'world-clock', label: '世界時鐘' },
  { mode: 'alarm', label: '鬧鐘' },
];

export function FeatureToolsButton({
  activeMode,
  onSelectMode,
}: FeatureToolsButtonProps): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { appearance } = useClockSettings();

  const GlassProvider =
    appearance === 'frosted' ? FrostedGlassProvider : LiquidGlassProvider;

  const glassConfig = {
    radius: 16,
    bezelWidth: 0,
    glassThickness: appearance === 'frosted' ? 100 : 150,
    surface: 'convexCircle' as const,
  };

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        rootRef.current?.contains(event.target)
      ) {
        return;
      }

      setMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <div ref={rootRef} className="feature-tools">
      <button
        type="button"
        className="settings-button"
        style={{
          position: 'static',
          opacity: activeMode !== 'clock' || menuOpen ? 1 : undefined,
        }}
        aria-label="開啟時鐘功能選單"
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
        aria-pressed={activeMode !== 'clock' || menuOpen}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <GlassProvider config={glassConfig}>
          <LiquidGlassSurface
            as="span"
            className="settings-button-glass"
            autoTextContrast={true}
          >
            <FeatureToolsIcon />
          </LiquidGlassSurface>
        </GlassProvider>
      </button>
      {menuOpen ? (
        <>
          <div
            className="feature-menu-overlay"
            onPointerDown={() => setMenuOpen(false)}
          />
          <div
            className="settings-menu-popover feature-menu-popover"
            role="listbox"
            aria-label="時鐘功能選單"
          >
            {MENU_ITEMS.map(({ mode, label }) => {
              const selected = activeMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className="settings-menu-option"
                  onClick={() => {
                    onSelectMode(mode);
                    setMenuOpen(false);
                  }}
                >
                  <SettingsGlass className="settings-menu-option-glass">
                    <span className="settings-control-content">{label}</span>
                    {selected ? (
                      <span
                        className="settings-menu-chevron"
                        aria-hidden="true"
                      >
                        ●
                      </span>
                    ) : null}
                  </SettingsGlass>
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
