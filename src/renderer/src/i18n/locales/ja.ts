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
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
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
  worldClock: {
    title: '世界時計',
    backToMain: 'メイン画面に戻る',
    menuLabel: '機能メニューを開く',
    menuTitle: '機能メニュー',
    zones: {
      taipei: { city: '台北', note: '現地' },
      tokyo: { city: '東京', note: '日本' },
      london: { city: 'ロンドン', note: 'イギリス' },
      newYork: { city: 'ニューヨーク', note: '米国東部' },
      losAngeles: { city: 'ロサンゼルス', note: '米国西部' },
    },
  },
  alarm: {
    title: 'アラーム',
    newAlarm: '新規アラーム',
    alarmNamePlaceholder: 'アラーム名',
    add: '追加',
    ringing: '鳴動中',
    stop: '停止',
    delete: '削除',
  },
};

export default translation;
