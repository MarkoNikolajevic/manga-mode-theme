import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import next from 'next';
import { chromium } from 'playwright';
import {
  hash,
  previewSourceHashes,
  projectRoot,
  readProjectFile,
  screenshotName,
  themeContributions,
} from '../../scripts/preview-manifest.mjs';

// Use the production build and the same expanded editor the website displays.
// https://nextjs.org/docs/app/guides/custom-server
// https://playwright.dev/docs/screenshots#element-screenshot
const app = next({
  dev: false,
  dir: fileURLToPath(new URL('../', import.meta.url)),
});
let server;
let browser;
const staging = await mkdtemp(join(tmpdir(), 'mangamode-previews-'));
const sources = previewSourceHashes();
try {
  await app.prepare();
  const handler = app.getRequestHandler();
  server = createServer((request, response) => handler(request, response));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
    locale: 'en-US',
    colorScheme: 'light',
  });
  page.setDefaultTimeout(15_000);
  page.setDefaultNavigationTimeout(30_000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, {
    waitUntil: 'networkidle',
  });
  await page.getByRole('button', { name: 'Expand preview' }).click();
  const dialog = page.getByRole('dialog');
  const selector = dialog.getByLabel('Volume', { exact: true });
  await selector.waitFor();
  await page.evaluate(() => document.fonts.ready);
  const surface = dialog.locator('[data-volume-surface]');
  const images = {};
  let dimensions;
  for (const contribution of themeContributions()) {
    const theme = JSON.parse(readProjectFile(contribution.path));
    const name = contribution.label.replace('MangaMode: ', '');
    const appearance =
      theme.type === 'hc'
        ? 'High contrast'
        : theme.type === 'light'
          ? 'Light'
          : 'Dark';
    await selector.selectOption({ label: `${name} · ${appearance}` });
    await surface.getByText(name, { exact: true }).waitFor();
    // Motion's text crossfade is driven by JS: wait for it as well as CSS.
    await page.waitForFunction(
      (name) => {
        const surface = document.querySelector('dialog [data-volume-surface]');
        const label = [...surface.querySelectorAll('span')].find(
          (element) => element.textContent === name,
        );
        return label && getComputedStyle(label).opacity === '1';
      },
      name,
      { timeout: 15_000 },
    );
    const actual = await surface.evaluate((element) => {
      const pre = element.querySelector('pre');
      return {
        background: getComputedStyle(pre).backgroundColor,
        fits: pre.scrollWidth <= pre.clientWidth,
      };
    });
    const rgb = theme.colors['editor.background']
      .match(/\w\w/g)
      .map((channel) => parseInt(channel, 16));
    assert.equal(
      actual.background,
      `rgb(${rgb.join(', ')})`,
      `${name}: wrong rendered palette`,
    );
    assert.ok(actual.fits, `${name}: code sample is clipped`);
    assert.deepEqual(errors, [], 'Browser runtime errors');
    const file = screenshotName(contribution);
    const bytes = await surface.screenshot({
      path: join(staging, file),
      animations: 'disabled',
      caret: 'hide',
      style: '* { transition: none !important; }',
    });
    const size = {
      width: bytes.readUInt32BE(16),
      height: bytes.readUInt32BE(20),
    };
    dimensions ??= size;
    assert.deepEqual(
      size,
      dimensions,
      `${name}: inconsistent image dimensions`,
    );
    images[file] = { ...size, sha256: hash(bytes) };
    console.log(`Generated ${file} (${size.width} × ${size.height})`);
  }
  assert.deepEqual(
    previewSourceHashes(),
    sources,
    'Sources changed while capturing; regenerate previews',
  );
  // Publish only after every theme rendered successfully.
  const output = fileURLToPath(new URL('images/screenshots/', projectRoot));
  await mkdir(output, { recursive: true });
  for (const file of Object.keys(images))
    await rename(join(staging, file), join(output, file));
  await writeFile(
    join(output, 'manifest.json'),
    `${JSON.stringify({ version: 1, sources, images }, null, 2)}\n`,
  );
} finally {
  await browser?.close();
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
  await app.close();
  await rm(staging, { recursive: true, force: true });
}
