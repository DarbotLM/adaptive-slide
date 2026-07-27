import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Test transformer
import { renderTile, renderSlide, renderDeck } from "../dist/transformer.js";

const EXAMPLE_DECK = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../examples/hello-world.deck.json"), "utf-8")
);

describe("Transformer", () => {
  it("renders a full deck to HTML", () => {
    const html = renderDeck(EXAMPLE_DECK);
    assert.ok(html.includes("Adaptive Slide"));
    assert.ok(html.includes("class=\"slide\""));
  });

  it("renders a text tile", () => {
    const tile = { type: "Tile.Text", text: "Hello **world**", style: "heading" };
    const html = renderTile(tile);
    assert.ok(html.includes("<strong>world</strong>"));
    assert.ok(html.includes("tile-text"));
  });

  it("renders an image tile", () => {
    const tile = { type: "Tile.Image", url: "https://example.com/img.png", altText: "test" };
    const html = renderTile(tile);
    assert.ok(html.includes("<img"));
    assert.ok(html.includes("example.com/img.png"));
  });

  it("renders a code tile", () => {
    const tile = { type: "Tile.Code", code: "const x = 1;", language: "javascript" };
    const html = renderTile(tile);
    assert.ok(html.includes("const x = 1;"));
    assert.ok(html.includes("<pre"));
  });

  it("renders a chart tile", () => {
    const tile = {
      type: "Tile.Chart",
      chartType: "bar",
      data: { labels: ["A", "B"], datasets: [{ values: [10, 20] }] },
    };
    const html = renderTile(tile);
    assert.ok(html.includes("tile-chart"));
  });

  it("renders expanded chart elements", () => {
    const pie = {
      type: "Tile.PieChart",
      data: { labels: ["A", "B"], datasets: [{ values: [30, 70] }] },
    };
    const line = {
      type: "Tile.LineGraph",
      data: { labels: ["Jan", "Feb"], datasets: [{ values: [4, 9] }] },
    };
    assert.ok(renderTile(pie).includes("conic-gradient"));
    assert.ok(renderTile(line).includes("<svg"));
  });

  it("renders a photo tile with overlay caption", () => {
    const tile = {
      type: "Tile.Photo",
      url: "https://example.com/photo.jpg",
      altText: "photo",
      aspectRatio: "4:3",
      caption: "Field visit",
      captionPosition: "overlay",
    };
    const html = renderTile(tile);
    assert.ok(html.includes("tile-image"));
    assert.ok(html.includes("object-fit:cover"));
    assert.ok(html.includes("Field visit"));
  });

  it("renders a container tile with nested tiles", () => {
    const tile = {
      type: "Tile.Container",
      layout: "row",
      items: [
        { type: "Tile.Text", text: "Left" },
        { type: "Tile.Text", text: "Right" },
      ],
    };
    const html = renderTile(tile);
    assert.ok(html.includes("tile-container"));
    assert.ok(html.includes("Left"));
    assert.ok(html.includes("Right"));
  });

  it("renders native Adaptive Card bridge tiles", () => {
    const elementTile = {
      type: "Tile.AdaptiveElement",
      element: { type: "TextBlock", text: "Native TextBlock", wrap: true },
    };
    const cardTile = {
      type: "Tile.AdaptiveCard",
      card: {
        type: "AdaptiveCard",
        version: "1.6",
        body: [{ type: "TextBlock", text: "Native card body" }],
        actions: [{ type: "Action.OpenUrl", title: "Open", url: "https://example.com/" }],
      },
    };

    assert.ok(renderTile(elementTile).includes("Native TextBlock"));
    const cardHtml = renderTile(cardTile);
    assert.ok(cardHtml.includes("Native card body"));
    assert.ok(cardHtml.includes("https://example.com/"));
  });

  it("sanitizes native action URLs and disables unsupported actions", () => {
    const html = renderTile({
      type: "Tile.AdaptiveCard",
      card: {
        type: "AdaptiveCard",
        body: [],
        actions: [
          { type: "Action.OpenUrl", title: "Unsafe", url: "javascript:alert(1)" },
          { type: "Action.Submit", title: "Submit" },
        ],
      },
    });
    assert.ok(!html.includes("javascript:"));
    assert.ok(html.includes('title="Action unavailable in this viewer"'));
    assert.ok(html.includes("disabled"));
  });

  it("renders the full native input tile set", () => {
    assert.ok(renderTile({ type: "Tile.Input.Date", id: "due", value: "2026-05-06" }).includes("type=\"date\""));
    assert.ok(renderTile({ type: "Tile.Input.Time", id: "time", value: "14:30" }).includes("type=\"time\""));
    assert.ok(renderTile({ type: "Tile.Input.Toggle", id: "ok", title: "OK" }).includes("type=\"checkbox\""));
  });

  it("preserves explicit freeform z-index values", () => {
    const html = renderTile({
      type: "Tile.Text",
      text: "Layered",
      freeformPosition: { x: 10, y: 10, width: 40, height: 20, zIndex: 0 },
    });
    assert.ok(html.includes("z-index: 0"));
  });

  it("hides invisible tiles", () => {
    const tile = { type: "Tile.Text", text: "Hidden", isVisible: false };
    const html = renderTile(tile);
    assert.equal(html, "");
  });

  it("renders a slide with grid layout", () => {
    const slide = {
      type: "AdaptiveSlide",
      layout: { mode: "grid", columns: 3 },
      body: [
        { type: "Tile.Text", text: "Cell", gridPosition: { column: 1, row: 1 } },
      ],
    };
    const html = renderSlide(slide);
    assert.ok(html.includes("grid-template-columns"));
    assert.ok(html.includes("repeat(3"));
  });

  it("renders background gradient", () => {
    const slide = {
      type: "AdaptiveSlide",
      background: { gradient: { type: "linear", colors: ["#ff0000", "#0000ff"], angle: 90 } },
      body: [{ type: "Tile.Text", text: "Gradient" }],
    };
    const html = renderSlide(slide);
    assert.ok(html.includes("linear-gradient"));
  });

  it("renders each slide in the example deck", () => {
    for (const slide of EXAMPLE_DECK.slides) {
      const html = renderSlide(slide, EXAMPLE_DECK.theme, EXAMPLE_DECK.defaults);
      assert.ok(html.length > 0, `Slide ${slide.id} should render`);
      assert.ok(html.includes("class=\"slide\""), `Slide ${slide.id} should have slide class`);
    }
  });
});

describe("Viewer HTML", () => {
  it("contains the MCP App protocol implementation", () => {
    const viewer = readFileSync(
      resolve(import.meta.dirname, "../src/plugins/mcp-app/viewer.html"),
      "utf-8"
    );
    assert.ok(viewer.includes("ui/ready"));
    assert.ok(viewer.includes("ui/toolResult"));
    assert.ok(viewer.includes("ui/initialize"));
    assert.ok(viewer.includes("AdaptiveDeck"));
    assert.ok(viewer.includes("TRANSFORMER"));
  });

  it("keeps the inlined viewer transformer aligned with native bridge tiles", () => {
    const viewer = readFileSync(
      resolve(import.meta.dirname, "../src/plugins/mcp-app/viewer.html"),
      "utf-8"
    );
    assert.ok(viewer.includes("Tile.AdaptiveElement"));
    assert.ok(viewer.includes("Tile.AdaptiveCard"));
    assert.ok(viewer.includes("Tile.Input.Date"));
    assert.ok(viewer.includes("renderAdaptiveElement"));
  });
});

describe("MCP Server module", () => {
  it("exports createServer function", async () => {
    const mod = await import("../dist/plugins/mcp-app/server.js");
    assert.ok(typeof mod.createServer === "function");
    assert.ok(typeof mod.startServer === "function");
  });

  it("creates a server instance", async () => {
    const { createServer } = await import("../dist/plugins/mcp-app/server.js");
    const server = createServer();
    assert.ok(server, "Server should be created");
  });
});
