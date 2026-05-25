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
  worldClock: {
    title: '세계 시계',
    backToMain: '메인 화면으로 돌아가기',
    menuLabel: '기능 메뉴 열기',
    menuTitle: '기능 메뉴',
    zones: {
      taipei: { city: '타이베이', note: '현지' },
      tokyo: { city: '도쿄', note: '일본' },
      london: { city: '런던', note: '영국' },
      newYork: { city: '뉴욕', note: '미국 동부' },
      losAngeles: { city: '로스앤젤레스', note: '미국 서부' },
    },
  },
  alarm: {
    title: '알람',
    newAlarm: '새 알람',
    alarmNamePlaceholder: '알람 이름',
    add: '추가',
    ringing: '울리는 중',
    stop: '중지',
    delete: '삭제',
  },
};

export default translation;
