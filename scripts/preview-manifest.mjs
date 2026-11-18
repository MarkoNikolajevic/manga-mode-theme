import { createHash } from 'node:crypto';
import { readProjectFile, themeContributions } from './theme-catalog.mjs';

import { themeId } from './theme-id.mjs';

export const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const screenshotName = (theme) => `${themeId(theme)}.png`;

export function previewSourceHashes() {
  const paths = [
    'package.json',
    'site/package.json',
    'site/bun.lock',
    'site/next.config.ts',
    'site/scripts/generate-previews.mjs',
    'scripts/preview-manifest.mjs',
    'scripts/theme-catalog.mjs',
    'scripts/theme-id.mjs',
    'scripts/color-math.mjs',
    'site/src/app/layout.tsx',
    'site/src/app/page.tsx',
    'site/src/app/globals.css',
    'site/src/components/editor-window.tsx',
    'site/src/components/code-sample.tsx',
    'site/src/components/preview-workspace.tsx',
    'site/src/components/expand-preview.tsx',
    'site/src/components/preview-samples.ts',
    'site/src/components/volume-context.tsx',
    'site/src/components/motion.tsx',
    'site/src/lib/volumes.ts',
    'site/src/lib/volume-catalog.ts',
    'site/src/lib/contrast.ts',
    'site/src/lib/easter-eggs.ts',
    'site/src/lib/selection.ts',
    'site/src/lib/oklch.ts',
    ...themeContributions().map((theme) => theme.path.replace('./', '')),
  ];
  return Object.fromEntries(
    paths.map((path) => [path, hash(readProjectFile(path))]),
  );
}
