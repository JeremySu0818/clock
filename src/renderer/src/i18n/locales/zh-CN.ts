import type { Translation } from '../types';

const translation: Translation = {
  locale: 'zh-CN',
  languageName: '简体中文',
  direction: 'ltr',
  clock: {
    currentTime: '当前时间',
  },
  settings: {
    appearanceLabel: '玻璃外观',
    autoTextContrast: '自动切换数字以适应背景图片',
    categoriesLabel: '设置分类',
    closeSettings: '关闭设置',
    dialogLabel: '设置',
    languageLabel: '语言',
    timeFormatLabel: '时间格式',
    timeFormatOptions: {
      h12: '12 小时制',
      h24: '24 小时制',
    },
    launchAtLogin: '登录时启动',
    settingsButtonLabel: '打开设置',
    languageOptions: {
      auto: '自动检测',
    },
    appearanceOptions: {
      frosted: '雾面玻璃',
      liquid: '液态玻璃',
    },
    sections: {
      appearance: '外观设置',
      general: '一般设置',
    },
    tabs: {
      appearance: '外观',
      general: '一般',
    },
  },
  worldClock: {
    title: '世界时钟',
    backToMain: '返回主画面',
    menuLabel: '打开时钟功能菜单',
    menuTitle: '时钟功能菜单',
    zones: {
      taipei: { city: '台北', note: '本地' },
      tokyo: { city: '东京', note: '日本' },
      london: { city: '伦敦', note: '英国' },
      newYork: { city: '纽约', note: '美东' },
      losAngeles: { city: '洛杉矶', note: '美西' },
    },
  },
  alarm: {
    title: '闹钟',
    newAlarm: '新闹钟',
    alarmNamePlaceholder: '闹钟名称',
    add: '新增',
    ringing: '响铃中',
    stop: '停止',
    delete: '删除',
  },
};

export default translation;
