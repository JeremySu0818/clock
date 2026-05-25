import type { Translation } from '../types';

const translation: Translation = {
  locale: 'pl',
  languageName: 'Polski',
  direction: 'ltr',
  clock: {
    currentTime: 'Aktualny czas',
  },
  settings: {
    appearanceLabel: 'Wygląd szkła',
    autoTextContrast: 'Automatycznie dopasuj cyfry do obrazu tła',
    categoriesLabel: 'Kategorie ustawień',
    closeSettings: 'Zamknij ustawienia',
    dialogLabel: 'Ustawienia',
    languageLabel: 'Język',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Uruchamiaj przy logowaniu',
    settingsButtonLabel: 'Otwórz ustawienia',
    languageOptions: {
      auto: 'Wykryj automatycznie',
    },
    appearanceOptions: {
      frosted: 'Matowe szkło',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Ustawienia wyglądu',
      general: 'Ustawienia ogólne',
    },
    tabs: {
      appearance: 'Wygląd',
      general: 'Ogólne',
    },
  },
};

export default translation;
