# Adaptive Slide

A schema-driven presentation builder/viewer built on the [Adaptive Cards](https://adaptivecards.io/) open card exchange format.

## Concept

Each slide is an Adaptive Card bucket containing Adaptive Tiles. Authors can combine stack, grid, and freeform layouts to build anything from linear documents to PowerPoint-style layered hero slides.

```
Deck (Presentation)
  -> Slide[]                        sequential pages
     -> Adaptive Card Bucket        the slide is an Adaptive Card
        -> Adaptive Tile[]          content blocks (text, image, code, chart)
           -> Tile Card Schema      per-type JSON schema
```

## Authoring Model

| Layer | Purpose |
|-------|---------|
| **Deck** | Presentation container - metadata, theme, slide ordering |
| **Slide** | A single page - layout mode, background, transitions |
| **Bucket** | The Adaptive Card root - composes tiles into a renderable card |
| **Tile** | Atomic content unit - curated content tile, input tile, or native bridge tile |

### PowerPoint-style layering

- Use `layout.mode: "freeform"` on a slide to place tiles with `freeformPosition`.
- Use `zIndex` inside `freeformPosition` to overlap tiles in the HTML viewer and MCP app.
- Use `Tile.Container` to build grouped panels, callouts, or stat blocks.
- Use `Tile.AdaptiveElement` and `Tile.AdaptiveCard` when you need a native Adaptive Cards element that does not have a curated tile yet.

NOTE: Absolute freeform placement is an HTML viewer feature. The Adaptive Cards 1.6 transformer preserves the same tile content for host rendering, but Adaptive Cards itself does not provide absolute positioning.

## Quick Start

Requires Node.js 20.19 or later.

```bash
npm install
npm run validate   # validate example decks against schemas
npm run build      # compile TypeScript + bundle viewer
npm run serve      # start MCP App server on :3001
```

## MCP App Plugin

Adaptive Slide includes an MCP App plugin that transforms deck JSON into interactive presentations rendered inside MCP hosts (Claude Desktop, VS Code Copilot, etc.).

### How It Works

```
Deck JSON -> present-deck tool -> MCP Host -> Viewer (sandboxed iframe)
```

1. The MCP server registers a `present-deck` tool with a `ui://` resource URI
2. When called, the host fetches the self-contained viewer HTML
3. The viewer receives deck JSON via the MCP App postMessage protocol
4. Slides render with full navigation, keyboard shortcuts, and theming

### Running the Server

```bash
# Development (with tsx)
npm run dev

# Production
npm run build && npm run serve

# Custom port
PORT=8080 npm run serve
```

### Connecting to Claude Desktop

```bash
# Tunnel local server for Claude
npx cloudflared tunnel --url http://localhost:3001
# Then add the tunnel URL as a custom connector in Claude
```

### Tools

| Tool | Description |
|------|-------------|
| `present-deck` | Renders a deck as an interactive MCP App |
| `list-slides` | Returns slide metadata (titles, IDs) |

## Examples

| File | What it demonstrates |
|------|----------------------|
| [`examples/hello-world.deck.json`](examples/hello-world.deck.json) | Core curated tiles, grid layout, containers, viewer navigation |
| [`examples/layered-hero.deck.json`](examples/layered-hero.deck.json) | PowerPoint-style layered slides with `freeformPosition` and `zIndex` |
| [`examples/native-adaptive-card.deck.json`](examples/native-adaptive-card.deck.json) | Native Adaptive Cards bridge via `Tile.AdaptiveElement`, `Tile.AdaptiveCard`, and native actions |
| [`examples/training-dsl-101.deck.json`](examples/training-dsl-101.deck.json) | Multi-slide training flow with input tiles and host-handled submit |

If you author a deck under `examples/`, use `../schemas/deck.schema.json` for `$schema`. If you author a deck in the repository root, use `./schemas/deck.schema.json`.

## Schemas

All schemas live in `schemas/` and follow [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core).

| Schema | Description |
|--------|-------------|
| `deck.schema.json` | Root presentation schema |
| `slide.schema.json` | Individual slide definition |
| `tile.schema.json` | Base tile interface |
| `tiles/*.schema.json` | Built-in tile type schemas |

## Documentation

- [Published Docusaurus site](https://darbotlm.github.io/adaptive-slide/)
- [Technical Specification](docs/spec/technical-specification.md)
- [Wiki: Home](docs/wiki/Home.md)
- [Wiki: Architecture](docs/wiki/Architecture.md)
- [Wiki: Schema Reference](docs/wiki/Schema-Reference.md)
- [Wiki: Getting Started](docs/wiki/Getting-Started.md)
- [Wiki: MCP App Plugin](docs/wiki/MCP-App-Plugin.md)
- [Changelog](CHANGELOG.md)

## License

MIT
