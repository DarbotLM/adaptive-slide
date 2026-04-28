---
id: getting-started
title: Getting Started
description: Install Adaptive Slide, validate decks, build the renderer, and run the MCP App server.
---

# Getting Started

This guide takes a new checkout from install to a locally running MCP App server.

## Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | 18 or later |
| npm | Bundled with Node.js |
| Git | Any current version |

## Install

```bash
git clone https://github.com/DarbotLM/adaptive-slide.git
cd adaptive-slide
npm install
```

## Validate the example deck

```bash
npm run validate
```

The validation script loads the schemas from `schemas/`, registers the built-in tile schemas with AJV, and validates `examples/hello-world.deck.json`.

## Build and test

```bash
npm run build
npm test
```

`npm run build` compiles the TypeScript source and copies the self-contained viewer HTML into `dist/plugins/mcp-app/`.

## Run the MCP App server

```bash
npm run serve
```

The server starts at:

```text
http://localhost:3001/mcp
```

Use a custom port when needed:

```bash
PORT=8080 npm run serve
```

## Minimal deck

Create `my-first.deck.json`:

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
          "text": "Hello, Adaptive Slide",
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
    }
  ]
}
```

## Render from TypeScript

```typescript
import { readFileSync } from "node:fs";
import { renderDeck } from "adaptive-slide";

const deck = JSON.parse(readFileSync("my-first.deck.json", "utf-8"));
const html = renderDeck(deck);

console.log(html);
```

## Next steps

| Next | Why |
| --- | --- |
| [Architecture](./architecture.md) | Understand deck structure, layout modes, and renderer boundaries. |
| [Schema Reference](./schema-reference.md) | Review required fields and tile-specific properties. |
| [MCP App Plugin](./mcp-app-plugin.md) | Connect the server to an MCP-compatible host. |
