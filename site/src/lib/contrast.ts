import { luminanceRatio, rgbLuminance } from '../../../scripts/color-math.mjs';

export type WcagLevel = 'AAA' | 'AA' | 'Fail';

const channel = (hex: string, offset: number) =>
  Number.parseInt(hex.slice(offset, offset + 2), 16);

/** WCAG relative luminance of a `#RRGGBB` color. */
export const luminance = (hex: string) =>
  rgbLuminance(channel(hex, 1), channel(hex, 3), channel(hex, 5));

export function contrastRatio(foreground: string, background: string) {
  return luminanceRatio(luminance(foreground), luminance(background));
}

export const wcagLevel = (ratio: number): WcagLevel =>
  ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';

// Rounds down so a 4.46:1 color is never advertised as 4.5:1.
export const formatRatio = (ratio: number) =>
  `${Math.floor(ratio * 10) / 10}:1`;

const toHex = (channels: number[]) =>
  `#${channels
    .map((value) => Math.round(value).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;

/**
 * Mixes `color` toward black or white in 10% steps until it reaches `minimum`
 * contrast on `background`. Used for the volume accent on paper and on ink.
 */
export function accentOn(color: string, background: string, minimum: number) {
  const target = luminance(background) > 0.18 ? 0 : 255;
  const start = [1, 3, 5].map((offset) => channel(color, offset));
  for (let step = 0; step <= 10; step++) {
    const mixed = toHex(
      start.map((value) => value + (target - value) * (step / 10)),
    );
    if (contrastRatio(mixed, background) >= minimum) return mixed;
  }
  throw new Error(`${color} cannot reach ${minimum}:1 on ${background}`);
}
