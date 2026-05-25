import type { Translation } from '../types';

const translation: Translation = {
  locale: 'nl',
  languageName: 'Nederlands',
  direction: 'ltr',
  clock: {
    currentTime: 'Huidige tijd',
  },
  settings: {
    appearanceLabel: 'Glasweergave',
    autoTextContrast:
      'Cijfers automatisch aanpassen aan de achtergrondafbeelding',
    categoriesLabel: 'Instellingscategorieën',
    closeSettings: 'Instellingen sluiten',
    dialogLabel: 'Instellingen',
    languageLabel: 'Taal',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Starten bij aanmelden',
    settingsButtonLabel: 'Instellingen openen',
    languageOptions: {
      auto: 'Automatisch detecteren',
    },
    appearanceOptions: {
      frosted: 'Matglas',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Weergave-instellingen',
      general: 'Algemene instellingen',
    },
    tabs: {
      appearance: 'Weergave',
      general: 'Algemeen',
    },
  },
  worldClock: {
    title: 'Wereldklok',
    backToMain: 'Terug naar hoofdscherm',
    menuLabel: 'Functiemenu openen',
    menuTitle: 'Functiemenu',
    zones: {
      taipei: { city: 'Taipei', note: 'Lokaal' },
      tokyo: { city: 'Tokio', note: 'Japan' },
      london: { city: 'Londen', note: 'VK' },
      newYork: { city: 'New York', note: 'Oost-VS' },
      losAngeles: { city: 'Los Angeles', note: 'West-VS' },
    },
  },
  alarm: {
    title: 'Wekker',
    newAlarm: 'Nieuwe wekker',
    alarmNamePlaceholder: 'Naam van wekker',
    add: 'Toevoegen',
    ringing: 'Gaat af',
    stop: 'Stoppen',
    delete: 'Verwijderen',
  },
};

export default translation;
