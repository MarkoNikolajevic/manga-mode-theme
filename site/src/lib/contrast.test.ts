import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  accentOn,
  contrastRatio,
  formatRatio,
  luminance,
  wcagLevel,
} from './contrast.ts';

test('contrastRatio matches WCAG reference values', () => {
  assert.equal(contrastRatio('#000000', '#FFFFFF'), 21);
  assert.equal(contrastRatio('#FFFFFF', '#000000'), 21);
  assert.equal(contrastRatio('#777777', '#777777'), 1);
});

test('formatRatio never rounds up past a threshold', () => {
  assert.equal(formatRatio(4.46), '4.4:1');
  assert.equal(formatRatio(14.39), '14.3:1');
});

test('wcagLevel thresholds', () => {
  assert.equal(wcagLevel(7), 'AAA');
  assert.equal(wcagLevel(4.5), 'AA');
  assert.equal(wcagLevel(4.49), 'Fail');
});

test('accentOn keeps a color that already clears the floor', () => {
  assert.equal(accentOn('#000000', '#F7F6F1', 3), '#000000');
});

test('accentOn darkens on paper and lightens on ink until the floor holds', () => {
  const onPaper = accentOn('#E7C85A', '#F7F6F1', 3);
  const onInk = accentOn('#286B59', '#0B0B0B', 4.5);
  assert.ok(contrastRatio(onPaper, '#F7F6F1') >= 3);
  assert.ok(contrastRatio(onInk, '#0B0B0B') >= 4.5);
  assert.ok(luminance(onPaper) < luminance('#E7C85A'));
  assert.ok(luminance(onInk) > luminance('#286B59'));
});
