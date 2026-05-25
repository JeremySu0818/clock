import type { Translation } from '../types';

const translation: Translation = {
  locale: 'ko',
  languageName: '한국어',
  direction: 'ltr',
  clock: {
    currentTime: '현재 시간',
  },
  settings: {
    appearanceLabel: '유리 모양',
    autoTextContrast: '배경 이미지에 맞게 숫자 자동 조정',
    categoriesLabel: '설정 카테고리',
    closeSettings: '설정 닫기',
    dialogLabel: '설정',
    languageLabel: '언어',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: '로그인 시 시작',
    settingsButtonLabel: '설정 열기',
    languageOptions: {
      auto: '자동 감지',
    },
    appearanceOptions: {
      frosted: '반투명 유리',
      liquid: '리퀴드 글래스',
    },
    sections: {
      appearance: '모양 설정',
      general: '일반 설정',
    },
    tabs: {
      appearance: '모양',
      general: '일반',
    },
  },
};

export default translation;
