# Schema Reference

Complete reference for all Adaptive Slide JSON Schemas.

---

## Deck — `AdaptiveDeck`

**Schema:** [`schemas/deck.schema.json`](../../schemas/deck.schema.json)  
**Type discriminator:** `"AdaptiveDeck"`

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `$schema` | string | yes | — | Schema URI |
| `type` | `"AdaptiveDeck"` | yes | — | Type discriminator |
| `version` | string (semver) | yes | — | Deck format version |
| `metadata` | [DeckMetadata](#deckmetadata) | — | — | Presentation metadata |
| `theme` | [Theme](#theme) | — | — | Visual theme |
| `card` | [AdaptiveCardOptions](#adaptivecardoptions) | — | — | Default native Adaptive Cards root properties for transformed slides |
| `slides` | [AdaptiveSlide](#slide--adaptiveslide)[] | yes | — | Slide array (at least 1) |
| `defaults` | [SlideDefaults](#slidedefaults) | — | — | Default slide settings |

### DeckMetadata

| Property | Type | Description |
|----------|------|-------------|
| `title` | string | Presentation title |
| `description` | string | Summary |
| `author` | string | Author name |
| `created` | date-time | Creation timestamp |
| `modified` | date-time | Last modified timestamp |
| `tags` | string[] | Categorization tags |
| `language` | string | BCP 47 language tag |

### Theme

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Theme name |
| `primaryColor` | hex color | Primary brand color |
| `accentColor` | hex color | Accent/highlight color |
| `backgroundColor` | hex color | Default background |
| `fontFamily` | string | Default font family |
| `darkMode` | boolean | Enable dark mode (default: `false`) |

### SlideDefaults

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `layout` | `"stack"` \| `"grid"` \| `"freeform"` | `"stack"` | Default layout mode |
| `transition` | enum | `"none"` | Default slide transition |
| `padding` | `"none"` \| `"small"` \| `"default"` \| `"large"` | `"default"` | Default padding |

### AdaptiveCardOptions

Decks and slides can provide native Adaptive Cards root properties through `card`. Adaptive Slide still owns `type`, `$schema`, `body`, and `actions`; all other listed properties are applied to the generated AdaptiveCard.

| Property | Type | Description |
|----------|------|-------------|
| `version` | `"1.6"` | Adaptive Cards version emitted for transformed slides; other values are ignored at runtime |
| `refresh` | object | Native AC refresh definition |
| `authentication` | object | Native AC authentication definition |
| `selectAction` | `Action.OpenUrl` \| `Action.Submit` \| `Action.Execute` \| `Action.ToggleVisibility` | Native select action for the generated card. `Action.ShowCard` and Adaptive Slide navigation actions are not valid here |
| `fallbackText` | string | Text shown by hosts that cannot render the card |
| `backgroundImage` | string or object | Native AC background image |
| `minHeight` | string | Minimum card height |
| `rtl` | boolean | Right-to-left rendering |
| `speak` | string | Text-to-speech content |
| `lang` | string | BCP 47 language tag for the card |
| `verticalContentAlignment` | enum | top, center, or bottom |
| `metadata` | object | Native AC metadata object |

---

## Slide — `AdaptiveSlide`

**Schema:** [`schemas/slide.schema.json`](../../schemas/slide.schema.json)  
**Type discriminator:** `"AdaptiveSlide"`

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `"AdaptiveSlide"` | yes | Type discriminator |
| `id` | string | — | Unique slide ID |
| `title` | string | — | Slide title |
| `notes` | string | — | Speaker notes |
| `layout` | [LayoutConfig](#layoutconfig) | — | Layout configuration |
| `background` | [Background](#background) | — | Background settings |
| `card` | [AdaptiveCardOptions](#adaptivecardoptions) | — | Native Adaptive Cards root properties for this slide |
| `transition` | enum | — | Entry transition |
| `body` | [AdaptiveTile](#tiles)[] | yes | Tile array (the bucket) |
| `actions` | [Action](#actions)[] | — | Slide-level actions |

### LayoutConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | `"stack"` \| `"grid"` \| `"freeform"` | `"stack"` | Layout mode |
| `columns` | integer (1–12) | — | Grid column count |
| `gap` | enum | `"default"` | Gap between tiles |
| `horizontalAlignment` | enum | `"stretch"` | Horizontal alignment |
| `verticalAlignment` | enum | `"top"` | Vertical alignment |

### Background

Supports three exclusive options: `color`, `image`, or `gradient`.

### Actions

| Type | Description |
|------|-------------|
| `Action.OpenUrl` | Open a URL |
| `Action.Submit` | Submit data |
| `Action.Execute` | Execute a host verb with optional data |
| `Action.ToggleVisibility` | Toggle native element visibility |
| `Action.ShowCard` | Show a nested native AdaptiveCard |
| `Action.GoToSlide` | Navigate to slide by ID |
| `Action.NextSlide` | Go to next slide |
| `Action.PrevSlide` | Go to previous slide |

---

## Tiles

**Base schema:** [`schemas/tile.schema.json`](../../schemas/tile.schema.json)

All tiles share these base properties:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | string | — | Tile type discriminator (required) |
| `id` | string | — | Unique tile ID |
| `isVisible` | boolean | `true` | Visibility |
| `spacing` | enum | `"default"` | Spacing above |
| `separator` | boolean | `false` | Show separator line |
| `height` | enum | — | Native AC element height, auto or stretch |
| `requires` | object | — | Native AC feature requirements |
| `fallback` | `"drop"` or object | — | Native AC fallback behavior |
| `gridPosition` | object | — | Grid layout position |
| `freeformPosition` | object | — | Freeform layout position |

---

### `Tile.Text`

**Schema:** [`schemas/tiles/text-tile.schema.json`](../../schemas/tiles/text-tile.schema.json)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | string | — | Text content (markdown subset), required |
| `style` | enum | `"body"` | heading, subheading, body, caption, quote |
| `size` | enum | `"default"` | Text size |
| `weight` | enum | `"default"` | Font weight |
| `color` | enum | `"default"` | Semantic color |
| `horizontalAlignment` | enum | `"left"` | Text alignment |
| `wrap` | boolean | `true` | Enable text wrapping |
| `maxLines` | integer | — | Maximum visible lines |
| `fontType` | enum | `"default"` | default or monospace |

---

### `Tile.Image` / `Tile.Photo`

**Schema:** [`schemas/tiles/image-tile.schema.json`](../../schemas/tiles/image-tile.schema.json)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | enum | — | `Tile.Image` or semantic photo alias `Tile.Photo` |
| `url` | URI | — | Image URL, required |
| `altText` | string | — | Accessible alt text |
| `size` | enum | `"auto"` | Image sizing |
| `horizontalAlignment` | enum | `"center"` | Alignment |
| `backgroundColor` | string | — | Background behind image |
| `aspectRatio` | string | — | Ratio constraint (e.g. `"16:9"`) |
| `caption` | string | — | Caption text |
| `style` | enum | `"default"` | default, photo, avatar, logo |
| `fit` | enum | — | contain, cover, fill, none, scale-down |
| `height` | string | — | CSS/Adaptive Cards image height |
| `captionPosition` | enum | `"bottom"` | bottom or overlay |
| `borderRadius` | string | — | CSS border radius override |

---

### `Tile.Code`

**Schema:** [`schemas/tiles/code-tile.schema.json`](../../schemas/tiles/code-tile.schema.json)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `code` | string | — | Source code, required |
| `language` | string | — | Language for highlighting |
| `showLineNumbers` | boolean | `true` | Show line numbers |
| `startLineNumber` | integer | `1` | First line number |
| `highlightLines` | integer[] | — | Lines to emphasize |
| `maxHeight` | string | — | Max height (CSS) |
| `title` | string | — | Filename/title |
| `theme` | enum | `"auto"` | light, dark, auto |

---

### `Tile.Chart` and semantic chart aliases

**Schema:** [`schemas/tiles/chart-tile.schema.json`](../../schemas/tiles/chart-tile.schema.json)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | enum | — | `Tile.Chart`, `Tile.BarGraph`, `Tile.PieChart`, `Tile.DonutChart`, `Tile.LineGraph`, `Tile.AreaChart`, or `Tile.ScatterPlot` |
| `chartType` | enum | — | bar, bargraph, horizontalBar, line, linegraph, pie, piechart, donut, donutchart, area, areachart, scatter, scatterplot. Required only for `Tile.Chart`; semantic aliases infer it. |
| `title` | string | — | Chart title |
| `data` | [ChartData](#chartdata) | — | Chart dataset, required |
| `showLegend` | boolean | `true` | Show legend |
| `showGrid` | boolean | `true` | Show grid lines |
| `colors` | string[] | — | Custom color palette |
| `aspectRatio` | string | `"16:9"` | Aspect ratio |
| `orientation` | enum | `"vertical"` | vertical or horizontal bar graph layout |
| `holeSize` | number | `45` | Donut chart inner hole size as a percentage |

#### ChartData

| Property | Type | Description |
|----------|------|-------------|
| `labels` | string[] | Category labels |
| `datasets` | Dataset[] | Data series (at least 1) |

Each dataset: `{ label, values: number[], color }`

---

### `Tile.Media`

**Schema:** [`schemas/tiles/media-tile.schema.json`](../../schemas/tiles/media-tile.schema.json)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sources` | MediaSource[] | — | Media sources (at least 1), required |
| `poster` | URI | — | Poster/thumbnail |
| `altText` | string | — | Accessible text |
| `autoplay` | boolean | `false` | Auto-play |
| `loop` | boolean | `false` | Loop playback |
| `muted` | boolean | `false` | Muted by default |
| `aspectRatio` | string | `"16:9"` | Aspect ratio |

---

### `Tile.Container`

**Schema:** [`schemas/tiles/container-tile.schema.json`](../../schemas/tiles/container-tile.schema.json)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | AdaptiveTile[] | — | Nested tiles, required |
| `layout` | enum | `"stack"` | stack, row, wrap |
| `style` | enum | `"default"` | Container style |
| `bleed` | boolean | `false` | Bleed to parent edge |
| `minHeight` | string | — | Min height (CSS) |
| `verticalContentAlignment` | enum | `"top"` | Content alignment |
| `backgroundImage` | object | — | Background image |

---

### `Tile.Input.Date`

**Schema:** [`schemas/tiles/input-date-tile.schema.json`](../../schemas/tiles/input-date-tile.schema.json)

Compiles to native AC 1.6 `Input.Date`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | — | Input id, required |
| `label` | string | — | Input label |
| `placeholder` | string | — | Placeholder text |
| `value` | `YYYY-MM-DD` | — | Initial date |
| `min` | `YYYY-MM-DD` | — | Inclusive lower bound |
| `max` | `YYYY-MM-DD` | — | Inclusive upper bound |
| `isRequired` | boolean | `false` | Require a value |
| `errorMessage` | string | — | Validation error message |

### `Tile.Input.Time`

**Schema:** [`schemas/tiles/input-time-tile.schema.json`](../../schemas/tiles/input-time-tile.schema.json)

Compiles to native AC 1.6 `Input.Time`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | — | Input id, required |
| `label` | string | — | Input label |
| `placeholder` | string | — | Placeholder text |
| `value` | `HH:mm` | — | Initial time |
| `min` | `HH:mm` | — | Inclusive lower bound |
| `max` | `HH:mm` | — | Inclusive upper bound |
| `isRequired` | boolean | `false` | Require a value |
| `errorMessage` | string | — | Validation error message |

### `Tile.Input.Toggle`

**Schema:** [`schemas/tiles/input-toggle-tile.schema.json`](../../schemas/tiles/input-toggle-tile.schema.json)

Compiles to native AC 1.6 `Input.Toggle`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | — | Input id, required |
| `title` | string | — | Toggle text, required |
| `label` | string | — | Input label |
| `value` | string | — | Initial submitted value |
| `valueOn` | string | `"true"` | Submitted value when selected |
| `valueOff` | string | `"false"` | Submitted value when not selected |
| `wrap` | boolean | `true` | Wrap the title |
| `isRequired` | boolean | `false` | Require a value |
| `errorMessage` | string | — | Validation error message |

---

## Native Adaptive Cards bridge

Adaptive Slide includes the official AdaptiveCards schema bundle under `schemas/adaptivecards` and validates native bridge content against the patched AC 1.6 schema used by `npm run validate`.

### `Tile.AdaptiveElement`

**Schema:** [`schemas/tiles/adaptive-element-tile.schema.json`](../../schemas/tiles/adaptive-element-tile.schema.json)

Use this for any native AC 1.6 element not represented by a curated tile, including `Table`, `RichTextBlock`, `ImageSet`, `FactSet`, `ActionSet`, `Input.Date`, `Input.Time`, and `Input.Toggle`.

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
            "items": [{ "type": "TextBlock", "text": "Status" }]
          }
        ]
      }
    ]
  }
}
```

### `Tile.AdaptiveCard`

**Schema:** [`schemas/tiles/adaptive-card-tile.schema.json`](../../schemas/tiles/adaptive-card-tile.schema.json)

Use this to embed a complete native AdaptiveCard as a card-in-card section. The transformer emits the native card body as a `Container`; native card actions are appended as an `ActionSet`.
