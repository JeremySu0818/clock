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
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
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
  worldClock: {
    title: 'World Clock',
    backToMain: 'Back to main screen',
    menuLabel: 'Open features menu',
    menuTitle: 'Features menu',
    zones: {
      taipei: { city: 'Taipei', note: 'Local' },
      tokyo: { city: 'Tokyo', note: 'Japan' },
      london: { city: 'London', note: 'UK' },
      newYork: { city: 'New York', note: 'US East' },
      losAngeles: { city: 'Los Angeles', note: 'US West' },
    },
  },
  alarm: {
    title: 'Alarm',
    newAlarm: 'New Alarm',
    alarmNamePlaceholder: 'Alarm Name',
    add: 'Add',
    ringing: 'Ringing',
    stop: 'Stop',
    delete: 'Delete',
  },
};

export default translation;
