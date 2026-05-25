import type { Translation } from '../types';

const translation: Translation = {
  locale: 'it',
  languageName: 'Italiano',
  direction: 'ltr',
  clock: {
    currentTime: 'Ora attuale',
  },
  settings: {
    appearanceLabel: 'Aspetto del vetro',
    autoTextContrast: "Adatta automaticamente le cifre all'immagine di sfondo",
    categoriesLabel: 'Categorie impostazioni',
    closeSettings: 'Chiudi impostazioni',
    dialogLabel: 'Impostazioni',
    languageLabel: 'Lingua',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: "Avvia all'accesso",
    settingsButtonLabel: 'Apri impostazioni',
    languageOptions: {
      auto: 'Rileva automaticamente',
    },
    appearanceOptions: {
      frosted: 'Vetro satinato',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Impostazioni aspetto',
      general: 'Impostazioni generali',
    },
    tabs: {
      appearance: 'Aspetto',
      general: 'Generali',
    },
  },
  worldClock: {
    title: 'Orologio mondiale',
    backToMain: 'Torna alla schermata principale',
    menuLabel: 'Apri menu funzioni',
    menuTitle: 'Menu funzioni',
    zones: {
      taipei: { city: 'Taipei', note: 'Locale' },
      tokyo: { city: 'Tokyo', note: 'Giappone' },
      london: { city: 'Londra', note: 'Regno Unito' },
      newYork: { city: 'New York', note: 'Est degli Stati Uniti' },
      losAngeles: { city: 'Los Angeles', note: 'Ovest degli Stati Uniti' },
    },
  },
  alarm: {
    title: 'Sveglia',
    newAlarm: 'Nuova sveglia',
    alarmNamePlaceholder: 'Nome sveglia',
    add: 'Aggiungi',
    ringing: 'Squilla',
    stop: 'Ferma',
    delete: 'Elimina',
  },
};

export default translation;
