import { DEFAULT_LANGUAGE } from '../../../shared/i18n';
import { useClockSettings } from '../settings/ClockSettingsProvider';
import { TRANSLATIONS } from './index';
import type { Translation } from './types';

export function useTranslation(): Translation {
  const { effectiveLanguage } = useClockSettings();

  return TRANSLATIONS[effectiveLanguage] ?? TRANSLATIONS[DEFAULT_LANGUAGE];
}
