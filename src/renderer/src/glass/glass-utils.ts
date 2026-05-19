import type { TextContrastTone } from '../../../shared/types';

export type { TextContrastTone };

export const DARK_TEXT_LUMINANCE_THRESHOLD = 0.58;
export const LIGHT_TEXT_LUMINANCE_THRESHOLD = 0.48;

export function getBackdropContrastTone(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  currentTone: TextContrastTone,
): TextContrastTone {
  const image = context.getImageData(0, 0, width, height);
  const data = image.data;
  const stride = Math.max(4, (Math.min(width, height) / 14) | 0);
  let luminanceTotal = 0;
  let samples = 0;

  for (let y = 0; y < height; y += stride) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x += stride) {
      const offset = (rowOffset + x) << 2;
      const alpha = data[offset + 3];

      if (alpha <= 0) {
        continue;
      }

      const alphaFactor = alpha / 255;
      luminanceTotal +=
        ((0.2126 * data[offset] +
          0.7152 * data[offset + 1] +
          0.0722 * data[offset + 2]) /
          255) *
        alphaFactor;
      samples += 1;
    }
  }

  if (samples === 0) {
    return currentTone;
  }

  const luminance = luminanceTotal / samples;

  if (currentTone === 'dark') {
    return luminance < LIGHT_TEXT_LUMINANCE_THRESHOLD ? 'light' : 'dark';
  }

  return luminance > DARK_TEXT_LUMINANCE_THRESHOLD ? 'dark' : 'light';
}
