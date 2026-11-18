export function themeId(contribution) {
  return contribution.path.split('/').at(-1).replace(/-color-theme\.json$/, '');
}
