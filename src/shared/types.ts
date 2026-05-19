import type { LanguagePreference } from "./i18n";

export type GlassAppearance = "liquid" | "frosted";
export type TextContrastTone = "light" | "dark";

export type ClockSettings = {
  autoTextContrast: boolean;
  appearance: GlassAppearance;
  language: LanguagePreference;
  launchAtLogin: boolean;
  textContrastTone: TextContrastTone;
};
