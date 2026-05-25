import type { Translation } from '../types';

const translation: Translation = {
  locale: 'cs',
  languageName: 'Čeština',
  direction: 'ltr',
  clock: {
    currentTime: 'Aktuální čas',
  },
  settings: {
    appearanceLabel: 'Vzhled skla',
    autoTextContrast: 'Automaticky přizpůsobit číslice obrázku na pozadí',
    categoriesLabel: 'Kategorie nastavení',
    closeSettings: 'Zavřít nastavení',
    dialogLabel: 'Nastavení',
    languageLabel: 'Jazyk',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Spustit po přihlášení',
    settingsButtonLabel: 'Otevřít nastavení',
    languageOptions: {
      auto: 'Automaticky rozpoznat',
    },
    appearanceOptions: {
      frosted: 'Matné sklo',
      liquid: 'Tekuté sklo',
    },
    sections: {
      appearance: 'Nastavení vzhledu',
      general: 'Obecná nastavení',
    },
    tabs: {
      appearance: 'Vzhled',
      general: 'Obecné',
    },
  },
  worldClock: {
    title: 'Světový čas',
    backToMain: 'Zpět na hlavní obrazovku',
    menuLabel: 'Otevřít nabídku funkcí',
    menuTitle: 'Nabídka funkcí',
    zones: {
      taipei: { city: 'Tchaj-pej', note: 'Místní' },
      tokyo: { city: 'Tokio', note: 'Japonsko' },
      london: { city: 'Londýn', note: 'Velká Británie' },
      newYork: { city: 'New York', note: 'Východ USA' },
      losAngeles: { city: 'Los Angeles', note: 'Západ USA' },
    },
  },
  alarm: {
    title: 'Budík',
    newAlarm: 'Nový budík',
    alarmNamePlaceholder: 'Název budíku',
    add: 'Přidat',
    ringing: 'Zvoní',
    stop: 'Zastavit',
    delete: 'Smazat',
  },
};

export default translation;
