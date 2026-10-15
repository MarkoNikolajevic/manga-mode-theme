import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { contrastRatio } from './contrast.ts';
import { hexToOklch } from './oklch.ts';
import { INK, PAPER, pageSelection } from './selection.ts';

const themesDir = new URL('../../../themes/', import.meta.url);
const accents = readdirSync(themesDir).map((file) => {
  const theme = JSON.parse(readFileSync(new URL(file, themesDir), 'utf8'));
  const token = theme.tokenColors.find(
    (entry: { scope: string | string[] }) =>
      [entry.scope].flat()[0] === 'entity.name.function',
  );
  return [file, token.settings.foreground as string] as const;
});

test('every volume gets a page selection that is visible and readable', () => {
  assert.equal(accents.length, 8);
  for (const [file, accent] of accents) {
    const tint = pageSelection(accent);
    assert.ok(contrastRatio(tint, PAPER) >= 3, `${file}: ${tint} vs paper`);
    assert.ok(contrastRatio(INK, tint) >= 4.5, `${file}: ink on ${tint}`);
  }
});

test('the tint keeps the accent hue', () => {
  for (const [file, accent] of accents) {
    const delta = Math.abs(
      hexToOklch(pageSelection(accent)).h - hexToOklch(accent).h,
    );
    assert.ok(
      Math.min(delta, 2 * Math.PI - delta) < 0.2,
      `${file}: hue drift ${delta}`,
    );
  }
});
