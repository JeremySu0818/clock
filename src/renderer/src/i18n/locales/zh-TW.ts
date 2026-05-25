import type { Translation } from '../types';

const translation: Translation = {
  locale: 'zh-TW',
  languageName: '繁體中文',
  direction: 'ltr',
  clock: {
    currentTime: '目前時間',
  },
  settings: {
    appearanceLabel: '玻璃外觀',
    autoTextContrast: '自動切換數字適應背景圖片',
    categoriesLabel: '設定分類',
    closeSettings: '關閉設定',
    dialogLabel: '設定',
    languageLabel: '語言',
    timeFormatLabel: '時間格式',
    timeFormatOptions: {
      h12: '12 小時制',
      h24: '24 小時制',
    },
    launchAtLogin: '登入時啟動',
    settingsButtonLabel: '開啟設定',
    languageOptions: {
      auto: '自動偵測',
    },
    appearanceOptions: {
      frosted: '霧面玻璃',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: '外觀設定',
      general: '一般設定',
    },
    tabs: {
      appearance: '外觀',
      general: '一般',
    },
  },
  worldClock: {
    title: '世界時鐘',
    backToMain: '返回主畫面',
    menuLabel: '開啟時鐘功能選單',
    menuTitle: '時鐘功能選單',
    zones: {
      taipei: { city: '台北', note: '本地' },
      tokyo: { city: '東京', note: '日本' },
      london: { city: '倫敦', note: '英國' },
      newYork: { city: '紐約', note: '美東' },
      losAngeles: { city: '洛杉磯', note: '美西' },
    },
  },
  alarm: {
    title: '鬧鐘',
    newAlarm: '新鬧鐘',
    alarmNamePlaceholder: '鬧鐘名稱',
    add: '新增',
    ringing: '響鈴中',
    stop: '停止',
    delete: '刪除',
  },
};

export default translation;
