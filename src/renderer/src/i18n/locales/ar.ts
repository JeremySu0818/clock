import type { Translation } from '../types';

const translation: Translation = {
  locale: 'ar',
  languageName: 'العربية',
  direction: 'rtl',
  clock: {
    currentTime: 'الوقت الحالي',
  },
  settings: {
    appearanceLabel: 'مظهر الزجاج',
    autoTextContrast: 'تبديل لون الأرقام تلقائيًا ليلائم صورة الخلفية',
    categoriesLabel: 'فئات الإعدادات',
    closeSettings: 'إغلاق الإعدادات',
    dialogLabel: 'الإعدادات',
    languageLabel: 'اللغة',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'الفتح عند تسجيل الدخول',
    settingsButtonLabel: 'فتح الإعدادات',
    languageOptions: {
      auto: 'اكتشاف تلقائي',
    },
    appearanceOptions: {
      frosted: 'زجاج مصنفر',
      liquid: 'زجاج سائل',
    },
    sections: {
      appearance: 'إعدادات المظهر',
      general: 'الإعدادات العامة',
    },
    tabs: {
      appearance: 'المظهر',
      general: 'عام',
    },
  },
  worldClock: {
    title: 'التوقيت العالمي',
    backToMain: 'العودة للشاشة الرئيسية',
    menuLabel: 'فتح قائمة الميزات',
    menuTitle: 'قائمة الميزات',
    zones: {
      taipei: { city: 'تايبيه', note: 'محلي' },
      tokyo: { city: 'طوكيو', note: 'اليابان' },
      london: { city: 'لندن', note: 'المملكة المتحدة' },
      newYork: { city: 'نيويورك', note: 'شرق أمريكا' },
      losAngeles: { city: 'لوس أنجلوس', note: 'غرب أمريكا' },
    },
  },
  alarm: {
    title: 'المنبه',
    newAlarm: 'منبه جديد',
    alarmNamePlaceholder: 'اسم المنبه',
    add: 'إضافة',
    ringing: 'يرن',
    stop: 'إيقاف',
    delete: 'حذف',
  },
};

export default translation;
