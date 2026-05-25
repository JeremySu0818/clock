import type { Translation } from '../types';

const translation: Translation = {
  locale: 'es',
  languageName: 'Español',
  direction: 'ltr',
  clock: {
    currentTime: 'Hora actual',
  },
  settings: {
    appearanceLabel: 'Apariencia del cristal',
    autoTextContrast:
      'Adaptar automáticamente los números a la imagen de fondo',
    categoriesLabel: 'Categorías de ajustes',
    closeSettings: 'Cerrar ajustes',
    dialogLabel: 'Ajustes',
    languageLabel: 'Idioma',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Iniciar al iniciar sesión',
    settingsButtonLabel: 'Abrir ajustes',
    languageOptions: {
      auto: 'Detectar automáticamente',
    },
    appearanceOptions: {
      frosted: 'Cristal esmerilado',
      liquid: 'Cristal líquido',
    },
    sections: {
      appearance: 'Ajustes de apariencia',
      general: 'Ajustes generales',
    },
    tabs: {
      appearance: 'Apariencia',
      general: 'General',
    },
  },
  worldClock: {
    title: 'Reloj mundial',
    backToMain: 'Volver a la pantalla principal',
    menuLabel: 'Abrir menú de funciones',
    menuTitle: 'Menú de funciones',
    zones: {
      taipei: { city: 'Taipéi', note: 'Local' },
      tokyo: { city: 'Tokio', note: 'Japón' },
      london: { city: 'Londres', note: 'Reino Unido' },
      newYork: { city: 'Nueva York', note: 'Este de EE. UU.' },
      losAngeles: { city: 'Los Ángeles', note: 'Oeste de EE. UU.' },
    },
  },
  alarm: {
    title: 'Alarma',
    newAlarm: 'Nueva alarma',
    alarmNamePlaceholder: 'Nombre de la alarma',
    add: 'Añadir',
    ringing: 'Sonando',
    stop: 'Detener',
    delete: 'Eliminar',
  },
};

export default translation;
