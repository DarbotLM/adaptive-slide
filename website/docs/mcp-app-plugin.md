---
id: mcp-app-plugin
title: MCP App Plugin
description: Use the Adaptive Slide MCP server and self-contained viewer in compatible MCP hosts.
---

# MCP App Plugin

The MCP App plugin turns Adaptive Slide deck JSON into an interactive presentation surface for compatible MCP hosts.

## What it provides

| Component | Description |
| --- | --- |
| MCP server | Registers tools and serves the UI resource. |
| `present-deck` tool | Accepts a full deck JSON string and returns it for viewer rendering. |
| `list-slides` tool | Returns slide index, id, and title metadata. |
| UI resource | Serves `ui://adaptive-slide/viewer` as `text/html;profile=mcp-app`. |
| Viewer | Self-contained HTML, CSS, and JavaScript for slide navigation and rendering. |

## Runtime flow

```text
Deck JSON
  -> present-deck
  -> MCP host receives structured content
  -> Host loads ui://adaptive-slide/viewer
  -> Viewer receives deck data
  -> Slides render in the sandboxed UI
```

## Build and run

```bash
npm install
npm run build
npm run serve
```

The default endpoint is:

```text
http://localhost:3001/mcp
```

To use another port:

```bash
PORT=8080 npm run serve
```

## Tools

### `present-deck`

Renders a deck in the viewer.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `deck` | string | Yes | Full Adaptive Slide deck as a JSON string. |

Example tool input:

```json
{
  "deck": "{\"type\":\"AdaptiveDeck\",\"version\":\"1.0.0\",\"slides\":[{\"type\":\"AdaptiveSlide\",\"body\":[{\"type\":\"Tile.Text\",\"text\":\"Hello\"}]}]}"
}
```

### `list-slides`

Returns slide metadata.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `deck` | string | Yes | Full Adaptive Slide deck as a JSON string. |

Example response:

```json
[
  {
    "index": 0,
    "id": "title-slide",
    "title": "Welcome"
  }
]
```

## Viewer features

| Feature | Notes |
| --- | --- |
| Slide navigation | Previous and next controls plus slide counter. |
| Keyboard shortcuts | Arrow keys, Space, Home, End, and Escape. |
| Slide picker | Menu control for jumping to a slide. |
| Theme support | Uses deck theme colors, fonts, and dark-mode hints. |
| Speaker notes | Shows notes when slides provide them. |
| Tile support | Text, image, code, chart, media, and container tiles. |
| Layout support | Stack, grid, and freeform layouts. |

## Host connection notes

For local host testing, point the MCP client at:

```json
{
  "servers": {
    "adaptive-slide": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

For remote hosts that cannot reach localhost, expose the local endpoint through an approved tunnel and configure the host with the tunnel URL plus `/mcp`.

## Security model

The viewer is designed for declarative deck data:

| Control | Behavior |
| --- | --- |
| Escaping | User-provided text, URLs, code, labels, and captions are escaped before rendering. |
| No external scripts | The viewer is self-contained and does not load third-party runtime scripts. |
| Sandboxed host | MCP App hosts are expected to embed the viewer in a sandboxed frame. |
| Declarative tiles | Deck JSON describes content and layout. It does not execute JavaScript from tile data. |

When changing renderer behavior, keep the TypeScript transformer and browser-side viewer transformer aligned so tests and hosted rendering remain consistent.
