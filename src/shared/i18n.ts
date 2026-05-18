export const SUPPORTED_LOCALES = [
  "ar",
  "cs",
  "de",
  "en",
  "es",
  "fr",
  "hi",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt-BR",
  "ru",
  "tr",
  "vi",
  "zh-CN",
  "zh-TW"
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type LocaleDirection = "ltr" | "rtl";

export const DEFAULT_LANGUAGE: SupportedLocale = "zh-TW";

export const LOCALE_DIRECTIONS = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, locale === "ar" ? "rtl" : "ltr"])
) as Record<SupportedLocale, LocaleDirection>;

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === "string" && SUPPORTED_LOCALES.includes(value as SupportedLocale);
}
