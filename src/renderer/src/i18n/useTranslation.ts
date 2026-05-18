import { DEFAULT_LANGUAGE } from "../../../shared/i18n";
import { useClockSettings } from "../settings/ClockSettingsProvider";
import { TRANSLATIONS } from "./index";
import type { Translation } from "./types";

export function useTranslation(): Translation {
  const { language } = useClockSettings();

  return TRANSLATIONS[language] ?? TRANSLATIONS[DEFAULT_LANGUAGE];
}
