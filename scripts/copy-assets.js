import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "src/plugins/mcp-app/viewer.html");
const target = resolve(root, "dist/plugins/mcp-app/viewer.html");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
