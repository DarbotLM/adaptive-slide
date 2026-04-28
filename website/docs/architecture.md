---
id: architecture
title: Architecture
description: Adaptive Slide data model, rendering flow, layout modes, and source structure.
---

# Architecture

Adaptive Slide is organized around a small, typed data model and a renderer that converts declarative deck JSON into host-ready HTML.

## Flow

```text
Author deck JSON
  -> Validate against JSON Schemas
  -> Render deck, slides, backgrounds, and tiles
  -> Present through HTML or MCP App viewer
```

## Data model

| Level | Responsibility |
| --- | --- |
| `AdaptiveDeck` | Presentation container with metadata, theme, defaults, and ordered slides. |
| `AdaptiveSlide` | A single page with layout, background, transition, actions, and tile body. |
| `AdaptiveTile` | A discriminated union of built-in tile types. |
| `Tile.Container` | A recursive tile that nests other tiles for grouped layouts. |

## Source map

| Path | Purpose |
| --- | --- |
| `schemas/deck.schema.json` | Root deck schema and reusable metadata, theme, and defaults definitions. |
| `schemas/slide.schema.json` | Slide schema, layout settings, backgrounds, and actions. |
| `schemas/tile.schema.json` | Tile union and shared tile base definitions. |
| `schemas/tiles/*.schema.json` | Concrete schemas for text, image, code, chart, media, and container tiles. |
| `src/types/index.ts` | TypeScript interfaces that mirror the JSON model. |
| `src/transformer.ts` | Pure rendering functions for tiles, slides, decks, and backgrounds. |
| `src/plugins/mcp-app/server.ts` | MCP server factory and HTTP entry point. |
| `src/plugins/mcp-app/viewer.html` | Self-contained MCP App viewer HTML, CSS, and browser-side rendering logic. |
| `examples/hello-world.deck.json` | End-to-end deck sample. |
| `tests/mcp-app.test.js` | Node test suite for renderer output, viewer protocol markers, and server exports. |

## Layout modes

| Mode | Behavior | Best for |
| --- | --- | --- |
| `stack` | Tiles flow vertically in body order. | Simple decks, generated summaries, notes-heavy slides. |
| `grid` | Tiles use `gridPosition` with row, column, and span metadata. | Dashboards, comparisons, multi-column layouts. |
| `freeform` | Tiles use percentage-based absolute positioning. | Designed slides that need precise placement. |

## Tile rendering

The renderer uses the `type` discriminator on each tile:

| Tile | Renderer behavior |
| --- | --- |
| `Tile.Text` | Escapes content, applies a markdown subset, and maps style, size, weight, color, and alignment to classes or inline styles. |
| `Tile.Image` | Emits an image with escaped URL and alt text, optional sizing, and optional caption. |
| `Tile.Code` | Emits a titled preformatted block with optional language and line-number metadata. |
| `Tile.Chart` | Emits a lightweight visual representation for supported chart types. |
| `Tile.Media` | Emits audio or video tags with escaped sources and playback attributes. |
| `Tile.Container` | Recursively renders nested tiles with stack, row, or wrap layout. |

## MCP App integration

```text
MCP host
  -> calls present-deck with deck JSON
  -> fetches ui://adaptive-slide/viewer
  -> embeds sandboxed viewer
  -> viewer receives deck data through postMessage
  -> viewer renders slides and navigation
```

The server uses `@modelcontextprotocol/sdk`, Express, CORS, and Streamable HTTP transport. The viewer intentionally avoids external scripts so it can run as a self-contained UI resource.

## Extension points

| Extension | Current path |
| --- | --- |
| New tile type | Add a schema under `schemas/tiles/`, update `schemas/tile.schema.json`, extend `src/types/index.ts`, and add renderer support. |
| Host-specific rendering | Add a renderer layer that consumes the same typed deck model and emits host-specific output. |
| Validation workflows | Extend `scripts/validate.js` to include additional examples, schema fixtures, or regression decks. |
| Viewer capabilities | Update both `src/transformer.ts` and the browser-side transformer embedded in `viewer.html` when behavior must match. |
