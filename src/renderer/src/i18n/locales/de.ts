import type { Translation } from '../types';

const translation: Translation = {
  locale: 'de',
  languageName: 'Deutsch',
  direction: 'ltr',
  clock: {
    currentTime: 'Aktuelle Zeit',
  },
  settings: {
    appearanceLabel: 'Glasdarstellung',
    autoTextContrast: 'Ziffern automatisch an das Hintergrundbild anpassen',
    categoriesLabel: 'Einstellungskategorien',
    closeSettings: 'Einstellungen schließen',
    dialogLabel: 'Einstellungen',
    languageLabel: 'Sprache',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Beim Anmelden starten',
    settingsButtonLabel: 'Einstellungen öffnen',
    languageOptions: {
      auto: 'Automatisch erkennen',
    },
    appearanceOptions: {
      frosted: 'Mattglas',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Darstellungseinstellungen',
      general: 'Allgemeine Einstellungen',
    },
    tabs: {
      appearance: 'Darstellung',
      general: 'Allgemein',
    },
  },
  worldClock: {
    title: 'Weltzeituhr',
    backToMain: 'Zurück zum Hauptbildschirm',
    menuLabel: 'Funktionsmenü öffnen',
    menuTitle: 'Funktionsmenü',
    zones: {
      taipei: { city: 'Taipeh', note: 'Lokal' },
      tokyo: { city: 'Tokio', note: 'Japan' },
      london: { city: 'London', note: 'Großbritannien' },
      newYork: { city: 'New York', note: 'US-Ostküste' },
      losAngeles: { city: 'Los Angeles', note: 'US-Westküste' },
    },
  },
  alarm: {
    title: 'Wecker',
    newAlarm: 'Neuer Wecker',
    alarmNamePlaceholder: 'Name des Weckers',
    add: 'Hinzufügen',
    ringing: 'Klingelt',
    stop: 'Stoppen',
    delete: 'Löschen',
  },
};

export default translation;
