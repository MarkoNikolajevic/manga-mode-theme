// Colors and state layering follow https://code.visualstudio.com/api/references/theme-color.
export function parseColor(value) {
  if (
    typeof value !== 'string' ||
    !/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)
  ) {
    throw new Error(`Invalid theme color: ${JSON.stringify(value)}`);
  }
  let hex = value.slice(1);
  if (hex.length < 5) hex = [...hex].map((c) => c + c).join('');
  return [0, 2, 4]
    .map((i) => parseInt(hex.slice(i, i + 2), 16))
    .concat(hex.length === 8 ? parseInt(hex.slice(6), 16) / 255 : 1);
}

export function composite(foreground, background) {
  const fg =
    typeof foreground === 'string' ? parseColor(foreground) : foreground;
  const bg =
    typeof background === 'string' ? parseColor(background) : background;
  if (bg[3] !== 1) throw new Error('Compositing requires an opaque backdrop');
  return fg
    .slice(0, 3)
    .map((channel, i) => channel * fg[3] + bg[i] * (1 - fg[3]))
    .concat(1);
}

export function contrastRatio(foreground, background) {
  const bg =
    typeof background === 'string' ? parseColor(background) : background;
  const luminance = (color) =>
    color
      .slice(0, 3)
      .map((c) => {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
  if (bg[3] !== 1) throw new Error('Contrast requires an opaque background');
  const a = luminance(composite(foreground, bg));
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function checkTheme(theme) {
  const colors = theme.colors;
  const findings = [];
  let checks = 0;
  const minimum = theme.type === 'hc' ? 7 : 4.5;
  const color = (key) => {
    if (!Object.hasOwn(colors, key))
      throw new Error(`Missing theme color: ${key}`);
    parseColor(colors[key]);
    return colors[key];
  };
  // Fail on malformed values even when a color is not part of a checked state.
  Object.values(colors).forEach(parseColor);
  const editor = parseColor(color('editor.background'));
  const syntax = [['editor.foreground', color('editor.foreground')]];
  theme.tokenColors.forEach((token) => {
    if (token.settings.foreground)
      syntax.push([
        `scope ${[token.scope].flat()[0]}`,
        token.settings.foreground,
      ]);
  });
  Object.entries(theme.semanticTokenColors).forEach(([key, value]) => {
    const fg = typeof value === 'string' ? value : value.foreground;
    if (fg) syntax.push([`semantic ${key}`, fg]);
  });
  for (let i = 1; i <= 6; i++)
    syntax.push([
      `bracket ${i}`,
      color(`editorBracketHighlight.foreground${i}`),
    ]);

  const check = (label, entries, background, floor = minimum) => {
    const pairs = entries.map(([key, fg]) => ({
      key,
      ratio: contrastRatio(fg, background),
    }));
    checks += pairs.length;
    const worst = pairs.reduce((a, b) => (a.ratio < b.ratio ? a : b));
    if (worst.ratio < floor) findings.push({ label, ...worst, minimum: floor });
  };
  const pair = (fg, bg, floor = minimum) =>
    check(`${fg} on ${bg}`, [[fg, color(fg)]], parseColor(color(bg)), floor);
  const state = (key, entries = syntax, backdrop = editor) =>
    check(key, entries, composite(color(key), backdrop));

  check('editor text', syntax, editor);
  for (const key of [
    'editor.lineHighlightBackground',
    'editor.selectionHighlightBackground',
    'editor.wordHighlightBackground',
    'editor.wordHighlightStrongBackground',
    'editor.findMatchBackground',
    'editor.findMatchHighlightBackground',
    'editorBracketMatch.background',
  ])
    state(key);
  const selected = colors['editor.selectionForeground']
    ? [['editor.selectionForeground', color('editor.selectionForeground')]]
    : syntax;
  state('editor.selectionBackground', selected);
  if (colors['editor.inactiveSelectionBackground'])
    state('editor.inactiveSelectionBackground', selected);
  // Inline changed text is drawn over the corresponding changed-line tint.
  for (const change of ['inserted', 'removed']) {
    const line = `diffEditor.${change}LineBackground`;
    state(line);
    state(
      `diffEditor.${change}TextBackground`,
      syntax,
      composite(color(line), editor),
    );
  }
  for (const key of [
    'editorLineNumber.foreground',
    'editorLineNumber.activeForeground',
    'editorGhostText.foreground',
    'editorCodeLens.foreground',
  ])
    check(key, [[key, color(key)]], editor);
  for (const suffix of ['', '.parameter', '.type']) {
    const prefix = suffix ? `editorInlayHint${suffix}` : 'editorInlayHint';
    const fg = suffix ? `${prefix}Foreground` : `${prefix}.foreground`;
    const bg = suffix ? `${prefix}Background` : `${prefix}.background`;
    state(bg, [[fg, color(fg)]]);
  }
  for (const [fg, bg] of [
    ['sideBar.foreground', 'sideBar.background'],
    ['sideBarTitle.foreground', 'sideBar.background'],
    ['activityBar.foreground', 'activityBar.background'],
    ['activityBarBadge.foreground', 'activityBarBadge.background'],
    ['titleBar.activeForeground', 'titleBar.activeBackground'],
    ['tab.activeForeground', 'tab.activeBackground'],
    ['tab.inactiveForeground', 'tab.inactiveBackground'],
    ['statusBar.foreground', 'statusBar.background'],
    ['statusBarItem.remoteForeground', 'statusBarItem.remoteBackground'],
    ['input.foreground', 'input.background'],
    ['input.placeholderForeground', 'input.background'],
    ['button.foreground', 'button.background'],
    ['button.foreground', 'button.hoverBackground'],
    ['editorSuggestWidget.foreground', 'editorSuggestWidget.background'],
    [
      'editorSuggestWidget.selectedForeground',
      'editorSuggestWidget.selectedBackground',
    ],
    ['editorHoverWidget.foreground', 'editorHoverWidget.background'],
    ['menu.foreground', 'menu.background'],
    ['menu.selectionForeground', 'menu.selectionBackground'],
    ['notifications.foreground', 'notifications.background'],
    ['quickInput.foreground', 'quickInput.background'],
    ['quickInputList.focusForeground', 'quickInputList.focusBackground'],
    ['list.activeSelectionForeground', 'list.activeSelectionBackground'],
    ['list.inactiveSelectionForeground', 'list.inactiveSelectionBackground'],
    ['list.focusForeground', 'list.focusBackground'],
    ['foreground', 'list.hoverBackground'],
    ['terminal.foreground', 'terminal.background'],
    ['list.highlightForeground', 'list.activeSelectionBackground'],
    ['list.highlightForeground', 'list.focusBackground'],
    ['list.highlightForeground', 'list.hoverBackground'],
  ])
    pair(fg, bg);
  for (const bg of ['editor.background', 'sideBar.background']) {
    check(
      `badge on ${bg}`,
      [['badge.foreground', color('badge.foreground')]],
      composite(color('badge.background'), color(bg)),
    );
    for (const fg of ['textLink.foreground', 'textLink.activeForeground'])
      pair(fg, bg);
  }
  for (const bg of [
    'editor.background',
    'input.background',
    'sideBar.background',
  ])
    pair('focusBorder', bg, 3);
  for (const [fg, bg] of [
    ['editorCursor.foreground', 'editor.background'],
    ['terminalCursor.foreground', 'terminal.background'],
    ['editor.findMatchBorder', 'editor.background'],
    ['editorBracketMatch.border', 'editor.background'],
    ['tab.activeBorder', 'tab.activeBackground'],
    ['activityBar.activeBorder', 'activityBar.background'],
    ['editorError.foreground', 'editor.background'],
    ['editorWarning.foreground', 'editor.background'],
    ['editorInfo.foreground', 'editor.background'],
    ['editorGutter.addedBackground', 'editor.background'],
    ['editorGutter.deletedBackground', 'editor.background'],
    ['editorGutter.modifiedBackground', 'editor.background'],
  ])
    pair(fg, bg, 3);
  return { findings, checks };
}
