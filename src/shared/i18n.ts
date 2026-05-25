export const SUPPORTED_LOCALES = [
  'ar',
  'cs',
  'de',
  'en',
  'es',
  'fr',
  'hi',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'nl',
  'pl',
  'pt-BR',
  'ru',
  'tr',
  'vi',
  'zh-CN',
  'zh-TW',
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type LanguagePreference = 'auto' | SupportedLocale;
export type LocaleDirection = 'ltr' | 'rtl';

export const DEFAULT_LANGUAGE: SupportedLocale = 'zh-TW';
export const DEFAULT_LANGUAGE_PREFERENCE: LanguagePreference = 'auto';

export const LOCALE_DIRECTIONS = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, locale === 'ar' ? 'rtl' : 'ltr']),
) as Record<SupportedLocale, LocaleDirection>;

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === 'string' &&
    SUPPORTED_LOCALES.includes(value as SupportedLocale)
  );
}

export function isLanguagePreference(
  value: unknown,
): value is LanguagePreference {
  return value === 'auto' || isSupportedLocale(value);
}

function resolveLocaleTag(locale: string): SupportedLocale | null {
  const normalizedLocale = locale.replace(/_/g, '-');

  if (isSupportedLocale(normalizedLocale)) {
    return normalizedLocale;
  }

  const lowerLocale = normalizedLocale.toLowerCase();

  if (
    lowerLocale.startsWith('zh-hant') ||
    lowerLocale === 'zh-hk' ||
    lowerLocale === 'zh-mo'
  ) {
    return 'zh-TW';
  }

  if (lowerLocale.startsWith('zh-hans') || lowerLocale.startsWith('zh')) {
    return 'zh-CN';
  }

  if (lowerLocale.startsWith('pt')) {
    return 'pt-BR';
  }

  return (
    SUPPORTED_LOCALES.find(
      (supportedLocale) => lowerLocale.split('-')[0] === supportedLocale,
    ) ?? null
  );
}

export function resolveSupportedLocale(
  locales: readonly string[],
  fallback: SupportedLocale = DEFAULT_LANGUAGE,
): SupportedLocale {
  for (const locale of locales) {
    const supportedLocale = resolveLocaleTag(locale);

    if (supportedLocale) {
      return supportedLocale;
    }
  }

  return fallback;
}
