import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  branchFor,
  hourSixCaption,
  noteRead,
  shelfIsRead,
} from './easter-eggs.ts';

const themesDir = new URL('../../../themes/', import.meta.url);
const themeNames = readdirSync(themesDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => {
    const theme = JSON.parse(readFileSync(new URL(file, themesDir), 'utf8'));
    return (theme.name as string).replace('MangaMode: ', '');
  })
  .sort();

test('each shipped theme has the status-bar branch agreed for it', () => {
  assert.deepEqual(
    themeNames.map((name) => [name, branchFor(name)]),
    [
      ['DanDaDan', 'occult'],
      ['Death Note', 'notebook'],
      ['Demon Slayer', 'nichirin'],
      ['Dragon Ball', 'kame'],
      ['Jujutsu Kaisen', 'domain'],
      ['One Piece', 'grand-line'],
      ['Pokemon', 'pallet'],
      ['Sailor Moon', 'moon'],
    ],
  );
});

test('branchFor rejects a volume with no branch', () => {
  assert.throws(() => branchFor('Naruto'), /Naruto/);
});

test('the volume already on screen counts as read', () => {
  const issues = [1, 2, 3];
  const read = noteRead(new Set(), 1);

  assert.deepEqual([...read], [1]);
  assert.equal(shelfIsRead(read, issues), false);
});

test('rereading a volume does not change the set', () => {
  const read = noteRead(new Set([1]), 1);

  assert.equal(noteRead(read, 1), read);
});

test('the shelf is read only after every volume has been opened', () => {
  const issues = [1, 2, 3];
  const almost = noteRead(noteRead(new Set([1]), 2), 2);

  assert.equal(shelfIsRead(almost, issues), false);
  assert.equal(shelfIsRead(noteRead(almost, 3), issues), true);
});

test('the hour-six line changes once the shelf is read', () => {
  assert.equal(hourSixCaption(false), 'Hour six of the refactor.');
  assert.equal(hourSixCaption(true), 'Hour six. You read the whole shelf.');
});
