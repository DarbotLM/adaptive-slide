// Validates:
// 1. Each example deck and template deck against the AdaptiveDeck JSON Schemas.
// 2. Every transformed slide against the official Adaptive Cards 1.6 JSON Schema.
//
// Adaptive Slide is an authoring DSL; the AC 1.6 transformer produces cards
// that any AC 1.6 host (Teams, Outlook, Power Apps, etc.) can render.

import Ajv2020 from "ajv/dist/2020.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import draft6 from "ajv/dist/refs/json-schema-draft-06.json" with { type: "json" };
import { readFileSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { templateDecks } from "../website/src/data/templateDecks.js";
import { slideToAdaptiveCard } from "../src/adaptiveCardTransformer.js";

const ROOT = resolve(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "schemas");
const EXAMPLES_DIR = join(ROOT, "examples");
const AC_SCHEMA_PATH = join(SCHEMAS_DIR, "adaptive-card-1.6.schema.json");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function loadAdaptiveDeckSchemas(dir) {
  const schemas = [];
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".schema.json")) continue;
    if (entry.name.startsWith("adaptive-card-")) continue; // AC 1.6 lives in its own validator
    const fullPath = join(entry.parentPath ?? entry.path, entry.name);
    schemas.push(loadJson(fullPath));
  }
  return schemas;
}

// ---------------------------------------------------------------------------
// AdaptiveDeck validator (Draft 2020-12)
// ---------------------------------------------------------------------------

const deckAjv = new Ajv2020({ allErrors: true, strict: false });
addFormats(deckAjv);

const deckSchemas = loadAdaptiveDeckSchemas(SCHEMAS_DIR);
for (const schema of deckSchemas) {
  deckAjv.addSchema(schema);
}

const deckSchema = deckSchemas.find((s) => s.title === "Adaptive Slide Deck");
if (!deckSchema) {
  console.error("ERROR: Could not find AdaptiveDeck schema");
  process.exit(1);
}
const validateDeck = deckAjv.compile(deckSchema);

// ---------------------------------------------------------------------------
// Adaptive Cards 1.6 validator (Draft-06)
// ---------------------------------------------------------------------------

const acAjv = new Ajv({ allErrors: true, strict: false, validateFormats: false, validateSchema: false });
acAjv.addMetaSchema(draft6);
addFormats(acAjv);

const acSchema = loadJson(AC_SCHEMA_PATH);
const validateAdaptiveCard = acAjv.compile(acSchema);

// ---------------------------------------------------------------------------
// Run validation
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function reportErrors(prefix, errors) {
  for (const err of errors.slice(0, 6)) {
    console.log(`   ${err.instancePath || "/"} - ${err.message}`);
  }
  if (errors.length > 6) {
    console.log(`   ... ${errors.length - 6} more`);
  }
}

function checkDeck(label, deck) {
  const valid = validateDeck(deck);
  if (valid) {
    console.log(`PASS deck       : ${label}`);
    passed++;
  } else {
    console.log(`FAIL deck       : ${label}`);
    reportErrors(label, validateDeck.errors);
    failed++;
  }
}

function checkAdaptiveCardSlides(label, deck) {
  let allValid = true;
  let firstFailureLogged = false;
  const slides = deck.slides ?? [];
  for (let i = 0; i < slides.length; i++) {
    const card = slideToAdaptiveCard(slides[i], deck);
    const valid = validateAdaptiveCard(card);
    if (!valid) {
      allValid = false;
      if (!firstFailureLogged) {
        console.log(`FAIL AC 1.6     : ${label} slide[${i}] (${slides[i].id ?? "no-id"})`);
        reportErrors(label, validateAdaptiveCard.errors);
        firstFailureLogged = true;
      }
    }
  }
  if (allValid) {
    console.log(`PASS AC 1.6     : ${label} (${slides.length} slides)`);
    passed++;
  } else {
    failed++;
  }
}

// Example decks on disk
const examples = readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith(".deck.json"));
for (const file of examples) {
  const deck = loadJson(join(EXAMPLES_DIR, file));
  checkDeck(file, deck);
  checkAdaptiveCardSlides(file, deck);
}

// Template decks defined in the website source
for (const template of templateDecks) {
  const label = `template:${template.id}`;
  checkDeck(label, template.deck);
  checkAdaptiveCardSlides(label, template.deck);
}

const total = passed + failed;
console.log(`\n${passed} passed, ${failed} failed out of ${total} checks`);
process.exit(failed > 0 ? 1 : 0);
