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

  it("converts Tile.Media into a Media element with sources and poster", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        {
          type: "Tile.Media",
          sources: [{ url: "https://example.com/clip.mp4", mimeType: "video/mp4" }],
          poster: "https://example.com/poster.png",
          aspectRatio: "16:9",
        },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    const media = card.body[0];
    assert.equal(media.type, "Media");
    assert.equal(media.poster, "https://example.com/poster.png");
    assert.equal(media.sources.length, 1);
    assert.equal(media.sources[0].url, "https://example.com/clip.mp4");
    assert.equal(media.sources[0].mimeType, "video/mp4");
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

describe("Adaptive Card layout templates", async () => {
  const { templateDecks } = await import("../website/src/data/templateDecks.js");

  it("registers all eight canonical card layout patterns", () => {
    const layoutDecks = templateDecks.filter((t) => t.category === "Card layouts");
    const ids = layoutDecks.map((t) => t.id).sort();
    assert.deepEqual(ids, [
      "ac-layout-digest",
      "ac-layout-expandable",
      "ac-layout-form",
      "ac-layout-hero",
      "ac-layout-list",
      "ac-layout-media",
      "ac-layout-quick-input",
      "ac-layout-thumbnail",
    ]);
  });

  it("media layout deck transforms cleanly to AC 1.6 with a Media element", () => {
    const deck = templateDecks.find((t) => t.id === "ac-layout-media").deck;
    const cards = deckToAdaptiveCards(deck);
    assert.ok(cards.length >= 1, "expected at least one card");
    const showcase = cards[0];
    const media = showcase.body.find((node) => node.type === "Media")
      ?? showcase.body
        .flatMap((node) => (node.type === "ColumnSet" ? node.columns.flatMap((c) => c.items ?? []) : []))
        .find((node) => node?.type === "Media");
    assert.ok(media, "expected a Media element in the showcase card body");
    assert.ok(Array.isArray(media.sources) && media.sources.length > 0, "Media must carry sources");
  });
});

describe("Input tile transformer (Tile.Input.*)", () => {
  it("Tile.Input.Text becomes Input.Text with id, label, isMultiline, maxLength", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        {
          type: "Tile.Input.Text",
          id: "feedback",
          label: "Feedback",
          placeholder: "Tell us more",
          isMultiline: true,
          isRequired: true,
          errorMessage: "Required",
          maxLength: 200,
          style: "email",
        },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    const input = card.body[0];
    assert.equal(input.type, "Input.Text");
    assert.equal(input.id, "feedback");
    assert.equal(input.label, "Feedback");
    assert.equal(input.placeholder, "Tell us more");
    assert.equal(input.isMultiline, true);
    assert.equal(input.isRequired, true);
    assert.equal(input.errorMessage, "Required");
    assert.equal(input.maxLength, 200);
    assert.equal(input.style, "Email");
  });

  it("Tile.Input.Number becomes Input.Number with min/max/value", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        {
          type: "Tile.Input.Number",
          id: "qty",
          label: "Quantity",
          min: 1,
          max: 99,
          value: 5,
        },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    const input = card.body[0];
    assert.equal(input.type, "Input.Number");
    assert.equal(input.id, "qty");
    assert.equal(input.label, "Quantity");
    assert.equal(input.min, 1);
    assert.equal(input.max, 99);
    assert.equal(input.value, 5);
  });

  it("Tile.Input.ChoiceSet becomes Input.ChoiceSet with expanded style and choices", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [
        {
          type: "Tile.Input.ChoiceSet",
          id: "rating",
          label: "Rate this",
          style: "expanded",
          isRequired: true,
          choices: [
            { title: "1", value: "1" },
            { title: "2", value: "2" },
            { title: "3", value: "3" },
          ],
        },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    const input = card.body[0];
    assert.equal(input.type, "Input.ChoiceSet");
    assert.equal(input.id, "rating");
    assert.equal(input.style, "expanded");
    assert.equal(input.isRequired, true);
    assert.equal(input.choices.length, 3);
    assert.deepEqual(input.choices[0], { title: "1", value: "1" });
  });

  it("preserves Action.Submit with data payload on slides", () => {
    const slide = {
      type: "AdaptiveSlide",
      body: [{ type: "Tile.Text", text: "x" }],
      actions: [
        {
          type: "Action.Submit",
          title: "Send",
          data: { courseId: "training-dsl-101", action: "complete-and-credit" },
        },
      ],
    };
    const card = slideToAdaptiveCard(slide);
    assert.equal(card.actions.length, 1);
    assert.equal(card.actions[0].type, "Action.Submit");
    assert.equal(card.actions[0].title, "Send");
    assert.deepEqual(card.actions[0].data, {
      courseId: "training-dsl-101",
      action: "complete-and-credit",
    });
  });
});

describe("Training DSL 101 deck (8-card validation pattern)", () => {
  const deck = JSON.parse(
    readFileSync(resolve(import.meta.dirname, "../examples/training-dsl-101.deck.json"), "utf-8"),
  );

  it("contains exactly 8 slides (title + 6 modules + validation)", () => {
    assert.equal(deck.slides.length, 8);
    assert.equal(deck.slides[0].id, "card-1-title");
    assert.equal(deck.slides[7].id, "card-8-validation");
  });

  it("validation card carries 3 inputs and a single Action.Submit", () => {
    const validation = deck.slides[7];
    const inputs = validation.body.filter((tile) => tile.type?.startsWith("Tile.Input."));
    assert.equal(inputs.length, 3, "expected 3 input tiles on validation card");

    const ids = inputs.map((i) => i.id).sort();
    assert.deepEqual(ids, ["courseRating", "feedbackComment", "quizAnswer"]);

    assert.equal(validation.actions.length, 1);
    assert.equal(validation.actions[0].type, "Action.Submit");
    assert.equal(validation.actions[0].data.courseId, "training-dsl-101");
    assert.equal(validation.actions[0].data.action, "complete-and-credit");
  });

  it("transforms every slide to a valid AC 1.6 envelope", () => {
    const cards = deckToAdaptiveCards(deck);
    assert.equal(cards.length, 8);
    for (const card of cards) {
      assert.equal(card.type, "AdaptiveCard");
      assert.equal(card.version, "1.6");
    }
  });

  it("validation card AC 1.6 output includes Input.ChoiceSet, Input.Text, and Action.Submit", () => {
    const cards = deckToAdaptiveCards(deck);
    const validationCard = cards[7];
    const inputTypes = validationCard.body
      .filter((node) => node.type?.startsWith("Input."))
      .map((node) => node.type)
      .sort();
    assert.deepEqual(inputTypes, ["Input.ChoiceSet", "Input.ChoiceSet", "Input.Text"]);

    const submit = validationCard.actions.find((a) => a.type === "Action.Submit");
    assert.ok(submit, "expected an Action.Submit on validation card");
    assert.deepEqual(submit.data, {
      courseId: "training-dsl-101",
      action: "complete-and-credit",
    });
  });
});
