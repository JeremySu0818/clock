import type { Translation } from '../types';

const translation: Translation = {
  locale: 'tr',
  languageName: 'Türkçe',
  direction: 'ltr',
  clock: {
    currentTime: 'Geçerli saat',
  },
  settings: {
    appearanceLabel: 'Cam görünümü',
    autoTextContrast: 'Rakamları arka plan görseline otomatik uyarla',
    categoriesLabel: 'Ayar kategorileri',
    closeSettings: 'Ayarları kapat',
    dialogLabel: 'Ayarlar',
    languageLabel: 'Dil',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Oturum açınca başlat',
    settingsButtonLabel: 'Ayarları aç',
    languageOptions: {
      auto: 'Otomatik algıla',
    },
    appearanceOptions: {
      frosted: 'Buzlu cam',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Görünüm ayarları',
      general: 'Genel ayarlar',
    },
    tabs: {
      appearance: 'Görünüm',
      general: 'Genel',
    },
  },
  worldClock: {
    title: 'Dünya Saati',
    backToMain: 'Ana ekrana dön',
    menuLabel: 'Özellikler menüsünü aç',
    menuTitle: 'Özellikler menüsü',
    zones: {
      taipei: { city: 'Taipei', note: 'Yerel' },
      tokyo: { city: 'Tokyo', note: 'Japonya' },
      london: { city: 'Londra', note: 'İngiltere' },
      newYork: { city: 'New York', note: 'ABD Doğu' },
      losAngeles: { city: 'Los Angeles', note: 'ABD Batı' },
    },
  },
  alarm: {
    title: 'Alarm',
    newAlarm: 'Yeni Alarm',
    alarmNamePlaceholder: 'Alarm Adı',
    add: 'Ekle',
    ringing: 'Çalıyor',
    stop: 'Durdur',
    delete: 'Sil',
  },
};

export default translation;
