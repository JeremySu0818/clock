import type { Translation } from '../types';

const translation: Translation = {
  locale: 'en',
  languageName: 'English',
  direction: 'ltr',
  clock: {
    currentTime: 'Current time',
  },
  settings: {
    appearanceLabel: 'Glass appearance',
    autoTextContrast: 'Automatically adapt digits to the background image',
    categoriesLabel: 'Settings categories',
    closeSettings: 'Close settings',
    dialogLabel: 'Settings',
    languageLabel: 'Language',
    launchAtLogin: 'Start at login',
    settingsButtonLabel: 'Open settings',
    languageOptions: {
      auto: 'Detect automatically',
    },
    appearanceOptions: {
      frosted: 'Frosted glass',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Appearance settings',
      general: 'General settings',
    },
    tabs: {
      appearance: 'Appearance',
      general: 'General',
    },
  },
};

export default translation;
