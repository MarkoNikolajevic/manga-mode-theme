// Generates the Zed extension in zed/ from the VS Code themes, which stay the source of truth.
// Keys follow https://zed.dev/schema/themes/v0.2.0.json.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composite, contrastRatio, parseColor } from './contrast.mjs';
import {
  projectRoot,
  readProjectFile,
  themeContributions,
} from './preview-manifest.mjs';

const TRANSPARENT = '#00000000';
const alpha = (hex, aa) => hex.slice(0, 7) + aa;

// Every backdrop Zed draws `text` and `text.muted` on; rows tint the panel behind them.
export function textSurfaces(style) {
  const panel = parseColor(style['panel.background']);
  return {
    ...Object.fromEntries(
      [
        'background',
        'surface.background',
        'elevated_surface.background',
        'panel.background',
        'title_bar.background',
        'status_bar.background',
        'tab_bar.background',
        'tab.active_background',
        'tab.inactive_background',
        'element.background',
      ].map((key) => [key, parseColor(style[key])]),
    ),
    'element.hover on panel': composite(style['element.hover'], panel),
    'element.selected on panel': composite(style['element.selected'], panel),
  };
}
export const textFloor = (contribution) =>
  contribution.uiTheme.startsWith('hc') ? 7 : 4.5;

export function zedTheme(contribution, theme) {
  const c = (key) => {
    if (!Object.hasOwn(theme.colors, key))
      throw new Error(`${theme.name}: missing theme color ${key}`);
    return theme.colors[key];
  };
  const rule = (scope) => {
    const found = theme.tokenColors.find((token) =>
      [token.scope].flat().includes(scope),
    );
    if (!found) throw new Error(`${theme.name}: missing token scope ${scope}`);
    return found.settings;
  };
  const scope = (name) => rule(name).foreground;
  const semantic = (key) => {
    const value = theme.semanticTokenColors[key];
    if (!value) throw new Error(`${theme.name}: missing semantic token ${key}`);
    return value;
  };
  const style = (color, extra) => ({ color, ...extra });
  const status = (name, color) => ({
    [name]: color,
    [`${name}.background`]: alpha(color, '26'),
    [`${name}.border`]: color,
  });
  const player = (color, selection = alpha(color, '3d')) => ({
    cursor: color,
    background: color,
    selection,
  });

  const border = theme.colors.contrastBorder ?? c('panel.border');
  const text = c('foreground');
  const selected = c('list.activeSelectionBackground');
  const hover = c('list.hoverBackground');
  const surfaces = {
    background: c('sideBar.background'),
    'surface.background': c('editorWidget.background'),
    'elevated_surface.background': c('menu.background'),
    'panel.background': c('sideBar.background'),
    'title_bar.background': c('titleBar.activeBackground'),
    'title_bar.inactive_background': c('titleBar.inactiveBackground'),
    'status_bar.background': c('statusBar.background'),
    'toolbar.background': c('editor.background'),
    'tab_bar.background': c('editorGroupHeader.tabsBackground'),
    'tab.active_background': c('tab.activeBackground'),
    'tab.inactive_background': c('tab.inactiveBackground'),
    // Zed draws `text` on filled elements, so they take the input surface, not the VS Code button accent.
    'element.background': c('input.background'),
    'element.hover': hover,
    'element.active': selected,
    'element.selected': selected,
    'element.disabled': c('input.background'),
  };
  // Zed reuses one muted color on hovered and selected rows, so take the most muted one that stays readable there.
  const backdrops = Object.values(textSurfaces(surfaces));
  const muted = [
    c('tab.inactiveForeground'),
    c('sideBarTitle.foreground'),
    text,
  ].find((color) =>
    backdrops.every(
      (backdrop) => contrastRatio(color, backdrop) >= textFloor(contribution),
    ),
  );
  if (!muted) throw new Error(`${theme.name}: UI text fails Zed contrast`);
  const keyword = scope('keyword');
  const string = scope('string');
  const link = c('textLink.foreground');

  return {
    name: contribution.label,
    // Zed has no high-contrast appearance; hc-black ships as dark.
    appearance: contribution.uiTheme === 'vs' ? 'light' : 'dark',
    style: {
      ...surfaces,

      border,
      'border.variant': border,
      'border.disabled': border,
      'border.focused': c('focusBorder'),
      'border.selected': c('focusBorder'),
      'border.transparent': TRANSPARENT,
      'pane_group.border': border,
      'panel.focused_border': c('focusBorder'),

      text,
      'text.muted': muted,
      'text.placeholder': c('input.placeholderForeground'),
      'text.disabled': c('editorLineNumber.foreground'),
      'text.accent': link,
      'link_text.hover': c('textLink.activeForeground'),
      icon: text,
      'icon.muted': muted,
      'icon.placeholder': c('input.placeholderForeground'),
      'icon.disabled': c('editorLineNumber.foreground'),
      'icon.accent': link,

      'ghost_element.background': TRANSPARENT,
      'ghost_element.hover': hover,
      'ghost_element.active': selected,
      'ghost_element.selected': selected,
      'ghost_element.disabled': TRANSPARENT,
      'drop_target.background': alpha(c('focusBorder'), '33'),

      'editor.foreground': c('editor.foreground'),
      'editor.background': c('editor.background'),
      'editor.gutter.background': c('editor.background'),
      'editor.subheader.background': c('sideBar.background'),
      'editor.active_line.background': c('editor.lineHighlightBackground'),
      'editor.highlighted_line.background': c('editor.lineHighlightBackground'),
      'editor.line_number': c('editorLineNumber.foreground'),
      'editor.active_line_number': c('editorLineNumber.activeForeground'),
      'editor.invisible': c('editorWhitespace.foreground'),
      'editor.wrap_guide': c('editorRuler.foreground'),
      'editor.active_wrap_guide': c('editorIndentGuide.activeBackground1'),
      'editor.indent_guide': c('editorIndentGuide.background1'),
      'editor.indent_guide_active': c('editorIndentGuide.activeBackground1'),
      'editor.document_highlight.read_background': c(
        'editor.wordHighlightBackground',
      ),
      'editor.document_highlight.write_background': c(
        'editor.wordHighlightStrongBackground',
      ),
      'editor.document_highlight.bracket_background': c(
        'editorBracketMatch.background',
      ),
      'search.match_background': c('editor.findMatchHighlightBackground'),
      'panel.indent_guide': c('editorIndentGuide.background1'),
      'panel.indent_guide_hover': c('editorIndentGuide.activeBackground1'),
      'panel.indent_guide_active': c('editorIndentGuide.activeBackground1'),

      'scrollbar.thumb.background': c('scrollbarSlider.background'),
      'scrollbar.thumb.hover_background': c('scrollbarSlider.hoverBackground'),
      'scrollbar.thumb.border': TRANSPARENT,
      'scrollbar.track.background': TRANSPARENT,
      'scrollbar.track.border': c('editorOverviewRuler.border'),

      'terminal.background': c('terminal.background'),
      'terminal.ansi.background': c('terminal.background'),
      'terminal.foreground': c('terminal.foreground'),
      'terminal.bright_foreground': c('terminal.ansiBrightWhite'),
      'terminal.dim_foreground': c('terminal.ansiBrightBlack'),
      ...Object.fromEntries(
        ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White']
          .flatMap((name) => [
            [name.toLowerCase(), `terminal.ansi${name}`],
            [`bright_${name.toLowerCase()}`, `terminal.ansiBright${name}`],
          ])
          .map(([zed, vscode]) => [`terminal.ansi.${zed}`, c(vscode)]),
      ),

      ...status('error', c('editorError.foreground')),
      ...status('warning', c('editorWarning.foreground')),
      ...status('info', c('editorInfo.foreground')),
      ...status('success', c('terminal.ansiGreen')),
      ...status('created', c('gitDecoration.untrackedResourceForeground')),
      ...status('modified', c('gitDecoration.modifiedResourceForeground')),
      ...status('deleted', c('gitDecoration.deletedResourceForeground')),
      ...status('conflict', c('editorWarning.foreground')),
      ...status('renamed', c('editorInfo.foreground')),
      ...status('ignored', c('gitDecoration.ignoredResourceForeground')),
      ...status('hidden', c('gitDecoration.ignoredResourceForeground')),
      ...status('unreachable', muted),
      ...status('predictive', c('editorGhostText.foreground')),
      ...status('hint', c('editorInlayHint.foreground')),
      'hint.background': c('editorInlayHint.background'),

      players: [
        player(c('editorCursor.foreground'), c('editor.selectionBackground')),
        ...['Red', 'Green', 'Yellow', 'Blue'].map((name) =>
          player(c(`terminal.ansi${name}`)),
        ),
      ],
      accents: [1, 2, 3, 4, 5, 6].map((i) =>
        c(`editorBracketHighlight.foreground${i}`),
      ),

      // Zed highlights tree-sitter captures; unset captures fall back to their prefix, then editor.foreground.
      // Semantic colors win where VS Code would show them for an LSP-backed language.
      syntax: {
        comment: style(scope('comment'), { font_style: 'italic' }),
        keyword: style(keyword),
        operator: style(keyword),
        preproc: style(keyword),
        function: style(semantic('function')),
        constructor: style(semantic('class')),
        type: style(semantic('type')),
        'type.builtin': style(scope('support.type')),
        enum: style(semantic('enum')),
        variant: style(semantic('enumMember')),
        namespace: style(semantic('namespace')),
        variable: style(semantic('variable')),
        'variable.parameter': style(semantic('parameter')),
        property: style(semantic('property')),
        'property.json_key': style(scope('support.type.property-name.json')),
        constant: style(semantic('variable.readonly')),
        boolean: style(scope('constant.language')),
        number: style(scope('constant.numeric')),
        string: style(string),
        'string.escape': style(scope('constant.character.escape')),
        'text.literal': style(string),
        tag: style(scope('entity.name.tag')),
        punctuation: style(scope('punctuation')),
        title: style(scope('markup.heading'), { font_weight: 700 }),
        emphasis: { font_style: 'italic' },
        'emphasis.strong': { font_weight: 700 },
        label: style(link),
        link_text: style(link),
        link_uri: style(link),
        primary: style(c('editor.foreground')),
        embedded: style(c('editor.foreground')),
        hint: style(c('editorInlayHint.foreground')),
        predictive: style(c('editorGhostText.foreground'), {
          font_style: 'italic',
        }),
      },
    },
  };
}

export function zedFiles() {
  const manifest = JSON.parse(readProjectFile('package.json'));
  const family = {
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: manifest.displayName,
    author: 'Marko Nikolajevic',
    themes: themeContributions().map((contribution) =>
      zedTheme(contribution, JSON.parse(readProjectFile(contribution.path))),
    ),
  };
  return {
    // Zed requires theme IDs to say so, and the ID is permanent once published.
    'zed/extension.toml': `id = "${manifest.name}-theme"
name = "${manifest.displayName}"
version = "${manifest.version}"
schema_version = 1
authors = ["Marko Nikolajevic"]
description = "Eye-comfort anime and manga-inspired themes."
repository = "${manifest.repository.url}"
`,
    'zed/themes/mangamode.json': `${JSON.stringify(family, null, 2)}\n`,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mkdirSync(new URL('zed/themes/', projectRoot), { recursive: true });
  for (const [path, content] of Object.entries(zedFiles()))
    writeFileSync(new URL(path, projectRoot), content);
  console.log('zed extension written to zed/');
}
