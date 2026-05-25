import type { LanguagePreference } from './i18n';

export type GlassAppearance = 'liquid' | 'frosted';
export type TextContrastTone = 'light' | 'dark';

export type TimeFormat = '12h' | '24h';

export type ClockSettings = {
  autoTextContrast: boolean;
  appearance: GlassAppearance;
  language: LanguagePreference;
  launchAtLogin: boolean;
  timeFormat: TimeFormat;
  textContrastTone: TextContrastTone;
};
