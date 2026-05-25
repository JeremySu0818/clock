import type { Translation } from '../types';

const translation: Translation = {
  locale: 'vi',
  languageName: 'Tiếng Việt',
  direction: 'ltr',
  clock: {
    currentTime: 'Thời gian hiện tại',
  },
  settings: {
    appearanceLabel: 'Kiểu kính',
    autoTextContrast: 'Tự động điều chỉnh chữ số theo ảnh nền',
    categoriesLabel: 'Danh mục cài đặt',
    closeSettings: 'Đóng cài đặt',
    dialogLabel: 'Cài đặt',
    languageLabel: 'Ngôn ngữ',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Khởi động khi đăng nhập',
    settingsButtonLabel: 'Mở cài đặt',
    languageOptions: {
      auto: 'Tự động phát hiện',
    },
    appearanceOptions: {
      frosted: 'Kính mờ',
      liquid: 'Liquid Glass',
    },
    sections: {
      appearance: 'Cài đặt giao diện',
      general: 'Cài đặt chung',
    },
    tabs: {
      appearance: 'Giao diện',
      general: 'Chung',
    },
  },
  worldClock: {
    title: 'Giờ thế giới',
    backToMain: 'Quay lại màn hình chính',
    menuLabel: 'Mở menu tính năng',
    menuTitle: 'Menu tính năng',
    zones: {
      taipei: { city: 'Đài Bắc', note: 'Địa phương' },
      tokyo: { city: 'Tokyo', note: 'Nhật Bản' },
      london: { city: 'Luân Đôn', note: 'Vương quốc Anh' },
      newYork: { city: 'New York', note: 'Miền Đông Hoa Kỳ' },
      losAngeles: { city: 'Los Angeles', note: 'Miền Tây Hoa Kỳ' },
    },
  },
  alarm: {
    title: 'Báo thức',
    newAlarm: 'Báo thức mới',
    alarmNamePlaceholder: 'Tên báo thức',
    add: 'Thêm',
    ringing: 'Đang reo',
    stop: 'Dừng',
    delete: 'Xóa',
  },
};

export default translation;
