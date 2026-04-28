---
id: technical-specification
title: Technical Specification
description: Normative Adaptive Slide format details for deck files, schemas, rendering, extensibility, and validation.
---

# Technical Specification

## Status

| Field | Value |
| --- | --- |
| Format | Adaptive Slide deck JSON |
| Current package version | 0.2.0 |
| Schema dialect | JSON Schema Draft 2020-12 |
| Adaptive Cards baseline | Adaptive Cards 1.6 concepts |
| MIME type | `application/vnd.adaptive-slide.deck+json` |
| File extension | `.deck.json` |

## Design principles

1. Schema-first: every deck element has an explicit JSON Schema contract.
2. Composable: tiles compose into slides, and slides compose into decks.
3. Portable: a deck is declarative JSON rather than renderer-owned binary state.
4. Extensible: new tile types can be introduced through schema, type, and renderer extensions.
5. Host-aware: renderers can target web, Adaptive Cards-inspired hosts, MCP Apps, or native surfaces.

## Required deck shape

```json
{
  "$schema": "./schemas/deck.schema.json",
  "type": "AdaptiveDeck",
  "version": "1.0.0",
  "slides": [
    {
      "type": "AdaptiveSlide",
      "body": [
        {
          "type": "Tile.Text",
          "text": "Hello"
        }
      ]
    }
  ]
}
```

## Type discriminators

| Object | Discriminator |
| --- | --- |
| Deck | `AdaptiveDeck` |
| Slide | `AdaptiveSlide` |
| Text tile | `Tile.Text` |
| Image tile | `Tile.Image` |
| Code tile | `Tile.Code` |
| Chart tile | `Tile.Chart` |
| Media tile | `Tile.Media` |
| Container tile | `Tile.Container` |

## Versioning

The deck `version` field follows a semver-like string pattern:

```text
major.minor
major.minor.patch
```

Schema-compatible additive changes should preserve existing render behavior. Breaking schema or renderer changes should update the documented deck version expectations and include migration guidance.

## Rendering contract

Renderers should follow these rules:

1. Preserve slide order.
2. Treat missing optional fields as defaults defined by schema or renderer behavior.
3. Escape user-provided text and URLs before writing HTML.
4. Do not execute scripts from deck data.
5. Respect `isVisible: false` by omitting the tile output.
6. Apply deck defaults unless a slide provides an override.
7. Render unknown future tile types through explicit fallback behavior rather than silent success.

## Accessibility guidance

| Area | Requirement |
| --- | --- |
| Images | Provide `altText` for content images. |
| Media | Provide `altText`, captions, or adjacent explanatory text when media is essential. |
| Color | Do not rely on color alone for meaning. |
| Navigation | Keep slide titles meaningful for list and picker UI. |
| Code | Provide `title` or nearby context for long code blocks. |

## Extending with a new tile

1. Add `schemas/tiles/your-tile.schema.json`.
2. Add a reference to `schemas/tile.schema.json`.
3. Extend the TypeScript tile union in `src/types/index.ts`.
4. Add rendering support in `src/transformer.ts`.
5. Mirror required behavior in `src/plugins/mcp-app/viewer.html`.
6. Add example deck coverage.
7. Add or update tests.

## Validation and release checks

Run these checks before publishing changes:

```bash
npm run validate
npm run build
npm test
npm run docs:build
```

For documentation-only changes, `npm run docs:build` is the key check. For schema or renderer changes, run all commands.
