import assert from 'node:assert/strict';
import { test } from 'node:test';
import { hexToOklch, oklchToHex } from './oklch.ts';

test('OKLCH round-trips sRGB colors', () => {
  for (const hex of ['#000000', '#FFFFFF', '#E06C75', '#1F2A44', '#7FD1B9']) {
    assert.equal(oklchToHex(hexToOklch(hex)), hex);
  }
});

test('OKLCH lightness matches reference values', () => {
  assert.ok(Math.abs(hexToOklch('#FFFFFF').l - 1) < 1e-4);
  assert.ok(Math.abs(hexToOklch('#FF0000').l - 0.628) < 1e-3);
});
