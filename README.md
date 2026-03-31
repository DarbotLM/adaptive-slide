# Adaptive Slide

A schema-driven presentation builder/viewer built on the [Adaptive Cards](https://adaptivecards.io/) open card exchange format.

## Concept

Each **Slide** is an Adaptive Card bucket containing **Adaptive Tiles** — modular content blocks, each defined by its own tile card schema. This makes presentations portable, schema-validated, and renderable across any Adaptive Cards host.

```
Deck (Presentation)
  └── Slide[]                        ← sequential pages
       └── Adaptive Card Bucket      ← the slide IS an Adaptive Card
            └── Adaptive Tile[]       ← content blocks (text, image, code, chart…)
                 └── Tile Card Schema ← per-type JSON schema
```

## Architecture

| Layer | Purpose |
|-------|---------|
| **Deck** | Presentation container — metadata, theme, slide ordering |
| **Slide** | A single page — layout mode, background, transitions |
| **Bucket** | The Adaptive Card root — composes tiles into a renderable card |
| **Tile** | Atomic content unit — text, image, code, chart, media, container |

## Quick Start

```bash
npm install
npm run validate   # validate example decks against schemas
```

See [`examples/hello-world.deck.json`](examples/hello-world.deck.json) for a working example.

## Schemas

All schemas live in `schemas/` and follow [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core).

| Schema | Description |
|--------|-------------|
| `deck.schema.json` | Root presentation schema |
| `slide.schema.json` | Individual slide definition |
| `tile.schema.json` | Base tile interface |
| `tiles/*.schema.json` | Built-in tile type schemas |

## Documentation

- [Technical Specification](docs/spec/technical-specification.md)
- [Wiki: Home](docs/wiki/Home.md)
- [Wiki: Architecture](docs/wiki/Architecture.md)
- [Wiki: Schema Reference](docs/wiki/Schema-Reference.md)
- [Wiki: Getting Started](docs/wiki/Getting-Started.md)

## License

MIT
