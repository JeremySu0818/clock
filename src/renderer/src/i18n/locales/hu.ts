import type { Translation } from '../types';

const translation: Translation = {
  locale: 'hu',
  languageName: 'Magyar',
  direction: 'ltr',
  clock: {
    currentTime: 'Pontos idő',
  },
  settings: {
    appearanceLabel: 'Üveg megjelenése',
    autoTextContrast: 'A számok automatikus igazítása a háttérképhez',
    categoriesLabel: 'Beállításkategóriák',
    closeSettings: 'Beállítások bezárása',
    dialogLabel: 'Beállítások',
    languageLabel: 'Nyelv',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Indítás bejelentkezéskor',
    settingsButtonLabel: 'Beállítások megnyitása',
    languageOptions: {
      auto: 'Automatikus felismerés',
    },
    appearanceOptions: {
      frosted: 'Matt üveg',
      liquid: 'Folyékony üveg',
    },
    sections: {
      appearance: 'Megjelenési beállítások',
      general: 'Általános beállítások',
    },
    tabs: {
      appearance: 'Megjelenés',
      general: 'Általános',
    },
  },
};

export default translation;
