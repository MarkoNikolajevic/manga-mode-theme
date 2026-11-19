import type { CSSProperties } from 'react';

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
  description: string;
  appearance: 'Dark' | 'Light' | 'High contrast';
  /** Git branch shown in the editor status bar. */
  branch: string;
  /** High contrast themes are held to AAA (7:1) instead of AA (4.5:1). */
  highContrast: boolean;
  palette: Palette;
  chrome: Record<ChromeKey, string>;
  /** The volume's badge color, shifted to read on the paper page and on the ink install band. */
  accent: { paper: string; ink: string };
  selection: {
    /** Tint of the volume's accent for text on the paper page. */
    page: string;
    /** The theme's own editor selection, used inside code panels. */
    editor: string;
    editorText?: string;
  };
}

/** Workbench colors the hero's editor window is drawn with. */
export const CHROME_KEYS = [
  'activityBar.background',
  'activityBar.foreground',
  'activityBarBadge.background',
  'editorGroupHeader.tabsBackground',
  'tab.activeBackground',
  'tab.activeForeground',
  'tab.inactiveBackground',
  'tab.inactiveForeground',
  'tab.activeBorder',
  'statusBar.background',
  'statusBar.foreground',
] as const;
type ChromeKey = (typeof CHROME_KEYS)[number];

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

/** `tab.activeBorder` becomes `--ed-tab-activeBorder`. */
export const chromeVars = (chrome: Volume['chrome']) =>
  Object.fromEntries(
    Object.entries(chrome).map(([key, value]) => [
      `--ed-${key.replaceAll('.', '-')}`,
      value,
    ]),
  ) as CSSProperties;
