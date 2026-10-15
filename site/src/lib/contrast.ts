export type WcagLevel = 'AAA' | 'AA' | 'Fail';

const channel = (hex: string, offset: number) => {
  const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance of a `#RRGGBB` color. */
export const luminance = (hex: string) =>
  0.2126 * channel(hex, 1) +
  0.7152 * channel(hex, 3) +
  0.0722 * channel(hex, 5);

export function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

export const wcagLevel = (ratio: number): WcagLevel =>
  ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';

// Rounds down so a 4.46:1 color is never advertised as 4.5:1.
export const formatRatio = (ratio: number) =>
  `${Math.floor(ratio * 10) / 10}:1`;
