import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const copies = [
  ["src/plugins/mcp-app/viewer.html", "dist/plugins/mcp-app/viewer.html"],
  ["src/adaptiveCardTransformer.js", "dist/adaptiveCardTransformer.js"],
];

for (const [from, to] of copies) {
  const target = resolve(root, to);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(resolve(root, from), target);
}
