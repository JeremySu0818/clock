import { useEffect, useId, useState, type ReactElement } from "react";
import { useClockSettings, type GlassAppearance } from "./ClockSettingsProvider";

type SettingsTab = "general" | "appearance";

const SETTINGS_TABS: Array<{ id: SettingsTab; label: string }> = [
  { id: "general", label: "一般" },
  { id: "appearance", label: "外觀" }
];

function isGlassAppearance(value: string): value is GlassAppearance {
  return value === "liquid" || value === "frosted";
}

export function SettingsPanel(): ReactElement {
  const autoTextContrastId = useId();
  const appearanceId = useId();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const { autoTextContrast, appearance, setAppearance, setAutoTextContrast } = useClockSettings();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        window.clockSettings?.closeSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="settings-panel" role="dialog" aria-label="設定">
      <button
        type="button"
        className="settings-close"
        aria-label="關閉設定"
        onClick={() => window.clockSettings?.closeSettings()}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6L18 18M18 6L6 18" />
        </svg>
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
            {tab.label}
          </button>
        ))}
      </nav>
      <section className="settings-content" aria-label={activeTab === "general" ? "一般設定" : "外觀設定"}>
        {activeTab === "general" ? (
          <label className="settings-row" htmlFor={autoTextContrastId}>
            <span className="settings-copy">
              <span className="settings-title">自動切換數字適應背景圖片</span>
            </span>
            <input
              id={autoTextContrastId}
              className="settings-switch"
              type="checkbox"
              checked={autoTextContrast}
              onChange={(event) => setAutoTextContrast(event.currentTarget.checked)}
            />
          </label>
        ) : (
          <label className="settings-row" htmlFor={appearanceId}>
            <span className="settings-copy">
              <span className="settings-title">玻璃外觀</span>
            </span>
            <select
              id={appearanceId}
              className="settings-select"
              value={appearance}
              onChange={(event) => {
                const nextAppearance = event.currentTarget.value;
                if (isGlassAppearance(nextAppearance)) {
                  setAppearance(nextAppearance);
                }
              }}
            >
              <option value="liquid">Liquid Glass</option>
              <option value="frosted">霧面玻璃</option>
            </select>
          </label>
        )}
      </section>
    </div>
  );
}
