import 'server-only';
import manifest from '../../../package.json';
import { themeId } from '../../../scripts/theme-id.mjs';
import { accentOn } from './contrast';
import { branchFor } from './easter-eggs';
import { INK, PAPER, pageSelection } from './selection';
import { CHROME_KEYS, type Palette, type Volume } from './volumes';

interface ThemeFile {
  name: string;
  type: string;
  colors: Record<string, string>;
  tokenColors: {
    scope: string | string[];
    settings: { foreground?: string };
  }[];
}

// Shelf order is editorial and independent of marketplace order.
const SHELF = [
  [
    'one-piece',
    'Ocean blues and Straw Hat red. Complicated code, handled like a Pirate King.',
  ],
  [
    'pokemon',
    'Electric yellow on soft charcoal. A familiar spark for your editor.',
  ],
  [
    'dragon-ball',
    'Warm oranges and deep blues, for those "Power Level over 9000" hours.',
  ],
  ['demon-slayer', 'Water blues and ember reds, sharp as a Nichirin sword.'],
  ['jujutsu-kaisen', 'Muted violets and cool cyan. A quieter Hollow Purple.'],
  [
    'dandadan',
    'Occult purple, alien green, and a flash of pink. Weird, on purpose.',
  ],
  [
    'gachiakuta',
    'Soot, chalk, and rust. Legacy code even Rudo would treasure.',
  ],
  [
    'sailor-moon',
    'Moonlit pinks on warm paper, with sailor blues and gentle purples.',
  ],
  [
    'apothecary-diaries',
    'Celadon, jade, and plum. Diagnose bugs before the palace spreads rumors.',
  ],
  [
    'death-note',
    'Near-black ink, apple red, and shinigami gold. Stark as the notebook.',
  ],
] as const;

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

const toChrome = (theme: ThemeFile) =>
  Object.fromEntries(
    CHROME_KEYS.map((key) => [key, workbenchColor(theme, key)]),
  ) as Volume['chrome'];

const contributions = manifest.contributes.themes;
const catalog = new Map(contributions.map((theme) => [themeId(theme), theme]));
if (catalog.size !== contributions.length || catalog.size !== SHELF.length) {
  throw new Error('The volume shelf must list each shipped theme exactly once');
}

export const VOLUMES: Volume[] = SHELF.map(([id, description], index) => {
  const contribution = catalog.get(id);
  if (!contribution || !catalog.delete(id)) {
    throw new Error(`Invalid or duplicate shelf theme: ${id}`);
  }
  const theme: ThemeFile = require(`../../../themes/${id}-color-theme.json`);
  const name = theme.name.replace('MangaMode: ', '');
  return {
    issue: index + 1,
    name,
    description,
    appearance:
      theme.type === 'hc'
        ? 'High contrast'
        : theme.type === 'light'
          ? 'Light'
          : 'Dark',
    branch: branchFor(name),
    highContrast: theme.type === 'hc',
    palette: toPalette(theme),
    chrome: toChrome(theme),
    accent: {
      // Paper accents only set large display text, so they need 3:1; the ink band uses them for small text.
      paper: accentOn(
        workbenchColor(theme, 'activityBarBadge.background'),
        PAPER,
        3,
      ),
      ink: accentOn(
        workbenchColor(theme, 'activityBarBadge.background'),
        INK,
        4.5,
      ),
    },
    selection: {
      page: pageSelection(scopeColor(theme, 'entity.name.function')),
      editor: workbenchColor(theme, 'editor.selectionBackground'),
      editorText: theme.colors['editor.selectionForeground'],
    },
  };
});
