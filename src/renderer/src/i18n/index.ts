import { SUPPORTED_LOCALES, type SupportedLocale } from "../../../shared/i18n";
import ar from "./locales/ar";
import cs from "./locales/cs";
import de from "./locales/de";
import en from "./locales/en";
import es from "./locales/es";
import fr from "./locales/fr";
import hi from "./locales/hi";
import hu from "./locales/hu";
import id from "./locales/id";
import it from "./locales/it";
import ja from "./locales/ja";
import ko from "./locales/ko";
import nl from "./locales/nl";
import pl from "./locales/pl";
import ptBR from "./locales/pt-BR";
import ru from "./locales/ru";
import tr from "./locales/tr";
import vi from "./locales/vi";
import zhCN from "./locales/zh-CN";
import zhTW from "./locales/zh-TW";
import type { Translation } from "./types";

export const TRANSLATIONS: Record<SupportedLocale, Translation> = {
  ar,
  cs,
  de,
  en,
  es,
  fr,
  hi,
  hu,
  id,
  it,
  ja,
  ko,
  nl,
  pl,
  "pt-BR": ptBR,
  ru,
  tr,
  vi,
  "zh-CN": zhCN,
  "zh-TW": zhTW
};

export const LANGUAGE_OPTIONS = SUPPORTED_LOCALES.map((locale) => ({
  label: TRANSLATIONS[locale].languageName,
  value: locale
}));

export type { Translation };
