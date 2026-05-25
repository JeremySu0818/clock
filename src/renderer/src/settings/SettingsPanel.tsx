import { useEffect, useId, useState, type ReactElement } from 'react';
import type { LanguagePreference } from '../../../shared/i18n';
import { LANGUAGE_OPTIONS } from '../i18n';
import { useTranslation } from '../i18n/useTranslation';
import { useClockSettings } from './ClockSettingsProvider';
import { SettingsGlass } from './SettingsGlass';
import {
  SettingsSelect,
  type SettingsMenuId,
  type SettingsSelectOption,
} from './SettingsSelect';
import {
  SWITCH_THUMB_GLASS_CONFIG,
  SWITCH_TRACK_GLASS_CONFIG,
} from './settings-constants';
import type { GlassAppearance } from '../../../shared/types';

type SettingsTab = 'general' | 'appearance';

export function SettingsPanel(): ReactElement {
  const autoTextContrastId = useId();
  const appearanceId = useId();
  const appearanceLabelId = useId();
  const appearanceMenuId = useId();
  const languageId = useId();
  const languageLabelId = useId();
  const languageMenuId = useId();
  const launchAtLoginId = useId();

  const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
    return (
      (localStorage.getItem('clockSettingsActiveTab') as SettingsTab) ||
      'general'
    );
  });
  const [openMenu, setOpenMenu] = useState<SettingsMenuId | null>(null);

  const {
    autoTextContrast,
    appearance,
    language,
    launchAtLogin,
    setAppearance,
    setAutoTextContrast,
    setLanguage,
    setLaunchAtLogin,
  } = useClockSettings();

  const t = useTranslation();

  const settingsTabs: Array<{ id: SettingsTab; label: string }> = [
    { id: 'general', label: t.settings.tabs.general },
    { id: 'appearance', label: t.settings.tabs.appearance },
  ];

  const appearanceOptions: Array<SettingsSelectOption<GlassAppearance>> = [
    { value: 'liquid', label: t.settings.appearanceOptions.liquid },
    { value: 'frosted', label: t.settings.appearanceOptions.frosted },
  ];
  const languageOptions: Array<SettingsSelectOption<LanguagePreference>> = [
    { value: 'auto', label: t.settings.languageOptions.auto },
    ...LANGUAGE_OPTIONS,
  ];

  useEffect(() => {
    localStorage.setItem('clockSettingsActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        if (openMenu) {
          setOpenMenu(null);
          return;
        }

        window.clockSettings?.closeSettings();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  return (
    <div
      className="settings-panel"
      role="dialog"
      aria-label={t.settings.dialogLabel}
    >
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
        aria-label={
          activeTab === 'general'
            ? t.settings.sections.general
            : t.settings.sections.appearance
        }
      >
        <div key={activeTab} className="settings-tab-pane">
          {activeTab === 'general' ? (
            <>
              <label className="settings-row" htmlFor={autoTextContrastId}>
                <span className="settings-copy">
                  <span className="settings-title">
                    {t.settings.autoTextContrast}
                  </span>
                </span>
                <button
                  id={autoTextContrastId}
                  className="settings-switch"
                  type="button"
                  role="switch"
                  aria-checked={autoTextContrast}
                  onClick={() => setAutoTextContrast(!autoTextContrast)}
                >
                  <SettingsGlass
                    className="settings-switch-track"
                    config={SWITCH_TRACK_GLASS_CONFIG}
                  >
                    <SettingsGlass
                      className="settings-switch-thumb"
                      config={SWITCH_THUMB_GLASS_CONFIG}
                    >
                      <span
                        className="settings-switch-thumb-tone"
                        aria-hidden="true"
                      />
                    </SettingsGlass>
                  </SettingsGlass>
                </button>
              </label>

              <label className="settings-row" htmlFor={launchAtLoginId}>
                <span className="settings-copy">
                  <span className="settings-title">
                    {t.settings.launchAtLogin}
                  </span>
                </span>
                <button
                  id={launchAtLoginId}
                  className="settings-switch"
                  type="button"
                  role="switch"
                  aria-checked={launchAtLogin}
                  onClick={() => setLaunchAtLogin(!launchAtLogin)}
                >
                  <SettingsGlass
                    className="settings-switch-track"
                    config={SWITCH_TRACK_GLASS_CONFIG}
                  >
                    <SettingsGlass
                      className="settings-switch-thumb"
                      config={SWITCH_THUMB_GLASS_CONFIG}
                    >
                      <span
                        className="settings-switch-thumb-tone"
                        aria-hidden="true"
                      />
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
                <SettingsSelect<LanguagePreference>
                  buttonId={languageId}
                  labelId={languageLabelId}
                  menuId={languageMenuId}
                  menuKey="language"
                  onChange={setLanguage}
                  onOpenMenuChange={setOpenMenu}
                  openMenu={openMenu}
                  options={languageOptions}
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
        </div>
      </section>
    </div>
  );
}
