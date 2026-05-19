import type { SupportedLocale } from "./i18n";

export type GlassAppearance = "liquid" | "frosted";
export type TextContrastTone = "light" | "dark";

export type ClockSettings = {
  autoTextContrast: boolean;
  appearance: GlassAppearance;
  language: SupportedLocale;
  textContrastTone: TextContrastTone;
};
