# Copilot Instructions — Adaptive Slide

## What this repository is

**Adaptive Slide** is a schema-driven presentation builder/viewer that layers a presentation model on top of the [Adaptive Cards 1.6](https://adaptivecards.io/) open card exchange format. A `.deck.json` file is a self-contained, schema-validated presentation that any Adaptive Cards host (Microsoft Teams, Outlook, Power Apps, Claude Desktop, VS Code Copilot) can render.

The project ships three things:
1. **A JSON DSL** — deck/slide/tile JSON schemas (under `schemas/`) that authors use to create presentations.
2. **A TypeScript renderer library** — converts deck JSON to HTML (for standalone viewing) and to Adaptive Cards 1.6 JSON (for host rendering).
3. **An MCP App plugin** — an HTTP server that exposes `present-deck` and `list-slides` MCP tools so AI assistants can drive interactive presentations.

---

## Essential commands

```bash
npm install              # install all dependencies
npm run build            # compile TypeScript (src/ → dist/) + copy assets
npm test                 # run all 26 tests (requires build first)
npm run validate         # validate example + template decks against schemas (36 checks)
npm run lint             # TypeScript type-check only (tsc --noEmit)
npm run dev              # run MCP server in dev mode via tsx (no build needed)
npm run serve            # run MCP server from compiled dist/ (build first)
```

> **Important:** `npm test` imports from `dist/` — always run `npm run build` before `npm test`. If you skip the build, the transformer and server tests will fail with "Cannot find module '../dist/...'".

To run only a specific test file during development:
```bash
node --test tests/adaptive-card.test.js
node --test tests/mcp-app.test.js
```

---

## Repository layout

```
adaptive-slide/
├── src/
│   ├── types/index.ts                  ← TypeScript type definitions (Deck, Slide, Tile subtypes)
│   ├── transformer.ts                  ← HTML renderer (renderTile / renderSlide / renderDeck)
│   ├── adaptiveCardTransformer.js      ← AC 1.6 converter (slideToAdaptiveCard / deckToAdaptiveCards)
│   ├── index.ts                        ← public exports
│   └── plugins/mcp-app/
│       ├── server.ts                   ← Express + MCP server (present-deck, list-slides tools)
│       └── viewer.html                 ← self-contained slide viewer (MCP App postMessage protocol)
├── schemas/
│   ├── deck.schema.json                ← AdaptiveDeck root (JSON Schema Draft 2020-12)
│   ├── slide.schema.json               ← AdaptiveSlide
│   ├── tile.schema.json                ← Tile discriminated union
│   ├── tiles/                          ← per-type tile schemas
│   │   ├── text-tile.schema.json
│   │   ├── image-tile.schema.json
│   │   ├── code-tile.schema.json
│   │   ├── chart-tile.schema.json
│   │   ├── media-tile.schema.json
│   │   ├── container-tile.schema.json
│   │   ├── input-text-tile.schema.json
│   │   ├── input-number-tile.schema.json
│   │   └── input-choice-set-tile.schema.json
│   └── adaptive-card-1.6.schema.json   ← patched AC 1.6 schema (see scripts/patch-ac-schema.js)
├── tests/
│   ├── adaptive-card.test.js           ← AC transformer + template deck tests
│   └── mcp-app.test.js                 ← HTML renderer + MCP server tests
├── scripts/
│   ├── validate.js                     ← AJV-based schema + AC 1.6 round-trip validator
│   ├── patch-ac-schema.js              ← One-time patcher for the official AC 1.6 schema
│   └── copy-assets.js                  ← Copies viewer.html to dist/ after build
├── examples/
│   ├── hello-world.deck.json           ← Exercises all tile types; used by mcp-app tests
│   └── training-dsl-101.deck.json      ← 8-slide training course with input tiles
├── website/
│   └── src/data/templateDecks.js       ← Industry template decks (validated by tests + validate.js)
├── docs/
│   ├── spec/technical-specification.md ← Formal spec
│   └── wiki/                           ← Architecture, schema reference, getting started
├── tsconfig.json                       ← Targets ES2022, ESNext modules, bundler resolution
└── package.json
```

---

## Data model overview

```
AdaptiveDeck  (type: "AdaptiveDeck")
├── metadata  { title, description, author, tags, … }
├── theme     { primaryColor, accentColor, backgroundColor, darkMode, … }
├── defaults  { layout, transition, padding }
└── slides[]  (type: "AdaptiveSlide")
     ├── id, title, notes
     ├── layout  { mode: "stack"|"grid"|"freeform", columns, gap, alignment }
     ├── background  { color | image | gradient }
     ├── body[]  — the tile array (the "bucket")
     └── actions[]
```

All tile types are discriminated on the `type` field:

| `type` | Purpose | Maps to AC 1.6 |
|--------|---------|----------------|
| `Tile.Text` | Text with styles (heading, subheading, body, caption, quote) | `TextBlock` |
| `Tile.Image` | Image with optional caption | `Image` (captioned → `Container`) |
| `Tile.Code` | Syntax-highlighted code block | `CodeBlock` |
| `Tile.Chart` | Bar, line, pie, donut, area, scatter | `TextBlock` + `FactSet` |
| `Tile.Media` | Audio/video | `Media` |
| `Tile.Container` | Groups tiles; layout: stack/row/wrap | `Container` or `ColumnSet` (row) |
| `Tile.Input.Text` | Text input | `Input.Text` |
| `Tile.Input.Number` | Number input | `Input.Number` |
| `Tile.Input.ChoiceSet` | Dropdown / radio / checkbox | `Input.ChoiceSet` |

---

## Key patterns and gotchas

### Stat-block pattern
A "stat block" (large KPI number over a small label) is a `Tile.Container` whose `items` array contains **exactly** two `Tile.Text` tiles — first with `style: "heading"`, then with `style: "caption"`. Both `src/adaptiveCardTransformer.js` and `website/src/pages/templates.js` (`isStatContainer` helper) detect this exact shape. **Do not reorder or change the styles** of this pair — it will break stat rendering.

### Grid layout → AC 1.6 ColumnSet
When a slide uses `layout.mode: "grid"`, `slideBodyToElements()` in `adaptiveCardTransformer.js` groups tiles by `gridPosition.row` and emits each row as an AC `ColumnSet`. Column widths come from `columnSpan` (as string e.g. `"2"`). A single full-width tile in a row collapses to a top-level element (not wrapped in a ColumnSet).

### AC 1.6 schema — three required patches
The official schema at `schemas/adaptive-card-1.6.schema.json` is a patched copy. Run `scripts/patch-ac-schema.js` only when pulling a newer version of the upstream schema. The patches are:
1. Rename Draft-06 `id` to `$id` so AJV can compile it.
2. Strip invalid `required: false` boolean entries.
3. Add `CodeBlock` to the definitions and `ImplementationsOf.Element` union (it's officially in AC 1.6 but absent from the published schema).

### Browser bundle — Map iterator spread
In browser-bound code (e.g. inside `viewer.html` or Docusaurus pages), **do not use** `[...mapInstance.keys()]`. Docusaurus/webpack/babel transpiles this to `[].concat(mapInstance.keys())`, which adds the iterator as a single element instead of spreading it. Use `Array.from(mapInstance.keys())` instead.

### Template decks
All industry template decks live in `website/src/data/templateDecks.js`. Each entry has:
- `id` — unique identifier (e.g. `"ac-layout-hero"`)
- `category` — grouping (`"Card layouts"`, `"Industry"`, etc.)
- `deck` — the full `AdaptiveDeck` object
- `deck.slides[0]` — the "showcase" slide rendered in the template gallery

Template decks are validated by both `npm run validate` and `tests/adaptive-card.test.js`. If you add or modify a template deck, run both checks.

### Actions
Navigation actions (`Action.GoToSlide`, `Action.NextSlide`, `Action.PrevSlide`) are Adaptive Slide-specific and are **silently dropped** by `slideToAdaptiveCard()` — they have no AC 1.6 equivalent. `Action.OpenUrl` and `Action.Submit` are forwarded.

### `Input.*` tiles
Input tiles require a string `id` field (used as the form field name). The `id` is also passed through to the AC 1.6 `Input.*` element. Input tiles validate with `isRequired`, `errorMessage`, `label`, and type-specific constraints.

---

## Adding a new tile type

1. Create `schemas/tiles/<name>-tile.schema.json` extending the tile base.
2. Add the TypeScript interface to `src/types/index.ts` extending `TileBase`.
3. Add `<NewTile>` to the `Tile` union type in `src/types/index.ts`.
4. Add a render function and a `case "Tile.<Name>":` branch in `src/transformer.ts`.
5. Add a `tileXxx()` function and a `case "Tile.<Name>":` branch in `src/adaptiveCardTransformer.js`.
6. Add at least one test in `tests/adaptive-card.test.js` covering the AC transform.
7. Run `npm run build && npm test && npm run validate` to verify everything passes.

---

## Workflow for schema changes

1. Edit the relevant `.schema.json` file in `schemas/` or `schemas/tiles/`.
2. Update the corresponding TypeScript interface in `src/types/index.ts`.
3. Update both transformers (`transformer.ts` and `adaptiveCardTransformer.js`).
4. Run `npm run validate` to check existing decks still pass.
5. Update `examples/` or `website/src/data/templateDecks.js` if needed.

---

## MCP server

- Default port: **3001**. Override with `PORT=<n>`.
- Single endpoint: `POST /mcp` — receives JSON-RPC 2.0 requests (MCP protocol).
- Two tools: `present-deck` (accepts deck JSON string, returns it for the viewer to render) and `list-slides` (returns slide titles/IDs).
- The viewer is served as a `text/html;profile=mcp-app` resource at `ui://adaptive-slide/viewer`.
- Connect to Claude Desktop by tunnelling: `npx cloudflared tunnel --url http://localhost:3001`.

---

## Testing strategy

Tests use Node.js's native `node:test` + `node:assert/strict`. No Jest, no Mocha.

- `tests/mcp-app.test.js` — Tests `dist/transformer.js` (HTML output) + `dist/plugins/mcp-app/server.js` (MCP module exports). **Requires `npm run build` first.**
- `tests/adaptive-card.test.js` — Tests `src/adaptiveCardTransformer.js` (AC 1.6 JSON output) + template decks from `website/src/data/templateDecks.js`. Runs directly from source (no build needed).

`npm run validate` runs a separate AJV-based validation suite covering all example decks and all template decks against both the Adaptive Slide DSL schemas and the AC 1.6 output schema.

---

## Documentation

- **Docusaurus site** (published): `https://darbotlm.github.io/adaptive-slide/`
- Local dev: `npm run docs:start`
- Build: `npm run docs:build`
- Website source: `website/src/` — pages, components, template data
- `docs/spec/technical-specification.md` — formal spec
- `docs/wiki/` — Architecture, Schema Reference, Getting Started, MCP App Plugin
