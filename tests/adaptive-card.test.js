import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  slideToAdaptiveCard,
  deckToAdaptiveCards,
} from "../src/adaptiveCardTransformer.js";

const EXAMPLE_DECK = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../examples/hello-world.deck.json"), "utf-8"),
);

describe("Adaptive Cards 1.6 transformer", () => {
  it("produces a valid AdaptiveCard 1.6 envelope", () => {
    const card = slideToAdaptiveCard(EXAMPLE_DECK.slides[0], EXAMPLE_DECK);
    assert.equal(card.type, "AdaptiveCard");
    assert.equal(card.version, "1.6");
    assert.equal(card.$schema, "http://adaptivecards.io/schemas/adaptive-card.json");
    assert.ok(Array.isArray(card.body));
  });

  it("maps Tile.Text to TextBlock with style mapping", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        { type: "Tile.Text", text: "Heading", style: "heading", size: "large", weight: "bolder" },
        { type: "Tile.Text", text: "Caption", style: "caption", color: "accent" },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    const [headingBlock, captionBlock] = card.body;
    assert.equal(headingBlock.type, "TextBlock");
    assert.equal(headingBlock.style, "heading");
    assert.equal(headingBlock.size, "Large");
    assert.equal(headingBlock.weight, "Bolder");
    assert.equal(captionBlock.isSubtle, true);
    assert.equal(captionBlock.color, "Accent");
  });

  it("maps Tile.Code to CodeBlock with normalized language enum", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        { type: "Tile.Code", code: "console.log('hi')", language: "js" },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    assert.equal(card.body[0].type, "CodeBlock");
    assert.equal(card.body[0].codeSnippet, "console.log('hi')");
    assert.equal(card.body[0].language, "JavaScript");
  });

  it("falls back unknown languages to PlainText", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [{ type: "Tile.Code", code: "x", language: "brainfuck" }],
    };
    const card = slideToAdaptiveCard(slide);
    assert.equal(card.body[0].language, "PlainText");
  });

  it("converts Tile.Chart into TextBlock + FactSet container", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        {
          type: "Tile.Chart",
          chartType: "bar",
          title: "Revenue",
          data: {
            labels: ["Q1", "Q2"],
            datasets: [{ label: "USD", values: [10, 20] }],
          },
        },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    const container = card.body[0];
    assert.equal(container.type, "Container");
    assert.equal(container.items[0].type, "TextBlock");
    assert.equal(container.items[1].type, "FactSet");
    assert.deepEqual(container.items[1].facts, [
      { title: "Q1", value: "10" },
      { title: "Q2", value: "20" },
    ]);
  });

  it("wraps captioned images in a Container", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        {
          type: "Tile.Image",
          url: "https://example.com/x.png",
          altText: "alt",
          caption: "Caption text",
        },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    const container = card.body[0];
    assert.equal(container.type, "Container");
    assert.equal(container.items[0].type, "Image");
    assert.equal(container.items[1].type, "TextBlock");
    assert.equal(container.items[1].text, "Caption text");
  });

  it("converts grid layouts into ColumnSet rows", () => {
    const slide = {
      type: "AdaptiveSlide",
      layout: { mode: "grid", columns: 4 },
      body: [
        { type: "Tile.Text", text: "Title", gridPosition: { column: 1, row: 1, columnSpan: 4 } },
        { type: "Tile.Text", text: "Left", gridPosition: { column: 1, row: 2, columnSpan: 2 } },
        { type: "Tile.Text", text: "Right", gridPosition: { column: 3, row: 2, columnSpan: 2 } },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    assert.equal(card.body[0].type, "TextBlock", "row 1 collapses to single element");
    assert.equal(card.body[1].type, "ColumnSet");
    assert.equal(card.body[1].columns.length, 2);
    assert.equal(card.body[1].columns[0].width, "2");
  });

  it("renders Tile.Container with row layout as ColumnSet", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        {
          type: "Tile.Container",
          layout: "row",
          items: [
            { type: "Tile.Text", text: "Left" },
            { type: "Tile.Text", text: "Right" },
          ],
        },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    assert.equal(card.body[0].type, "ColumnSet");
    assert.equal(card.body[0].columns.length, 2);
  });

  it("drops Adaptive Slide-only navigation actions", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [{ type: "Tile.Text", text: "x" }],
      actions: [
        { type: "Action.OpenUrl", title: "Docs", url: "https://example.com/" },
        { type: "Action.GoToSlide", title: "Next", targetSlideId: "x" },
        { type: "Action.NextSlide", title: "Onward" },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    assert.equal(card.actions.length, 1);
    assert.equal(card.actions[0].type, "Action.OpenUrl");
  });

  it("deckToAdaptiveCards returns one card per slide", () => {
    const cards = deckToAdaptiveCards(EXAMPLE_DECK);
    assert.equal(cards.length, EXAMPLE_DECK.slides.length);
    for (const card of cards) {
      assert.equal(card.type, "AdaptiveCard");
      assert.equal(card.version, "1.6");
    }
  });
});
