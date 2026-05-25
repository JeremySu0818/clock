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
};

export default translation;
