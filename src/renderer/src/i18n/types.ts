import type { LocaleDirection, SupportedLocale } from '../../../shared/i18n';

export type Translation = {
  locale: SupportedLocale;
  languageName: string;
  direction: LocaleDirection;
  clock: {
    currentTime: string;
  };
  settings: {
    appearanceLabel: string;
    autoTextContrast: string;
    categoriesLabel: string;
    closeSettings: string;
    dialogLabel: string;
    languageLabel: string;
    timeFormatLabel: string;
    launchAtLogin: string;
    settingsButtonLabel: string;
    timeFormatOptions: {
      h12: string;
      h24: string;
    };
    languageOptions: {
      auto: string;
    };
    appearanceOptions: {
      frosted: string;
      liquid: string;
    };
    sections: {
      appearance: string;
      general: string;
    };
    tabs: {
      appearance: string;
      general: string;
    };
  };
  worldClock: {
    title: string;
    backToMain: string;
    menuLabel: string;
    menuTitle: string;
    zones: {
      taipei: { city: string; note: string };
      tokyo: { city: string; note: string };
      london: { city: string; note: string };
      newYork: { city: string; note: string };
      losAngeles: { city: string; note: string };
    };
  };
  alarm: {
    title: string;
    newAlarm: string;
    alarmNamePlaceholder: string;
    add: string;
    ringing: string;
    stop: string;
    delete: string;
  };
};
