import type { Translation } from '../types';

const translation: Translation = {
  locale: 'id',
  languageName: 'Bahasa Indonesia',
  direction: 'ltr',
  clock: {
    currentTime: 'Waktu saat ini',
  },
  settings: {
    appearanceLabel: 'Tampilan kaca',
    autoTextContrast: 'Sesuaikan angka secara otomatis dengan gambar latar',
    categoriesLabel: 'Kategori pengaturan',
    closeSettings: 'Tutup pengaturan',
    dialogLabel: 'Pengaturan',
    languageLabel: 'Bahasa',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Mulai saat masuk',
    settingsButtonLabel: 'Buka pengaturan',
    languageOptions: {
      auto: 'Deteksi otomatis',
    },
    appearanceOptions: {
      frosted: 'Kaca buram',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Pengaturan tampilan',
      general: 'Pengaturan umum',
    },
    tabs: {
      appearance: 'Tampilan',
      general: 'Umum',
    },
  },
  worldClock: {
    title: 'Jam Dunia',
    backToMain: 'Kembali ke layar utama',
    menuLabel: 'Buka menu fitur',
    menuTitle: 'Menu fitur',
    zones: {
      taipei: { city: 'Taipei', note: 'Lokal' },
      tokyo: { city: 'Tokyo', note: 'Jepang' },
      london: { city: 'London', note: 'Inggris' },
      newYork: { city: 'New York', note: 'AS Timur' },
      losAngeles: { city: 'Los Angeles', note: 'AS Barat' },
    },
  },
  alarm: {
    title: 'Alarm',
    newAlarm: 'Alarm Baru',
    alarmNamePlaceholder: 'Nama Alarm',
    add: 'Tambah',
    ringing: 'Berdering',
    stop: 'Berhenti',
    delete: 'Hapus',
  },
};

export default translation;
