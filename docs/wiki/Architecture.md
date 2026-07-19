# Architecture

## System Overview

Adaptive Slide follows a three-phase pipeline:

```
Parse -> Resolve -> Render
```

### Parse
- Load a `.deck.json` file
- Validate against JSON Schemas (AJV)
- Deserialize into a typed object tree: `Deck -> Slide[] -> Tile[]`

### Resolve
- Merge deck-level defaults into each slide
- Apply theme colors/fonts to unstyled tiles
- Calculate layout positions (stack, grid, freeform)
- Resolve external resource URIs

### Render
- Convert each slide's tile tree into renderable output
- Map tiles to Adaptive Cards elements (or native UI)
- Apply host-specific fallbacks for unsupported tile types

---

## Data Model

```
AdaptiveDeck
|-- metadata: { title, author, tags, dates }
|-- theme: { colors, fonts, darkMode }
|-- card: AdaptiveCardOptions
|-- defaults: { layout, transition, padding }
`-- slides: AdaptiveSlide[]
    |-- id, title, notes
    |-- layout: { mode, columns, gap, alignment }
    |-- background: { color | image | gradient }
    |-- card: AdaptiveCardOptions
    |-- body: AdaptiveTile[]           the bucket
    |   |-- Tile.Text     { text, style, size, weight, color }
    |   |-- Tile.Image / Tile.Photo
    |   |-- Tile.Code     { code, language, lineNumbers }
    |   |-- Tile.Chart / semantic chart aliases
    |   |-- Tile.Media    { sources, poster, autoplay }
    |   |-- Tile.Input.*  { text, number, choiceSet, date, time, toggle }
    |   |-- Tile.AdaptiveElement
    |   |-- Tile.AdaptiveCard
    |   `-- Tile.Container
    |       `-- items: AdaptiveTile[]  recursive
    `-- actions: Action[]
```

---

## Layout Modes

### Stack (default)
Tiles flow vertically, top to bottom. Spacing controls gaps.

### Grid
CSS-grid-like layout. Each tile specifies `gridPosition` with `column`, `row`, `columnSpan`, `rowSpan`. The slide's `layout.columns` sets the grid column count.

### Freeform
Absolute positioning. Each tile specifies `freeformPosition` with `x`, `y`, `width`, `height` (all as percentages 0-100), plus optional `rotation` and `zIndex`.

This is the layering model for PowerPoint-style slides. The HTML viewer honors absolute placement and overlap. The Adaptive Cards 1.6 transformer preserves the same tile content, but Adaptive Cards does not have an absolute positioning model, so freeform placement does not survive as native AC layout metadata.

---

## Adaptive Cards Mapping

The rendering phase maps tiles to native AC elements:

| Tile | AC Element | Notes |
|------|-----------|-------|
| `Tile.Text` | `TextBlock` | `style: "heading"` maps to large bold |
| `Tile.Image` / `Tile.Photo` | `Image` | Direct mapping; photo-only presentation options affect HTML rendering |
| `Tile.Code` | `CodeBlock` (v1.6) | Falls back to monospace `TextBlock` |
| `Tile.Chart` and chart aliases | Extension / `FactSet` fallback | HTML renderer draws charts; AC fallback exposes values as facts |
| `Tile.Media` | `Media` | Direct 1:1 mapping |
| `Tile.Container` | `Container` | Nested tiles become nested AC elements |
| `Tile.Input.*` | `Input.*` | Text, number, choice set, date, time, and toggle inputs |
| `Tile.AdaptiveElement` | Any AC element | Native bridge for the full AC 1.6 element library |
| `Tile.AdaptiveCard` | `Container` + optional `ActionSet` | Embeds native cards inside slides |

Slide actions forward native `Action.OpenUrl`, `Action.Submit`, `Action.Execute`, `Action.ToggleVisibility`, and `Action.ShowCard`. Adaptive Slide navigation actions are retained for presentation hosts and dropped from AC output when no AC equivalent exists.

---

## Extension Model

### Custom Tiles

1. Define a JSON Schema extending `TileBase`
2. Use `Tile.YourType` as the discriminator
3. Add the new type to `src/types/index.ts`
4. Register renderer branches in `src/transformer.ts` and `src/adaptiveCardTransformer.js`
5. Provide an AC fallback for basic hosts

### Theme Extensions

Themes are open for extension (`additionalProperties: true`). Host-specific properties go under a namespaced key.

---

## Source Structure

```
adaptive-slide/
|-- schemas/
|   |-- deck.schema.json
|   |-- slide.schema.json
|   |-- tile.schema.json
|   `-- tiles/
|-- docs/
|   |-- spec/
|   `-- wiki/
|-- src/
|   |-- types/index.ts
|   |-- transformer.ts
|   |-- adaptiveCardTransformer.js
|   `-- plugins/mcp-app/
|       |-- server.ts
|       `-- viewer.html
|-- examples/
`-- tests/
```
