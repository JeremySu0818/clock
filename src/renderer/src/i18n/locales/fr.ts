import type { Translation } from '../types';

const translation: Translation = {
  locale: 'fr',
  languageName: 'Français',
  direction: 'ltr',
  clock: {
    currentTime: 'Heure actuelle',
  },
  settings: {
    appearanceLabel: 'Apparence du verre',
    autoTextContrast:
      "Adapter automatiquement les chiffres à l'image d'arrière-plan",
    categoriesLabel: 'Catégories des réglages',
    closeSettings: 'Fermer les réglages',
    dialogLabel: 'Réglages',
    languageLabel: 'Langue',
    timeFormatLabel: 'Time format',
    timeFormatOptions: {
      h12: '12-hour',
      h24: '24-hour',
    },
    launchAtLogin: 'Lancer à la connexion',
    settingsButtonLabel: 'Ouvrir les réglages',
    languageOptions: {
      auto: 'Détecter automatiquement',
    },
    appearanceOptions: {
      frosted: 'Verre dépoli',
      liquid: 'Verre liquide',
    },
    sections: {
      appearance: "Réglages d'apparence",
      general: 'Réglages généraux',
    },
    tabs: {
      appearance: 'Apparence',
      general: 'Général',
    },
  },
  worldClock: {
    title: 'Horloge mondiale',
    backToMain: "Retour à l'écran principal",
    menuLabel: 'Ouvrir le menu des fonctionnalités',
    menuTitle: 'Menu des fonctionnalités',
    zones: {
      taipei: { city: 'Taipei', note: 'Local' },
      tokyo: { city: 'Tokyo', note: 'Japon' },
      london: { city: 'Londres', note: 'Royaume-Uni' },
      newYork: { city: 'New York', note: 'Est des États-Unis' },
      losAngeles: { city: 'Los Angeles', note: 'Ouest des États-Unis' },
    },
  },
  alarm: {
    title: 'Alarme',
    newAlarm: 'Nouvelle alarme',
    alarmNamePlaceholder: "Nom de l'alarme",
    add: 'Ajouter',
    ringing: 'Sonnerie',
    stop: 'Arrêter',
    delete: 'Supprimer',
  },
};

export default translation;
