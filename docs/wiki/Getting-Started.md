# Getting Started

Build your first Adaptive Slide deck in 5 minutes.

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

```bash
git clone <repo-url>
cd adaptive-slide
npm install
```

## Your First Deck

Create a file called `my-first.deck.json`:

```json
{
  "$schema": "./schemas/deck.schema.json",
  "type": "AdaptiveDeck",
  "version": "1.0.0",
  "metadata": {
    "title": "My First Deck",
    "author": "You"
  },
  "slides": [
    {
      "type": "AdaptiveSlide",
      "id": "title-slide",
      "title": "Welcome",
      "body": [
        {
          "type": "Tile.Text",
          "text": "Hello, Adaptive Slide!",
          "style": "heading",
          "size": "extraLarge",
          "horizontalAlignment": "center"
        },
        {
          "type": "Tile.Text",
          "text": "A schema-driven presentation format",
          "style": "subheading",
          "color": "accent",
          "horizontalAlignment": "center"
        }
      ]
    },
    {
      "type": "AdaptiveSlide",
      "id": "content-slide",
      "title": "Key Concepts",
      "body": [
        {
          "type": "Tile.Text",
          "text": "The Building Blocks",
          "style": "heading"
        },
        {
          "type": "Tile.Text",
          "text": "- **Deck** - the presentation container\n- **Slide** - a single page\n- **Tile** - an atomic content block",
          "style": "body"
        },
        {
          "type": "Tile.Code",
          "language": "json",
          "title": "tile.schema.json",
          "code": "{ \"type\": \"Tile.Text\", \"text\": \"Hello!\" }"
        }
      ]
    }
  ]
}
```

## Validate

```bash
npm run validate
```

If the deck file lives in the repository root, `"$schema": "./schemas/deck.schema.json"` is correct. If the deck file lives under `examples/`, use `"$schema": "../schemas/deck.schema.json"` instead.

## Concepts

### Deck
The root object. Contains metadata (title, author), a theme, and an ordered array of slides.

### Slide
A single page in the presentation. Each slide is an Adaptive Card bucket - its `body` array is where you place tiles.

### Tiles
The atomic content units are grouped into three authoring categories:

| Category | Tile types | Use for |
|----------|------------|---------|
| Curated content | `Tile.Text`, `Tile.Image`, `Tile.Photo`, `Tile.Code`, `Tile.Chart`, semantic chart aliases, `Tile.Media`, `Tile.Container` | Most deck authoring |
| Curated inputs | `Tile.Input.Text`, `Tile.Input.Number`, `Tile.Input.ChoiceSet`, `Tile.Input.Date`, `Tile.Input.Time`, `Tile.Input.Toggle` | Forms, surveys, check-ins |
| Native bridge | `Tile.AdaptiveElement`, `Tile.AdaptiveCard` | Direct access to native Adaptive Cards 1.6 elements and embedded cards |

Semantic chart aliases include `Tile.BarGraph`, `Tile.PieChart`, `Tile.DonutChart`, `Tile.LineGraph`, `Tile.AreaChart`, and `Tile.ScatterPlot`.

### Layouts

Each slide supports three layout modes:

- **stack** (default) - tiles flow vertically
- **grid** - CSS-grid-like with `gridPosition` on each tile
- **freeform** - absolute positioning with `freeformPosition`

```json
{
  "type": "AdaptiveSlide",
  "layout": { "mode": "grid", "columns": 2 },
  "body": [
    { "type": "Tile.Text", "text": "Left column", "gridPosition": { "column": 1, "row": 1 } },
    { "type": "Tile.Image", "url": "...", "gridPosition": { "column": 2, "row": 1 } }
  ]
}
```

### PowerPoint-style layered slides

For hero slides, posters, and callouts, use `freeform` and place each tile with percentages:

```json
{
  "type": "AdaptiveSlide",
  "id": "layered-hero",
  "title": "Layered hero",
  "layout": { "mode": "freeform" },
  "body": [
    {
      "type": "Tile.Container",
      "style": "accent",
      "freeformPosition": { "x": 8, "y": 18, "width": 40, "height": 42, "zIndex": 1 },
      "items": [
        { "type": "Tile.Text", "text": "Backdrop panel", "style": "caption", "color": "light" }
      ]
    },
    {
      "type": "Tile.Text",
      "text": "Adaptive Slide supports layered deck composition",
      "style": "heading",
      "size": "extraLarge",
      "color": "light",
      "freeformPosition": { "x": 10, "y": 10, "width": 68, "height": 18, "zIndex": 3 }
    },
    {
      "type": "Tile.Image",
      "url": "https://adaptivecards.io/content/cats/2.png",
      "altText": "Decorative example image",
      "freeformPosition": { "x": 62, "y": 16, "width": 28, "height": 50, "zIndex": 2 }
    }
  ]
}
```

`freeformPosition` uses percentages for `x`, `y`, `width`, and `height`. `zIndex` controls overlap in the HTML viewer and MCP app.

NOTE: Freeform is a presentation-layer feature. The HTML viewer honors absolute placement, but Adaptive Cards 1.6 hosts receive the same tile content without absolute positioning.

### Native Adaptive Cards bridge

Use the bridge when a host-native element is the best fit:

```json
{
  "type": "Tile.AdaptiveElement",
  "element": {
    "type": "Table",
    "rows": [
      {
        "type": "TableRow",
        "cells": [
          {
            "type": "TableCell",
            "items": [{ "type": "TextBlock", "text": "Native table cell" }]
          }
        ]
      }
    ]
  }
}
```

Use `Tile.AdaptiveCard` when you want to embed an entire native card body plus its native actions. See [`examples/native-adaptive-card.deck.json`](../../examples/native-adaptive-card.deck.json) for a complete bridge example.

## Next Steps

- Read the [Architecture](Architecture.md) for system design details
- Browse the [Schema Reference](Schema-Reference.md) for all properties
- Study the [Technical Specification](../spec/technical-specification.md) for the full spec
- Check out [`examples/hello-world.deck.json`](../../examples/hello-world.deck.json)
- Study [`examples/layered-hero.deck.json`](../../examples/layered-hero.deck.json) for layered presentation authoring
- Study [`examples/native-adaptive-card.deck.json`](../../examples/native-adaptive-card.deck.json) for bridge authoring
