import clsx from "clsx";
import { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { createPromptDeck, templateDecks } from "../data/templateDecks.js";
import styles from "./templates.module.css";

const generatorNote =
  "GitHub Copilot Spark currently provides an interactive app-building workflow, not a public static-site LLM API. Configure this form with your own Spark-hosted route or another backend that returns AdaptiveDeck JSON.";

function isAdaptiveDeck(value) {
  return Boolean(value && value.type === "AdaptiveDeck" && Array.isArray(value.slides));
}

function deckFileName(title) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.deck.json`;
}

function getDeckJson(deck) {
  return JSON.stringify(deck, null, 2);
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

function downloadDeck(deck, fileName) {
  const blob = new Blob([getDeckJson(deck)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function textStyleClass(style) {
  switch (style) {
    case "heading":
      return styles.tileTextHeading;
    case "subheading":
      return styles.tileTextSubheading;
    case "caption":
      return styles.tileTextCaption;
    case "quote":
      return styles.tileTextQuote;
    default:
      return styles.tileTextBody;
  }
}

function textColorClass(color) {
  switch (color) {
    case "light":
      return styles.tileTextLight;
    case "accent":
      return styles.tileTextAccent;
    case "good":
      return styles.tileTextGood;
    case "warning":
      return styles.tileTextWarning;
    case "attention":
      return styles.tileTextAttention;
    default:
      return undefined;
  }
}

function renderText(text) {
  const cleaned = text.replace(/\*\*/g, "").replace(/`/g, "");
  const lines = cleaned.split("\n");
  const listItems = lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2));

  if (listItems.length === lines.filter((line) => line.trim()).length && listItems.length > 0) {
    return (
      <ul className={styles.tileList}>
        {listItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

function getSlideBackground(slide, deck) {
  if (slide.background?.gradient) {
    const gradient = slide.background.gradient;
    const colors = gradient.colors.join(", ");
    const prefix = gradient.type === "radial" ? "radial-gradient(circle" : `linear-gradient(${gradient.angle ?? 180}deg`;
    return { background: `${prefix}, ${colors})` };
  }

  if (slide.background?.color) {
    return { background: slide.background.color };
  }

  return {
    background:
      deck.theme?.backgroundColor ??
      "linear-gradient(135deg, rgba(7, 26, 47, 0.96), rgba(13, 58, 102, 0.96))",
  };
}

function AdaptiveTile({ tile, depth = 0 }) {
  if (tile.isVisible === false) {
    return null;
  }

  if (tile.type === "Tile.Text") {
    return (
      <div
        className={clsx(
          styles.tile,
          styles.tileText,
          textStyleClass(tile.style),
          textColorClass(tile.color),
        )}
      >
        {renderText(tile.text)}
      </div>
    );
  }

  if (tile.type === "Tile.Chart") {
    const dataset = tile.data.datasets[0];
    const maxValue = Math.max(...dataset.values, 1);

    return (
      <div className={clsx(styles.tile, styles.tileChart)}>
        <strong>{tile.title}</strong>
        <div className={styles.chartBars}>
          {tile.data.labels.map((label, index) => (
            <div className={styles.chartBarRow} key={label}>
              <span>{label}</span>
              <div className={styles.chartTrack}>
                <div
                  className={styles.chartFill}
                  style={{ width: `${Math.max((dataset.values[index] / maxValue) * 100, 4)}%` }}
                />
              </div>
              <b>{dataset.values[index]}</b>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tile.type === "Tile.Container") {
    return (
      <div className={clsx(styles.tile, styles.tileContainer, styles[`tileContainerDepth${Math.min(depth, 2)}`])}>
        {tile.items.map((item, index) => (
          <AdaptiveTile key={`${item.type}-${index}`} tile={item} depth={depth + 1} />
        ))}
      </div>
    );
  }

  if (tile.type === "Tile.Code") {
    return (
      <pre className={clsx(styles.tile, styles.tileCode)}>
        <code>{tile.code}</code>
      </pre>
    );
  }

  if (tile.type === "Tile.Image") {
    return (
      <figure className={clsx(styles.tile, styles.tileImage)}>
        <img src={tile.url} alt={tile.altText ?? ""} />
        {tile.caption ? <figcaption>{tile.caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <div className={clsx(styles.tile, styles.tileText, styles.tileTextCaption)}>
      {tile.type}
    </div>
  );
}

function AdaptiveCardFace({ deck, compact = false }) {
  const slide = deck.slides[0];
  const visibleTiles = slide.body.slice(0, compact ? 4 : 8);

  return (
    <section
      className={clsx(styles.adaptiveCard, compact && styles.adaptiveCardCompact)}
      style={getSlideBackground(slide, deck)}
      aria-label={`${slide.title ?? deck.metadata?.title ?? "Adaptive deck"} rendered preview`}
    >
      <div className={styles.cardChrome}>
        <span>{slide.title ?? deck.metadata?.title ?? "AdaptiveDeck"}</span>
        <span>AdaptiveDeck</span>
      </div>
      <div className={styles.slideCanvas}>
        {visibleTiles.map((tile, index) => (
          <AdaptiveTile key={`${tile.type}-${index}`} tile={tile} />
        ))}
      </div>
    </section>
  );
}

function TemplateFlipCard({
  template,
  selected,
  flipped,
  copied,
  onCopy,
  onFlip,
  onSelect,
}) {
  const schemaJson = getDeckJson(template.deck);

  return (
    <article className={clsx(styles.flipCard, selected && styles.selectedCard)}>
      <div className={clsx(styles.flipCardInner, flipped && styles.flipCardFlipped)}>
        <div className={clsx(styles.flipFace, styles.flipFront)}>
          <div className={styles.flipFaceContent}>
            <AdaptiveCardFace deck={template.deck} compact />
            <div className={styles.templateSummary}>
              <span className={styles.cardMeta}>{template.category}</span>
              <Heading as="h3">{template.title}</Heading>
              <p>{template.summary}</p>
              <span>{template.useCase}</span>
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

        <div className={clsx(styles.flipFace, styles.flipBack)} aria-hidden={!flipped}>
          <div className={styles.schemaHeader}>
            <div>
              <span className={styles.cardMeta}>AdaptiveDeck JSON</span>
              <strong>{template.title}</strong>
            </div>
            <button className="button button--primary button--sm" type="button" onClick={onCopy}>
              {copied ? "Copied" : "Copy schema"}
            </button>
          </div>
          <pre className={styles.schemaPreview}>
            <code>{schemaJson}</code>
          </pre>
          <div className={styles.cardActions}>
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

export default function TemplatesPage() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(templateDecks.map((template) => template.category)))],
    [],
  );
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(templateDecks[0].id);
  const [flippedId, setFlippedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copyError, setCopyError] = useState("");
  const [uploadedDeck, setUploadedDeck] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [prompt, setPrompt] = useState("Create a five-slide onboarding deck for field sellers learning Adaptive Cards.");
  const [generatorEndpoint, setGeneratorEndpoint] = useState("");
  const [generatedDeck, setGeneratedDeck] = useState(null);
  const [generatorStatus, setGeneratorStatus] = useState("");
  const [generatorError, setGeneratorError] = useState("");

  const filteredTemplates = templateDecks.filter(
    (template) => category === "All" || template.category === category,
  );
  const selectedTemplate =
    templateDecks.find((template) => template.id === selectedId) ?? templateDecks[0];
  const activeDeck = generatedDeck ?? uploadedDeck ?? selectedTemplate.deck;
  const activeTitle =
    generatedDeck?.metadata?.title ?? uploadedDeck?.metadata?.title ?? selectedTemplate.title;

  async function copyDeckSchema(deck, key) {
    try {
      await copyText(getDeckJson(deck));
      setCopiedId(key);
      setCopyError("");
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopyError("Copy failed. Select the schema text and copy it manually.");
    }
  }

  function selectTemplate(template) {
    setSelectedId(template.id);
    setUploadedDeck(null);
    setGeneratedDeck(null);
    setGeneratorStatus("");
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    setUploadError("");

    if (!file) {
      return;
    }

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
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          schema: "AdaptiveDeck",
          version: "1.0.0",
          referenceTemplate: selectedTemplate.deck,
        }),
      });

      if (!response.ok) {
        throw new Error(`Generator returned HTTP ${response.status}.`);
      }

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
      description="Adaptive Slide template library with industry decks, upload preview, and natural-language generation scaffolding."
    >
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Adaptive card tileslide library</p>
          <Heading as="h1" className={styles.heroTitle}>
            Templates for training, industries, and generated adaptive slide decks.
          </Heading>
          <p className={styles.heroSubtitle}>
            Browse ready-to-edit AdaptiveDeck JSON templates, flip each card to copy
            its schema, upload your own deck, or generate a starter deck from natural language.
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <section className={clsx("container", styles.librarySection)}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Browse</p>
              <Heading as="h2">Template library</Heading>
            </div>
            <label className={styles.filterLabel}>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.templateGrid}>
            {filteredTemplates.map((template) => (
              <TemplateFlipCard
                copied={copiedId === template.id}
                flipped={flippedId === template.id}
                key={template.id}
                onCopy={() => copyDeckSchema(template.deck, template.id)}
                onFlip={() => setFlippedId(flippedId === template.id ? null : template.id)}
                onSelect={() => selectTemplate(template)}
                selected={selectedId === template.id && !uploadedDeck && !generatedDeck}
                template={template}
              />
            ))}
          </div>
          {copyError ? <p className={styles.error}>{copyError}</p> : null}
        </section>

        <section className={clsx("container", styles.workspace)}>
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Customize</p>
            <Heading as="h2">Upload or generate</Heading>

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
                <p className={styles.eyebrow}>Preview</p>
                <Heading as="h2">{activeTitle}</Heading>
              </div>
              <div className={styles.previewActions}>
                <button
                  className="button button--primary"
                  type="button"
                  onClick={() => copyDeckSchema(activeDeck, "active")}
                >
                  {copiedId === "active" ? "Copied" : "Copy schema"}
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => downloadDeck(activeDeck, deckFileName(activeDeck.metadata?.title ?? activeTitle))}
                >
                  Download JSON
                </button>
              </div>
            </div>
            <AdaptiveCardFace deck={activeDeck} />
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
              <code>{getDeckJson(activeDeck)}</code>
            </pre>
          </div>
        </section>
      </main>
    </Layout>
  );
}
