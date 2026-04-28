---
id: schema-reference
title: Schema Reference
description: Adaptive Slide deck, slide, tile, action, background, and layout schema guide.
---

# Schema Reference

Adaptive Slide schemas use JSON Schema Draft 2020-12. The source files are maintained in the repository under [schemas](https://github.com/DarbotLM/adaptive-slide/tree/main/schemas).

## Deck

Source: [schemas/deck.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/deck.schema.json)

| Property | Type | Required | Notes |
| --- | --- | --- | --- |
| `$schema` | string | Yes | URI reference to the schema. |
| `type` | `"AdaptiveDeck"` | Yes | Deck discriminator. |
| `version` | semver string | Yes | Pattern allows `major.minor` or `major.minor.patch`. |
| `metadata` | object | No | Title, description, author, tags, language, and dates. |
| `theme` | object | No | Color, font, and dark-mode defaults. |
| `defaults` | object | No | Default layout, transition, and padding. |
| `slides` | `AdaptiveSlide[]` | Yes | Ordered slide array with at least one slide. |

## Slide

Source: [schemas/slide.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/slide.schema.json)

| Property | Type | Required | Notes |
| --- | --- | --- | --- |
| `type` | `"AdaptiveSlide"` | Yes | Slide discriminator. |
| `id` | string | No | Stable slide identifier. |
| `title` | string | No | Used by navigation and slide lists. |
| `notes` | string | No | Speaker notes. |
| `layout` | `LayoutConfig` | No | Overrides deck defaults. |
| `background` | `Background` | No | Color, image, or gradient. |
| `transition` | enum | No | `none`, `fade`, `slide-left`, `slide-right`, `slide-up`, or `zoom`. |
| `body` | `AdaptiveTile[]` | Yes | Ordered tile bucket. |
| `actions` | `Action[]` | No | Links, submit actions, and slide navigation. |

## Layout

| Property | Type | Notes |
| --- | --- | --- |
| `mode` | `stack`, `grid`, or `freeform` | Defaults to `stack`. |
| `columns` | integer, 1 through 12 | Used by grid layout. |
| `gap` | `none`, `small`, `default`, or `large` | Controls tile spacing in grid contexts. |
| `horizontalAlignment` | `left`, `center`, `right`, or `stretch` | Defaults to `stretch`. |
| `verticalAlignment` | `top`, `center`, or `bottom` | Defaults to `top`. |

## Background

| Shape | Required fields | Notes |
| --- | --- | --- |
| Color | `color` | Any string accepted by the schema. |
| Image | `image.url` | URL must validate as a URI. Optional `fillMode` and `opacity`. |
| Gradient | `gradient.type`, `gradient.colors` | At least two colors. Optional angle. |

## Tile base

Source: [schemas/tile.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/tile.schema.json)

All tile types share these base properties:

| Property | Type | Notes |
| --- | --- | --- |
| `type` | string | Discriminator. Required on every tile. |
| `id` | string | Unique within a slide when supplied. |
| `isVisible` | boolean | Defaults to `true`. Hidden tiles render as empty output. |
| `spacing` | enum | `none`, `small`, `default`, `medium`, `large`, `extraLarge`, or `padding`. |
| `separator` | boolean | Adds a separator before the tile when supported by the renderer. |
| `gridPosition` | object | `column`, `row`, `columnSpan`, and `rowSpan`. |
| `freeformPosition` | object | `x`, `y`, `width`, `height`, optional `rotation`, and optional `zIndex`. |

## Built-in tiles

| Tile | Required fields | Common optional fields | Source |
| --- | --- | --- | --- |
| `Tile.Text` | `type`, `text` | `style`, `size`, `weight`, `color`, `horizontalAlignment`, `wrap`, `maxLines`, `fontType` | [text-tile.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/tiles/text-tile.schema.json) |
| `Tile.Image` | `type`, `url` | `altText`, `size`, `horizontalAlignment`, `backgroundColor`, `aspectRatio`, `caption` | [image-tile.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/tiles/image-tile.schema.json) |
| `Tile.Code` | `type`, `code` | `language`, `showLineNumbers`, `startLineNumber`, `highlightLines`, `maxHeight`, `title`, `theme` | [code-tile.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/tiles/code-tile.schema.json) |
| `Tile.Chart` | `type`, `chartType`, `data` | `title`, `showLegend`, `showGrid`, `colors`, `aspectRatio` | [chart-tile.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/tiles/chart-tile.schema.json) |
| `Tile.Media` | `type`, `sources` | `poster`, `altText`, `autoplay`, `loop`, `muted`, `aspectRatio` | [media-tile.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/tiles/media-tile.schema.json) |
| `Tile.Container` | `type`, `items` | `layout`, `style`, `bleed`, `minHeight`, `verticalContentAlignment`, `backgroundImage` | [container-tile.schema.json](https://github.com/DarbotLM/adaptive-slide/blob/main/schemas/tiles/container-tile.schema.json) |

## Actions

| Action | Required fields | Additional fields |
| --- | --- | --- |
| `Action.OpenUrl` | `type`, `title` | `url` |
| `Action.Submit` | `type`, `title` | `data` |
| `Action.GoToSlide` | `type`, `title` | `targetSlideId` |
| `Action.NextSlide` | `type`, `title` | None |
| `Action.PrevSlide` | `type`, `title` | None |

## Validation command

```bash
npm run validate
```

The validation script is the fastest way to confirm that schema changes still accept the example deck.
