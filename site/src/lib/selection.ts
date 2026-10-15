import { contrastRatio } from './contrast.ts';
import { hexToOklch, oklchToHex } from './oklch.ts';

// Mirror --color-paper and --color-ink in globals.css.
export const PAPER = '#F7F6F1';
export const INK = '#0B0B0B';

// Pale enough to stay in sRGB at high lightness, so the hue survives.
const MAX_TINT_CHROMA = 0.07;

/**
 * Lightest tint of the accent's hue that is at least as visible on paper as a
 * browser's default selection (1.3:1) and keeps ink text readable (4.5:1).
 */
export function pageSelection(accent: string) {
  const color = hexToOklch(accent);
  color.c = Math.min(color.c, MAX_TINT_CHROMA);
  for (let l = 0.95; l > 0.3; l -= 0.005) {
    const tint = oklchToHex({ ...color, l });
    if (contrastRatio(tint, PAPER) >= 1.3 && contrastRatio(INK, tint) >= 4.5) {
      return tint;
    }
  }
  throw new Error(`No readable page selection for ${accent}`);
}
