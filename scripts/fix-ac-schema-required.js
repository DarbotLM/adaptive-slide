// Strip invalid `"required": false` clauses from the AC 1.6 schema.
// `required` must be an array of strings; the official schema accidentally
// emits boolean values in two property descriptors. We drop those lines.

import { readFileSync, writeFileSync } from "node:fs";

const path = "schemas/adaptive-card-1.6.schema.json";
const schema = JSON.parse(readFileSync(path, "utf8"));

let stripped = 0;

function walk(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach(walk);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(node, "required") && typeof node.required === "boolean") {
    delete node.required;
    stripped += 1;
  }
  for (const value of Object.values(node)) walk(value);
}

walk(schema);
writeFileSync(path, JSON.stringify(schema, null, 2));
console.log(`stripped ${stripped} invalid required:false entries`);
