// Industry-tailored AdaptiveDeck templates.
// Each deck's slide[0] is a dashboard-style "showcase" slide rendered in the
// template card preview. Subsequent slides form a usable presentation flow.

const themes = {
  training: {
    name: "Training Indigo",
    primaryColor: "#6366f1",
    accentColor: "#a78bfa",
    backgroundColor: "#1e1b4b",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  healthcare: {
    name: "Healthcare Teal",
    primaryColor: "#10b981",
    accentColor: "#5eead4",
    backgroundColor: "#064e3b",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  financial: {
    name: "Financial Navy",
    primaryColor: "#3b82f6",
    accentColor: "#fbbf24",
    backgroundColor: "#0c1f4d",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  retail: {
    name: "Retail Coral",
    primaryColor: "#fb7185",
    accentColor: "#fbbf24",
    backgroundColor: "#5c1a3b",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  manufacturing: {
    name: "Manufacturing Steel",
    primaryColor: "#f97316",
    accentColor: "#facc15",
    backgroundColor: "#1c2128",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  publicSector: {
    name: "Public Sector Forest",
    primaryColor: "#16a34a",
    accentColor: "#fbbf24",
    backgroundColor: "#14532d",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  education: {
    name: "Education Purple",
    primaryColor: "#a855f7",
    accentColor: "#fbbf24",
    backgroundColor: "#3b1466",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  sales: {
    name: "Sales Emerald",
    primaryColor: "#10b981",
    accentColor: "#06b6d4",
    backgroundColor: "#064e3b",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  support: {
    name: "Support Crimson",
    primaryColor: "#ef4444",
    accentColor: "#fb7185",
    backgroundColor: "#4c0519",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  generated: {
    name: "Generated Cyan",
    primaryColor: "#06b6d4",
    accentColor: "#a78bfa",
    backgroundColor: "#082f49",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  project: {
    name: "Project Sky",
    primaryColor: "#0ea5e9",
    accentColor: "#38bdf8",
    backgroundColor: "#082f49",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  marketing: {
    name: "Marketing Rose",
    primaryColor: "#ec4899",
    accentColor: "#f97316",
    backgroundColor: "#500724",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  hr: {
    name: "Workforce Violet",
    primaryColor: "#8b5cf6",
    accentColor: "#f472b6",
    backgroundColor: "#2e1065",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  engineering: {
    name: "Engineering Green",
    primaryColor: "#22c55e",
    accentColor: "#67e8f9",
    backgroundColor: "#052e16",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  devops: {
    name: "DevOps Blue",
    primaryColor: "#3b82f6",
    accentColor: "#22d3ee",
    backgroundColor: "#111827",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  security: {
    name: "Security Red",
    primaryColor: "#dc2626",
    accentColor: "#f59e0b",
    backgroundColor: "#450a0a",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  legal: {
    name: "Legal Slate",
    primaryColor: "#64748b",
    accentColor: "#fbbf24",
    backgroundColor: "#111827",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  logistics: {
    name: "Logistics Teal",
    primaryColor: "#14b8a6",
    accentColor: "#fde047",
    backgroundColor: "#134e4a",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  energy: {
    name: "Energy Lime",
    primaryColor: "#84cc16",
    accentColor: "#facc15",
    backgroundColor: "#1a2e05",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  nonprofit: {
    name: "Nonprofit Blue",
    primaryColor: "#0ea5e9",
    accentColor: "#f472b6",
    backgroundColor: "#0c4a6e",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  hospitality: {
    name: "Hospitality Fuchsia",
    primaryColor: "#d946ef",
    accentColor: "#facc15",
    backgroundColor: "#581c87",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  realEstate: {
    name: "Real Estate Amber",
    primaryColor: "#f59e0b",
    accentColor: "#34d399",
    backgroundColor: "#451a03",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  insurance: {
    name: "Insurance Royal",
    primaryColor: "#2563eb",
    accentColor: "#93c5fd",
    backgroundColor: "#172554",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  telecom: {
    name: "Telecom Cyan",
    primaryColor: "#06b6d4",
    accentColor: "#a78bfa",
    backgroundColor: "#164e63",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  acPattern: {
    primaryColor: "#2563eb",
    accentColor: "#60a5fa",
    backgroundColor: "#0a1834",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
  trainingCourse: {
    name: "Training Course Emerald",
    primaryColor: "#10b981",
    accentColor: "#34d399",
    backgroundColor: "#022c22",
    fontFamily: "Segoe UI, sans-serif",
    darkMode: true,
  },
};

const defaultDeckSettings = {
  layout: "stack",
  transition: "fade",
  padding: "default",
};

function deck({ title, description, tags, slides, theme }) {
  return {
    $schema: "./schemas/deck.schema.json",
    type: "AdaptiveDeck",
    version: "1.0.0",
    metadata: {
      title,
      description,
      author: "Adaptive Slide Templates",
      tags,
      language: "en-US",
    },
    theme,
    defaults: defaultDeckSettings,
    slides,
  };
}

function gradientBackground(theme, angle = 135) {
  return {
    gradient: {
      type: "linear",
      colors: [theme.backgroundColor, theme.primaryColor],
      angle,
    },
  };
}

// KPI/stat tile: large value over small label.
// The renderer detects this shape (Container with two Text items where the
// first has style "heading" and the second "caption") and renders as a stat block.
function statTile({ value, label, style = "accent", gridPosition }) {
  return {
    type: "Tile.Container",
    style,
    gridPosition,
    items: [
      {
        type: "Tile.Text",
        text: value,
        style: "heading",
        size: "extraLarge",
        weight: "bolder",
        color: "light",
        horizontalAlignment: "center",
      },
      {
        type: "Tile.Text",
        text: label,
        style: "caption",
        color: "light",
        horizontalAlignment: "center",
      },
    ],
  };
}

// Status tile: small subheading title + body status text + optional caption.
function statusTile({ label, status, detail, style = "emphasis", gridPosition }) {
  const items = [
    {
      type: "Tile.Text",
      text: label,
      style: "subheading",
      weight: "bolder",
      color: "accent",
    },
    {
      type: "Tile.Text",
      text: status,
      style: "body",
      color: "light",
    },
  ];
  if (detail) {
    items.push({
      type: "Tile.Text",
      text: detail,
      style: "caption",
      color: "light",
    });
  }
  return { type: "Tile.Container", style, gridPosition, items };
}

// List tile: subheading title + bullet list body.
function listTile({ title, items, style = "default", gridPosition }) {
  return {
    type: "Tile.Container",
    style,
    gridPosition,
    items: [
      {
        type: "Tile.Text",
        text: title,
        style: "subheading",
        weight: "bolder",
        color: "accent",
      },
      {
        type: "Tile.Text",
        text: items.map((item) => `- ${item}`).join("\n"),
        style: "body",
        color: "light",
      },
    ],
  };
}

function chartTile({ title, chartType = "bar", labels, values, color = "#a78bfa", gridPosition }) {
  return {
    type: "Tile.Chart",
    chartType,
    title,
    gridPosition,
    data: {
      labels,
      datasets: [{ label: title, values, color }],
    },
  };
}

function headerTile({ text, gridPosition }) {
  return {
    type: "Tile.Text",
    text,
    style: "heading",
    size: "large",
    weight: "bolder",
    color: "light",
    gridPosition,
  };
}

function subheaderTile({ text, gridPosition }) {
  return {
    type: "Tile.Text",
    text,
    style: "subheading",
    color: "accent",
    gridPosition,
  };
}

// Dashboard slide with grid layout.
// Title row, optional subtitle row, then composed body of stat/chart/list tiles.
function dashboardSlide({ id, title, subtitle, columns = 4, body, theme }) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: gradientBackground(theme),
    layout: { mode: "grid", columns, gap: "small" },
    body: [
      headerTile({ text: title, gridPosition: { column: 1, row: 1, columnSpan: columns } }),
      ...(subtitle
        ? [subheaderTile({ text: subtitle, gridPosition: { column: 1, row: 2, columnSpan: columns } })]
        : []),
      ...body,
    ],
  };
}

function titleSlide(id, title, subtitle, theme) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: gradientBackground(theme),
    body: [
      {
        type: "Tile.Text",
        text: title,
        style: "heading",
        size: "extraLarge",
        weight: "bolder",
        color: "light",
        horizontalAlignment: "center",
      },
      {
        type: "Tile.Text",
        text: subtitle,
        style: "subheading",
        color: "light",
        horizontalAlignment: "center",
      },
    ],
  };
}

function agendaSlide(id, title, items) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    layout: { mode: "grid", columns: 2, gap: "default" },
    body: [
      {
        type: "Tile.Text",
        text: title,
        style: "heading",
        size: "large",
        gridPosition: { column: 1, row: 1, columnSpan: 2 },
      },
      ...items.map((item, index) => ({
        type: "Tile.Container",
        style: index % 2 === 0 ? "accent" : "emphasis",
        gridPosition: { column: (index % 2) + 1, row: Math.floor(index / 2) + 2 },
        items: [
          {
            type: "Tile.Text",
            text: item.label,
            style: "subheading",
            weight: "bolder",
            color: "accent",
          },
          { type: "Tile.Text", text: item.detail, style: "body" },
        ],
      })),
    ],
  };
}

function checklistSlide(id, title, items) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    body: [
      { type: "Tile.Text", text: title, style: "heading", size: "large" },
      {
        type: "Tile.Text",
        text: items.map((item) => `- ${item}`).join("\n"),
        style: "body",
      },
    ],
  };
}

function closeSlide(id, title, subtitle, theme) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: { color: theme.primaryColor },
    body: [
      {
        type: "Tile.Text",
        text: title,
        style: "heading",
        size: "extraLarge",
        weight: "bolder",
        color: "light",
        horizontalAlignment: "center",
      },
      {
        type: "Tile.Text",
        text: subtitle,
        style: "body",
        color: "light",
        horizontalAlignment: "center",
      },
    ],
  };
}

const DECK_SIZE_TIERS = [8, 16, 32, 64];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function narrativeSlide({ id, title, subtitle, theme, sections }) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: gradientBackground(theme),
    layout: { mode: "grid", columns: 2, gap: "default" },
    body: [
      headerTile({ text: title, gridPosition: { column: 1, row: 1, columnSpan: 2 } }),
      ...(subtitle
        ? [subheaderTile({ text: subtitle, gridPosition: { column: 1, row: 2, columnSpan: 2 } })]
        : []),
      ...sections.map((section, index) => ({
        type: "Tile.Container",
        style: section.style ?? (index % 2 === 0 ? "accent" : "emphasis"),
        gridPosition: { column: (index % 2) + 1, row: Math.floor(index / 2) + 3 },
        items: [
          {
            type: "Tile.Text",
            text: section.label,
            style: "subheading",
            weight: "bolder",
            color: "accent",
          },
          { type: "Tile.Text", text: section.detail, style: "body", color: "light" },
        ],
      })),
    ],
  };
}

function inputCommitmentSlide({ id, title, prompt, theme, submitData }) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: gradientBackground(theme),
    body: [
      { type: "Tile.Text", text: title, style: "heading", size: "large", color: "light" },
      { type: "Tile.Text", text: prompt, style: "subheading", color: "light" },
      {
        type: "Tile.Input.Number",
        id: `${id}-confidence`,
        label: "Confidence score",
        placeholder: "85",
        min: 0,
        max: 100,
        isRequired: true,
        errorMessage: "Enter a confidence score from 0 to 100.",
      },
      {
        type: "Tile.Input.ChoiceSet",
        id: `${id}-priority`,
        label: "Priority",
        value: "this-week",
        style: "compact",
        choices: [
          { title: "Today", value: "today" },
          { title: "This week", value: "this-week" },
          { title: "Monitor", value: "monitor" },
        ],
      },
      {
        type: "Tile.Input.Text",
        id: `${id}-notes`,
        label: "Decision notes",
        placeholder: "Capture owner, decision, or blocker.",
        isMultiline: true,
        maxLength: 500,
      },
    ],
    actions: [
      {
        type: "Action.Submit",
        title: "Submit update",
        data: submitData,
      },
    ],
  };
}

function scenarioSignalSlide({ id, title, theme, chart, status, actionList }) {
  const chartType = chart.chartType ?? "donut";
  return dashboardSlide({
    id,
    title,
    subtitle: "Composition, trend, and operating signal for the next decision.",
    theme,
    columns: 4,
    body: [
      chartTile({
        ...chart,
        chartType,
        gridPosition: { column: 1, row: 3, columnSpan: 2, rowSpan: 2 },
      }),
      statusTile({
        ...status,
        gridPosition: { column: 3, row: 3, columnSpan: 2 },
      }),
      listTile({
        ...actionList,
        title: "Signal response",
        gridPosition: { column: 3, row: 4, columnSpan: 2 },
      }),
    ],
  });
}

function scenarioRiskSlide({ id, title, theme, agendaItems, checklistItems }) {
  return narrativeSlide({
    id,
    title,
    subtitle: "Watchlist built from the agenda and operating checklist.",
    theme,
    sections: agendaItems.slice(0, 4).map((item, index) => ({
      label: `${item.label} risk`,
      detail: `${item.detail} Action: ${checklistItems[index % checklistItems.length]}.`,
      style: index === 0 ? "warning" : undefined,
    })),
  });
}

function scenarioCommitmentSlide({ id, title, theme, useCase }) {
  return inputCommitmentSlide({
    id,
    title,
    prompt: `Capture the next commitment for ${useCase}.`,
    theme,
    submitData: { templateId: id.replace(/-commitment$/, ""), action: "commitment" },
  });
}

function scenarioTierSlides({
  id,
  title,
  theme,
  chart,
  status,
  actionList,
  agendaItems,
  checklistItems,
  useCase,
}) {
  return [
    scenarioSignalSlide({
      id: `${id}-signal`,
      title: `${title} signal review`,
      theme,
      chart,
      status,
      actionList,
    }),
    scenarioRiskSlide({
      id: `${id}-risk`,
      title: `${title} risk register`,
      theme,
      agendaItems,
      checklistItems,
    }),
    scenarioCommitmentSlide({
      id: `${id}-commitment`,
      title: `${title} commitment capture`,
      theme,
      useCase,
    }),
  ];
}

// =============================================================================
// Adaptive Card layout-pattern helpers
//
// These factories mirror the eight "Card layouts" guidance from the official
// Adaptive Cards design best practices page (Hero, Thumbnail, List, Digest,
// Video/Media, Form, Quick input, Expandable). They produce visually faithful
// flipcards within the current renderer's capability set:
//
//   - Multi-column arrangements use slide-level grid (Container.layout="row"
//     is intentionally avoided because the website renderer ignores it).
//   - Mock buttons/inputs use container styles only (no className hooks exist
//     on the DSL).
//   - Tile.Media references a stable public sample so all three runtime
//     renderers (templates.js, viewer.html, src/transformer.ts) play cleanly.
// =============================================================================

const SAMPLE_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_VIDEO_POSTER = "https://darbotlm.github.io/adaptive-slide/img/social-card.svg";
const SAMPLE_HERO_IMAGE = "https://darbotlm.github.io/adaptive-slide/img/social-card.svg";
const SAMPLE_THUMB_IMAGE = "https://darbotlm.github.io/adaptive-slide/img/logo.svg";
const SAMPLE_AVATAR = "https://darbotlm.github.io/adaptive-slide/img/favicon.svg";

function buttonMock({ label, style = "accent", gridPosition }) {
  return {
    type: "Tile.Container",
    style,
    gridPosition,
    items: [
      {
        type: "Tile.Text",
        text: label,
        style: "subheading",
        weight: "bolder",
        color: "light",
        horizontalAlignment: "center",
      },
    ],
  };
}

function inputMock({ label, placeholder, gridPosition }) {
  return {
    type: "Tile.Container",
    style: "emphasis",
    gridPosition,
    items: [
      {
        type: "Tile.Text",
        text: label,
        style: "caption",
        color: "accent",
        weight: "bolder",
      },
      {
        type: "Tile.Text",
        text: placeholder,
        style: "body",
        color: "light",
      },
    ],
  };
}

function listRowMock({ avatarUrl, title, subtitle, meta, row, columns = 4 }) {
  return [
    {
      type: "Tile.Image",
      url: avatarUrl,
      altText: title,
      gridPosition: { column: 1, row, columnSpan: 1 },
    },
    {
      type: "Tile.Container",
      style: "default",
      gridPosition: { column: 2, row, columnSpan: columns - 2 },
      items: [
        { type: "Tile.Text", text: title, style: "subheading", weight: "bolder", color: "accent" },
        { type: "Tile.Text", text: subtitle, style: "caption", color: "light" },
      ],
    },
    {
      type: "Tile.Text",
      text: meta,
      style: "caption",
      color: "light",
      horizontalAlignment: "right",
      gridPosition: { column: columns, row, columnSpan: 1 },
    },
  ];
}

function digestArticle({ imageUrl, title, summary, gridPosition }) {
  return {
    type: "Tile.Container",
    style: "default",
    gridPosition,
    items: [
      { type: "Tile.Image", url: imageUrl, altText: title },
      { type: "Tile.Text", text: title, style: "subheading", weight: "bolder", color: "accent" },
      { type: "Tile.Text", text: summary, style: "caption", color: "light" },
    ],
  };
}

function mediaTile({ url, mimeType = "video/mp4", poster, gridPosition }) {
  const tile = {
    type: "Tile.Media",
    sources: [{ url, mimeType }],
    aspectRatio: "16:9",
    gridPosition,
  };
  if (poster) tile.poster = poster;
  return tile;
}

function whenToUseSlide({ id, title, when, dont, theme }) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: gradientBackground(theme),
    layout: { mode: "grid", columns: 2, gap: "default" },
    body: [
      headerTile({ text: title, gridPosition: { column: 1, row: 1, columnSpan: 2 } }),
      {
        type: "Tile.Container",
        style: "good",
        gridPosition: { column: 1, row: 2 },
        items: [
          { type: "Tile.Text", text: "When to use", style: "subheading", weight: "bolder", color: "accent" },
          {
            type: "Tile.Text",
            text: when.map((item) => `- ${item}`).join("\n"),
            style: "body",
            color: "light",
          },
        ],
      },
      {
        type: "Tile.Container",
        style: "attention",
        gridPosition: { column: 2, row: 2 },
        items: [
          { type: "Tile.Text", text: "Avoid when", style: "subheading", weight: "bolder", color: "accent" },
          {
            type: "Tile.Text",
            text: dont.map((item) => `- ${item}`).join("\n"),
            style: "body",
            color: "light",
          },
        ],
      },
    ],
  };
}

function anatomySlide({ id, title, parts, theme }) {
  return {
    type: "AdaptiveSlide",
    id,
    title,
    background: gradientBackground(theme),
    layout: { mode: "grid", columns: 2, gap: "default" },
    body: [
      headerTile({ text: "Anatomy", gridPosition: { column: 1, row: 1, columnSpan: 2 } }),
      ...parts.map((part, index) => ({
        type: "Tile.Container",
        style: index % 2 === 0 ? "accent" : "emphasis",
        gridPosition: { column: (index % 2) + 1, row: Math.floor(index / 2) + 2 },
        items: [
          { type: "Tile.Text", text: part.label, style: "subheading", weight: "bolder", color: "accent" },
          { type: "Tile.Text", text: part.detail, style: "caption", color: "light" },
        ],
      })),
    ],
  };
}

// -----------------------------------------------------------------------------
// Layout-specific showcase slides
// -----------------------------------------------------------------------------

function heroLayoutSlide(theme) {
  return dashboardSlide({
    id: "hero-showcase",
    title: "Hero layout",
    subtitle: "An immersive image carries the narrative; one primary action sits below.",
    columns: 4,
    body: [
      {
        type: "Tile.Image",
        url: SAMPLE_HERO_IMAGE,
        altText: "Featured story image",
        gridPosition: { column: 1, row: 3, columnSpan: 4, rowSpan: 2 },
      },
      {
        type: "Tile.Text",
        text: "Adaptive Cards 1.6 — design system release",
        style: "heading",
        size: "large",
        color: "light",
        weight: "bolder",
        gridPosition: { column: 1, row: 5, columnSpan: 4 },
      },
      {
        type: "Tile.Text",
        text: "A refined token palette, dark-mode parity, and motion guidance for embedded experiences across Teams, Outlook, and Power Apps.",
        style: "body",
        color: "light",
        gridPosition: { column: 1, row: 6, columnSpan: 4 },
      },
      buttonMock({ label: "Read article", style: "accent", gridPosition: { column: 1, row: 7, columnSpan: 2 } }),
      buttonMock({ label: "Share", style: "default", gridPosition: { column: 3, row: 7, columnSpan: 2 } }),
    ],
    theme,
  });
}

function thumbnailLayoutSlide(theme) {
  return dashboardSlide({
    id: "thumbnail-showcase",
    title: "Thumbnail layout",
    subtitle: "Compact image plus actionable message — perfect for dense feeds.",
    columns: 4,
    body: [
      {
        type: "Tile.Image",
        url: SAMPLE_THUMB_IMAGE,
        altText: "Thumbnail",
        gridPosition: { column: 1, row: 3, columnSpan: 1, rowSpan: 3 },
      },
      {
        type: "Tile.Text",
        text: "Build status: passing",
        style: "subheading",
        weight: "bolder",
        color: "accent",
        gridPosition: { column: 2, row: 3, columnSpan: 3 },
      },
      {
        type: "Tile.Text",
        text: "All 247 tests passed on main. Ready to promote to release/2025.11.",
        style: "body",
        color: "light",
        gridPosition: { column: 2, row: 4, columnSpan: 3 },
      },
      buttonMock({ label: "Open run", style: "accent", gridPosition: { column: 2, row: 5, columnSpan: 3 } }),
    ],
    theme,
  });
}

function listLayoutSlide(theme) {
  const rows = [
    listRowMock({
      avatarUrl: SAMPLE_AVATAR,
      title: "Jordan Stevens",
      subtitle: "Adaptive Cards renderer regression",
      meta: "Active",
      row: 3,
    }),
    listRowMock({
      avatarUrl: SAMPLE_AVATAR,
      title: "Priya Raman",
      subtitle: "Schema 1.6 validation gap",
      meta: "Triage",
      row: 4,
    }),
    listRowMock({
      avatarUrl: SAMPLE_AVATAR,
      title: "Marco Lopez",
      subtitle: "Power Apps host parity audit",
      meta: "Backlog",
      row: 5,
    }),
    listRowMock({
      avatarUrl: SAMPLE_AVATAR,
      title: "Aiko Tanaka",
      subtitle: "Localization tokens for date/time",
      meta: "Ready",
      row: 6,
    }),
  ];
  return dashboardSlide({
    id: "list-showcase",
    title: "List layout",
    subtitle: "Pick one item from a scannable list — keep each row terse.",
    columns: 4,
    body: rows.flat(),
    theme,
  });
}

function digestLayoutSlide(theme) {
  return dashboardSlide({
    id: "digest-showcase",
    title: "Digest layout",
    subtitle: "News round-up — three article cards in one glance.",
    columns: 3,
    body: [
      digestArticle({
        imageUrl: SAMPLE_HERO_IMAGE,
        title: "Renderer parity",
        summary: "Outlook, Teams, and Power Apps now share a single host-config baseline.",
        gridPosition: { column: 1, row: 3 },
      }),
      digestArticle({
        imageUrl: SAMPLE_HERO_IMAGE,
        title: "Authoring guide",
        summary: "Updated DSL playbook with grid layout patterns and accessibility rules.",
        gridPosition: { column: 2, row: 3 },
      }),
      digestArticle({
        imageUrl: SAMPLE_HERO_IMAGE,
        title: "MCP server",
        summary: "Drop-in npx server brings Adaptive Slide tools to any MCP-aware client.",
        gridPosition: { column: 3, row: 3 },
      }),
    ],
    theme,
  });
}

function mediaLayoutSlide(theme) {
  return dashboardSlide({
    id: "media-showcase",
    title: "Video and media layout",
    subtitle: "Combine a media element with supporting text and one clear action.",
    columns: 4,
    body: [
      mediaTile({
        url: SAMPLE_VIDEO_URL,
        poster: SAMPLE_VIDEO_POSTER,
        gridPosition: { column: 1, row: 3, columnSpan: 4, rowSpan: 2 },
      }),
      {
        type: "Tile.Text",
        text: "Adaptive Cards in 90 seconds — what they are and where they render.",
        style: "body",
        color: "light",
        gridPosition: { column: 1, row: 5, columnSpan: 4 },
      },
      buttonMock({ label: "Open transcript", style: "accent", gridPosition: { column: 1, row: 6, columnSpan: 2 } }),
      buttonMock({ label: "Save for later", style: "default", gridPosition: { column: 3, row: 6, columnSpan: 2 } }),
    ],
    theme,
  });
}

function formLayoutSlide(theme) {
  return dashboardSlide({
    id: "form-showcase",
    title: "Form layout",
    subtitle: "Collect a small set of structured inputs to file a task or ticket.",
    columns: 4,
    body: [
      inputMock({
        label: "Title",
        placeholder: "Describe the issue in one line",
        gridPosition: { column: 1, row: 3, columnSpan: 4 },
      }),
      inputMock({
        label: "Severity",
        placeholder: "Select severity",
        gridPosition: { column: 1, row: 4, columnSpan: 2 },
      }),
      inputMock({
        label: "Assignee",
        placeholder: "Pick a teammate",
        gridPosition: { column: 3, row: 4, columnSpan: 2 },
      }),
      inputMock({
        label: "Steps to reproduce",
        placeholder: "1. Open ...\n2. Click ...\n3. Observe ...",
        gridPosition: { column: 1, row: 5, columnSpan: 4 },
      }),
      buttonMock({ label: "Submit", style: "accent", gridPosition: { column: 1, row: 6, columnSpan: 2 } }),
      buttonMock({ label: "Cancel", style: "default", gridPosition: { column: 3, row: 6, columnSpan: 2 } }),
    ],
    theme,
  });
}

function quickInputLayoutSlide(theme) {
  return dashboardSlide({
    id: "quick-input-showcase",
    title: "Quick input layout",
    subtitle: "One prompt, one input, one send — for in-the-moment replies.",
    columns: 4,
    body: [
      {
        type: "Tile.Text",
        text: "How would you rate the new schema validator?",
        style: "subheading",
        weight: "bolder",
        color: "accent",
        gridPosition: { column: 1, row: 3, columnSpan: 4 },
      },
      inputMock({
        label: "Your reply",
        placeholder: "Type a short answer ...",
        gridPosition: { column: 1, row: 4, columnSpan: 3 },
      }),
      buttonMock({ label: "Send", style: "accent", gridPosition: { column: 4, row: 4, columnSpan: 1 } }),
    ],
    theme,
  });
}

function expandableLayoutSlide(theme) {
  return dashboardSlide({
    id: "expandable-showcase",
    title: "Expandable layout",
    subtitle: "Lead with the summary; reveal extra detail only on demand.",
    columns: 4,
    body: [
      {
        type: "Tile.Text",
        text: "Deployment passed all gates",
        style: "subheading",
        weight: "bolder",
        color: "accent",
        gridPosition: { column: 1, row: 3, columnSpan: 4 },
      },
      {
        type: "Tile.Text",
        text: "Build 2025.11.04 promoted to release with 0 critical findings.",
        style: "body",
        color: "light",
        gridPosition: { column: 1, row: 4, columnSpan: 4 },
      },
      buttonMock({ label: "Show details", style: "accent", gridPosition: { column: 1, row: 5, columnSpan: 4 } }),
      {
        type: "Tile.Container",
        style: "emphasis",
        gridPosition: { column: 1, row: 6, columnSpan: 4 },
        items: [
          { type: "Tile.Text", text: "Coverage", style: "caption", color: "accent", weight: "bolder" },
          { type: "Tile.Text", text: "Lines 92.4% — Branches 88.1% — Functions 95.0%", style: "body", color: "light" },
          { type: "Tile.Text", text: "Security", style: "caption", color: "accent", weight: "bolder" },
          { type: "Tile.Text", text: "0 critical, 1 medium (false positive)", style: "body", color: "light" },
        ],
      },
    ],
    theme,
  });
}

export function createPromptDeck(prompt) {
  const normalizedPrompt = prompt.trim() || "Custom adaptive card training deck";
  const title =
    normalizedPrompt.split(/\s+/).slice(0, 8).join(" ").replace(/[^\w\s-]/g, "").trim() ||
    "Generated Adaptive Slide Deck";

  return deck({
    title,
    description: `Starter deck generated from prompt: ${normalizedPrompt}`,
    tags: ["generated", "starter", "adaptive-slide"],
    theme: themes.generated,
    slides: [
      dashboardSlide({
        id: "generated-dashboard",
        title,
        subtitle: "Generated starter — replace placeholder content with your own.",
        theme: themes.generated,
        columns: 4,
        body: [
          statTile({ value: "4", label: "Slides", style: "accent", gridPosition: { column: 1, row: 3 } }),
          statTile({ value: "5", label: "Tile types", style: "emphasis", gridPosition: { column: 2, row: 3 } }),
          statTile({ value: "JSON", label: "Schema", style: "good", gridPosition: { column: 3, row: 3 } }),
          statTile({ value: "MCP", label: "Renderable", style: "accent", gridPosition: { column: 4, row: 3 } }),
          listTile({
            title: "Build flow",
            items: [
              "Refine prompt and regenerate",
              "Edit JSON in your tool of choice",
              "Validate against the schema",
              "Render in MCP host or web",
            ],
            gridPosition: { column: 1, row: 4, columnSpan: 4 },
          }),
        ],
      }),
      titleSlide("generated-title", title, "Adaptive Slide starter from natural language", themes.generated),
      agendaSlide("generated-plan", "Suggested slide plan", [
        { label: "Audience", detail: "Who the deck is for and the decision they need to make." },
        { label: "Outcome", detail: "Behavior, knowledge, or action the deck should drive." },
        { label: "Content", detail: "Convert ideas into text, chart, code, image, and container tiles." },
        { label: "Validation", detail: "Run the deck through the schema validator before publishing." },
      ]),
      closeSlide(
        "generated-close",
        "Ready to customize",
        "Download the JSON, edit it, and render with Adaptive Slide.",
        themes.generated,
      ),
    ],
  });
}

function scenarioTemplate({
  id,
  title,
  category,
  useCase,
  audience,
  summary,
  tags,
  theme,
  deckTitle,
  deckDescription,
  dashboardTitle,
  dashboardSubtitle,
  stats,
  chart,
  status,
  actionList,
  agendaTitle,
  agendaItems,
  checklistTitle,
  checklistItems,
  closeTitle,
  closeSubtitle,
}) {
  return {
    id,
    title,
    category,
    useCase,
    audience,
    summary,
    tags,
    deck: deck({
      title: deckTitle,
      description: deckDescription,
      tags,
      theme,
      slides: [
        dashboardSlide({
          id: `${id}-dashboard`,
          title: dashboardTitle,
          subtitle: dashboardSubtitle,
          theme,
          columns: 4,
          body: [
            ...stats.map((stat, index) => (
              statTile({ ...stat, gridPosition: { column: index + 1, row: 3 } })
            )),
            chartTile({ ...chart, gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 } }),
            statusTile({ ...status, gridPosition: { column: 3, row: 4, columnSpan: 2 } }),
            listTile({ ...actionList, gridPosition: { column: 3, row: 5, columnSpan: 2 } }),
          ],
        }),
        titleSlide(`${id}-title`, title, useCase, theme),
        agendaSlide(`${id}-agenda`, agendaTitle, agendaItems),
        ...scenarioTierSlides({
          id,
          title,
          theme,
          chart,
          status,
          actionList,
          agendaItems,
          checklistItems,
          useCase,
        }),
        checklistSlide(`${id}-checklist`, checklistTitle, checklistItems),
        closeSlide(`${id}-close`, closeTitle, closeSubtitle, theme),
      ],
    }),
  };
}

const enterpriseScenarioTemplates = [
  scenarioTemplate({
    id: "project-portfolio",
    title: "Executive Project Portfolio",
    category: "Project Management",
    useCase: "Portfolio governance, steering committees, and dependency review",
    audience: "PMO leads, sponsors, delivery executives, workstream owners",
    summary:
      "Executive portfolio dashboard with schedule health, budget risk, blockers, and sponsor actions.",
    tags: ["project-management", "portfolio", "governance"],
    theme: themes.project,
    deckTitle: "Q3 Portfolio Governance Review",
    deckDescription: "Portfolio-level delivery health, risks, dependencies, and leadership actions.",
    dashboardTitle: "Q3 Portfolio Health - Week 8",
    dashboardSubtitle: "24 programs - 6 strategic bets - steering committee pack",
    stats: [
      { value: "81%", label: "On track", style: "good" },
      { value: "24", label: "Active projects", style: "accent" },
      { value: "$3.8M", label: "Budget at risk", style: "warning" },
      { value: "6", label: "Critical blockers", style: "attention" },
    ],
    chart: {
      title: "Health by portfolio",
      labels: ["Core", "Growth", "Compliance", "Platform"],
      values: [92, 76, 84, 68],
      color: "#38bdf8",
    },
    status: {
      label: "Top dependency",
      status: "ERP migration - vendor interface certification delayed",
      detail: "Owner assigned - decision needed on parallel test window",
      style: "warning",
    },
    actionList: {
      title: "Sponsor actions",
      items: [
        "Approve extra QA week for ERP integration",
        "Resolve data owner conflict for finance feed",
        "Confirm release train scope cut by Friday",
      ],
    },
    agendaTitle: "Governance cadence",
    agendaItems: [
      { label: "Scope", detail: "Confirm funded outcomes, change requests, and no-go items." },
      { label: "Risk", detail: "Review cross-program risks that require sponsor decisions." },
      { label: "Dependency", detail: "Track unblockers, decision owners, and due dates." },
      { label: "Commit", detail: "Record portfolio decisions and publish the action register." },
    ],
    checklistTitle: "Portfolio review checklist",
    checklistItems: [
      "Refresh health score from source systems",
      "Confirm blocker owners and due dates",
      "Attach finance variance notes",
      "Publish decisions within one business day",
    ],
    closeTitle: "Portfolio aligned",
    closeSubtitle: "Turn steering decisions into tracked delivery actions.",
  }),
  scenarioTemplate({
    id: "marketing-campaign",
    title: "Integrated Campaign Performance",
    category: "Marketing",
    useCase: "Campaign performance review and demand-generation optimization",
    audience: "Marketing leaders, demand generation, sales development, agencies",
    summary:
      "Campaign dashboard with reach, click-through, cost per lead, MQL lift, and channel actions.",
    tags: ["marketing", "campaign", "demand-generation"],
    theme: themes.marketing,
    deckTitle: "Spring Launch Campaign Performance",
    deckDescription: "Integrated marketing campaign metrics, channel mix, and optimization actions.",
    dashboardTitle: "Spring Launch - Week 5",
    dashboardSubtitle: "Paid search - social - webinar - partner syndication",
    stats: [
      { value: "2.8M", label: "Reach", style: "accent" },
      { value: "4.7%", label: "CTR", style: "good" },
      { value: "$42", label: "Cost per lead", style: "emphasis" },
      { value: "+18%", label: "MQL lift", style: "good" },
    ],
    chart: {
      title: "Funnel conversion %",
      labels: ["Reach", "Clicks", "MQL", "SQL"],
      values: [100, 47, 18, 9],
      color: "#f97316",
    },
    status: {
      label: "Optimization focus",
      status: "Partner syndication CPL is 31% above plan",
      detail: "Shift spend to webinar retargeting until creative refresh lands",
      style: "warning",
    },
    actionList: {
      title: "Next experiments",
      items: [
        "A/B test proof-point headline on paid search",
        "Retarget webinar attendees with case-study offer",
        "Pause two low-quality partner placements",
      ],
    },
    agendaTitle: "Campaign operating rhythm",
    agendaItems: [
      { label: "Audience", detail: "Review segment fit, exclusions, and intent signals." },
      { label: "Creative", detail: "Compare hook, offer, and proof-point performance." },
      { label: "Channel", detail: "Rebalance spend against quality and conversion." },
      { label: "Sales handoff", detail: "Check routing, SLA adherence, and feedback loop." },
    ],
    checklistTitle: "Optimization checklist",
    checklistItems: [
      "Refresh source-of-truth campaign tags",
      "Pull rejected lead reasons from sales",
      "Confirm budget reallocation approval",
      "Update creative backlog with test results",
    ],
    closeTitle: "Campaign tuned",
    closeSubtitle: "Move budget toward the segments that convert and document the learning loop.",
  }),
  scenarioTemplate({
    id: "hr-workforce",
    title: "Workforce Planning Review",
    category: "Human Resources",
    useCase: "Headcount planning, engagement review, and retention risk tracking",
    audience: "HR business partners, talent leaders, finance partners, managers",
    summary:
      "Workforce dashboard with engagement, open roles, time-to-fill, attrition risk, and hiring actions.",
    tags: ["human-resources", "workforce", "talent"],
    theme: themes.hr,
    deckTitle: "Workforce Planning - Product Org",
    deckDescription: "Talent health, hiring progress, and retention risk dashboard for planning reviews.",
    dashboardTitle: "Product Org Workforce Snapshot",
    dashboardSubtitle: "312 employees - Q3 hiring plan - engagement pulse",
    stats: [
      { value: "92%", label: "Engagement", style: "good" },
      { value: "14", label: "Open roles", style: "accent" },
      { value: "38d", label: "Time to fill", style: "warning" },
      { value: "7", label: "Retention risks", style: "attention" },
    ],
    chart: {
      title: "Headcount by function",
      labels: ["PM", "Design", "Eng", "Ops"],
      values: [42, 36, 198, 36],
      color: "#f472b6",
    },
    status: {
      label: "Hot spot",
      status: "Senior engineering backfill risk in platform team",
      detail: "Two finalists active - comp exception review due Thursday",
      style: "attention",
    },
    actionList: {
      title: "People actions",
      items: [
        "Approve Q3 critical-role exception list",
        "Schedule manager retention calibration",
        "Publish interview panel refresh plan",
      ],
    },
    agendaTitle: "Workforce planning flow",
    agendaItems: [
      { label: "Demand", detail: "Connect business goals to funded role demand." },
      { label: "Supply", detail: "Review internal mobility, backfills, and candidate health." },
      { label: "Risk", detail: "Identify retention signals and role coverage gaps." },
      { label: "Action", detail: "Assign owners for hiring, retention, and enablement moves." },
    ],
    checklistTitle: "HRBP prep checklist",
    checklistItems: [
      "Refresh headcount actuals and requisition state",
      "Validate retention risks with managers",
      "Confirm finance alignment on open roles",
      "Document offers, exceptions, and due dates",
    ],
    closeTitle: "Talent plan ready",
    closeSubtitle: "Align hiring moves with retention actions before the next planning gate.",
  }),
  scenarioTemplate({
    id: "engineering-release",
    title: "Engineering Release Readiness",
    category: "Engineering",
    useCase: "Release readiness, quality gates, and defect triage",
    audience: "Engineering managers, release leads, QA, product owners",
    summary:
      "Release dashboard with test pass rate, open defects, code coverage, freeze date, and triage actions.",
    tags: ["engineering", "release", "quality"],
    theme: themes.engineering,
    deckTitle: "Release 2026.05 Readiness Review",
    deckDescription: "Release health, quality gates, risks, and launch readiness actions.",
    dashboardTitle: "Release 2026.05 - Readiness",
    dashboardSubtitle: "Feature freeze in 4 days - production ring 0 candidate",
    stats: [
      { value: "96%", label: "Test pass", style: "good" },
      { value: "12", label: "Open defects", style: "warning" },
      { value: "4d", label: "To freeze", style: "accent" },
      { value: "89%", label: "Coverage", style: "good" },
    ],
    chart: {
      title: "Defects by severity",
      labels: ["Critical", "High", "Medium", "Low"],
      values: [0, 2, 7, 3],
      color: "#67e8f9",
    },
    status: {
      label: "Release risk",
      status: "Payment retry telemetry missing in canary ring",
      detail: "Owner: reliability - fix queued behind trace schema update",
      style: "warning",
    },
    actionList: {
      title: "Triage actions",
      items: [
        "Close two high-severity defects or cut scope",
        "Run rollback rehearsal in staging",
        "Publish launch notes to support by Thursday",
      ],
    },
    agendaTitle: "Release gate review",
    agendaItems: [
      { label: "Scope", detail: "Validate committed features, cuts, and known limitations." },
      { label: "Quality", detail: "Review automated suites, manual coverage, and defect aging." },
      { label: "Reliability", detail: "Confirm telemetry, rollback, and alert readiness." },
      { label: "Launch", detail: "Approve go/no-go, comms, and post-release watch." },
    ],
    checklistTitle: "Launch readiness checklist",
    checklistItems: [
      "Build promoted from signed release branch",
      "Canary metrics are within guardrails",
      "Rollback steps rehearsed and documented",
      "Support and customer success notes published",
    ],
    closeTitle: "Release decision set",
    closeSubtitle: "Keep defects visible and make the launch call with evidence.",
  }),
  scenarioTemplate({
    id: "devops-service-health",
    title: "Service Health Operations",
    category: "DevOps",
    useCase: "SLO review, incident trends, and deployment operations",
    audience: "SRE, platform engineering, incident commanders, service owners",
    summary:
      "Service health dashboard with SLO, incidents, MTTR, deployment throughput, and reliability actions.",
    tags: ["devops", "sre", "service-health"],
    theme: themes.devops,
    deckTitle: "Platform Service Health Review",
    deckDescription: "SLO adherence, incident response, deployment flow, and reliability actions.",
    dashboardTitle: "Platform Health - Last 7 Days",
    dashboardSubtitle: "API gateway - identity - billing - notifications",
    stats: [
      { value: "99.95%", label: "SLO", style: "good" },
      { value: "3", label: "Incidents", style: "warning" },
      { value: "18m", label: "MTTR", style: "accent" },
      { value: "42", label: "Deploys", style: "good" },
    ],
    chart: {
      title: "Deploys by service",
      labels: ["API", "Auth", "Billing", "Notify"],
      values: [16, 8, 7, 11],
      color: "#22d3ee",
    },
    status: {
      label: "Reliability focus",
      status: "Notification queue lag breached burn-rate alert twice",
      detail: "Shard rebalance planned - alert tuning needed after deploy",
      style: "warning",
    },
    actionList: {
      title: "Ops actions",
      items: [
        "Patch noisy alert route for notification lag",
        "Complete post-incident review for INC-913",
        "Run game day for auth dependency failure",
      ],
    },
    agendaTitle: "Service review flow",
    agendaItems: [
      { label: "Signals", detail: "Review SLI trends, alert fidelity, and customer impact." },
      { label: "Incidents", detail: "Check timelines, mitigations, and action item closure." },
      { label: "Change", detail: "Correlate deploys, config changes, and regressions." },
      { label: "Capacity", detail: "Validate headroom, queue depth, and scaling policies." },
    ],
    checklistTitle: "Weekly SRE checklist",
    checklistItems: [
      "Close incident action items older than 14 days",
      "Review burn-rate alerts for noise and misses",
      "Confirm runbooks have current owners",
      "Publish reliability summary to service owners",
    ],
    closeTitle: "Service posture clear",
    closeSubtitle: "Use SLO evidence to fund reliability work before customers feel pain.",
  }),
  scenarioTemplate({
    id: "security-posture",
    title: "Security Posture Review",
    category: "Security",
    useCase: "Vulnerability management, identity controls, and compliance readiness",
    audience: "Security leaders, engineering owners, compliance, IT operations",
    summary:
      "Security dashboard with critical findings, high vulnerabilities, MFA coverage, patch SLA, and remediation actions.",
    tags: ["security", "vulnerability-management", "compliance"],
    theme: themes.security,
    deckTitle: "Security Posture - Monthly Review",
    deckDescription: "Vulnerability, identity, remediation, and compliance posture dashboard.",
    dashboardTitle: "Security Posture - May Review",
    dashboardSubtitle: "Enterprise estate - identity - endpoints - cloud workloads",
    stats: [
      { value: "0", label: "Critical open", style: "good" },
      { value: "9", label: "High vulns", style: "attention" },
      { value: "87%", label: "MFA coverage", style: "warning" },
      { value: "24h", label: "Patch SLA", style: "accent" },
    ],
    chart: {
      title: "Findings by domain",
      labels: ["Identity", "Cloud", "Endpoint", "App"],
      values: [18, 26, 34, 21],
      color: "#f59e0b",
    },
    status: {
      label: "Priority risk",
      status: "Legacy service principals without owner attestation",
      detail: "Remediation sprint approved - app owners due Friday",
      style: "attention",
    },
    actionList: {
      title: "Remediation actions",
      items: [
        "Enforce MFA exception review for admins",
        "Assign owner to all stale workload identities",
        "Patch internet-facing high findings this week",
      ],
    },
    agendaTitle: "Posture review flow",
    agendaItems: [
      { label: "Exposure", detail: "Prioritize externally reachable and privileged assets." },
      { label: "Controls", detail: "Review identity, device, and network control coverage." },
      { label: "Remediation", detail: "Track owners, exceptions, and missed SLAs." },
      { label: "Evidence", detail: "Capture audit artifacts and compliance decisions." },
    ],
    checklistTitle: "Security review checklist",
    checklistItems: [
      "Verify high-risk exceptions have expiry dates",
      "Confirm owners for critical assets",
      "Export evidence for audit package",
      "Publish remediation burndown to engineering",
    ],
    closeTitle: "Risk posture actionable",
    closeSubtitle: "Convert findings into owner-backed remediation plans with deadlines.",
  }),
  scenarioTemplate({
    id: "legal-contract",
    title: "Contract Review Operations",
    category: "Legal",
    useCase: "Legal operations queue, contract risk review, and clause escalation",
    audience: "Legal operations, counsel, procurement, sales operations",
    summary:
      "Legal operations dashboard with open matters, escalations, review aging, exposure, and contract actions.",
    tags: ["legal", "contracts", "operations"],
    theme: themes.legal,
    deckTitle: "Contract Operations Queue Review",
    deckDescription: "Legal matter queue, SLA health, exposure, and clause escalation dashboard.",
    dashboardTitle: "Contract Queue - Week 19",
    dashboardSubtitle: "Commercial agreements - procurement - privacy - renewals",
    stats: [
      { value: "42", label: "Open matters", style: "accent" },
      { value: "6", label: "Escalations", style: "attention" },
      { value: "9d", label: "Avg review", style: "warning" },
      { value: "$1.8M", label: "Exposure", style: "emphasis" },
    ],
    chart: {
      title: "Matters by stage",
      labels: ["Intake", "Review", "Redline", "Approve"],
      values: [11, 16, 9, 6],
      color: "#fbbf24",
    },
    status: {
      label: "Clause watch",
      status: "Non-standard liability cap requested on enterprise renewal",
      detail: "Counsel review complete - business owner decision needed",
      style: "warning",
    },
    actionList: {
      title: "Queue actions",
      items: [
        "Batch low-risk NDAs for standard approval",
        "Escalate privacy addendum to data protection officer",
        "Update playbook for liability fallback language",
      ],
    },
    agendaTitle: "Legal ops cadence",
    agendaItems: [
      { label: "Intake", detail: "Classify matter type, urgency, and business owner." },
      { label: "Risk", detail: "Flag non-standard clauses and policy exceptions." },
      { label: "SLA", detail: "Review aging, blockers, and counsel load." },
      { label: "Decision", detail: "Document approvals, fallback positions, and next steps." },
    ],
    checklistTitle: "Contract review checklist",
    checklistItems: [
      "Confirm current template and fallback terms",
      "Attach business justification for exceptions",
      "Log privacy and security dependencies",
      "Update matter status after counsel decision",
    ],
    closeTitle: "Contract queue controlled",
    closeSubtitle: "Keep non-standard risk visible and move routine work through standard paths.",
  }),
  scenarioTemplate({
    id: "logistics-fulfillment",
    title: "Fulfillment Network Briefing",
    category: "Logistics",
    useCase: "Warehouse, carrier, and route operations review",
    audience: "Logistics managers, warehouse leads, carrier managers, customer operations",
    summary:
      "Fulfillment dashboard with on-time rate, dwell time, carrier exceptions, order volume, and network actions.",
    tags: ["logistics", "fulfillment", "supply-chain"],
    theme: themes.logistics,
    deckTitle: "Fulfillment Network - Daily Briefing",
    deckDescription: "Warehouse throughput, carrier health, and exception management dashboard.",
    dashboardTitle: "Fulfillment Network - Today",
    dashboardSubtitle: "4 DCs - 18 carriers - next-day promise window",
    stats: [
      { value: "94%", label: "On time", style: "good" },
      { value: "1.8d", label: "Dwell", style: "accent" },
      { value: "12", label: "Exceptions", style: "warning" },
      { value: "8.7K", label: "Orders", style: "emphasis" },
    ],
    chart: {
      title: "Route performance %",
      labels: ["North", "East", "South", "West"],
      values: [96, 91, 88, 97],
      color: "#fde047",
    },
    status: {
      label: "Carrier watch",
      status: "West regional carrier missed pickup cutoff twice",
      detail: "Backup carrier staged for priority shipments",
      style: "warning",
    },
    actionList: {
      title: "Network actions",
      items: [
        "Move priority orders to backup carrier",
        "Clear 38 aged picks before noon cutoff",
        "Confirm dock appointment slots for DC-3",
      ],
    },
    agendaTitle: "Daily logistics rhythm",
    agendaItems: [
      { label: "Demand", detail: "Review order volume, priority cohorts, and promise exposure." },
      { label: "Capacity", detail: "Check labor, dock, inventory, and carrier constraints." },
      { label: "Exceptions", detail: "Triage aged picks, missed pickups, and damaged shipments." },
      { label: "Recovery", detail: "Assign reroutes, customer comms, and prevention actions." },
    ],
    checklistTitle: "Fulfillment checklist",
    checklistItems: [
      "Confirm cutoff capacity at each DC",
      "Escalate carrier misses before service window closes",
      "Prioritize aged picks by customer promise",
      "Update customer operations on high-impact delays",
    ],
    closeTitle: "Network actions assigned",
    closeSubtitle: "Protect customer promise by moving exceptions before the cutoff window.",
  }),
  scenarioTemplate({
    id: "energy-grid",
    title: "Energy Operations Snapshot",
    category: "Energy",
    useCase: "Grid operations, generation mix, and reliability briefing",
    audience: "Energy operations, field crews, reliability engineers, executives",
    summary:
      "Energy operations dashboard with load, uptime, alerts, renewable mix, and reliability actions.",
    tags: ["energy", "grid", "operations"],
    theme: themes.energy,
    deckTitle: "Regional Grid Operations Snapshot",
    deckDescription: "Load, generation mix, reliability alerts, and operating actions for grid review.",
    dashboardTitle: "Regional Grid - Morning Snapshot",
    dashboardSubtitle: "North region - peak forecast - field crew readiness",
    stats: [
      { value: "78 MW", label: "Current load", style: "accent" },
      { value: "96%", label: "Asset uptime", style: "good" },
      { value: "14", label: "Open alerts", style: "warning" },
      { value: "21%", label: "Renewable mix", style: "good" },
    ],
    chart: {
      title: "Generation mix %",
      labels: ["Solar", "Wind", "Gas", "Hydro"],
      values: [18, 21, 47, 14],
      color: "#facc15",
    },
    status: {
      label: "Reliability watch",
      status: "Substation 12 transformer temperature trending high",
      detail: "Crew dispatched - load transfer plan ready if threshold hits",
      style: "warning",
    },
    actionList: {
      title: "Operations actions",
      items: [
        "Stage crew for substation 12 inspection",
        "Publish peak load conservation message",
        "Review reserve margin before afternoon forecast",
      ],
    },
    agendaTitle: "Grid briefing flow",
    agendaItems: [
      { label: "Load", detail: "Compare current, forecast, and historical demand." },
      { label: "Supply", detail: "Review generation mix, reserve margin, and constraints." },
      { label: "Reliability", detail: "Triage alerts, asset risk, and crew availability." },
      { label: "Communications", detail: "Align public updates and stakeholder notifications." },
    ],
    checklistTitle: "Grid ops checklist",
    checklistItems: [
      "Validate telemetry from critical substations",
      "Confirm field crew dispatch windows",
      "Check reserve margin under peak scenario",
      "Prepare customer message if conservation is needed",
    ],
    closeTitle: "Grid posture set",
    closeSubtitle: "Keep reliability actions tied to live telemetry and clear operating thresholds.",
  }),
  scenarioTemplate({
    id: "nonprofit-fundraising",
    title: "Fundraising Campaign Progress",
    category: "Nonprofit",
    useCase: "Donor campaign, grant pipeline, and event planning review",
    audience: "Development leaders, program directors, board members, volunteers",
    summary:
      "Fundraising dashboard with raised dollars, goal progress, donor count, events, and outreach actions.",
    tags: ["nonprofit", "fundraising", "donor-engagement"],
    theme: themes.nonprofit,
    deckTitle: "Annual Fund Campaign Progress",
    deckDescription: "Fundraising goal progress, donor engagement, channel mix, and board actions.",
    dashboardTitle: "Annual Fund - Mid Campaign",
    dashboardSubtitle: "Community health initiative - board review pack",
    stats: [
      { value: "$840K", label: "Raised", style: "good" },
      { value: "67%", label: "Goal", style: "accent" },
      { value: "1,240", label: "Donors", style: "emphasis" },
      { value: "18", label: "Events", style: "good" },
    ],
    chart: {
      title: "Gifts by channel %",
      labels: ["Major", "Digital", "Events", "Grants"],
      values: [44, 23, 18, 15],
      color: "#f472b6",
    },
    status: {
      label: "Gap to close",
      status: "$410K remaining; major donor renewals are pacing late",
      detail: "Board call list assigned - first update due Monday",
      style: "warning",
    },
    actionList: {
      title: "Development actions",
      items: [
        "Launch matched-gift email to lapsed donors",
        "Assign top 25 renewal calls to board members",
        "Submit two grant LOIs by Friday",
      ],
    },
    agendaTitle: "Fundraising review flow",
    agendaItems: [
      { label: "Goal", detail: "Review total, restricted, unrestricted, and pledge progress." },
      { label: "Pipeline", detail: "Track donors, grants, events, and renewal likelihood." },
      { label: "Story", detail: "Align impact proof, beneficiary voice, and board talking points." },
      { label: "Action", detail: "Assign outreach owners and reporting commitments." },
    ],
    checklistTitle: "Campaign checklist",
    checklistItems: [
      "Refresh donor segmentation and pledge status",
      "Confirm board outreach assignments",
      "Update impact story and proof points",
      "Publish weekly progress note to volunteers",
    ],
    closeTitle: "Campaign focused",
    closeSubtitle: "Use the dashboard to connect donor outreach with program impact.",
  }),
  scenarioTemplate({
    id: "hospitality-guest-ops",
    title: "Guest Experience Operations",
    category: "Hospitality",
    useCase: "Hotel operations, guest satisfaction, and occupancy review",
    audience: "General managers, front office, housekeeping, revenue management",
    summary:
      "Hospitality dashboard with NPS, occupancy, ADR, VIP arrivals, and service recovery actions.",
    tags: ["hospitality", "guest-experience", "operations"],
    theme: themes.hospitality,
    deckTitle: "Property Operations - Daily Guest Briefing",
    deckDescription: "Daily hotel operations dashboard for arrivals, satisfaction, rooms, and service recovery.",
    dashboardTitle: "Downtown Property - Today",
    dashboardSubtitle: "412 rooms - convention block - VIP arrivals",
    stats: [
      { value: "91", label: "Guest NPS", style: "good" },
      { value: "84%", label: "Occupancy", style: "accent" },
      { value: "$218", label: "ADR", style: "emphasis" },
      { value: "5", label: "VIP arrivals", style: "warning" },
    ],
    chart: {
      title: "Bookings by segment",
      labels: ["Business", "Leisure", "Group", "OTA"],
      values: [38, 24, 26, 12],
      color: "#facc15",
    },
    status: {
      label: "Service watch",
      status: "Housekeeping turn time above target on premium floors",
      detail: "Runner added - front desk delaying early check-in promises",
      style: "warning",
    },
    actionList: {
      title: "Guest actions",
      items: [
        "Pre-assign rooms for VIP arrivals by noon",
        "Recover three detractor stays before checkout",
        "Confirm banquet staffing for evening event",
      ],
    },
    agendaTitle: "Daily property rhythm",
    agendaItems: [
      { label: "Arrivals", detail: "Review VIPs, groups, room readiness, and special requests." },
      { label: "Service", detail: "Track guest feedback, recovery cases, and staffing constraints." },
      { label: "Revenue", detail: "Monitor occupancy, ADR, pickup, and channel mix." },
      { label: "Handoff", detail: "Align front office, housekeeping, F&B, and engineering." },
    ],
    checklistTitle: "Manager checklist",
    checklistItems: [
      "Confirm room readiness for priority arrivals",
      "Review open service recovery cases",
      "Validate staffing against event schedule",
      "Publish shift notes before handoff",
    ],
    closeTitle: "Guest day aligned",
    closeSubtitle: "Use the briefing to turn operational signals into proactive service recovery.",
  }),
  scenarioTemplate({
    id: "real-estate-listing",
    title: "Real Estate Listing Pipeline",
    category: "Real Estate",
    useCase: "Listing portfolio review, offer tracking, and market activity",
    audience: "Brokerage leaders, agents, transaction coordinators, investors",
    summary:
      "Real estate dashboard with pipeline value, active listings, days on market, offers, and follow-up actions.",
    tags: ["real-estate", "listings", "pipeline"],
    theme: themes.realEstate,
    deckTitle: "Metro Listing Pipeline Review",
    deckDescription: "Listing pipeline, offer activity, market signals, and agent actions dashboard.",
    dashboardTitle: "Metro Listings - Weekly Review",
    dashboardSubtitle: "Residential portfolio - premium segment - agent team",
    stats: [
      { value: "$48M", label: "Pipeline", style: "good" },
      { value: "12", label: "Active listings", style: "accent" },
      { value: "21d", label: "Avg DOM", style: "warning" },
      { value: "6", label: "Offers", style: "good" },
    ],
    chart: {
      title: "Pipeline by stage",
      labels: ["Prep", "Live", "Offer", "Close"],
      values: [8, 12, 6, 4],
      color: "#34d399",
    },
    status: {
      label: "Listing watch",
      status: "Oak Ridge property passed 30 days with declining showing rate",
      detail: "Pricing review scheduled - new media package ready",
      style: "warning",
    },
    actionList: {
      title: "Agent actions",
      items: [
        "Schedule seller pricing conversation",
        "Refresh digital campaign for Oak Ridge",
        "Confirm inspection windows for two accepted offers",
      ],
    },
    agendaTitle: "Listing review cadence",
    agendaItems: [
      { label: "Market", detail: "Review comps, days on market, and buyer activity." },
      { label: "Pipeline", detail: "Track prep, live, offer, closing, and fallout risk." },
      { label: "Marketing", detail: "Assess content, channels, showings, and follow-up." },
      { label: "Close", detail: "Confirm contingencies, documents, and client commitments." },
    ],
    checklistTitle: "Listing checklist",
    checklistItems: [
      "Update comps and pricing notes",
      "Review showing feedback within 24 hours",
      "Confirm offer deadlines and contingency dates",
      "Publish seller update with next actions",
    ],
    closeTitle: "Pipeline moving",
    closeSubtitle: "Keep market signals, pricing decisions, and client follow-up in one view.",
  }),
  scenarioTemplate({
    id: "insurance-claims",
    title: "Insurance Claims Operations",
    category: "Insurance",
    useCase: "Claims queue management, reserve exposure, and cycle-time review",
    audience: "Claims leaders, adjusters, operations, actuarial partners",
    summary:
      "Claims operations dashboard with open claims, straight-through rate, cycle time, reserve exposure, and queue actions.",
    tags: ["insurance", "claims", "operations"],
    theme: themes.insurance,
    deckTitle: "Claims Operations - Weekly Review",
    deckDescription: "Claims queue health, automation rate, reserve exposure, and adjuster actions.",
    dashboardTitle: "Claims Operations - Week 19",
    dashboardSubtitle: "Auto - property - liability - catastrophe watch",
    stats: [
      { value: "328", label: "Open claims", style: "accent" },
      { value: "73%", label: "Straight through", style: "good" },
      { value: "2.4d", label: "Cycle time", style: "emphasis" },
      { value: "$920K", label: "Reserved", style: "warning" },
    ],
    chart: {
      title: "Claims by type",
      labels: ["Auto", "Property", "Liability", "Cat"],
      values: [142, 96, 54, 36],
      color: "#93c5fd",
    },
    status: {
      label: "Queue risk",
      status: "Property claims in coastal region aging past SLA",
      detail: "Adjuster pool rebalanced - vendor inspection backlog remains",
      style: "warning",
    },
    actionList: {
      title: "Claims actions",
      items: [
        "Assign aged property claims to overflow adjusters",
        "Validate reserve movement on high-exposure files",
        "Update customer scripts for catastrophe queue",
      ],
    },
    agendaTitle: "Claims review flow",
    agendaItems: [
      { label: "Intake", detail: "Review volume, triage quality, and automation exceptions." },
      { label: "SLA", detail: "Track aging, adjuster load, and vendor dependencies." },
      { label: "Reserve", detail: "Watch exposure changes, litigation flags, and approvals." },
      { label: "Customer", detail: "Measure updates, complaints, and service recovery needs." },
    ],
    checklistTitle: "Claims ops checklist",
    checklistItems: [
      "Refresh aging buckets by type and region",
      "Review large-loss reserve changes",
      "Confirm adjuster load balance",
      "Publish customer update guidance",
    ],
    closeTitle: "Claims queue focused",
    closeSubtitle: "Balance automation, service quality, and reserve control across the queue.",
  }),
  scenarioTemplate({
    id: "telecom-network",
    title: "Telecom Network Operations",
    category: "Telecommunications",
    useCase: "Network reliability, outage response, and planned maintenance briefing",
    audience: "NOC leaders, field operations, customer care, network engineering",
    summary:
      "Network operations dashboard with uptime, latency, fiber cuts, maintenance windows, and field actions.",
    tags: ["telecommunications", "network", "operations"],
    theme: themes.telecom,
    deckTitle: "Network Operations - Regional Review",
    deckDescription: "Network uptime, traffic, incidents, maintenance windows, and field operations.",
    dashboardTitle: "Network Operations - Region West",
    dashboardSubtitle: "Wireless core - transport - access network - customer care",
    stats: [
      { value: "99.98%", label: "Uptime", style: "good" },
      { value: "17ms", label: "Latency", style: "accent" },
      { value: "6", label: "Fiber cuts", style: "warning" },
      { value: "24", label: "Planned works", style: "emphasis" },
    ],
    chart: {
      title: "Traffic by region %",
      labels: ["Metro", "Coastal", "Inland", "Rural"],
      values: [42, 21, 24, 13],
      color: "#a78bfa",
    },
    status: {
      label: "NOC watch",
      status: "Metro north packet loss spike linked to carrier handoff",
      detail: "Vendor bridge active - reroute ready if loss exceeds threshold",
      style: "warning",
    },
    actionList: {
      title: "Network actions",
      items: [
        "Notify care teams for metro north watchlist",
        "Stage field crew for coastal splice repair",
        "Reconfirm maintenance blackout for enterprise accounts",
      ],
    },
    agendaTitle: "Network ops flow",
    agendaItems: [
      { label: "Health", detail: "Review uptime, latency, packet loss, and capacity." },
      { label: "Incidents", detail: "Track active events, vendor bridges, and field dispatch." },
      { label: "Maintenance", detail: "Validate planned works, blackout windows, and rollback." },
      { label: "Customer", detail: "Align care scripts, impact messages, and account watchlists." },
    ],
    checklistTitle: "NOC briefing checklist",
    checklistItems: [
      "Confirm active alarms against customer impact",
      "Validate field crew ETA and access requirements",
      "Check maintenance windows for account conflicts",
      "Publish status update to care and account teams",
    ],
    closeTitle: "Network watch aligned",
    closeSubtitle: "Tie network signals to customer impact and field-ready response actions.",
  }),
];

function tieredSectionSlide({ id, title, family, section, sectionIndex, tier, theme }) {
  return narrativeSlide({
    id,
    title,
    subtitle: `${family} section ${sectionIndex + 1} of ${tier - 4}`,
    theme,
    sections: [
      {
        label: section.label,
        detail: section.detail,
        style: sectionIndex % 3 === 0 ? "accent" : undefined,
      },
      {
        label: "Evidence",
        detail: `Use source metrics, owner notes, and customer context to support ${section.label.toLowerCase()}.`,
      },
      {
        label: "Decision",
        detail: "State the decision, recommendation, or facilitation prompt this slide should drive.",
      },
      {
        label: "Follow-through",
        detail: "Capture owner, date, dependency, and validation signal before moving on.",
      },
    ],
  });
}

function buildTieredSlides({ id, title, family, tier, theme, sections, chartType = "bar" }) {
  const normalizedSections = sections.length > 0
    ? sections
    : [{ label: "Context", detail: "Frame the audience, decision, and expected outcome." }];
  const contentSlideCount = tier - 4;

  return [
    dashboardSlide({
      id: `${id}-showcase`,
      title,
      subtitle: `${tier}-slide ${family} template`,
      theme,
      columns: 4,
      body: [
        statTile({ value: String(tier), label: "Slides", style: "accent", gridPosition: { column: 1, row: 3 } }),
        statTile({ value: String(normalizedSections.length), label: "Sections", style: "good", gridPosition: { column: 2, row: 3 } }),
        statTile({ value: "4", label: "Tier size", style: "emphasis", gridPosition: { column: 3, row: 3 } }),
        statTile({ value: "1", label: "Decision path", style: "warning", gridPosition: { column: 4, row: 3 } }),
        chartTile({
          title: "Content emphasis",
          chartType,
          labels: ["Context", "Evidence", "Decision", "Action"],
          values: [25, 35, 20, 20],
          color: theme.accentColor,
          gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
        }),
        listTile({
          title: "Reusable structure",
          items: normalizedSections.slice(0, 4).map((section) => section.label),
          gridPosition: { column: 3, row: 4, columnSpan: 2, rowSpan: 2 },
        }),
      ],
    }),
    titleSlide(`${id}-title`, title, `${family} framework for Adaptive Slide`, theme),
    agendaSlide(
      `${id}-agenda`,
      `${family} flow`,
      normalizedSections.slice(0, 4).map((section) => ({
        label: section.label,
        detail: section.detail,
      })),
    ),
    ...Array.from({ length: contentSlideCount }, (_, index) => {
      const section = normalizedSections[index % normalizedSections.length];
      const sectionNumber = String(index + 1).padStart(2, "0");
      return tieredSectionSlide({
        id: `${id}-section-${sectionNumber}`,
        title: `${section.label} - ${sectionNumber}`,
        family,
        section,
        sectionIndex: index,
        tier,
        theme,
      });
    }),
    closeSlide(
      `${id}-close`,
      `${family} ready`,
      `Use this ${tier}-slide deck as a reusable ${family.toLowerCase()} backbone.`,
      theme,
    ),
  ];
}

function tieredPresentationTemplate({
  id,
  title,
  category = "Presentation templates",
  family,
  tier,
  theme,
  summary,
  tags,
  sections,
  chartType,
}) {
  return {
    id,
    title,
    category,
    useCase: `${tier}-slide ${family} presentation framework`,
    audience: "Executives, operators, project teams, and adaptive-card authors",
    summary,
    tags: [...tags, `tier-${tier}`, "presentation-template"],
    deck: deck({
      title,
      description: `${tier}-slide ${family} template for Adaptive Slide.`,
      tags: [...tags, family.toLowerCase().replace(/\s+/g, "-"), `tier-${tier}`],
      theme,
      slides: buildTieredSlides({ id, title, family, tier, theme, sections, chartType }),
    }),
  };
}

const presentationFamilyTemplates = [
  tieredPresentationTemplate({
    id: "presentation-executive-briefing",
    title: "Executive Briefing Pack",
    family: "Executive briefing",
    tier: 16,
    theme: themes.generated,
    summary: "Leadership-ready briefing deck with context, decision asks, risk, and next actions.",
    tags: ["executive", "briefing", "decision"],
    chartType: "line",
    sections: [
      { label: "Executive context", detail: "Frame the operating moment and strategic choice." },
      { label: "Performance signal", detail: "Show the few metrics that explain the current state." },
      { label: "Decision ask", detail: "Make the leadership decision explicit and time-bound." },
      { label: "Action register", detail: "Assign owners, dates, and validation criteria." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-qbr",
    title: "Quarterly Business Review",
    family: "Quarterly business review",
    tier: 32,
    theme: themes.sales,
    summary: "Full QBR structure for performance, customer health, risks, and next-quarter plan.",
    tags: ["qbr", "business-review", "customer-health"],
    chartType: "area",
    sections: [
      { label: "Quarter snapshot", detail: "Summarize performance, variance, and major shifts." },
      { label: "Customer and market", detail: "Connect outcomes to customer, segment, and market signals." },
      { label: "Pipeline and delivery", detail: "Review committed work, blockers, and quality gates." },
      { label: "Next-quarter plan", detail: "Convert insights into priorities, owners, and asks." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-training-course",
    title: "Training Course Builder",
    family: "Training course",
    tier: 32,
    theme: themes.trainingCourse,
    summary: "Reusable course deck with modules, examples, practice checks, and validation flow.",
    tags: ["training", "course", "learning"],
    chartType: "bar",
    sections: [
      { label: "Learning objective", detail: "State the behavior learners should demonstrate." },
      { label: "Concept module", detail: "Teach the pattern with short examples and practice prompts." },
      { label: "Applied exercise", detail: "Guide learners through a realistic scenario." },
      { label: "Validation", detail: "Capture rating, answer, feedback, and completion signal." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-incident-review",
    title: "Incident Review Pack",
    family: "Incident review",
    tier: 16,
    theme: themes.support,
    summary: "Post-incident and live-review structure with impact, timeline, cause, and remediation.",
    tags: ["incident", "review", "reliability"],
    chartType: "scatter",
    sections: [
      { label: "Impact", detail: "Quantify customer, service, and business impact." },
      { label: "Timeline", detail: "Track detection, escalation, mitigation, and recovery." },
      { label: "Root cause", detail: "Separate contributing factors from confirmed causes." },
      { label: "Remediation", detail: "Assign durable fixes and validation checks." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-project-status",
    title: "Project Status Review",
    family: "Project status",
    tier: 8,
    theme: themes.project,
    summary: "Compact project status deck for milestones, dependencies, risks, and decisions.",
    tags: ["project", "status", "delivery"],
    chartType: "bar",
    sections: [
      { label: "Milestones", detail: "Show committed dates, completion, and variance." },
      { label: "Dependencies", detail: "Identify upstream and downstream blockers." },
      { label: "Risks", detail: "Prioritize risks by impact, probability, and owner." },
      { label: "Decisions", detail: "Record asks and commitments needed this week." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-product-launch",
    title: "Product Launch Plan",
    family: "Product launch",
    tier: 16,
    theme: themes.marketing,
    summary: "Launch readiness template for audience, positioning, channels, enablement, and gates.",
    tags: ["product", "launch", "go-to-market"],
    chartType: "donut",
    sections: [
      { label: "Audience", detail: "Define target segment, problem, and launch trigger." },
      { label: "Positioning", detail: "Clarify message, proof, and competitive frame." },
      { label: "Readiness", detail: "Track product, sales, support, and channel gates." },
      { label: "Launch motion", detail: "Map sequence, owners, and measurement plan." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-customer-proposal",
    title: "Sales and Customer Proposal",
    family: "Sales/customer proposal",
    tier: 16,
    theme: themes.sales,
    summary: "Customer proposal deck with context, solution, value proof, plan, and commercial ask.",
    tags: ["sales", "proposal", "customer"],
    chartType: "pie",
    sections: [
      { label: "Customer context", detail: "Reflect the customer's goals, constraints, and urgency." },
      { label: "Solution", detail: "Explain the proposed path and why it fits." },
      { label: "Value proof", detail: "Connect benefits to measurable outcomes." },
      { label: "Commercial ask", detail: "Clarify scope, next step, timeline, and owner." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-board-update",
    title: "Board Update Book",
    family: "Board update",
    tier: 64,
    theme: themes.financial,
    summary: "Comprehensive board package for strategy, metrics, risks, capital, and decisions.",
    tags: ["board", "strategy", "governance"],
    chartType: "line",
    sections: [
      { label: "Strategy", detail: "Connect annual priorities to current execution." },
      { label: "Operating metrics", detail: "Explain performance, trend, variance, and outlook." },
      { label: "Risk and controls", detail: "Surface material risks, mitigations, and governance asks." },
      { label: "Capital and decisions", detail: "Frame investment choices and approval paths." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-architecture-review",
    title: "Architecture and Design Review",
    family: "Architecture/design review",
    tier: 32,
    theme: themes.engineering,
    summary: "Technical decision deck for context, constraints, options, tradeoffs, and recommendation.",
    tags: ["architecture", "design-review", "engineering"],
    chartType: "bar",
    sections: [
      { label: "Context", detail: "Describe problem, users, constraints, and non-goals." },
      { label: "Options", detail: "Compare viable designs using the same criteria." },
      { label: "Tradeoffs", detail: "Make cost, risk, reliability, and complexity explicit." },
      { label: "Recommendation", detail: "State the chosen path and rollout plan." },
    ],
  }),
  tieredPresentationTemplate({
    id: "presentation-workshop-facilitation",
    title: "Workshop Facilitation Kit",
    family: "Workshop/facilitation",
    tier: 16,
    theme: themes.education,
    summary: "Facilitator deck for agenda, prompts, exercises, breakout capture, and synthesis.",
    tags: ["workshop", "facilitation", "collaboration"],
    chartType: "donut",
    sections: [
      { label: "Setup", detail: "Define room, roles, working agreements, and desired output." },
      { label: "Prompt", detail: "Frame the question and constraints for each exercise." },
      { label: "Breakout", detail: "Guide group work, capture notes, and flag blockers." },
      { label: "Synthesis", detail: "Converge on themes, decisions, and next actions." },
    ],
  }),
];

function layoutGuidanceSlides(template) {
  const theme = template.deck.theme ?? themes.acPattern;
  const layoutName = template.title.replace(/\s+layout$/i, "");
  const slug = template.id.replace(/^ac-layout-/, "");
  return [
    {
      type: "AdaptiveSlide",
      id: `${slug}-schema-example`,
      title: `${layoutName} - schema example`,
      background: gradientBackground(theme),
      body: [
        { type: "Tile.Text", text: `${layoutName} schema example`, style: "heading", size: "large", color: "light" },
        {
          type: "Tile.Code",
          title: `${slug}.deck.json`,
          language: "json",
          theme: "dark",
          showLineNumbers: true,
          code: JSON.stringify(
            {
              type: "AdaptiveSlide",
              layout: { mode: "grid", columns: 4 },
              body: [
                { type: "Tile.Text", text: `${layoutName} headline`, style: "heading" },
                { type: "Tile.Container", style: "accent", items: [] },
              ],
            },
            null,
            2,
          ),
        },
      ],
    },
    narrativeSlide({
      id: `${slug}-accessibility`,
      title: `${layoutName} - accessibility`,
      subtitle: "Make the card usable across Teams, Outlook, web, and host surfaces.",
      theme,
      sections: [
        { label: "Contrast", detail: "Keep text and key affordances readable in dark and light host themes." },
        { label: "Alt text", detail: "Every image or media poster needs a useful description." },
        { label: "Keyboard flow", detail: "Inputs and actions should follow the visual reading order." },
        { label: "Text density", detail: "Use short labels and keep long detail in follow-on cards." },
      ],
    }),
    narrativeSlide({
      id: `${slug}-host-compatibility`,
      title: `${layoutName} - host compatibility`,
      subtitle: "Design for Adaptive Cards 1.6 with graceful host variance.",
      theme,
      sections: [
        { label: "Teams", detail: "Use concise actions and avoid layouts that rely on fixed pixel width." },
        { label: "Outlook", detail: "Prefer compact text and clear fallbacks for media-heavy cards." },
        { label: "Power Apps", detail: "Keep data fields explicit so cards can bind to app state." },
        { label: "MCP App", detail: "Use the same deck JSON for browser preview and assistant-driven presentation." },
      ],
    }),
    narrativeSlide({
      id: `${slug}-composition`,
      title: `${layoutName} - composition variants`,
      subtitle: "Ways to adapt this pattern without changing the semantic contract.",
      theme,
      sections: [
        { label: "Compact", detail: "Reduce supporting copy and keep one primary action." },
        { label: "Standard", detail: "Use the showcase layout as the default host-safe pattern." },
        { label: "Expanded", detail: "Add a secondary evidence block or follow-up detail card." },
        { label: "Interactive", detail: "Add inputs or submit actions only when the user can complete the task inline." },
      ],
    }),
    narrativeSlide({
      id: `${slug}-quick-reference`,
      title: `${layoutName} - quick reference`,
      subtitle: "Implementation checklist for authors.",
      theme,
      sections: [
        { label: "Best for", detail: template.summary },
        { label: "Use tiles", detail: "Compose with Text, Container, Image, Chart, Media, or Input tiles as needed." },
        { label: "Validate", detail: "Run the deck validator and inspect the AC 1.6 output before publishing." },
        { label: "Preview", detail: "Keep slide 0 as the strongest gallery showcase." },
      ],
    }),
  ];
}

function genericScenarioExpansionSlides(template) {
  const theme = template.deck.theme ?? themes.generated;
  return scenarioTierSlides({
    id: template.id,
    title: template.title,
    theme,
    useCase: template.useCase ?? template.summary ?? template.title,
    chart: {
      title: "Decision mix",
      chartType: "pie",
      labels: ["Context", "Evidence", "Risk", "Action"],
      values: [25, 30, 20, 25],
      color: theme.accentColor,
    },
    status: {
      label: "Watch item",
      status: template.summary,
      detail: `Audience: ${template.audience ?? "Template authors and decision makers"}`,
      style: "warning",
    },
    actionList: {
      title: "Next actions",
      items: [
        "Review the dashboard signal",
        "Assign one accountable owner",
        "Capture the decision and validation date",
      ],
    },
    agendaItems: [
      { label: "Context", detail: "Confirm audience, decision, and current state." },
      { label: "Evidence", detail: "Review metrics, examples, and source-of-truth data." },
      { label: "Risk", detail: "Prioritize watch items and unresolved blockers." },
      { label: "Action", detail: "Convert discussion into owners and due dates." },
    ],
    checklistItems: [
      "Validate source data",
      "Confirm owner",
      "Record decision",
      "Publish follow-up",
    ],
  });
}

function normalizeTemplateDeck(template) {
  const slides = template.deck?.slides ?? [];
  if (template.category === "Card layouts" && slides.length < 8) {
    return {
      ...template,
      deck: {
        ...template.deck,
        slides: [...slides, ...layoutGuidanceSlides(template)].slice(0, 8),
      },
    };
  }
  if (slides.length === 5) {
    const [showcase, title, agenda, checklist, close] = slides;
    return {
      ...template,
      deck: {
        ...template.deck,
        slides: [
          showcase,
          title,
          agenda,
          ...genericScenarioExpansionSlides(template),
          checklist,
          close,
        ],
      },
    };
  }
  return template;
}

function verticalStrategyTemplate(source) {
  const categorySlug = slugify(source.category);
  return tieredPresentationTemplate({
    id: `${categorySlug}-strategy-review`,
    title: `${source.category} Strategy Review`,
    category: source.category,
    family: `${source.category} strategy review`,
    tier: 16,
    theme: source.deck.theme ?? themes.generated,
    summary: `Sixteen-slide ${source.category.toLowerCase()} strategy template that extends the starter scenario into a deeper operating review.`,
    tags: [...(source.tags ?? []), "strategy-review", "vertical-pack"],
    chartType: "area",
    sections: [
      { label: "Market and mission", detail: `Frame the ${source.category.toLowerCase()} operating context and audience need.` },
      { label: "Performance baseline", detail: "Review the metrics, trend, and target variance that define the current state." },
      { label: "Risk and dependency", detail: "Surface blockers, compliance issues, customer impact, and resource constraints." },
      { label: "Strategic actions", detail: "Commit to owners, timing, governance path, and validation evidence." },
    ],
  });
}

function buildVerticalStrategyTemplates(templates) {
  const seenCategories = new Set();
  return templates
    .filter((template) => template.category !== "Card layouts")
    .filter((template) => {
      if (seenCategories.has(template.category)) return false;
      seenCategories.add(template.category);
      return true;
    })
    .map(verticalStrategyTemplate);
}

function expandTemplateLibrary(templates) {
  return templates.map(normalizeTemplateDeck);
}

// =============================================================================
// Industry-tailored templates
// =============================================================================

const baseTemplateDecks = [
  // ---- Training -----------------------------------------------------------
  {
    id: "training-onboarding",
    title: "New Hire Onboarding Readiness",
    category: "Training",
    useCase: "Cohort onboarding and product enablement",
    audience: "Talent enablement, managers, learning leaders",
    summary:
      "Cohort-level readiness dashboard with module completion, knowledge scores, at-risk learners, and weekly trend.",
    tags: ["training", "onboarding", "enablement"],
    deck: deck({
      title: "New Hire Onboarding — Cohort 2025-Q3",
      description: "Cohort-level training readiness dashboard and program flow.",
      tags: ["training", "onboarding", "enablement"],
      theme: themes.training,
      slides: [
        dashboardSlide({
          id: "training-dashboard",
          title: "Onboarding Readiness — Week 4",
          subtitle: "Cohort 2025-Q3 · 47 learners · 12-week program",
          theme: themes.training,
          columns: 4,
          body: [
            statTile({ value: "8/12", label: "Modules complete", style: "accent", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "92%", label: "Average score", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "47", label: "Active learners", style: "emphasis", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "3", label: "At risk", style: "attention", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Module completion %",
              labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
              values: [98, 95, 88, 82],
              color: "#a78bfa",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            listTile({
              title: "This week",
              items: [
                "Live demo: product tour (Mon 1p)",
                "Office hours: Wed 10a",
                "Cohort retro: Fri 3p",
              ],
              style: "default",
              gridPosition: { column: 3, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "training-title",
          "New Hire Onboarding",
          "Cohort 2025-Q3 — twelve weeks to fully ramped",
          themes.training,
        ),
        agendaSlide("training-objectives", "Program objectives", [
          { label: "Foundation", detail: "Core values, tools, and team orientation in week 1." },
          { label: "Product", detail: "Hands-on product mastery and demo certification by week 4." },
          { label: "Process", detail: "Internal workflows, escalation paths, and tooling by week 8." },
          { label: "Practice", detail: "Real customer scenarios with mentor sign-off by week 12." },
        ]),
        checklistSlide("training-week-checklist", "Manager check-in this week", [
          "Confirm learner has completed Module 8 lab",
          "Schedule 1:1 to review week-4 self-assessment",
          "Pair learner with shadow account for next week",
          "Submit at-risk flag if any module is overdue >5 days",
        ]),
        closeSlide(
          "training-close",
          "Ready to ramp",
          "Track completion weekly and escalate at-risk learners early.",
          themes.training,
        ),
      ],
    }),
  },

  {
    id: "training-dsl-101",
    title: "Adaptive Slide DSL 101 — 8-card course",
    category: "Training",
    useCase: "Eight-card course pattern: title, six modules, validation card",
    audience: "Course authors, enablement, learning designers",
    summary:
      "Repeatable training pattern: title card + six content cards + a validation card with question, 1-5 rating, free-text feedback, and Submit to earn credit.",
    tags: ["training", "course", "input", "validation", "submit", "rating"],
    deck: deck({
      title: "Adaptive Slide DSL 101",
      description:
        "An eight-card crash course on the Adaptive Slide DSL: title, six training modules, and a combined validation card with question, rating, feedback, and submit. Credit-granting requires a host submit handler.",
      tags: ["training", "course", "dsl", "input", "validation", "submit"],
      theme: themes.trainingCourse,
      slides: [
        {
          type: "AdaptiveSlide",
          id: "card-1-title",
          title: "Title — Adaptive Slide DSL 101",
          background: {
            gradient: { type: "linear", colors: ["#022c22", "#065f46", "#10b981"], angle: 145 },
          },
          body: [
            {
              type: "Tile.Text",
              text: "Adaptive Slide DSL 101",
              style: "heading",
              size: "extraLarge",
              weight: "bolder",
              color: "light",
              horizontalAlignment: "center",
              spacing: "extraLarge",
            },
            {
              type: "Tile.Text",
              text: "An eight-card crash course on authoring schema-driven decks",
              style: "subheading",
              color: "light",
              horizontalAlignment: "center",
            },
            {
              type: "Tile.Text",
              text: "Six modules · One validation card · Earns completion credit",
              style: "caption",
              color: "light",
              horizontalAlignment: "center",
              spacing: "large",
            },
          ],
          notes: "Welcome. Set expectations: 6 short modules then a single validation card.",
        },
        {
          type: "AdaptiveSlide",
          id: "card-2-module-overview",
          title: "Module 1 — What is Adaptive Slide?",
          body: [
            { type: "Tile.Text", text: "Module 1 of 6", style: "caption", color: "accent", weight: "bolder" },
            { type: "Tile.Text", text: "What is Adaptive Slide?", style: "heading", size: "large" },
            {
              type: "Tile.Text",
              text:
                "Adaptive Slide is a JSON-first DSL that authors decks as schema-validated documents and compiles each slide to a fully compliant Adaptive Card 1.6 payload. One source, many surfaces: Teams, Outlook, web, MCP App.",
              style: "body",
            },
            {
              type: "Tile.Container",
              style: "accent",
              items: [
                {
                  type: "Tile.Text",
                  text: "Key idea — your slide is the Adaptive Card body. The transformer fills in the rest.",
                  style: "body",
                },
              ],
            },
          ],
        },
        {
          type: "AdaptiveSlide",
          id: "card-3-module-structure",
          title: "Module 2 — Decks, Slides, Tiles",
          body: [
            { type: "Tile.Text", text: "Module 2 of 6", style: "caption", color: "accent", weight: "bolder" },
            { type: "Tile.Text", text: "Decks, Slides, Tiles", style: "heading", size: "large" },
            {
              type: "Tile.Code",
              language: "json",
              title: "minimal.deck.json",
              code:
                '{\n  "type": "AdaptiveDeck",\n  "version": "1.0.0",\n  "slides": [\n    {\n      "type": "AdaptiveSlide",\n      "body": [\n        { "type": "Tile.Text", "text": "Hello!" }\n      ]\n    }\n  ]\n}',
              showLineNumbers: true,
              theme: "dark",
            },
          ],
        },
        {
          type: "AdaptiveSlide",
          id: "card-4-module-layouts",
          title: "Module 3 — Layouts",
          body: [
            { type: "Tile.Text", text: "Module 3 of 6", style: "caption", color: "accent", weight: "bolder" },
            { type: "Tile.Text", text: "Layouts", style: "heading", size: "large" },
            {
              type: "Tile.Container",
              style: "emphasis",
              items: [
                { type: "Tile.Text", text: "**stack** — vertical flow (default). Best for long-form reading.", style: "body" },
                { type: "Tile.Text", text: "**grid** — N columns, with gridPosition per tile. Best for dashboards.", style: "body" },
                { type: "Tile.Text", text: "**freeform** — absolute positioning. Best for hero slides and infographics.", style: "body" },
              ],
            },
          ],
        },
        {
          type: "AdaptiveSlide",
          id: "card-5-module-tiles",
          title: "Module 4 — Tile Types",
          body: [
            { type: "Tile.Text", text: "Module 4 of 6", style: "caption", color: "accent", weight: "bolder" },
            { type: "Tile.Text", text: "Tile Types", style: "heading", size: "large" },
            {
              type: "Tile.Container",
              layout: "row",
              style: "emphasis",
              items: [
                { type: "Tile.Text", text: "**Content** — Text, Image, Code, Chart, Media, Container.", style: "body" },
                { type: "Tile.Text", text: "**Inputs** — Input.Text, Input.Number, Input.ChoiceSet (this card 8 uses all three).", style: "body" },
              ],
            },
            {
              type: "Tile.Text",
              text: "Every tile compiles to a real AC 1.6 element. There is no proprietary surface — your deck runs anywhere a card runs.",
              style: "caption",
              spacing: "medium",
            },
          ],
        },
        {
          type: "AdaptiveSlide",
          id: "card-6-module-themes",
          title: "Module 5 — Themes, Transitions, Actions",
          body: [
            { type: "Tile.Text", text: "Module 5 of 6", style: "caption", color: "accent", weight: "bolder" },
            { type: "Tile.Text", text: "Themes, Transitions, Actions", style: "heading", size: "large" },
            {
              type: "Tile.Container",
              style: "good",
              items: [
                { type: "Tile.Text", text: "**Theme** — primaryColor, accentColor, backgroundColor, fontFamily, darkMode. Applies deck-wide.", style: "body" },
                { type: "Tile.Text", text: "**Transitions** — fade, slide-left, slide-right, slide-up, zoom, none. Per-slide override.", style: "body" },
                { type: "Tile.Text", text: "**Actions** — OpenUrl, Submit (host-handled), GoToSlide, NextSlide, PrevSlide.", style: "body" },
              ],
            },
          ],
        },
        {
          type: "AdaptiveSlide",
          id: "card-7-module-transform",
          title: "Module 6 — AC 1.6 Transformation",
          body: [
            { type: "Tile.Text", text: "Module 6 of 6", style: "caption", color: "accent", weight: "bolder" },
            { type: "Tile.Text", text: "AC 1.6 Transformation", style: "heading", size: "large" },
            {
              type: "Tile.Code",
              language: "javascript",
              title: "transform.js",
              code:
                'import { slideToAdaptiveCard } from "adaptive-slide";\n\nconst card = slideToAdaptiveCard(deck.slides[7], deck);\n// card now has Input.ChoiceSet, Input.Text, Action.Submit\n// Send to Teams, Outlook, or any AC 1.6 host.',
              showLineNumbers: false,
              theme: "dark",
            },
            {
              type: "Tile.Text",
              text: "The next card validates what you've learned. Answer the question, rate the training, and submit.",
              style: "caption",
              spacing: "medium",
            },
          ],
        },
        {
          type: "AdaptiveSlide",
          id: "card-8-validation",
          title: "Validation — Earn Credit",
          body: [
            { type: "Tile.Text", text: "Validation", style: "heading", size: "large" },
            {
              type: "Tile.Text",
              text: "Answer the question, rate the training, and tell us what to improve. Submit to earn completion credit.",
              style: "body",
              spacing: "small",
            },
            {
              type: "Tile.Input.ChoiceSet",
              id: "quizAnswer",
              label: "1. Which of these is NOT an Adaptive Slide tile type?",
              style: "expanded",
              isRequired: true,
              errorMessage: "Pick the option that does not exist in the DSL.",
              choices: [
                { title: "Tile.Text", value: "text" },
                { title: "Tile.Image", value: "image" },
                { title: "Tile.Button", value: "button" },
                { title: "Tile.Container", value: "container" },
              ],
              spacing: "medium",
            },
            {
              type: "Tile.Input.ChoiceSet",
              id: "courseRating",
              label: "2. How clear was this training? (1 = Poor, 5 = Excellent)",
              style: "expanded",
              isRequired: true,
              errorMessage: "Pick a rating from 1 to 5.",
              choices: [
                { title: "1 — Poor", value: "1" },
                { title: "2 — Fair", value: "2" },
                { title: "3 — Good", value: "3" },
                { title: "4 — Great", value: "4" },
                { title: "5 — Excellent", value: "5" },
              ],
              spacing: "medium",
            },
            {
              type: "Tile.Input.Text",
              id: "feedbackComment",
              label: "3. What can we improve? (optional)",
              placeholder: "One or two sentences is plenty.",
              isMultiline: true,
              maxLength: 500,
              spacing: "medium",
            },
          ],
          actions: [
            {
              type: "Action.Submit",
              title: "Complete and get credit",
              data: { courseId: "training-dsl-101", action: "complete-and-credit" },
            },
          ],
          notes:
            "Submit is host-handled. Hosts (Teams, Outlook, MCP App) receive the inputs payload (quizAnswer, courseRating, feedbackComment) plus the static data (courseId, action) to grant credit.",
        },
      ],
    }),
  },

  // ---- Healthcare ---------------------------------------------------------
  {
    id: "healthcare-discharge",
    title: "Patient Discharge Summary",
    category: "Healthcare",
    useCase: "Patient discharge and care-team handoff",
    audience: "Care coordinators, hospitalists, patient educators",
    summary:
      "Patient discharge dashboard with vitals, daily medications, follow-up appointment, and warning-sign alerts.",
    tags: ["healthcare", "discharge", "patient-education"],
    deck: deck({
      title: "Discharge Summary Template",
      description: "Patient-friendly discharge education dashboard and care-team handoff.",
      tags: ["healthcare", "discharge", "patient-education"],
      theme: themes.healthcare,
      slides: [
        dashboardSlide({
          id: "healthcare-dashboard",
          title: "Discharge Summary — MRN 7842301",
          subtitle: "Day 4 post-op · Cardiac unit · Ready for home transition",
          theme: themes.healthcare,
          columns: 4,
          body: [
            statTile({ value: "72", label: "Heart rate (bpm)", style: "good", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "118/76", label: "Blood pressure", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "98.4°", label: "Temp (°F)", style: "accent", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "98%", label: "O₂ saturation", style: "good", gridPosition: { column: 4, row: 3 } }),
            listTile({
              title: "Daily medication",
              items: [
                "Metoprolol 25 mg — 8a / 8p",
                "Aspirin 81 mg — 9a",
                "Atorvastatin 40 mg — bedtime",
              ],
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "Follow-up",
              status: "Cardiology — Tue Apr 30, 10:30a",
              detail: "Bring meds list. Lab draw 30 min before visit.",
              style: "accent",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            statusTile({
              label: "Call your team if",
              status: "Chest pain · shortness of breath · fever >100.4°",
              style: "attention",
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "healthcare-title",
          "Discharge Education",
          "Care plan, warning signs, follow-up, and support contacts",
          themes.healthcare,
        ),
        agendaSlide("healthcare-careplan", "Care plan summary", [
          { label: "Medication", detail: "Dose, timing, and missed-dose instructions for each prescription." },
          { label: "Warning signs", detail: "Symptoms that require an urgent call to the care team." },
          { label: "Follow-up", detail: "Appointment date, location, and what to bring." },
          { label: "Support", detail: "After-hours nurse line and patient portal contact options." },
        ]),
        checklistSlide("healthcare-checklist", "Home readiness checklist", [
          "Patient can teach back medication plan",
          "Caregiver knows when to call the care team",
          "Transportation home is confirmed",
          "Follow-up appointment is on the calendar",
        ]),
        closeSlide(
          "healthcare-close",
          "Safe transition home",
          "Document teach-back and share with the receiving care team.",
          themes.healthcare,
        ),
      ],
    }),
  },

  // ---- Financial Services -------------------------------------------------
  {
    id: "financial-fraud",
    title: "Fraud Operations Briefing",
    category: "Financial Services",
    useCase: "Weekly fraud and risk operations review",
    audience: "Risk officers, fraud ops, compliance, executive leadership",
    summary:
      "Fraud operations dashboard with open cases, recovery dollars, channel breakdown, and risk exposure by region.",
    tags: ["financial-services", "fraud", "risk", "ops"],
    deck: deck({
      title: "Fraud Operations Briefing",
      description: "Weekly fraud operations dashboard and response actions.",
      tags: ["financial-services", "fraud", "risk", "ops"],
      theme: themes.financial,
      slides: [
        dashboardSlide({
          id: "financial-dashboard",
          title: "Q3 Fraud Operations — Week 28",
          subtitle: "Cards · ACH · Wire · Digital channels · Region 1–4",
          theme: themes.financial,
          columns: 4,
          body: [
            statTile({ value: "142", label: "Open cases", style: "attention", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "$1.2M", label: "Recovered YTD", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "4.2d", label: "Mean time to close", style: "accent", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "$4.8M", label: "Loss prevented", style: "good", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Cases by channel %",
              labels: ["Cards", "ACH", "Wire", "Digital"],
              values: [31, 18, 9, 42],
              color: "#fbbf24",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "High exposure",
              status: "Region 4 — synthetic identity ring, 23 accounts flagged",
              detail: "Containment in progress · ETA 24h",
              style: "attention",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            listTile({
              title: "This week's actions",
              items: [
                "Tighten velocity rule on digital channel (R4)",
                "Publish exec summary by Thu EOD",
                "Open SAR review on ring 0427-A",
              ],
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "financial-title",
          "Fraud Operations Briefing",
          "Trend analysis · control posture · weekly action register",
          themes.financial,
        ),
        agendaSlide("financial-controls", "Control response", [
          { label: "Detect", detail: "Tune anomaly rules, velocity limits, and device intelligence signals." },
          { label: "Triage", detail: "Prioritize high-loss exposure, vulnerable customers, and repeated patterns." },
          { label: "Investigate", detail: "Connect case notes, transaction context, and customer communications." },
          { label: "Report", detail: "Prepare regulatory, leadership, and remediation status updates." },
        ]),
        checklistSlide("financial-actions", "Action register", [
          "Confirm threshold changes with risk owners",
          "Review false positive rate after deployment",
          "Update analyst runbook",
          "Publish weekly executive summary",
        ]),
        closeSlide(
          "financial-close",
          "Risk response aligned",
          "Track owners, due dates, and post-control effectiveness.",
          themes.financial,
        ),
      ],
    }),
  },

  // ---- Retail -------------------------------------------------------------
  {
    id: "retail-seasonal",
    title: "Seasonal Launch Performance",
    category: "Retail",
    useCase: "Store team merchandising and campaign launch",
    audience: "Store leaders, merchandising, marketing, operations",
    summary:
      "Daily launch performance with traffic, conversion, AOV, top SKUs, and store rankings for execution focus.",
    tags: ["retail", "merchandising", "campaign"],
    deck: deck({
      title: "Holiday 2025 Launch — Day 3",
      description: "Daily seasonal launch performance dashboard and execution plan.",
      tags: ["retail", "merchandising", "campaign"],
      theme: themes.retail,
      slides: [
        dashboardSlide({
          id: "retail-dashboard",
          title: "Holiday Launch — Day 3",
          subtitle: "248 stores · Region East / West / Central · vs. plan",
          theme: themes.retail,
          columns: 4,
          body: [
            statTile({ value: "+18%", label: "Traffic vs plan", style: "good", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "4.2%", label: "Conversion", style: "accent", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "$87", label: "AOV", style: "emphasis", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "12", label: "Top stores", style: "good", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Top 4 SKUs (units)",
              labels: ["Hero A", "Hero B", "Add-on C", "Gift D"],
              values: [842, 615, 503, 391],
              color: "#fbbf24",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "Store of the day",
              status: "#0142 Northgate — 142% to plan",
              detail: "Standout: hero display + barista promo",
              style: "good",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            listTile({
              title: "Tonight's action",
              items: [
                "Replenish Hero A — 6pm cutoff",
                "Reset front table to gift moment",
                "Confirm Wed staffing for peak",
              ],
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "retail-title",
          "Seasonal Launch Playbook",
          "Campaign story, store execution, and daily operating rhythm",
          themes.retail,
        ),
        agendaSlide("retail-plan", "Launch plan", [
          { label: "Story", detail: "Seasonal message, hero assortment, and customer promise." },
          { label: "Floor set", detail: "Display placement, signage, replenishment, visual standards." },
          { label: "Staffing", detail: "Coverage to expected traffic, peak windows, and service moments." },
          { label: "Metrics", detail: "Conversion, basket size, attachment rate, and inventory health." },
        ]),
        checklistSlide("retail-readiness", "Store readiness checklist", [
          "Visual standards confirmed and photographed",
          "Inventory exceptions escalated by 9a",
          "Daily huddle script shared with leads",
          "Customer objections captured and routed",
        ]),
        closeSlide(
          "retail-close",
          "Launch ready",
          "Run the floor walk, publish final deck, and monitor daily signals.",
          themes.retail,
        ),
      ],
    }),
  },

  // ---- Manufacturing ------------------------------------------------------
  {
    id: "manufacturing-safety",
    title: "Plant Shift Safety Standup",
    category: "Manufacturing",
    useCase: "Daily plant safety + quality standup",
    audience: "Plant managers, line leads, quality, safety teams",
    summary:
      "Plant safety dashboard with incident streak, OEE, first-pass yield, line status, and today's safety focus.",
    tags: ["manufacturing", "safety", "quality", "ops"],
    deck: deck({
      title: "Plant 2 — Shift Safety Standup",
      description: "Daily manufacturing safety and quality standup dashboard.",
      tags: ["manufacturing", "safety", "quality", "ops"],
      theme: themes.manufacturing,
      slides: [
        dashboardSlide({
          id: "manufacturing-dashboard",
          title: "Plant 2 — Shift Briefing",
          subtitle: "Day shift · 06:00 handoff · Lines A · B · C",
          theme: themes.manufacturing,
          columns: 4,
          body: [
            statTile({ value: "47", label: "Days w/o incident", style: "good", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "84%", label: "OEE rolling 7d", style: "accent", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "96%", label: "First-pass yield", style: "good", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "3", label: "Open NCRs", style: "warning", gridPosition: { column: 4, row: 3 } }),
            statusTile({
              label: "Line A — Assembly",
              status: "Running · OEE 88% · 0 stops",
              style: "good",
              gridPosition: { column: 1, row: 4 },
            }),
            statusTile({
              label: "Line B — Coating",
              status: "Hold · cure-zone calibration",
              detail: "Maint ETA 07:30",
              style: "warning",
              gridPosition: { column: 2, row: 4 },
            }),
            statusTile({
              label: "Line C — Pack",
              status: "Running · OEE 81%",
              detail: "Watch: label feed jam history",
              style: "accent",
              gridPosition: { column: 3, row: 4 },
            }),
            statusTile({
              label: "Hot zone",
              status: "Bay 4 forklift route",
              detail: "Spotter required this shift",
              style: "attention",
              gridPosition: { column: 4, row: 4 },
            }),
            listTile({
              title: "Today's safety focus",
              items: [
                "LOTO refresher at 10:00",
                "Confirm bay-4 spotter coverage",
                "Close near-miss NM-0426 by EOD",
              ],
              gridPosition: { column: 1, row: 5, columnSpan: 4 },
            }),
          ],
        }),
        titleSlide(
          "manufacturing-title",
          "Plant 2 — Shift Standup",
          "Hazards · quality · handoff · escalation discipline",
          themes.manufacturing,
        ),
        agendaSlide("manufacturing-handoff", "Shift handoff", [
          { label: "People", detail: "Staffing, training restrictions, support assignments." },
          { label: "Process", detail: "Standard work changes and active containment actions." },
          { label: "Equipment", detail: "Downtime risk, maintenance windows, and blocked assets." },
          { label: "Escalation", detail: "When to stop the line and who owns each escalation path." },
        ]),
        checklistSlide("manufacturing-quality", "Quality watch", [
          "Confirm first-piece sign-off on each line",
          "Review NCR aging — escalate >48h",
          "Trend scrap by line for end-of-shift report",
          "Note any audit-relevant deviations",
        ]),
        closeSlide(
          "manufacturing-close",
          "Safe shift start",
          "Document decisions and carry open risks into the next handoff.",
          themes.manufacturing,
        ),
      ],
    }),
  },

  // ---- Public Sector ------------------------------------------------------
  {
    id: "public-sector-emergency",
    title: "Emergency Response Briefing",
    category: "Public Sector",
    useCase: "Multi-agency incident coordination",
    audience: "Agency leadership, EOC commanders, communications",
    summary:
      "Incident response dashboard with affected population, deployed crews, shelter capacity, and public-message status.",
    tags: ["public-sector", "emergency", "incident-response"],
    deck: deck({
      title: "Storm Response — Region 4",
      description: "Multi-agency incident coordination dashboard.",
      tags: ["public-sector", "emergency", "incident-response"],
      theme: themes.publicSector,
      slides: [
        dashboardSlide({
          id: "public-dashboard",
          title: "Storm Response — Day 2",
          subtitle: "Region 4 · EOC activated · Multi-agency operation",
          theme: themes.publicSector,
          columns: 4,
          body: [
            statTile({ value: "12,400", label: "Residents affected", style: "warning", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "8", label: "Shelters open", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "47", label: "Crews deployed", style: "accent", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "36h", label: "ETR power", style: "warning", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Shelter capacity %",
              labels: ["North", "East", "South", "West"],
              values: [62, 88, 41, 73],
              color: "#fbbf24",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "Critical infra",
              status: "Hospital generators operational · Water main intact",
              style: "good",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            statusTile({
              label: "Public message",
              status: "10:00 update posted · Next at 14:00",
              detail: "Channels: web, SMS, radio, social",
              style: "accent",
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "public-title",
          "Emergency Response Briefing",
          "Situation · priorities · resources · public updates",
          themes.publicSector,
        ),
        agendaSlide("public-priorities", "Operational priorities", [
          { label: "Life safety", detail: "Protect impacted residents, responders, and vulnerable populations." },
          { label: "Stabilization", detail: "Coordinate resources, logistics, and agency responsibilities." },
          { label: "Information", detail: "Share confirmed updates and suppress unverified claims." },
          { label: "Recovery", detail: "Plan transition from immediate response to sustained support." },
        ]),
        checklistSlide("public-comms", "Public message checklist", [
          "Plain language; reading-level checked",
          "Verified sources cited inline",
          "Includes next update time and contact",
          "Accessible: alt text, captions, translations",
        ]),
        closeSlide(
          "public-close",
          "Response aligned",
          "Publish update and capture unresolved dependencies for next shift.",
          themes.publicSector,
        ),
      ],
    }),
  },

  // ---- Education ----------------------------------------------------------
  {
    id: "education-module",
    title: "Course Module Progress",
    category: "Education",
    useCase: "Mid-cycle classroom or course module review",
    audience: "Teachers, instructional designers, learning leaders",
    summary:
      "Student progress dashboard with mastery %, at-risk count, average score, engagement, and topic-mastery chart.",
    tags: ["education", "course", "workshop"],
    deck: deck({
      title: "Algebra II — Module 4 Mid-Cycle",
      description: "Mid-cycle student progress dashboard for a course module.",
      tags: ["education", "course", "workshop"],
      theme: themes.education,
      slides: [
        dashboardSlide({
          id: "education-dashboard",
          title: "Algebra II · Module 4 — Mid-cycle",
          subtitle: "Period 3 · 28 students · Day 6 of 12",
          theme: themes.education,
          columns: 4,
          body: [
            statTile({ value: "78%", label: "Class mastery", style: "accent", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "84%", label: "Avg score", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "92%", label: "Engagement", style: "good", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "4", label: "At risk", style: "warning", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Topic mastery %",
              labels: ["Linear", "Quadratic", "Systems", "Functions"],
              values: [88, 72, 65, 81],
              color: "#fbbf24",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            listTile({
              title: "Reteach focus",
              items: [
                "Quadratic word problems (small group)",
                "Systems via substitution (warm-up)",
                "Office hours: Thu lunch",
              ],
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            statusTile({
              label: "Next assessment",
              status: "Quiz 4B — Friday",
              detail: "Covers systems and functions",
              style: "accent",
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "education-title",
          "Course Module — Algebra II",
          "Outcomes · activities · assessment · reflection",
          themes.education,
        ),
        agendaSlide("education-outcomes", "Learning outcomes", [
          { label: "Recall", detail: "Define key vocabulary and concepts." },
          { label: "Practice", detail: "Apply the concept to a guided scenario." },
          { label: "Assess", detail: "Demonstrate mastery through a short task." },
          { label: "Reflect", detail: "Connect content to a real-world context." },
        ]),
        checklistSlide("education-activities", "Module activities", [
          "Warm-up question",
          "Concept mini-lesson",
          "Guided practice",
          "Independent task",
          "Exit ticket",
        ]),
        closeSlide(
          "education-close",
          "Module complete",
          "Collect artifacts, review misconceptions, and assign extension work.",
          themes.education,
        ),
      ],
    }),
  },

  // ---- Sales --------------------------------------------------------------
  {
    id: "sales-enablement",
    title: "Quarterly Pipeline Review",
    category: "Sales",
    useCase: "Pipeline review and account team enablement",
    audience: "Sales leaders, account teams, solutions, ops",
    summary:
      "Pipeline coverage dashboard with quarter pipeline, win rate, stage distribution, and deals-at-risk callout.",
    tags: ["sales", "pipeline", "enablement"],
    deck: deck({
      title: "Q3 Pipeline Snapshot",
      description: "Quarterly pipeline review dashboard and enablement playbook.",
      tags: ["sales", "pipeline", "enablement"],
      theme: themes.sales,
      slides: [
        dashboardSlide({
          id: "sales-dashboard",
          title: "Q3 Pipeline Snapshot — Week 8",
          subtitle: "Enterprise West · 14 reps · target $4.2M",
          theme: themes.sales,
          columns: 4,
          body: [
            statTile({ value: "$12.4M", label: "Pipeline", style: "good", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "3.2x", label: "Coverage ratio", style: "accent", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "28%", label: "Win rate", style: "good", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "7", label: "Stalled deals", style: "warning", gridPosition: { column: 4, row: 3 } }),
            chartTile({
              title: "Stage distribution ($M)",
              labels: ["Discover", "Qualify", "Propose", "Close"],
              values: [3.8, 4.1, 2.9, 1.6],
              color: "#06b6d4",
              gridPosition: { column: 1, row: 4, columnSpan: 2, rowSpan: 2 },
            }),
            statusTile({
              label: "Top deal",
              status: "Acme Co · $620K · Propose · close Aug 22",
              detail: "Risk: budget timing — exec sponsor confirmed",
              style: "good",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            listTile({
              title: "Deals at risk",
              items: [
                "Globex — security review stalled (14d)",
                "Initech — competing eval starts Mon",
                "Acme W — sponsor moved teams",
              ],
              style: "warning",
              gridPosition: { column: 3, row: 5, columnSpan: 2 },
            }),
          ],
        }),
        titleSlide(
          "sales-title",
          "Pipeline Review",
          "Coverage · stage health · enablement plays",
          themes.sales,
        ),
        agendaSlide("sales-message", "Buyer conversation framework", [
          { label: "Pain", detail: "Connect the offering to urgent business pressure and measurable impact." },
          { label: "Value", detail: "State differentiated outcomes in the customer's operating language." },
          { label: "Proof", detail: "Use evidence, customer examples, and implementation milestones." },
          { label: "Close", detail: "Decision criteria, next meeting, owner, and mutual action plan." },
        ]),
        checklistSlide("sales-objections", "Common objections", [
          "Budget timing — phase of contract",
          "Security review — pre-stage docs",
          "Change management — exec sponsor + adoption plan",
          "Competitive comparison — proof points + references",
        ]),
        closeSlide(
          "sales-close",
          "Field ready",
          "Share the playbook, capture feedback, and update win stories.",
          themes.sales,
        ),
      ],
    }),
  },

  // ---- Customer Support ---------------------------------------------------
  {
    id: "support-escalation",
    title: "Sev 2 Incident Tracker",
    category: "Customer Support",
    useCase: "Active incident response and customer recovery",
    audience: "Support managers, incident leads, engineering, comms",
    summary:
      "Active incident dashboard with customers impacted, MTTR clock, workstream status, and customer comms timeline.",
    tags: ["support", "escalation", "incident"],
    deck: deck({
      title: "INC-4821 — Authentication Degradation",
      description: "Active customer-impact incident dashboard and recovery plan.",
      tags: ["support", "escalation", "incident"],
      theme: themes.support,
      slides: [
        dashboardSlide({
          id: "support-dashboard",
          title: "INC-4821 — Auth Degradation",
          subtitle: "Sev 2 · Started 09:42 UTC · Mitigating",
          theme: themes.support,
          columns: 4,
          body: [
            statTile({ value: "1,247", label: "Customers impacted", style: "attention", gridPosition: { column: 1, row: 3 } }),
            statTile({ value: "4m", label: "Time to ack", style: "good", gridPosition: { column: 2, row: 3 } }),
            statTile({ value: "1h", label: "MTTR target", style: "accent", gridPosition: { column: 3, row: 3 } }),
            statTile({ value: "32m", label: "Elapsed", style: "warning", gridPosition: { column: 4, row: 3 } }),
            statusTile({
              label: "Engineering",
              status: "Rolling back auth-svc to v4.2.1",
              detail: "Owner: @evelyn · ETA 15m",
              style: "accent",
              gridPosition: { column: 1, row: 4, columnSpan: 2 },
            }),
            statusTile({
              label: "Support",
              status: "Workaround posted · 187 cases routed",
              detail: "Owner: @marcus",
              style: "good",
              gridPosition: { column: 3, row: 4, columnSpan: 2 },
            }),
            listTile({
              title: "Customer comms timeline",
              items: [
                "09:46 — Status page updated to Investigating",
                "09:58 — Workaround posted",
                "10:04 — Personalized email to top accounts",
                "Next: 10:30 status update + RCA placeholder",
              ],
              gridPosition: { column: 1, row: 5, columnSpan: 4 },
            }),
          ],
        }),
        titleSlide(
          "support-title",
          "Incident Escalation Review",
          "Impact · timeline · owners · recovery plan",
          themes.support,
        ),
        agendaSlide("support-summary", "Escalation summary", [
          { label: "Impact", detail: "Affected users, business process, severity, and start time." },
          { label: "Timeline", detail: "Detection, triage, mitigation, and customer updates." },
          { label: "Owners", detail: "Accountable support, engineering, customer success, comms." },
          { label: "Recovery", detail: "Fix plan, validation criteria, follow-up commitments." },
        ]),
        checklistSlide("support-next", "Customer update checklist", [
          "Plain-language summary at the top",
          "Current status and any workaround",
          "Next update time committed",
          "Named owner and escalation path",
        ]),
        closeSlide(
          "support-close",
          "Recovery in motion",
          "Track commitments and convert learnings into a reusable support article.",
          themes.support,
        ),
      ],
    }),
  },
  ...enterpriseScenarioTemplates,
  {
    id: "ac-layout-hero",
    category: "Card layouts",
    title: "Hero layout",
    summary: "Image-first storytelling for articles, releases, and announcements.",
    tags: ["adaptive cards", "layout", "hero"],
    deck: deck({
      title: "Hero card layout",
      description: "Adaptive Cards hero layout — large image carries the message; one primary action sits below.",
      tags: ["layout", "hero", "adaptive-cards"],
      theme: themes.acPattern,
      slides: [
        heroLayoutSlide(themes.acPattern),
        whenToUseSlide({
          id: "hero-when",
          title: "Hero — when to use",
          when: [
            "An article, release, or announcement where an image tells most of the story",
            "There is one clear primary action (read, share, open)",
            "Card width is wide or standard breakpoint",
          ],
          dont: [
            "The image is purely decorative or low contrast",
            "There are more than two competing actions",
            "The card must remain compact in narrow widths",
          ],
          theme: themes.acPattern,
        }),
        anatomySlide({
          id: "hero-anatomy",
          title: "Hero — anatomy",
          parts: [
            { label: "Hero image", detail: "Full-width image with 4.5:1 contrast against any overlaid text" },
            { label: "Headline", detail: "TextBlock styled heading, weight bolder, light color" },
            { label: "Body", detail: "Short body copy that complements (not duplicates) the image" },
            { label: "Primary action", detail: "Single accented button; secondary actions stay quiet" },
          ],
          theme: themes.acPattern,
        }),
      ],
    }),
  },
  {
    id: "ac-layout-thumbnail",
    category: "Card layouts",
    title: "Thumbnail layout",
    summary: "Compact image plus actionable message for dense feeds.",
    tags: ["adaptive cards", "layout", "thumbnail"],
    deck: deck({
      title: "Thumbnail card layout",
      description: "Adaptive Cards thumbnail layout — small image plus title, body, and one action.",
      tags: ["layout", "thumbnail", "adaptive-cards"],
      theme: themes.acPattern,
      slides: [
        thumbnailLayoutSlide(themes.acPattern),
        whenToUseSlide({
          id: "thumbnail-when",
          title: "Thumbnail — when to use",
          when: [
            "Status messages, notifications, or PR updates",
            "Feeds where many cards stack together",
            "Narrow and very narrow breakpoints",
          ],
          dont: [
            "The image needs to convey detail (use Hero instead)",
            "More than three lines of body copy are required",
            "The action requires a multi-step form",
          ],
          theme: themes.acPattern,
        }),
        anatomySlide({
          id: "thumbnail-anatomy",
          title: "Thumbnail — anatomy",
          parts: [
            { label: "Thumbnail", detail: "Small image, square or 4:3, on the leading side" },
            { label: "Title", detail: "Subheading text with strong weight and accent color" },
            { label: "Body", detail: "One or two short lines of supporting text" },
            { label: "Action", detail: "Single button anchored to the trailing side" },
          ],
          theme: themes.acPattern,
        }),
      ],
    }),
  },
  {
    id: "ac-layout-list",
    category: "Card layouts",
    title: "List layout",
    summary: "Pick one item from a scannable list of records.",
    tags: ["adaptive cards", "layout", "list"],
    deck: deck({
      title: "List card layout",
      description: "Adaptive Cards list layout — each row carries an avatar, title, subtitle, and meta.",
      tags: ["layout", "list", "adaptive-cards"],
      theme: themes.acPattern,
      slides: [
        listLayoutSlide(themes.acPattern),
        whenToUseSlide({
          id: "list-when",
          title: "List — when to use",
          when: [
            "Users need to choose one record from many (tasks, tickets, contacts)",
            "Each row has a consistent shape (avatar + title + meta)",
            "Total list fits within a single card without scrolling",
          ],
          dont: [
            "Rows have wildly different shapes or lengths",
            "More than 7 to 10 rows are needed (link to a full view instead)",
            "Each row has multiple competing actions",
          ],
          theme: themes.acPattern,
        }),
        anatomySlide({
          id: "list-anatomy",
          title: "List — anatomy",
          parts: [
            { label: "Avatar", detail: "Square or circular image at the leading edge" },
            { label: "Title and subtitle", detail: "Subheading + caption stacked vertically" },
            { label: "Meta", detail: "Right-aligned status, time, or count" },
            { label: "Selection target", detail: "Tapping a row should fire one consistent action" },
          ],
          theme: themes.acPattern,
        }),
      ],
    }),
  },
  {
    id: "ac-layout-digest",
    category: "Card layouts",
    title: "Digest layout",
    summary: "News round-up — three article cards in one glance.",
    tags: ["adaptive cards", "layout", "digest"],
    deck: deck({
      title: "Digest card layout",
      description: "Adaptive Cards digest layout — three or four article cards aligned in a single row.",
      tags: ["layout", "digest", "adaptive-cards"],
      theme: themes.acPattern,
      slides: [
        digestLayoutSlide(themes.acPattern),
        whenToUseSlide({
          id: "digest-when",
          title: "Digest — when to use",
          when: [
            "Weekly news round-ups, blog roll-ups, or release-note summaries",
            "Each item shares the same shape (image + title + summary)",
            "Card width is wide enough for three or four columns",
          ],
          dont: [
            "Items vary in length and require different layouts",
            "Articles need full body content (link out instead)",
            "Card collapses to a single column where Hero would be cleaner",
          ],
          theme: themes.acPattern,
        }),
        anatomySlide({
          id: "digest-anatomy",
          title: "Digest — anatomy",
          parts: [
            { label: "Article image", detail: "16:9 or 1:1 thumbnail per article" },
            { label: "Title", detail: "Subheading bolder, accent color, two lines max" },
            { label: "Summary", detail: "Caption-sized supporting copy, two to three lines" },
            { label: "Card link", detail: "Whole article tile is the click target" },
          ],
          theme: themes.acPattern,
        }),
      ],
    }),
  },
  {
    id: "ac-layout-media",
    category: "Card layouts",
    title: "Video and media layout",
    summary: "Combine a video or audio element with text and one clear action.",
    tags: ["adaptive cards", "layout", "media"],
    deck: deck({
      title: "Video and media card layout",
      description: "Adaptive Cards media layout — video player with poster, supporting copy, and one action.",
      tags: ["layout", "media", "video", "adaptive-cards"],
      theme: themes.acPattern,
      slides: [
        mediaLayoutSlide(themes.acPattern),
        whenToUseSlide({
          id: "media-when",
          title: "Media — when to use",
          when: [
            "A short video or audio clip is the most efficient way to convey the message",
            "A poster image keeps the card useful even before playback starts",
            "The host (Teams, Outlook, custom) supports the Media element",
          ],
          dont: [
            "The clip is longer than three minutes (link to the full asset instead)",
            "The video has no transcript or captions for accessibility",
            "The poster has insufficient contrast for any overlaid text",
          ],
          theme: themes.acPattern,
        }),
        anatomySlide({
          id: "media-anatomy",
          title: "Media — anatomy",
          parts: [
            { label: "Media element", detail: "Tile.Media with at least one source URL and a poster image" },
            { label: "Aspect ratio", detail: "16:9 by default; switch to 1:1 for portrait-friendly clips" },
            { label: "Caption", detail: "One or two lines that summarize what the user will hear or see" },
            { label: "Action", detail: "Optional transcript link or save-for-later button" },
          ],
          theme: themes.acPattern,
        }),
      ],
    }),
  },
  {
    id: "ac-layout-form",
    category: "Card layouts",
    title: "Form layout",
    summary: "Collect a small set of structured inputs to file a task or ticket.",
    tags: ["adaptive cards", "layout", "form"],
    deck: deck({
      title: "Form card layout",
      description: "Adaptive Cards form layout — labeled inputs plus submit and cancel actions.",
      tags: ["layout", "form", "adaptive-cards"],
      theme: themes.acPattern,
      slides: [
        formLayoutSlide(themes.acPattern),
        whenToUseSlide({
          id: "form-when",
          title: "Form — when to use",
          when: [
            "Three to six inputs that map to a clear back-end record",
            "Field labels and validation messages stay short",
            "The card can submit to a connector, Power Automate flow, or webhook",
          ],
          dont: [
            "More than seven inputs (escalate to a task module or full app)",
            "Inputs depend on each other in a wizard pattern",
            "File uploads or rich text are required (host support is uneven)",
          ],
          theme: themes.acPattern,
        }),
        anatomySlide({
          id: "form-anatomy",
          title: "Form — anatomy",
          parts: [
            { label: "Field label", detail: "Caption-sized accent text directly above each input" },
            { label: "Input mock", detail: "Container styled emphasis with placeholder body text" },
            { label: "Layout", detail: "Slide-level grid keeps fields aligned across breakpoints" },
            { label: "Actions", detail: "Primary submit button accent; cancel stays neutral" },
          ],
          theme: themes.acPattern,
        }),
      ],
    }),
  },
  {
    id: "ac-layout-quick-input",
    category: "Card layouts",
    title: "Quick input layout",
    summary: "One prompt, one input, one send — for in-the-moment replies.",
    tags: ["adaptive cards", "layout", "quick-input"],
    deck: deck({
      title: "Quick input card layout",
      description: "Adaptive Cards quick input layout — single-line response with a send action.",
      tags: ["layout", "quick-input", "adaptive-cards"],
      theme: themes.acPattern,
      slides: [
        quickInputLayoutSlide(themes.acPattern),
        whenToUseSlide({
          id: "quick-input-when",
          title: "Quick input — when to use",
          when: [
            "A single short response is enough (rating, comment, RSVP)",
            "The interaction sits inline in a chat or notification thread",
            "The send action posts back to a bot or webhook",
          ],
          dont: [
            "Multiple fields are needed (use Form instead)",
            "The reply requires structured choices (use a list or chiclets)",
            "The user must upload a file or attach media",
          ],
          theme: themes.acPattern,
        }),
        anatomySlide({
          id: "quick-input-anatomy",
          title: "Quick input — anatomy",
          parts: [
            { label: "Prompt", detail: "Subheading text that frames the question" },
            { label: "Input row", detail: "Mock input spans most of the row; send action takes the trailing column" },
            { label: "Send action", detail: "Accent-styled button labeled with the action verb" },
            { label: "Confirmation", detail: "Replace the input area on submit with a friendly thank-you state" },
          ],
          theme: themes.acPattern,
        }),
      ],
    }),
  },
  {
    id: "ac-layout-expandable",
    category: "Card layouts",
    title: "Expandable layout",
    summary: "Lead with the summary; reveal extra detail only on demand.",
    tags: ["adaptive cards", "layout", "expandable", "progressive disclosure"],
    deck: deck({
      title: "Expandable card layout",
      description: "Adaptive Cards expandable layout — summary plus a show-more region for additional context.",
      tags: ["layout", "expandable", "progressive-disclosure", "adaptive-cards"],
      theme: themes.acPattern,
      slides: [
        expandableLayoutSlide(themes.acPattern),
        whenToUseSlide({
          id: "expandable-when",
          title: "Expandable — when to use",
          when: [
            "Most users only need the summary, but a few need the full detail",
            "Detail data is read-only (logs, coverage stats, change lists)",
            "The card can keep both states without re-fetching data",
          ],
          dont: [
            "Detail must change frequently (link to a live view instead)",
            "Hidden content is critical for the action above",
            "Hidden region exceeds the card height when expanded",
          ],
          theme: themes.acPattern,
        }),
        anatomySlide({
          id: "expandable-anatomy",
          title: "Expandable — anatomy",
          parts: [
            { label: "Summary", detail: "One subheading plus one body line that captures the verdict" },
            { label: "Toggle action", detail: "Show more / show less button toggles the detail region" },
            { label: "Detail region", detail: "Container with paired caption labels and body values" },
            { label: "Default state", detail: "Card always opens collapsed; user choice is not persisted" },
          ],
          theme: themes.acPattern,
        }),
      ],
    }),
  },
];

const verticalStrategyTemplates = buildVerticalStrategyTemplates(baseTemplateDecks);

export const templateDecks = expandTemplateLibrary([
  ...baseTemplateDecks,
  ...presentationFamilyTemplates,
  ...verticalStrategyTemplates,
]);

export function findTemplateDeck(id) {
  return templateDecks.find((template) => template.id === id) ?? templateDecks[0];
}
