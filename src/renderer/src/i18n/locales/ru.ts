import type { Translation } from '../types';

const translation: Translation = {
  locale: 'ru',
  languageName: 'Русский',
  direction: 'ltr',
  clock: {
    currentTime: 'Текущее время',
  },
  settings: {
    appearanceLabel: 'Вид стекла',
    autoTextContrast:
      'Автоматически подстраивать цифры под фоновое изображение',
    categoriesLabel: 'Категории настроек',
    closeSettings: 'Закрыть настройки',
    dialogLabel: 'Настройки',
    languageLabel: 'Язык',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Запускать при входе',
    settingsButtonLabel: 'Открыть настройки',
    languageOptions: {
      auto: 'Определять автоматически',
    },
    appearanceOptions: {
      frosted: 'Матовое стекло',
      liquid: 'Жидкое стекло',
    },
    sections: {
      appearance: 'Настройки внешнего вида',
      general: 'Общие настройки',
    },
    tabs: {
      appearance: 'Внешний вид',
      general: 'Общие',
    },
  },
  worldClock: {
    title: 'Мировое время',
    backToMain: 'Назад на главный экран',
    menuLabel: 'Открыть меню функций',
    menuTitle: 'Меню функций',
    zones: {
      taipei: { city: 'Тайбэй', note: 'Местное' },
      tokyo: { city: 'Токио', note: 'Япония' },
      london: { city: 'Лондон', note: 'Великобритания' },
      newYork: { city: 'Нью-Йорк', note: 'Восток США' },
      losAngeles: { city: 'Лос-Анджелес', note: 'Запад США' },
    },
  },
  alarm: {
    title: 'Будильник',
    newAlarm: 'Новый будильник',
    alarmNamePlaceholder: 'Название будильника',
    add: 'Добавить',
    ringing: 'Звонит',
    stop: 'Остановить',
    delete: 'Удалить',
  },
};

export default translation;
