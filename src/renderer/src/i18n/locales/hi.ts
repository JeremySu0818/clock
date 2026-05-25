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
  worldClock: {
    title: 'विश्व घड़ी',
    backToMain: 'मुख्य स्क्रीन पर वापस जाएं',
    menuLabel: 'सुविधा मेनू खोलें',
    menuTitle: 'सुविधा मेनू',
    zones: {
      taipei: { city: 'ताइपे', note: 'स्थानीय' },
      tokyo: { city: 'टोक्यो', note: 'जापान' },
      london: { city: 'लंदन', note: 'यूके' },
      newYork: { city: 'न्यू यॉर्क', note: 'पूर्वी अमेरिका' },
      losAngeles: { city: 'लॉस एंजिल्स', note: 'पश्चिमी अमेरिका' },
    },
  },
  alarm: {
    title: 'अलार्म',
    newAlarm: 'नया अलार्म',
    alarmNamePlaceholder: 'अलार्म का नाम',
    add: 'जोड़ें',
    ringing: 'बज रहा है',
    stop: 'रोकें',
    delete: 'हटाएं',
  },
};

export default translation;
