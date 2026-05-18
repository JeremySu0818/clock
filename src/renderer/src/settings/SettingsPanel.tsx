import { useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import type { SupportedLocale } from "../../../shared/i18n";
import { GlassModeProvider } from "../glass/GlassModeProvider";
import { LiquidGlassSurface } from "../glass/LiquidGlassSurface";
import type { LiquidGlassConfig } from "../glass/LiquidGlassProvider";
import { LANGUAGE_OPTIONS } from "../i18n";
import { useTranslation } from "../i18n/useTranslation";
import { useClockSettings, type GlassAppearance } from "./ClockSettingsProvider";

type SettingsTab = "general" | "appearance";
type SettingsMenuId = "appearance" | "language";

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

type SettingsSelectOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SettingsSelectProps<TValue extends string> = {
  buttonId: string;
  labelId: string;
  menuId: string;
  menuKey: SettingsMenuId;
  onChange: (value: TValue) => void;
  onOpenMenuChange: (menu: SettingsMenuId | null) => void;
  openMenu: SettingsMenuId | null;
  options: Array<SettingsSelectOption<TValue>>;
  value: TValue;
};

function SettingsSelect<TValue extends string>({
  buttonId,
  labelId,
  menuId,
  menuKey,
  onChange,
  onOpenMenuChange,
  openMenu,
  options,
  value
}: SettingsSelectProps<TValue>): ReactElement {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const isOpen = openMenu === menuKey;
  const selectedLabel = options.find((option) => option.value === value)?.label ?? options[0]?.label ?? "";

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (event.target instanceof Node && menuRef.current?.contains(event.target)) {
        return;
      }

      onOpenMenuChange(null);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onOpenMenuChange]);

  return (
    <div className="settings-menu" ref={menuRef}>
      <button
        id={buttonId}
        type="button"
        className="settings-menu-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-labelledby={`${labelId} ${buttonId}`}
        onClick={() => onOpenMenuChange(isOpen ? null : menuKey)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            onOpenMenuChange(menuKey);
          }
        }}
      >
        <SettingsGlass className="settings-menu-button-glass">
          <span className="settings-control-content">{selectedLabel}</span>
          <span className="settings-menu-chevron" aria-hidden="true">
            ⌄
          </span>
        </SettingsGlass>
      </button>
      {isOpen ? (
        <div
          id={menuId}
          className="settings-menu-popover"
          role="listbox"
          aria-labelledby={labelId}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="settings-menu-option"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                onOpenMenuChange(null);
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
  );
}

export function SettingsPanel(): ReactElement {
  const autoTextContrastId = useId();
  const appearanceId = useId();
  const appearanceLabelId = useId();
  const appearanceMenuId = useId();
  const languageId = useId();
  const languageLabelId = useId();
  const languageMenuId = useId();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [openMenu, setOpenMenu] = useState<SettingsMenuId | null>(null);
  const { autoTextContrast, appearance, language, setAppearance, setAutoTextContrast, setLanguage } =
    useClockSettings();
  const t = useTranslation();
  const settingsTabs: Array<{ id: SettingsTab; label: string }> = [
    { id: "general", label: t.settings.tabs.general },
    { id: "appearance", label: t.settings.tabs.appearance }
  ];
  const appearanceOptions: Array<SettingsSelectOption<GlassAppearance>> = [
    { value: "liquid", label: t.settings.appearanceOptions.liquid },
    { value: "frosted", label: t.settings.appearanceOptions.frosted }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        if (openMenu) {
          setOpenMenu(null);
          return;
        }

        window.clockSettings?.closeSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  return (
    <div className="settings-panel" role="dialog" aria-label={t.settings.dialogLabel}>
      <button
        type="button"
        className="settings-close"
        aria-label={t.settings.closeSettings}
        onClick={() => window.clockSettings?.closeSettings()}
      >
        <SettingsGlass className="settings-close-glass">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" />
          </svg>
        </SettingsGlass>
      </button>
      <nav className="settings-sidebar" aria-label={t.settings.categoriesLabel}>
        {settingsTabs.map((tab) => (
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
      <section
        className="settings-content"
        aria-label={activeTab === "general" ? t.settings.sections.general : t.settings.sections.appearance}
      >
        {activeTab === "general" ? (
          <>
            <label className="settings-row" htmlFor={autoTextContrastId}>
              <span className="settings-copy">
                <span className="settings-title">{t.settings.autoTextContrast}</span>
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
            <div className="settings-row">
              <span className="settings-copy">
                <span id={languageLabelId} className="settings-title">
                  {t.settings.languageLabel}
                </span>
              </span>
              <SettingsSelect<SupportedLocale>
                buttonId={languageId}
                labelId={languageLabelId}
                menuId={languageMenuId}
                menuKey="language"
                onChange={setLanguage}
                onOpenMenuChange={setOpenMenu}
                openMenu={openMenu}
                options={LANGUAGE_OPTIONS}
                value={language}
              />
            </div>
          </>
        ) : (
          <div className="settings-row">
            <span className="settings-copy">
              <span id={appearanceLabelId} className="settings-title">
                {t.settings.appearanceLabel}
              </span>
            </span>
            <SettingsSelect<GlassAppearance>
              buttonId={appearanceId}
              labelId={appearanceLabelId}
              menuId={appearanceMenuId}
              menuKey="appearance"
              onChange={setAppearance}
              onOpenMenuChange={setOpenMenu}
              openMenu={openMenu}
              options={appearanceOptions}
              value={appearance}
            />
          </div>
        )}
      </section>
    </div>
  );
}
