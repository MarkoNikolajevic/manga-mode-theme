// Fails if any text colour in a theme falls below WCAG AA (4.5:1), or AAA (7:1) for hc themes.
import { readFileSync, readdirSync } from "node:fs";

const lum = (h) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(1 + i, 3 + i), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const TEXT_KEYS = ["editor.foreground", "editorLineNumber.foreground", "editorInlayHint.foreground", "editorInlayHint.parameterForeground",
  "editorInlayHint.typeForeground", "tab.inactiveForeground", "editorGhostText.foreground", "editorCodeLens.foreground"];

let failed = false;
for (const file of readdirSync("themes").filter((f) => f.endsWith(".json"))) {
  const t = JSON.parse(readFileSync(`themes/${file}`, "utf8"));
  const bg = t.colors["editor.background"];
  const min = t.type === "hc" ? 7 : 4.5;
  const check = (label, fg) => {
    if (!fg || fg.length !== 7) return;
    const r = ratio(fg, bg);
    if (r < min) { failed = true; console.log(`${t.name}: ${label} ${fg} is ${r.toFixed(2)}:1 (< ${min})`); }
  };
  TEXT_KEYS.forEach((k) => check(k, t.colors[k]));
  // hc themes default selectionForeground to black; make sure the pair is readable
  const selFg = t.colors["editor.selectionForeground"], selBg = t.colors["editor.selectionBackground"];
  if (selFg && selBg.length === 7 && ratio(selFg, selBg) < min) { failed = true; console.log(`${t.name}: selection ${selFg} on ${selBg} is ${ratio(selFg, selBg).toFixed(2)}:1`); }
  Object.entries(t.semanticTokenColors).forEach(([k, v]) => check(`semantic ${k}`, v));
  t.tokenColors.forEach((tc) => check(`scope ${tc.scope[0]}`, tc.settings.foreground));
}
if (failed) process.exit(1);
console.log("contrast ok");
