// Adds the CodeBlock element definition to the AC 1.6 schema.
// CodeBlock ships with Adaptive Cards 1.6 (per Microsoft docs) but the
// published JSON schema at adaptivecards.io/schemas/1.6.0 omits it.

import { readFileSync, writeFileSync } from "node:fs";

const path = "schemas/adaptive-card-1.6.schema.json";
const schema = JSON.parse(readFileSync(path, "utf8"));

const codeBlockDefinition = {
  description:
    "Displays a block of source code with optional syntax highlighting and line numbers. Added in Adaptive Cards 1.5; carried forward in 1.6.",
  type: "object",
  required: ["type", "codeSnippet"],
  properties: {
    type: { type: "string", enum: ["CodeBlock"] },
    codeSnippet: {
      type: "string",
      description: "The source code snippet to display.",
    },
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
    startLineNumber: {
      type: "integer",
      description: "Optional starting line number to display next to the snippet.",
    },
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
      properties: {
        area: { type: "string" },
      },
    },
    targetWidth: { type: "string" },
  },
  additionalProperties: false,
};

if (!schema.definitions.CodeBlock) {
  schema.definitions.CodeBlock = codeBlockDefinition;
  console.log("added CodeBlock definition");
} else {
  console.log("CodeBlock definition already present");
}

// Add to the ImplementationsOf.Element union if not already.
const elementUnion = schema.definitions["ImplementationsOf.Element"];
if (elementUnion?.anyOf) {
  const has = elementUnion.anyOf.some(
    (entry) =>
      entry.allOf?.some((member) => member.$ref === "#/definitions/CodeBlock"),
  );
  if (!has) {
    elementUnion.anyOf.push({
      required: ["type"],
      allOf: [{ $ref: "#/definitions/CodeBlock" }],
    });
    console.log("added CodeBlock to ImplementationsOf.Element");
  } else {
    console.log("CodeBlock already in element union");
  }
}

writeFileSync(path, JSON.stringify(schema, null, 2));
console.log("schema definitions:", Object.keys(schema.definitions).length);
