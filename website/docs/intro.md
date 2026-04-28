---
id: intro
title: Introduction
description: Adaptive Slide overview, core concepts, and implementation status.
slug: /intro
---

# Adaptive Slide

Adaptive Slide is a schema-first presentation format built on Adaptive Cards. A deck is a JSON document, each slide is an Adaptive Card bucket, and each tile is a typed content block with its own schema and renderer behavior.

The project currently ships:

| Area | What is included |
| --- | --- |
| Schemas | Draft 2020-12 JSON Schemas for decks, slides, and six built-in tile types. |
| Renderer | TypeScript functions that convert decks, slides, backgrounds, and tiles to HTML. |
| MCP App plugin | An HTTP MCP server with presentation tools and a self-contained HTML viewer resource. |
| Example | A sample deck that exercises text, image, code, chart, container, action, theme, and transition features. |
| Documentation | This Docusaurus site plus the technical specification and schema reference. |

## Core model

```text
AdaptiveDeck
  -> metadata, theme, defaults
  -> AdaptiveSlide[]
       -> layout, background, transition, actions
       -> AdaptiveTile[]
            -> Tile.Text
            -> Tile.Image
            -> Tile.Code
            -> Tile.Chart
            -> Tile.Media
            -> Tile.Container
```

## Why it exists

Presentation formats often couple content, layout, and renderer-specific behavior. Adaptive Slide separates those concerns:

1. Authors create deck JSON that is easy to diff, validate, generate, and review.
2. Schemas define the allowed structure and keep generated content predictable.
3. Renderers can target Adaptive Cards hosts, web viewers, MCP Apps, or native presentation surfaces.

## Good fit

Use Adaptive Slide when you need one or more of these outcomes:

| Need | How Adaptive Slide helps |
| --- | --- |
| Generated presentations | Agents and scripts can produce strongly shaped JSON instead of opaque slide binaries. |
| Portable content | Decks are declarative and can be rendered by multiple host implementations. |
| Validation | JSON Schema catches missing required fields and invalid tile contracts before presentation time. |
| MCP integration | The included server exposes `present-deck` and `list-slides` tools for MCP-compatible hosts. |

## Current boundaries

The docs describe the target architecture and the code that exists today. The current implementation includes schemas, type definitions, HTML rendering, a self-contained viewer, and an MCP server. Parser, resolver, and builder modules are architectural extension points, not separate source directories in the current package.

## Primary links

| Resource | Link |
| --- | --- |
| Repository | [DarbotLM/adaptive-slide](https://github.com/DarbotLM/adaptive-slide) |
| Example deck | [examples/hello-world.deck.json](https://github.com/DarbotLM/adaptive-slide/blob/main/examples/hello-world.deck.json) |
| Schema folder | [schemas](https://github.com/DarbotLM/adaptive-slide/tree/main/schemas) |
| Technical specification | [Technical Specification](./technical-specification.md) |
