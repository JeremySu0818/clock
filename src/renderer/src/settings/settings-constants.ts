import type { LiquidGlassConfig } from '../glass/LiquidGlassProvider';

export const BUTTON_GLASS_CONFIG = {
  radius: 5,
  bezelWidth: 0,
  glassThickness: 120,
  surface: 'convexSquircle',
} satisfies Partial<LiquidGlassConfig>;

export const SWITCH_TRACK_GLASS_CONFIG = {
  radius: 999,
  bezelWidth: 0,
  glassThickness: 100,
  surface: 'convexSquircle',
} satisfies Partial<LiquidGlassConfig>;

export const SWITCH_THUMB_GLASS_CONFIG = {
  radius: 999,
  bezelWidth: 0,
  glassThickness: 160,
  surface: 'convexCircle',
} satisfies Partial<LiquidGlassConfig>;
