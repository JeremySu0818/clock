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
};

export default translation;
