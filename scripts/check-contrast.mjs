import { readFileSync, readdirSync } from 'node:fs';
import { checkTheme } from './contrast.mjs';

const directory = new URL('../themes/', import.meta.url);
let failures = 0;
let checks = 0;
for (const file of readdirSync(directory).filter((name) => name.endsWith('.json'))) {
  const theme = JSON.parse(readFileSync(new URL(file, directory), 'utf8'));
  try {
    const result = checkTheme(theme);
    checks += result.checks;
    failures += result.findings.length;
    for (const finding of result.findings) {
      console.error(`${theme.name}: ${finding.label}: ${finding.key} is ${finding.ratio.toFixed(3)}:1 (< ${finding.minimum})`);
    }
  } catch (error) {
    failures++;
    console.error(`${theme.name}: ${error.message}`);
  }
}
if (failures) {
  console.error(`${failures} contrast or configuration failures`);
  process.exitCode = 1;
} else {
  console.log(`contrast ok (${checks} text and UI-state checks)`);
}
