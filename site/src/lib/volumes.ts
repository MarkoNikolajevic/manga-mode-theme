import type { CSSProperties } from 'react';
import dandadan from '../../../themes/dandadan-color-theme.json';
import deathNote from '../../../themes/death-note-color-theme.json';
import demonSlayer from '../../../themes/demon-slayer-color-theme.json';
import dragonBall from '../../../themes/dragon-ball-color-theme.json';
import jujutsuKaisen from '../../../themes/jujutsu-kaisen-color-theme.json';
import onePiece from '../../../themes/one-piece-color-theme.json';
import pokemon from '../../../themes/pokemon-color-theme.json';
import sailorMoon from '../../../themes/sailor-moon-color-theme.json';

interface ThemeFile {
  name: string;
  colors: Record<string, string>;
  tokenColors: {
    scope: string | string[];
    settings: { foreground?: string };
  }[];
}

export interface Palette {
  background: string;
  text: string;
  lineNumber: string;
  comment: string;
  keyword: string;
  function: string;
  string: string;
  number: string;
  type: string;
  brackets: readonly [string, string, string];
}

export interface Volume {
  issue: number;
  name: string;
  palette: Palette;
}

// Shelf order matches the order themes are contributed in the extension manifest.
const THEMES: ThemeFile[] = [
  onePiece,
  pokemon,
  dragonBall,
  demonSlayer,
  jujutsuKaisen,
  dandadan,
  sailorMoon,
  deathNote,
];

function requireColor(
  theme: ThemeFile,
  key: string,
  value: string | undefined,
) {
  if (!value) throw new Error(`${theme.name} is missing a color for "${key}"`);
  return value;
}

const workbenchColor = (theme: ThemeFile, key: string) =>
  requireColor(theme, key, theme.colors[key]);

const scopeColor = (theme: ThemeFile, scope: string) =>
  requireColor(
    theme,
    scope,
    theme.tokenColors.find((token) => [token.scope].flat()[0] === scope)
      ?.settings.foreground,
  );

const toPalette = (theme: ThemeFile): Palette => ({
  background: workbenchColor(theme, 'editor.background'),
  text: workbenchColor(theme, 'editor.foreground'),
  lineNumber: workbenchColor(theme, 'editorLineNumber.foreground'),
  comment: scopeColor(theme, 'comment'),
  keyword: scopeColor(theme, 'keyword'),
  function: scopeColor(theme, 'entity.name.function'),
  string: scopeColor(theme, 'string'),
  number: scopeColor(theme, 'constant.numeric'),
  type: scopeColor(theme, 'entity.name.type'),
  brackets: [
    workbenchColor(theme, 'editorBracketHighlight.foreground1'),
    workbenchColor(theme, 'editorBracketHighlight.foreground2'),
    workbenchColor(theme, 'editorBracketHighlight.foreground3'),
  ],
});

export const VOLUMES: Volume[] = THEMES.map((theme, index) => ({
  issue: index + 1,
  name: theme.name.replace('MangaMode: ', ''),
  palette: toPalette(theme),
}));

/** A deliberately garish palette, invented for the side-by-side comparison. */
export const LOUD_PALETTE: Palette = {
  background: '#000000',
  text: '#FFFFFF',
  lineNumber: '#FFFFFF',
  comment: '#00FF00',
  keyword: '#FF00FF',
  function: '#00FFFF',
  string: '#39FF14',
  number: '#FFFF00',
  type: '#FF8C00',
  brackets: ['#FFD700', '#DA70D6', '#179FFF'],
};

export const CONTRAST_TOKENS = [
  { label: 'Text', key: 'text' },
  { label: 'Comment', key: 'comment' },
  { label: 'Keyword', key: 'keyword' },
  { label: 'Function', key: 'function' },
  { label: 'String', key: 'string' },
  { label: 'Number', key: 'number' },
  { label: 'Type', key: 'type' },
  { label: 'Line number', key: 'lineNumber' },
] as const satisfies readonly { label: string; key: keyof Palette }[];

type PaletteVars = CSSProperties & Record<`--tok-${string}`, string>;

/** Exposes a palette as the CSS variables `CodeSample` is colored with. */
export const paletteVars = (palette: Palette): PaletteVars => ({
  '--tok-bg': palette.background,
  '--tok-text': palette.text,
  '--tok-line': palette.lineNumber,
  '--tok-comment': palette.comment,
  '--tok-keyword': palette.keyword,
  '--tok-function': palette.function,
  '--tok-string': palette.string,
  '--tok-number': palette.number,
  '--tok-type': palette.type,
  '--tok-b1': palette.brackets[0],
  '--tok-b2': palette.brackets[1],
  '--tok-b3': palette.brackets[2],
});
