// Strip "id" -> "$id" rewrite for AC 1.6 schema (one-time fix).
import { readFileSync, writeFileSync } from "node:fs";

const path = "schemas/adaptive-card-1.6.schema.json";
const text = readFileSync(path, "utf8");

// Only swap "id": at the start of a property declaration line. The schema's "id" 
// is always at the JSON root or in an object body. We use a conservative replacement:
// match  "id":  followed by a string value (URI), preserving indentation.
const replaced = text.replace(/"id":\s*"/g, '"$id": "');
writeFileSync(path, replaced);

const schema = JSON.parse(readFileSync(path, "utf8"));
console.log("rewrote id -> $id");
console.log("schema $id:", schema.$id);
console.log("definitions:", Object.keys(schema.definitions ?? {}).length);
