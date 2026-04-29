import clsx from "clsx";
import { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { createPromptDeck, templateDecks } from "../data/templateDecks.js";
import {
  slideToAdaptiveCard,
  deckToAdaptiveCards,
} from "../../../src/adaptiveCardTransformer.js";
import styles from "./templates.module.css";

const generatorNote =
  "GitHub Copilot Spark currently provides an interactive app-building workflow, not a public static-site LLM API. Configure this form with your own Spark-hosted route or another backend that returns AdaptiveDeck JSON.";

const VIEW_MODES = {
  deck: { label: "AdaptiveDeck", short: "DSL" },
  slideAc: { label: "Slide 1 · AC 1.6", short: "AC 1.6" },
  allAc: { label: "All slides · AC 1.6", short: "AC × N" },
};

function isAdaptiveDeck(value) {
  return Boolean(value && value.type === "AdaptiveDeck" && Array.isArray(value.slides));
}

function deckFileName(title, suffix = "deck") {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug}.${suffix}.json`;
}

function getViewJson(deck, mode) {
  if (mode === "slideAc") {
    return JSON.stringify(slideToAdaptiveCard(deck.slides[0], deck), null, 2);
  }
  if (mode === "allAc") {
    return JSON.stringify(deckToAdaptiveCards(deck), null, 2);
  }
  return JSON.stringify(deck, null, 2);
}

function getViewFileName(deck, mode) {
  const title = deck.metadata?.title ?? "adaptive-slide-deck";
  if (mode === "slideAc") return deckFileName(title, "slide.ac16");
  if (mode === "allAc") return deckFileName(title, "ac16");
  return deckFileName(title);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.append(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

function downloadJson(text, fileName) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// =============================================================================
// AdaptiveDeck slide renderer
// =============================================================================

function isStatContainer(tile) {
  return (
    tile.type === "Tile.Container" &&
    Array.isArray(tile.items) &&
    tile.items.length === 2 &&
    tile.items[0]?.type === "Tile.Text" &&
    tile.items[0]?.style === "heading" &&
    tile.items[1]?.type === "Tile.Text" &&
    tile.items[1]?.style === "caption"
  );
}

function containerStyleClass(style) {
  switch (style) {
    case "good": return styles.containerGood;
    case "warning": return styles.containerWarning;
    case "attention": return styles.containerAttention;
    case "accent": return styles.containerAccent;
    case "emphasis": return styles.containerEmphasis;
    default: return styles.containerDefault;
  }
}

function textStyleClass(style) {
  switch (style) {
    case "heading": return styles.textHeading;
    case "subheading": return styles.textSubheading;
    case "caption": return styles.textCaption;
    case "quote": return styles.textQuote;
    default: return styles.textBody;
  }
}

function textColorClass(color) {
  switch (color) {
    case "light": return styles.textLight;
    case "accent": return styles.textAccent;
    case "good": return styles.textGood;
    case "warning": return styles.textWarning;
    case "attention": return styles.textAttention;
    default: return undefined;
  }
}

function textSizeClass(size) {
  switch (size) {
    case "small": return styles.sizeSmall;
    case "medium": return styles.sizeMedium;
    case "large": return styles.sizeLarge;
    case "extraLarge": return styles.sizeExtraLarge;
    default: return undefined;
  }
}

function alignClass(align) {
  switch (align) {
    case "center": return styles.alignCenter;
    case "right": return styles.alignRight;
    default: return undefined;
  }
}

function gridStyleFor(tile) {
  if (!tile.gridPosition) return undefined;
  const { column, row, columnSpan = 1, rowSpan = 1 } = tile.gridPosition;
  const style = {};
  if (column != null) style.gridColumn = `${column} / span ${columnSpan}`;
  if (row != null) style.gridRow = `${row} / span ${rowSpan}`;
  return style;
}

function renderInlineText(text) {
  if (!text) return null;
  const segments = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) segments.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      segments.push(<strong key={`b-${key++}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      segments.push(<code key={`c-${key++}`}>{token.slice(1, -1)}</code>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) segments.push(text.slice(last));
  return segments;
}

function renderTextContent(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const trimmed = lines.map((l) => l.trim()).filter(Boolean);
  const allBullets = trimmed.length > 0 && trimmed.every((l) => l.startsWith("- "));
  if (allBullets) {
    return (
      <ul className={styles.bulletList}>
        {trimmed.map((line, idx) => (
          <li key={`li-${idx}`}>{renderInlineText(line.slice(2))}</li>
        ))}
      </ul>
    );
  }
  return lines.map((line, idx) => (
    <span key={`ln-${idx}`}>
      {renderInlineText(line)}
      {idx < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

function StatBlock({ tile }) {
  return (
    <div
      className={clsx(styles.statBlock, containerStyleClass(tile.style))}
      style={gridStyleFor(tile)}
    >
      <span className={styles.statValue}>{tile.items[0]?.text}</span>
      <span className={styles.statLabel}>{tile.items[1]?.text}</span>
    </div>
  );
}

function ChartBlock({ tile }) {
  const dataset = tile.data?.datasets?.[0];
  if (!dataset) return null;
  const max = Math.max(...dataset.values, 1);
  const color = dataset.color || "var(--ifm-color-primary)";
  return (
    <div className={clsx(styles.chartBlock, styles.containerEmphasis)} style={gridStyleFor(tile)}>
      {tile.title ? <span className={styles.blockTitle}>{tile.title}</span> : null}
      <div className={styles.chartRows}>
        {tile.data.labels.map((label, idx) => {
          const value = dataset.values[idx];
          const widthPct = Math.max((value / max) * 100, 3);
          return (
            <div className={styles.chartRow} key={`bar-${idx}`}>
              <span className={styles.chartLabel}>{label}</span>
              <div className={styles.chartTrack}>
                <div className={styles.chartFill} style={{ width: `${widthPct}%`, background: color }} />
              </div>
              <span className={styles.chartValue}>{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TextTile({ tile }) {
  const className = clsx(
    styles.textTile,
    textStyleClass(tile.style),
    textSizeClass(tile.size),
    textColorClass(tile.color),
    alignClass(tile.horizontalAlignment),
    tile.weight === "bolder" && styles.weightBolder,
  );
  return (
    <div className={className} style={gridStyleFor(tile)}>
      {renderTextContent(tile.text)}
    </div>
  );
}

function ContainerTile({ tile, depth = 0 }) {
  const items = Array.isArray(tile.items) ? tile.items : [];
  const className = clsx(
    styles.containerBlock,
    containerStyleClass(tile.style),
    depth > 0 && styles.containerNested,
  );
  return (
    <div className={className} style={gridStyleFor(tile)}>
      {items.map((child, idx) => (
        <AdaptiveTile key={`ct-${idx}`} tile={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function CodeTile({ tile }) {
  return (
    <pre className={clsx(styles.codeTile, styles.containerEmphasis)} style={gridStyleFor(tile)}>
      {tile.title ? <span className={styles.blockTitle}>{tile.title}</span> : null}
      <code>{tile.code}</code>
    </pre>
  );
}

function ImageTile({ tile }) {
  return (
    <figure className={styles.imageTile} style={gridStyleFor(tile)}>
      <img src={tile.url} alt={tile.altText ?? ""} />
      {tile.caption ? <figcaption>{tile.caption}</figcaption> : null}
    </figure>
  );
}

function MediaTile({ tile }) {
  const source = Array.isArray(tile.sources) ? tile.sources[0] : null;
  const aspect = (tile.aspectRatio || "16:9").replace(":", "/");
  return (
    <div
      className={styles.mediaTile}
      style={{ ...gridStyleFor(tile), aspectRatio: aspect }}
    >
      {tile.poster ? (
        <img className={styles.mediaPoster} src={tile.poster} alt={tile.altText ?? ""} />
      ) : null}
      <span className={styles.mediaPlayBadge} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      </span>
      {source?.url ? (
        <span className={styles.mediaSourceLabel}>{source.mimeType ?? "media"}</span>
      ) : (
        <span className={styles.mediaSourceLabel}>no source</span>
      )}
    </div>
  );
}

function InputLabelMock({ label, isRequired }) {
  if (!label) return null;
  return (
    <label className={styles.inputLabelMock}>
      {label}
      {isRequired ? (
        <span className={styles.inputRequiredStar} aria-hidden="true">*</span>
      ) : null}
    </label>
  );
}

function InputTextMock({ tile }) {
  return (
    <div className={styles.inputMock} style={gridStyleFor(tile)}>
      <InputLabelMock label={tile.label} isRequired={tile.isRequired} />
      {tile.isMultiline ? (
        <textarea
          className={styles.inputControl}
          placeholder={tile.placeholder ?? ""}
          defaultValue={tile.value ?? ""}
          rows={3}
          maxLength={tile.maxLength ?? undefined}
          disabled
          readOnly
        />
      ) : (
        <input
          className={styles.inputControl}
          type={tile.style ?? "text"}
          placeholder={tile.placeholder ?? ""}
          defaultValue={tile.value ?? ""}
          maxLength={tile.maxLength ?? undefined}
          disabled
          readOnly
        />
      )}
    </div>
  );
}

function InputNumberMock({ tile }) {
  return (
    <div className={styles.inputMock} style={gridStyleFor(tile)}>
      <InputLabelMock label={tile.label} isRequired={tile.isRequired} />
      <input
        className={styles.inputControl}
        type="number"
        placeholder={tile.placeholder ?? ""}
        defaultValue={tile.value ?? ""}
        min={tile.min ?? undefined}
        max={tile.max ?? undefined}
        disabled
        readOnly
      />
    </div>
  );
}

function InputChoiceSetMock({ tile }) {
  const style = tile.style ?? "compact";
  const choices = Array.isArray(tile.choices) ? tile.choices : [];
  const initialValues = tile.value != null
    ? String(tile.value).split(",").map((v) => v.trim())
    : [];

  if (style === "expanded") {
    const inputType = tile.isMultiSelect ? "checkbox" : "radio";
    return (
      <fieldset className={clsx(styles.inputMock, styles.inputChoiceFieldset)} style={gridStyleFor(tile)}>
        <InputLabelMock label={tile.label} isRequired={tile.isRequired} />
        <div className={styles.choiceList} role="group">
          {choices.map((choice, idx) => (
            <label key={`choice-${idx}`} className={styles.choiceRow}>
              <input
                type={inputType}
                name={tile.id}
                value={choice.value}
                defaultChecked={initialValues.includes(choice.value)}
                disabled
                readOnly
              />
              <span>{choice.title}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <div className={styles.inputMock} style={gridStyleFor(tile)}>
      <InputLabelMock label={tile.label} isRequired={tile.isRequired} />
      <select
        className={styles.inputControl}
        defaultValue={initialValues[0] ?? ""}
        multiple={Boolean(tile.isMultiSelect)}
        disabled
      >
        {tile.placeholder ? <option value="">{tile.placeholder}</option> : null}
        {choices.map((choice, idx) => (
          <option key={`opt-${idx}`} value={choice.value}>
            {choice.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function AdaptiveTile({ tile, depth = 0 }) {
  if (!tile || tile.isVisible === false) return null;
  if (tile.type === "Tile.Text") return <TextTile tile={tile} />;
  if (tile.type === "Tile.Chart") return <ChartBlock tile={tile} />;
  if (tile.type === "Tile.Code") return <CodeTile tile={tile} />;
  if (tile.type === "Tile.Image") return <ImageTile tile={tile} />;
  if (tile.type === "Tile.Media") return <MediaTile tile={tile} />;
  if (tile.type === "Tile.Container") {
    if (isStatContainer(tile)) return <StatBlock tile={tile} />;
    return <ContainerTile tile={tile} depth={depth} />;
  }
  if (tile.type === "Tile.Input.Text") return <InputTextMock tile={tile} />;
  if (tile.type === "Tile.Input.Number") return <InputNumberMock tile={tile} />;
  if (tile.type === "Tile.Input.ChoiceSet") return <InputChoiceSetMock tile={tile} />;
  return null;
}

function slideBackgroundStyle(slide, deck) {
  const bg = slide.background;
  if (bg?.gradient) {
    const colors = bg.gradient.colors.join(", ");
    const angle = bg.gradient.angle ?? 180;
    const fn = bg.gradient.type === "radial" ? "radial-gradient(circle" : `linear-gradient(${angle}deg`;
    return { background: `${fn}, ${colors})` };
  }
  if (bg?.color) return { background: bg.color };
  if (deck.theme?.backgroundColor) {
    return {
      background: `linear-gradient(135deg, ${deck.theme.backgroundColor}, ${deck.theme.primaryColor ?? deck.theme.backgroundColor})`,
    };
  }
  return { background: "linear-gradient(135deg, #071a2f, #0d3a66)" };
}

function SlideCanvas({ slide, deck, compact = false }) {
  const grid = slide.layout?.mode === "grid";
  const columns = slide.layout?.columns ?? 4;
  const innerStyle = grid
    ? {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: compact ? "0.45rem" : "0.7rem",
      }
    : { display: "grid", gap: compact ? "0.5rem" : "0.85rem" };

  const cssVars = {};
  if (deck.theme?.accentColor) cssVars["--slideAccent"] = deck.theme.accentColor;
  if (deck.theme?.primaryColor) cssVars["--slidePrimary"] = deck.theme.primaryColor;

  return (
    <section
      className={clsx(styles.slideCanvas, compact && styles.slideCanvasCompact)}
      style={{ ...slideBackgroundStyle(slide, deck), ...cssVars }}
      aria-label={`${slide.title ?? deck.metadata?.title ?? "Adaptive deck"} preview`}
    >
      <div className={styles.slideInner} style={innerStyle}>
        {(slide.body ?? []).map((tile, idx) => (
          <AdaptiveTile key={`tile-${idx}`} tile={tile} />
        ))}
      </div>
    </section>
  );
}

function ShowcaseFace({ template, compact = false }) {
  const slide = template.deck.slides[0];
  return <SlideCanvas slide={slide} deck={template.deck} compact={compact} />;
}

// =============================================================================
// View-mode tabs
// =============================================================================

function ViewModeTabs({ value, onChange, size = "default" }) {
  return (
    <div className={clsx(styles.tabs, size === "small" && styles.tabsSmall)} role="tablist">
      {Object.entries(VIEW_MODES).map(([key, info]) => (
        <button
          key={key}
          role="tab"
          type="button"
          aria-selected={value === key}
          className={clsx(styles.tab, value === key && styles.tabActive)}
          onClick={() => onChange(key)}
        >
          {size === "small" ? info.short : info.label}
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// Flip card
// =============================================================================

function TemplateFlipCard({
  template,
  selected,
  flipped,
  copiedKey,
  onCopy,
  onFlip,
  onSelect,
}) {
  const [viewMode, setViewMode] = useState("deck");
  const json = useMemo(() => getViewJson(template.deck, viewMode), [template, viewMode]);

  return (
    <article className={clsx(styles.flipCard, selected && styles.selectedCard)}>
      <div className={clsx(styles.flipInner, flipped && styles.flipped)}>
        {/* FRONT */}
        <div className={clsx(styles.face, styles.faceFront)}>
          <div className={styles.cardHeader}>
            <span className={styles.cardCategory}>{template.category}</span>
            <span className={styles.cardSlideCount}>
              {template.deck.slides.length} slides · AC 1.6
            </span>
          </div>
          <ShowcaseFace template={template} compact />
          <div className={styles.cardMeta}>
            <Heading as="h3" className={styles.cardTitle}>
              {template.title}
            </Heading>
            <p className={styles.cardSummary}>{template.summary}</p>
            <div className={styles.cardTags}>
              {template.tags.slice(0, 3).map((tag) => (
                <span className={styles.cardTag} key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className={styles.cardActions}>
            <button className="button button--primary button--sm" type="button" onClick={onSelect}>
              Use template
            </button>
            <button className="button button--secondary button--sm" type="button" onClick={onFlip}>
              View schema
            </button>
          </div>
        </div>

        {/* BACK */}
        <div className={clsx(styles.face, styles.faceBack)} aria-hidden={!flipped}>
          <div className={styles.cardHeader}>
            <span className={styles.cardCategory}>Schema preview</span>
            <span className={styles.cardSlideCount}>
              {template.deck.slides.length} slides · AC 1.6
            </span>
          </div>
          <Heading as="h3" className={styles.cardTitle}>
            {template.title}
          </Heading>
          <ViewModeTabs value={viewMode} onChange={setViewMode} size="small" />
          <pre className={styles.schemaPreview}>
            <code>{json}</code>
          </pre>
          <div className={styles.cardActions}>
            <button
              className="button button--primary button--sm"
              type="button"
              onClick={() => onCopy(json, `${template.id}:${viewMode}`)}
            >
              {copiedKey === `${template.id}:${viewMode}` ? "Copied" : "Copy schema"}
            </button>
            <button className="button button--secondary button--sm" type="button" onClick={onFlip}>
              Back to face
            </button>
            <button className="button button--secondary button--sm" type="button" onClick={onSelect}>
              Use template
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function TemplatesPage() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(templateDecks.map((t) => t.category)))],
    [],
  );
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(templateDecks[0].id);
  const [flippedId, setFlippedId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [copyError, setCopyError] = useState("");
  const [uploadedDeck, setUploadedDeck] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [prompt, setPrompt] = useState(
    "Create a five-slide onboarding deck for field sellers learning Adaptive Cards.",
  );
  const [generatorEndpoint, setGeneratorEndpoint] = useState("");
  const [generatedDeck, setGeneratedDeck] = useState(null);
  const [generatorStatus, setGeneratorStatus] = useState("");
  const [generatorError, setGeneratorError] = useState("");
  const [previewMode, setPreviewMode] = useState("deck");

  const filteredTemplates = templateDecks.filter(
    (template) => category === "All" || template.category === category,
  );
  const selectedTemplate =
    templateDecks.find((template) => template.id === selectedId) ?? templateDecks[0];
  const activeDeck = generatedDeck ?? uploadedDeck ?? selectedTemplate.deck;
  const activeTitle =
    generatedDeck?.metadata?.title ?? uploadedDeck?.metadata?.title ?? selectedTemplate.title;
  const previewJson = useMemo(() => getViewJson(activeDeck, previewMode), [activeDeck, previewMode]);

  async function handleCopy(text, key) {
    try {
      await copyText(text);
      setCopiedKey(key);
      setCopyError("");
      window.setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      setCopyError("Copy failed. Select the schema text and copy it manually.");
    }
  }

  function selectTemplate(template) {
    setSelectedId(template.id);
    setUploadedDeck(null);
    setGeneratedDeck(null);
    setGeneratorStatus("");
    setPreviewMode("deck");
    if (typeof window !== "undefined") {
      const target = document.getElementById("workspace");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    setUploadError("");
    if (!file) return;
    try {
      const parsedDeck = JSON.parse(await file.text());
      if (!isAdaptiveDeck(parsedDeck)) {
        throw new Error("The file must contain an AdaptiveDeck object with a slides array.");
      }
      setUploadedDeck(parsedDeck);
      setGeneratedDeck(null);
      setGeneratorStatus(`Loaded ${file.name}.`);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Unable to parse uploaded deck.");
    }
  }

  async function handleGenerate(event) {
    event.preventDefault();
    setGeneratorError("");
    setGeneratorStatus("");
    if (!prompt.trim()) {
      setGeneratorError("Enter a natural-language prompt before generating a deck.");
      return;
    }
    if (!generatorEndpoint.trim()) {
      setGeneratedDeck(createPromptDeck(prompt));
      setUploadedDeck(null);
      setGeneratorStatus(
        "Generated a local starter deck. Add a backend endpoint to call a Spark-hosted or other LLM generator.",
      );
      return;
    }
    try {
      const response = await fetch(generatorEndpoint.trim(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt,
          schema: "AdaptiveDeck",
          version: "1.0.0",
          referenceTemplate: selectedTemplate.deck,
        }),
      });
      if (!response.ok) throw new Error(`Generator returned HTTP ${response.status}.`);
      const payload = await response.json();
      const deckPayload = payload.deck ?? payload;
      if (!isAdaptiveDeck(deckPayload)) {
        throw new Error("Generator response must be an AdaptiveDeck object or { deck } wrapper.");
      }
      setGeneratedDeck(deckPayload);
      setUploadedDeck(null);
      setGeneratorStatus("Generated deck loaded from configured endpoint.");
    } catch (error) {
      setGeneratorError(error instanceof Error ? error.message : "Generation failed.");
    }
  }

  return (
    <Layout
      title="Templates"
      description="Adaptive Slide template library with industry dashboards, Adaptive Card layout patterns, schema preview, upload, natural-language generation, and Adaptive Cards 1.6 compliance."
    >
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Adaptive Card tileslide library</p>
          <Heading as="h1" className={styles.heroTitle}>
            Templates that compile to Adaptive Cards 1.6.
          </Heading>
          <p className={styles.heroSubtitle}>
            Industry dashboards plus the eight canonical Adaptive Card layout patterns
            (hero, thumbnail, list, digest, media, form, quick input, expandable).
            Flip a card to copy either the AdaptiveDeck DSL or the rendered Adaptive Cards 1.6
            JSON. Upload your own deck or generate one from a natural-language prompt.
          </p>
          <div className={styles.heroStats}>
            <span>
              <strong>{templateDecks.length}</strong> templates
            </span>
            <span>
              <strong>{categories.length - 1}</strong> categories
            </span>
            <span>
              <strong>AC 1.6</strong> schema validated
            </span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={clsx("container", styles.librarySection)}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Browse</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Template library
              </Heading>
            </div>
            <label className={styles.filterLabel}>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.templateGrid}>
            {filteredTemplates.map((template) => (
              <TemplateFlipCard
                copiedKey={copiedKey}
                flipped={flippedId === template.id}
                key={template.id}
                onCopy={handleCopy}
                onFlip={() => setFlippedId(flippedId === template.id ? null : template.id)}
                onSelect={() => selectTemplate(template)}
                selected={selectedId === template.id && !uploadedDeck && !generatedDeck}
                template={template}
              />
            ))}
          </div>
          {copyError ? <p className={styles.error}>{copyError}</p> : null}
        </section>

        <section className={clsx("container", styles.workspace)} id="workspace">
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Customize</p>
            <Heading as="h2" className={styles.sectionTitle}>
              Upload or generate
            </Heading>

            <div className={styles.uploadBox}>
              <label>
                Upload an AdaptiveDeck JSON file
                <input accept=".json,application/json" type="file" onChange={handleUpload} />
              </label>
              {uploadError ? <p className={styles.error}>{uploadError}</p> : null}
            </div>

            <form className={styles.generatorForm} onSubmit={handleGenerate}>
              <label>
                Natural-language prompt
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  rows={5}
                />
              </label>
              <label>
                Optional generator endpoint
                <input
                  placeholder="https://your-generator.example.com/api/adaptive-deck"
                  type="url"
                  value={generatorEndpoint}
                  onChange={(event) => setGeneratorEndpoint(event.target.value)}
                />
              </label>
              <p className={styles.note}>{generatorNote}</p>
              <button className="button button--primary" type="submit">
                Generate deck
              </button>
              {generatorStatus ? <p className={styles.success}>{generatorStatus}</p> : null}
              {generatorError ? <p className={styles.error}>{generatorError}</p> : null}
            </form>
          </div>

          <div className={styles.panel}>
            <div className={styles.previewHeader}>
              <div>
                <p className={styles.eyebrow}>Preview · {VIEW_MODES[previewMode].label}</p>
                <Heading as="h2" className={styles.sectionTitle}>{activeTitle}</Heading>
              </div>
              <div className={styles.previewActions}>
                <button
                  className="button button--primary"
                  type="button"
                  onClick={() => handleCopy(previewJson, "active")}
                >
                  {copiedKey === "active" ? "Copied" : "Copy schema"}
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => downloadJson(previewJson, getViewFileName(activeDeck, previewMode))}
                >
                  Download JSON
                </button>
              </div>
            </div>
            <ViewModeTabs value={previewMode} onChange={setPreviewMode} />
            <div className={styles.fullPreview}>
              <SlideCanvas slide={activeDeck.slides[0]} deck={activeDeck} compact={false} />
            </div>
            <dl className={styles.deckStats}>
              <div>
                <dt>Slides</dt>
                <dd>{activeDeck.slides.length}</dd>
              </div>
              <div>
                <dt>Tags</dt>
                <dd>{activeDeck.metadata?.tags?.join(", ") ?? "None"}</dd>
              </div>
            </dl>
            <pre className={styles.deckPreview}>
              <code>{previewJson}</code>
            </pre>
          </div>
        </section>
      </main>
    </Layout>
  );
}
