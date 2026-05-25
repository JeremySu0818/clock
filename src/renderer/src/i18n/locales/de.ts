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
};

export default translation;
