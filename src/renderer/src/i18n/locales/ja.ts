import type { Translation } from '../types';

const translation: Translation = {
  locale: 'ja',
  languageName: '日本語',
  direction: 'ltr',
  clock: {
    currentTime: '現在時刻',
  },
  settings: {
    appearanceLabel: 'ガラスの外観',
    autoTextContrast: '背景画像に合わせて数字を自動調整',
    categoriesLabel: '設定カテゴリ',
    closeSettings: '設定を閉じる',
    dialogLabel: '設定',
    languageLabel: '言語',
    launchAtLogin: 'ログイン時に起動',
    settingsButtonLabel: '設定を開く',
    languageOptions: {
      auto: '自動検出',
    },
    appearanceOptions: {
      frosted: 'すりガラス',
      liquid: 'リキッドガラス',
    },
    sections: {
      appearance: '外観設定',
      general: '一般設定',
    },
    tabs: {
      appearance: '外観',
      general: '一般',
    },
  },
};

export default translation;
