import assert from 'node:assert/strict';
import {
  hash,
  previewSourceHashes,
  readProjectFile,
  screenshotName,
  themeContributions,
} from './preview-manifest.mjs';

try {
  const manifest = JSON.parse(
    readProjectFile('images/screenshots/manifest.json'),
  );
  assert.equal(manifest.version, 1);
  assert.deepEqual(
    manifest.sources,
    previewSourceHashes(),
    'Preview sources changed',
  );
  assert.deepEqual(
    Object.keys(manifest.images).sort(),
    themeContributions().map(screenshotName).sort(),
    'Screenshot coverage differs from the extension manifest',
  );
  for (const [name, image] of Object.entries(manifest.images)) {
    const bytes = readProjectFile(`images/screenshots/${name}`);
    assert.equal(
      bytes.subarray(0, 8).toString('hex'),
      '89504e470d0a1a0a',
      `${name}: invalid PNG`,
    );
    assert.equal(hash(bytes), image.sha256, `${name}: screenshot changed`);
    assert.equal(bytes.readUInt32BE(16), image.width, `${name}: width changed`);
    assert.equal(
      bytes.readUInt32BE(20),
      image.height,
      `${name}: height changed`,
    );
  }
  console.log(
    `previews ok (${Object.keys(manifest.images).length} generated editor previews)`,
  );
} catch (error) {
  console.error(
    `Preview verification failed: ${error.message}\nRun bun run previews to regenerate the images and their source manifest.`,
  );
  process.exitCode = 1;
}
