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
};

export default translation;
