import assert from 'node:assert/strict';
import { test } from 'node:test';
import { textFloor, textSurfaces, zedFiles } from './build-zed.mjs';
import { contrastRatio, parseColor } from './contrast.mjs';
import { readProjectFile, themeContributions } from './preview-manifest.mjs';

const files = zedFiles();
const family = JSON.parse(files['zed/themes/mangamode.json']);

test('committed Zed extension matches the VS Code themes', () => {
  for (const [path, content] of Object.entries(files))
    assert.equal(
      readProjectFile(path).toString(),
      content,
      `${path} is stale; run node scripts/build-zed.mjs`,
    );
});

// The Zed registry only accepts a license inside the extension directory.
test('Zed extension carries the project license', () => {
  assert.deepEqual(readProjectFile('zed/LICENSE'), readProjectFile('LICENSE'));
});

test('every VS Code variant ships to Zed with valid colors', () => {
  assert.deepEqual(
    family.themes.map((theme) => theme.name),
    themeContributions().map((theme) => theme.label),
  );
  const visit = (value) => {
    if (typeof value === 'string' && value.startsWith('#')) parseColor(value);
    else if (value && typeof value === 'object')
      Object.values(value).forEach(visit);
  };
  visit(family);
});

// Guards the generator's muted-text choice: these pairings are not covered by the VS Code checks.
test('Zed UI text clears the contrast floor on every surface it is drawn on', () => {
  const floors = new Map(
    themeContributions().map((theme) => [theme.label, textFloor(theme)]),
  );
  for (const { name, style } of family.themes) {
    const floor = floors.get(name);
    const surfaces = textSurfaces(style);
    for (const [surface, background] of Object.entries(surfaces))
      for (const key of ['text', 'text.muted']) {
        const ratio = contrastRatio(style[key], background);
        assert.ok(
          ratio >= floor,
          `${name}: ${key} on ${surface} is ${ratio.toFixed(2)}:1 (< ${floor})`,
        );
      }
  }
});
