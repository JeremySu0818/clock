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
  worldClock: {
    title: 'Világóra',
    backToMain: 'Vissza a főképernyőre',
    menuLabel: 'Funkciómenü megnyitása',
    menuTitle: 'Funkciómenü',
    zones: {
      taipei: { city: 'Tajpej', note: 'Helyi' },
      tokyo: { city: 'Tokió', note: 'Japán' },
      london: { city: 'London', note: 'Egyesült Királyság' },
      newYork: { city: 'New York', note: 'Keleti USA' },
      losAngeles: { city: 'Los Angeles', note: 'Nyugati USA' },
    },
  },
  alarm: {
    title: 'Ébresztő',
    newAlarm: 'Új ébresztő',
    alarmNamePlaceholder: 'Ébresztő neve',
    add: 'Hozzáadás',
    ringing: 'Csörög',
    stop: 'Leállítás',
    delete: 'Törlés',
  },
};

export default translation;
