# Adaptive Slide Wiki

Welcome to the Adaptive Slide wiki - the guide for building, viewing, and extending schema-driven presentations.

## What is Adaptive Slide?

Adaptive Slide is a presentation format built on the [Adaptive Cards](https://adaptivecards.io/) open card exchange format. It brings the portability and schema-validation of Adaptive Cards to layered, presentation-style authoring.

**Key idea:** Each slide is an Adaptive Card bucket containing Adaptive Tiles. Tiles are the atomic content blocks. Use stack for documents, grid for dashboards, freeform for layered hero slides, and native bridge tiles when you need direct access to Adaptive Cards 1.6 elements.

## Pages

| Page | Description |
|------|-------------|
| [Architecture](Architecture.md) | System design, data model, and rendering pipeline |
| [Schema Reference](Schema-Reference.md) | Complete reference for all schemas and tile types |
| [Getting Started](Getting-Started.md) | Build your first deck in 5 minutes |
| [MCP App Plugin](MCP-App-Plugin.md) | Render decks as interactive MCP Apps |

## Quick Links

- [Technical Specification](../spec/technical-specification.md)
- [Hello World example](../../examples/hello-world.deck.json)
- [Layered hero example](../../examples/layered-hero.deck.json)
- [Native bridge example](../../examples/native-adaptive-card.deck.json)
- [Adaptive Cards Docs](https://adaptivecards.io/)
- [JSON Schema Spec](https://json-schema.org/draft/2020-12/json-schema-core)

## Core Concepts

```
Deck -> contains Slides -> each Slide has a Bucket -> Bucket holds Tiles
```

| Concept | Description |
|---------|-------------|
| **Deck** | The presentation - metadata, theme, and an ordered list of slides |
| **Slide** | A single page with layout, background, and a body of tiles |
| **Bucket** | The slide's Adaptive Card root - the composition surface |
| **Tile** | An atomic content unit with its own tile card schema |

## Authoring paths

| Need | Start here |
|------|------------|
| First deck | [Getting Started](Getting-Started.md) |
| Layered presentations | [`examples/layered-hero.deck.json`](../../examples/layered-hero.deck.json) |
| Native Adaptive Cards bridge | [`examples/native-adaptive-card.deck.json`](../../examples/native-adaptive-card.deck.json) |
| Extension workflow | [Architecture](Architecture.md) and [Technical Specification](../spec/technical-specification.md) |

## Tile families

| Type | Description |
|------|-------------|
| `Tile.Text` | Rich text: headings, body, captions, quotes |
| `Tile.Image` / `Tile.Photo` | Images and photos with alt text, sizing, captions, and photo presentation options |
| `Tile.Code` | Syntax-highlighted code blocks |
| `Tile.Chart` plus semantic chart aliases | Bar, pie, donut, line, area, and scatter visualizations |
| `Tile.Media` | Embedded video/audio |
| `Tile.Container` | Nests other tiles for complex layouts |
| `Tile.Input.*` | Text, number, choice, date, time, and toggle inputs |
| `Tile.AdaptiveElement` / `Tile.AdaptiveCard` | Native Adaptive Cards 1.6 bridge |
