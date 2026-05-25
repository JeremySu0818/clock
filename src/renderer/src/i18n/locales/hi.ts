import type { Translation } from '../types';

const translation: Translation = {
  locale: 'hi',
  languageName: 'हिन्दी',
  direction: 'ltr',
  clock: {
    currentTime: 'वर्तमान समय',
  },
  settings: {
    appearanceLabel: 'ग्लास का रूप',
    autoTextContrast: 'अंकों को पृष्ठभूमि चित्र के अनुसार अपने आप ढालें',
    categoriesLabel: 'सेटिंग श्रेणियां',
    closeSettings: 'सेटिंग बंद करें',
    dialogLabel: 'सेटिंग',
    languageLabel: 'भाषा',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'लॉगिन पर शुरू करें',
    settingsButtonLabel: 'सेटिंग खोलें',
    languageOptions: {
      auto: 'स्वचालित रूप से पहचानें',
    },
    appearanceOptions: {
      frosted: 'धुंधला ग्लास',
      liquid: 'लिक्विड ग्लास',
    },
    sections: {
      appearance: 'रूप सेटिंग',
      general: 'सामान्य सेटिंग',
    },
    tabs: {
      appearance: 'रूप',
      general: 'सामान्य',
    },
  },
};

export default translation;
