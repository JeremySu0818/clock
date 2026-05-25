import type { Translation } from '../types';

const translation: Translation = {
  locale: 'pt-BR',
  languageName: 'Português (Brasil)',
  direction: 'ltr',
  clock: {
    currentTime: 'Hora atual',
  },
  settings: {
    appearanceLabel: 'Aparência do vidro',
    autoTextContrast: 'Adaptar automaticamente os números à imagem de fundo',
    categoriesLabel: 'Categorias de configurações',
    closeSettings: 'Fechar configurações',
    dialogLabel: 'Configurações',
    languageLabel: 'Idioma',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Iniciar ao entrar',
    settingsButtonLabel: 'Abrir configurações',
    languageOptions: {
      auto: 'Detectar automaticamente',
    },
    appearanceOptions: {
      frosted: 'Vidro fosco',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Configurações de aparência',
      general: 'Configurações gerais',
    },
    tabs: {
      appearance: 'Aparência',
      general: 'Geral',
    },
  },
};

export default translation;
