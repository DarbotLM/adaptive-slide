/**
 * Default tile templates for the "Add tile" picker.
 *
 * Each entry returns a fresh tile object that round-trips to AC 1.6 and looks
 * reasonable as a starting point for editing.
 */

export const TILE_TEMPLATES = [
  {
    id: "text-heading",
    label: "Heading",
    create: () => ({ type: "Tile.Text", text: "New heading", style: "heading" }),
  },
  {
    id: "text-body",
    label: "Body text",
    create: () => ({ type: "Tile.Text", text: "Add your description here.", style: "body" }),
  },
  {
    id: "text-quote",
    label: "Quote",
    create: () => ({
      type: "Tile.Text",
      text: "“A great quote that stands out.”",
      style: "quote",
    }),
  },
  {
    id: "stat-block",
    label: "Stat block",
    create: () => ({
      type: "Tile.Container",
      style: "emphasis",
      items: [
        { type: "Tile.Text", text: "1.4M", style: "heading", alignment: "center" },
        { type: "Tile.Text", text: "Total users", style: "caption", alignment: "center" },
      ],
    }),
  },
  {
    id: "container-stack",
    label: "Container (stack)",
    create: () => ({
      type: "Tile.Container",
      style: "default",
      layout: "stack",
      items: [{ type: "Tile.Text", text: "Container content", style: "body" }],
    }),
  },
  {
    id: "container-row",
    label: "Container (row)",
    create: () => ({
      type: "Tile.Container",
      style: "default",
      layout: "row",
      items: [
        { type: "Tile.Text", text: "Left", style: "body" },
        { type: "Tile.Text", text: "Right", style: "body" },
      ],
    }),
  },
  {
    id: "image",
    label: "Image",
    create: () => ({
      type: "Tile.Image",
      url: "",
      altText: "Image",
      style: "default",
    }),
  },
  {
    id: "code",
    label: "Code block",
    create: () => ({
      type: "Tile.Code",
      language: "javascript",
      code: "console.log('hello, world');",
    }),
  },
  {
    id: "chart-bar",
    label: "Bar chart",
    create: () => ({
      type: "Tile.Chart",
      chartType: "bar",
      title: "Revenue by quarter",
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [{ label: "Revenue", values: [120, 180, 240, 310], color: "#50e6ff" }],
      },
    }),
  },
  {
    id: "chart-pie",
    label: "Pie chart",
    create: () => ({
      type: "Tile.Chart",
      chartType: "pie",
      title: "Traffic source",
      data: {
        labels: ["Search", "Direct", "Referral"],
        datasets: [{ label: "Sessions", values: [55, 28, 17] }],
      },
      colors: ["#50e6ff", "#34d399", "#fbbf24"],
    }),
  },
  {
    id: "media",
    label: "Media",
    create: () => ({
      type: "Tile.Media",
      sources: [{ url: "", mimeType: "video/mp4" }],
      altText: "Video",
    }),
  },
  {
    id: "input-text",
    label: "Text input",
    create: () => ({
      type: "Tile.Input.Text",
      id: `text-${Date.now().toString(36)}`,
      label: "Your answer",
      placeholder: "Type here…",
    }),
  },
  {
    id: "input-number",
    label: "Number input",
    create: () => ({
      type: "Tile.Input.Number",
      id: `num-${Date.now().toString(36)}`,
      label: "Quantity",
      min: 0,
    }),
  },
  {
    id: "input-choice",
    label: "Choice set",
    create: () => ({
      type: "Tile.Input.ChoiceSet",
      id: `choice-${Date.now().toString(36)}`,
      label: "Pick one",
      style: "compact",
      choices: [
        { title: "Option A", value: "a" },
        { title: "Option B", value: "b" },
        { title: "Option C", value: "c" },
      ],
    }),
  },
];
