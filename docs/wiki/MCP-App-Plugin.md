# MCP App Plugin

The MCP App plugin transforms Adaptive Slide deck JSON into interactive presentations that render directly inside MCP-compatible hosts like Claude Desktop, VS Code Copilot, Goose, and others.

## Overview

```
Deck JSON (.deck.json)
  -> MCP Server (/mcp, present-deck, list-slides, ui://adaptive-slide/viewer)
  -> MCP Host
  -> Viewer MCP App
```

## How It Works

MCP Apps extend the Model Context Protocol by allowing tools to return interactive HTML UIs alongside their data. The Adaptive Slide plugin uses this pattern:

1. **Tool registration**: The `present-deck` tool declares a `_meta.ui.resourceUri` pointing to a `ui://` resource
2. **Resource serving**: The server serves a self-contained HTML viewer as a UI resource
3. **Communication**: The viewer implements the MCP App postMessage protocol to receive deck data from the host
4. **Rendering**: The viewer's built-in transformer converts tile JSON to HTML and provides interactive navigation

## Tools

### `present-deck`

Renders an Adaptive Slide deck as an interactive presentation inside the MCP host.

**Input:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `deck` | string | Full Adaptive Slide deck as a JSON string |

**Output:** The deck JSON is returned as text content and pushed to the viewer UI via the MCP App protocol.

**Example prompt:** *"Show me this presentation"* (with deck JSON attached or generated)

### `list-slides`

Returns metadata about slides in a deck (titles, IDs, indices).

**Input:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `deck` | string | The Adaptive Slide deck JSON string |

**Output:** JSON array of `{ index, id, title }` for each slide.

## Setup

### Install & Build

```bash
npm install
npm run build
```

### Run the Server

```bash
# Production
npm run serve          # starts on port 3001

# Development (with auto-reload)
npm run dev

# Custom port
PORT=8080 npm run serve
```

### Connect to Claude Desktop

1. Start the server locally
2. Create a tunnel: `npx cloudflared tunnel --url http://localhost:3001`
3. In Claude Desktop > Settings > Connectors > Add Custom Connector
4. Paste the tunnel URL (e.g., `https://random-name.trycloudflare.com/mcp`)

### Connect to VS Code Copilot

Add to your MCP settings:
```json
{
  "servers": {
    "adaptive-slide": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

## Viewer Features

The viewer is a self-contained HTML page with:

- **Slide navigation**: Previous/Next buttons, slide counter
- **Keyboard shortcuts**: Arrow keys, Space, Home, End, Escape
- **Slide picker**: Use the slide picker menu to jump to any slide
- **Theme support**: Applies deck theme (colors, fonts, dark mode)
- **Speaker notes**: Displays notes panel when slides have notes
- **Layered layouts**: Stack, grid, and freeform slides, including `zIndex` overlap in freeform mode
- **Tile coverage**: Curated content tiles, input tiles, and native bridge tiles
- **Layout modes**: Stack, Grid, Freeform
- **Transitions**: Fade animation between slides

NOTE: Freeform placement is implemented by the HTML viewer. When you transform a slide to plain Adaptive Cards 1.6 JSON for a host surface, the content is preserved but absolute positioning is not.

## Architecture

### Transformer

The transformer (`src/transformer.ts`) is a pure-function module that converts tile JSON to HTML strings. It handles:

- Markdown subset rendering (bold, italic, code, links)
- Semantic color mapping with theme awareness
- Grid and freeform positioning
- Chart rendering (bar, pie/donut via CSS conic-gradient)
- Recursive container nesting

### Server

The server (`src/plugins/mcp-app/server.ts`) uses:
- `@modelcontextprotocol/sdk` for MCP protocol
- Express + CORS for HTTP transport
- StreamableHTTPServerTransport for MCP communication

### Viewer

The viewer (`src/plugins/mcp-app/viewer.html`) is fully self-contained:
- Inline CSS for all styling
- Inline JS transformer (duplicated from the TS module for browser use)
- Direct postMessage MCP App protocol implementation (no SDK dependency)
- Supports both MCP host communication and direct postMessage deck loading

Presentation-only navigation actions (`Action.GoToSlide`, `Action.NextSlide`, `Action.PrevSlide`) are handled by the viewer. Native Adaptive Cards actions (`Action.OpenUrl`, `Action.Submit`, `Action.Execute`, `Action.ToggleVisibility`, `Action.ShowCard`) flow through to the generated Adaptive Card output when the action exists in AC 1.6.

## Security

- Viewer runs in a sandboxed iframe (MCP host enforced)
- No external scripts or resources loaded
- All user content is HTML-escaped before rendering
- No JavaScript execution from deck data - tiles are declarative only
