import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { checkTheme, composite, contrastRatio, parseColor } from './contrast.mjs';

const fixture = () => JSON.parse(readFileSync(new URL('../themes/gachiakuta-color-theme.json', import.meta.url), 'utf8'));
const fails = (theme, label) => checkTheme(theme).findings.some((finding) => finding.label === label);

test('hex parsing supports VS Code shorthand and rejects invalid colors', () => {
  assert.deepEqual(parseColor('#abc'), [170, 187, 204, 1]);
  assert.deepEqual(parseColor('#1238'), [17, 34, 51, 136 / 255]);
  for (const value of [undefined, '#12345', '#gggggg', 'red']) assert.throws(() => parseColor(value), /Invalid theme color/);
});

test('translucent colors are composited in sRGB before contrast is measured', () => {
  assert.deepEqual(composite('#ffffff80', '#000000'), [128, 128, 128, 1]);
  assert.deepEqual(composite('#ff000080', composite('#0000ff80', '#ffffff')).map(Math.round), [191, 63, 127, 1]);
  assert.equal(contrastRatio('#000', '#fff'), 21);
  assert.equal(contrastRatio('#ffffff00', '#000'), 1);
  assert.ok(contrastRatio('#777', '#fff') < 4.5);
  assert.throws(() => contrastRatio('#fff', '#0008'), /opaque/);
});

test('selection checks syntax unless the theme explicitly overrides selected text', () => {
  const theme = fixture();
  assert.equal(fails(theme, 'editor.selectionBackground'), false);
  theme.colors['editor.selectionBackground'] = '#fff';
  assert.equal(fails(theme, 'editor.selectionBackground'), true);
  theme.colors['editor.selectionForeground'] = '#000';
  assert.equal(fails(theme, 'editor.selectionBackground'), false);
});

test('transparent diff text is checked over its changed-line background', () => {
  const theme = fixture();
  theme.colors['diffEditor.insertedLineBackground'] = '#ffffff20';
  theme.colors['diffEditor.insertedTextBackground'] = '#ffffff20';
  assert.equal(fails(theme, 'diffEditor.insertedTextBackground'), true);
  assert.equal(fails(fixture(), 'diffEditor.insertedTextBackground'), false);
});

test('UI text is checked against its own surface and hover state', () => {
  const theme = fixture();
  theme.colors['button.hoverBackground'] = theme.colors['button.foreground'];
  theme.colors['tab.inactiveBackground'] = theme.colors['tab.inactiveForeground'];
  assert.equal(fails(theme, 'button.foreground on button.hoverBackground'), true);
  assert.equal(fails(theme, 'tab.inactiveForeground on tab.inactiveBackground'), true);
});

test('transparent focus indicators must clear non-text contrast on adjacent surfaces', () => {
  const theme = fixture();
  theme.colors.focusBorder = '#ffffff10';
  assert.equal(fails(theme, 'focusBorder on editor.background'), true);
  assert.equal(checkTheme(theme).findings.find((f) => f.label === 'focusBorder on editor.background').minimum, 3);
});

test('missing required colors fail instead of silently skipping a state', () => {
  const theme = fixture();
  delete theme.colors['menu.selectionForeground'];
  assert.throws(() => checkTheme(theme), /Missing theme color: menu.selectionForeground/);
});

test('semantic token style objects and bracket colors are checked', () => {
  const theme = fixture();
  theme.semanticTokenColors.function = { foreground: '#1C1917', italic: true };
  assert.equal(fails(theme, 'editor text'), true);
  const brackets = fixture();
  brackets.colors['editorBracketHighlight.foreground6'] = '#1C1917';
  assert.equal(fails(brackets, 'editor text'), true);
});

test('high contrast themes retain the AAA text floor', () => {
  const theme = fixture();
  theme.type = 'hc';
  assert.ok(checkTheme(theme).findings.some((f) => f.minimum === 7 && f.ratio >= 4.5));
});
