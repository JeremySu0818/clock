import { useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import { GlassModeProvider } from "../glass/GlassModeProvider";
import { LiquidGlassSurface } from "../glass/LiquidGlassSurface";
import type { LiquidGlassConfig } from "../glass/LiquidGlassProvider";
import { useClockSettings, type GlassAppearance } from "./ClockSettingsProvider";

type SettingsTab = "general" | "appearance";

const SETTINGS_TABS: Array<{ id: SettingsTab; label: string }> = [
  { id: "general", label: "一般" },
  { id: "appearance", label: "外觀" }
];

const APPEARANCE_OPTIONS: Array<{ value: GlassAppearance; label: string }> = [
  { value: "liquid", label: "Liquid Glass" },
  { value: "frosted", label: "霧面玻璃" }
];

const BUTTON_GLASS_CONFIG = {
  radius: 5,
  bezelWidth: 0,
  glassThickness: 120,
  surface: "convexSquircle"
} satisfies Partial<LiquidGlassConfig>;

const SWITCH_TRACK_GLASS_CONFIG = {
  radius: 999,
  bezelWidth: 0,
  glassThickness: 100,
  surface: "convexSquircle"
} satisfies Partial<LiquidGlassConfig>;

const SWITCH_THUMB_GLASS_CONFIG = {
  radius: 999,
  bezelWidth: 0,
  glassThickness: 160,
  surface: "convexCircle"
} satisfies Partial<LiquidGlassConfig>;

type SettingsGlassProps = {
  children?: ReactNode;
  className: string;
  config?: Partial<LiquidGlassConfig>;
};

function SettingsGlass({ children, className, config = BUTTON_GLASS_CONFIG }: SettingsGlassProps): ReactElement {
  return (
    <GlassModeProvider config={config}>
      <LiquidGlassSurface as="span" className={`settings-control-glass ${className}`} autoTextContrast={false}>
        {children}
      </LiquidGlassSurface>
    </GlassModeProvider>
  );
}

export function SettingsPanel(): ReactElement {
  const autoTextContrastId = useId();
  const appearanceId = useId();
  const appearanceLabelId = useId();
  const appearanceMenuId = useId();
  const appearanceMenuRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [appearanceMenuOpen, setAppearanceMenuOpen] = useState(false);
  const { autoTextContrast, appearance, setAppearance, setAutoTextContrast } = useClockSettings();
  const selectedAppearanceLabel =
    APPEARANCE_OPTIONS.find((option) => option.value === appearance)?.label ?? APPEARANCE_OPTIONS[0].label;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        if (appearanceMenuOpen) {
          setAppearanceMenuOpen(false);
          return;
        }

        window.clockSettings?.closeSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [appearanceMenuOpen]);

  useEffect(() => {
    if (!appearanceMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        appearanceMenuRef.current?.contains(event.target)
      ) {
        return;
      }

      setAppearanceMenuOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [appearanceMenuOpen]);

  return (
    <div className="settings-panel" role="dialog" aria-label="設定">
      <button
        type="button"
        className="settings-close"
        aria-label="關閉設定"
        onClick={() => window.clockSettings?.closeSettings()}
      >
        <SettingsGlass className="settings-close-glass">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" />
          </svg>
        </SettingsGlass>
      </button>
      <nav className="settings-sidebar" aria-label="設定分類">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="settings-tab"
            data-active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="settings-control-content">{tab.label}</span>
          </button>
        ))}
      </nav>
      <section className="settings-content" aria-label={activeTab === "general" ? "一般設定" : "外觀設定"}>
        {activeTab === "general" ? (
          <label className="settings-row" htmlFor={autoTextContrastId}>
            <span className="settings-copy">
              <span className="settings-title">自動切換數字適應背景圖片</span>
            </span>
            <button
              id={autoTextContrastId}
              className="settings-switch"
              type="button"
              role="switch"
              aria-checked={autoTextContrast}
              onClick={() => setAutoTextContrast(!autoTextContrast)}
            >
              <SettingsGlass className="settings-switch-track" config={SWITCH_TRACK_GLASS_CONFIG}>
                <SettingsGlass className="settings-switch-thumb" config={SWITCH_THUMB_GLASS_CONFIG}>
                  <span className="settings-switch-thumb-tone" aria-hidden="true" />
                </SettingsGlass>
              </SettingsGlass>
            </button>
          </label>
        ) : (
          <div className="settings-row">
            <span className="settings-copy">
              <span id={appearanceLabelId} className="settings-title">玻璃外觀</span>
            </span>
            <div className="settings-menu" ref={appearanceMenuRef}>
              <button
                id={appearanceId}
                type="button"
                className="settings-menu-button"
                aria-haspopup="listbox"
                aria-expanded={appearanceMenuOpen}
                aria-controls={appearanceMenuId}
                aria-labelledby={`${appearanceLabelId} ${appearanceId}`}
                onClick={() => setAppearanceMenuOpen((isOpen) => !isOpen)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setAppearanceMenuOpen(true);
                  }
                }}
              >
                <SettingsGlass className="settings-menu-button-glass">
                  <span className="settings-control-content">{selectedAppearanceLabel}</span>
                  <span className="settings-menu-chevron" aria-hidden="true">⌄</span>
                </SettingsGlass>
              </button>
              {appearanceMenuOpen ? (
                <div
                  id={appearanceMenuId}
                  className="settings-menu-popover"
                  role="listbox"
                  aria-labelledby={appearanceLabelId}
                >
                  {APPEARANCE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="settings-menu-option"
                      role="option"
                      aria-selected={appearance === option.value}
                      onClick={() => {
                        setAppearance(option.value);
                        setAppearanceMenuOpen(false);
                      }}
                    >
                      <SettingsGlass className="settings-menu-option-glass">
                        <span className="settings-control-content">{option.label}</span>
                      </SettingsGlass>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
