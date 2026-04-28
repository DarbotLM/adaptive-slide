// One-time patches applied to the official Adaptive Cards 1.6 JSON schema
// downloaded from microsoft/AdaptiveCards. The patched schema is committed to
// the repo (schemas/adaptive-card-1.6.schema.json); rerun this only when
// pulling a newer version of the source schema.
//
// Patches:
//   1. Rename JSON Schema Draft-06 `id` keyword to `$id` so AJV (Draft-07+) compiles it.
//   2. Strip invalid `"required": false` clauses (must be array of strings).
//   3. Add the CodeBlock element definition (officially part of AC 1.6 per
//      Microsoft docs but absent from the published schema).

import { readFileSync, writeFileSync } from "node:fs";

const path = "schemas/adaptive-card-1.6.schema.json";
let raw = readFileSync(path, "utf8");

// 1. Replace top-level `"id": "..."` with `"$id": "..."`.
raw = raw.replace(/"id":\s*"/g, '"$id": "');

const schema = JSON.parse(raw);

// 2. Strip invalid `required: <boolean>` entries.
let strippedRequired = 0;
function walkStrip(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach(walkStrip);
    return;
  }
  if (Object.prototype.hasOwnProperty.call(node, "required") && typeof node.required === "boolean") {
    delete node.required;
    strippedRequired += 1;
  }
  for (const value of Object.values(node)) walkStrip(value);
}
walkStrip(schema);

// 3. Add CodeBlock to definitions and the Element union.
const codeBlockDefinition = {
  description:
    "Displays a block of source code with optional syntax highlighting and line numbers. Added in Adaptive Cards 1.5; carried forward in 1.6.",
  type: "object",
  required: ["type", "codeSnippet"],
  properties: {
    type: { type: "string", enum: ["CodeBlock"] },
    codeSnippet: { type: "string" },
    language: {
      type: "string",
      enum: [
        "PlainText", "Bash", "C", "Cpp", "CSharp", "Css", "CMake", "Dart",
        "Dockerfile", "Elixir", "Fortran", "FSharp", "Go", "Graphql", "Haskell",
        "Html", "Java", "JavaScript", "Json", "Julia", "Kotlin", "Latex", "Lua",
        "Markdown", "MatLab", "Objc", "Perl", "Php", "PowerShell", "Python", "R",
        "Ruby", "Rust", "Sql", "Swift", "TypeScript", "VB", "Verilog", "Vhdl",
        "Xml", "Yaml",
      ],
      default: "PlainText",
    },
    startLineNumber: { type: "integer" },
    fallback: {
      anyOf: [
        { $ref: "#/definitions/ImplementationsOf.Element" },
        { type: "string", enum: ["drop"] },
      ],
    },
    height: { $ref: "#/definitions/BlockElementHeight" },
    id: { type: "string" },
    isVisible: { type: "boolean", default: true },
    separator: { type: "boolean", default: false },
    spacing: {
      type: "string",
      enum: ["default", "none", "small", "medium", "large", "extraLarge", "padding"],
    },
    requires: { type: "object", additionalProperties: { type: "string" } },
    grid: {
      type: "object",
      properties: { area: { type: "string" } },
    },
    targetWidth: { type: "string" },
  },
  additionalProperties: false,
};

let addedCodeBlock = false;
if (!schema.definitions.CodeBlock) {
  schema.definitions.CodeBlock = codeBlockDefinition;
  addedCodeBlock = true;
}

const elementUnion = schema.definitions["ImplementationsOf.Element"];
let addedToUnion = false;
if (elementUnion?.anyOf) {
  const has = elementUnion.anyOf.some(
    (entry) => entry.allOf?.some((m) => m.$ref === "#/definitions/CodeBlock"),
  );
  if (!has) {
    elementUnion.anyOf.push({
      required: ["type"],
      allOf: [{ $ref: "#/definitions/CodeBlock" }],
    });
    addedToUnion = true;
  }
}

writeFileSync(path, JSON.stringify(schema, null, 2));

console.log(`renamed id -> $id`);
console.log(`stripped ${strippedRequired} invalid required:false entries`);
console.log(`CodeBlock definition: ${addedCodeBlock ? "added" : "already present"}`);
console.log(`CodeBlock in element union: ${addedToUnion ? "added" : "already present"}`);
console.log(`schema definitions: ${Object.keys(schema.definitions).length}`);
