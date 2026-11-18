import { readFileSync } from 'node:fs';

export const projectRoot = new URL('../', import.meta.url);
export const readProjectFile = (path) =>
  readFileSync(new URL(path, projectRoot));
export const themeContributions = () =>
  JSON.parse(readProjectFile('package.json')).contributes.themes;

