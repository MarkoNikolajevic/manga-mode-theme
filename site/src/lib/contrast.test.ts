import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contrastRatio, formatRatio, wcagLevel } from './contrast.ts';

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
