import { contrastRatio } from './contrast.ts';
import { hexToOklch, oklchToHex } from './oklch.ts';

// Mirror --color-paper and --color-ink in globals.css.
export const PAPER = '#F7F6F1';
export const INK = '#0B0B0B';

/**
 * Lightest tint of the accent's hue that stays visible on paper (3:1) and
 * keeps ink text readable on top of it (4.5:1).
 */
export function pageSelection(accent: string) {
  const color = hexToOklch(accent);
  for (let l = 0.95; l > 0.3; l -= 0.005) {
    const tint = oklchToHex({ ...color, l });
    if (contrastRatio(tint, PAPER) >= 3 && contrastRatio(INK, tint) >= 4.5) {
      return tint;
    }
  }
  throw new Error(`No readable page selection for ${accent}`);
}
