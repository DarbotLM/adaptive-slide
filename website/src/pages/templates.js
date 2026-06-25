import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { createPromptDeck, templateDecks } from "../data/templateDecks.js";
import {
  slideToAdaptiveCard,
  deckToAdaptiveCards,
} from "../../../src/adaptiveCardTransformer.js";
import { SlideCanvas } from "../components/preview/SlideCanvas.jsx";
import { Inspector } from "../components/editor/Inspector.jsx";
import {
  addTileAtParent,
  cloneDeck,
  getTileAtPath,
  moveTileAtPath,
  remapAfterDelete,
  remapAfterMove,
  removeTileAtPath,
  updateSlide,
  updateTileAtPath,
} from "../components/editor/pathUtils.js";
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
// Showcase / flip card
// =============================================================================

function ShowcaseFace({ template, compact = false }) {
  const slide = template.deck.slides[0];
  return <SlideCanvas slide={slide} deck={template.deck} compact={compact} />;
}

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
  const [searchQuery, setSearchQuery] = useState("");
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

  // Editing state — baseline is the source-of-truth deck (template, upload, or
  // generated). workingDeck is the user's live edits. When the source deck
  // changes, both reset to a fresh deep clone and selection clears.
  const sourceDeck = generatedDeck ?? uploadedDeck ?? templateDecks[0].deck;
  const sourceTitle =
    generatedDeck?.metadata?.title ?? uploadedDeck?.metadata?.title ?? templateDecks[0].title;

  const selectedTemplate =
    templateDecks.find((template) => template.id === selectedId) ?? templateDecks[0];
  const baselineDeck = generatedDeck ?? uploadedDeck ?? selectedTemplate.deck;
  const baselineTitle =
    generatedDeck?.metadata?.title ?? uploadedDeck?.metadata?.title ?? selectedTemplate.title;

  const [workingDeck, setWorkingDeck] = useState(() => cloneDeck(baselineDeck));
  const [selectedPath, setSelectedPath] = useState(null);

  // Reset workingDeck whenever the baseline source changes (template switch,
  // upload, or generation).
  const baselineKey = generatedDeck
    ? "generated"
    : uploadedDeck
    ? "uploaded"
    : `template:${selectedTemplate.id}`;
  useEffect(() => {
    setWorkingDeck(cloneDeck(baselineDeck));
    setSelectedPath(null);
  }, [baselineKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = useMemo(
    () => JSON.stringify(workingDeck) !== JSON.stringify(baselineDeck),
    [workingDeck, baselineDeck],
  );

  const previewJson = useMemo(
    () => getViewJson(workingDeck, previewMode),
    [workingDeck, previewMode],
  );

  // Filter + search.
  const filteredTemplates = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return templateDecks.filter((template) => {
      if (category !== "All" && template.category !== category) return false;
      if (!needle) return true;
      const haystack = [
        template.title,
        template.summary,
        template.category,
        ...(template.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [category, searchQuery]);

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

  // ===== Editor handlers =====

  function handleTileChange(updatedTile) {
    if (!selectedPath) return;
    setWorkingDeck((deck) =>
      updateSlide(deck, 0, (slide) =>
        updateTileAtPath(slide, selectedPath, () => updatedTile),
      ),
    );
  }

  function handleDeckChange(nextDeck) {
    setWorkingDeck(nextDeck);
  }

  function handleMoveTile(delta) {
    if (!selectedPath) return;
    setWorkingDeck((deck) => {
      const slide = deck.slides[0];
      const updatedSlide = moveTileAtPath(slide, selectedPath, delta);
      const result = updateSlide(deck, 0, () => updatedSlide);
      return result;
    });
    setSelectedPath((sp) => remapAfterMove(sp, selectedPath, delta));
  }

  function handleDeleteTile() {
    if (!selectedPath) return;
    const pathToDelete = selectedPath;
    setWorkingDeck((deck) =>
      updateSlide(deck, 0, (slide) => removeTileAtPath(slide, pathToDelete)),
    );
    setSelectedPath((sp) => remapAfterDelete(sp, pathToDelete));
  }

  function handleAddTile(newTile) {
    setWorkingDeck((deck) =>
      updateSlide(deck, 0, (slide) => addTileAtParent(slide, [], newTile)),
    );
  }

  function handleResetWorking() {
    setWorkingDeck(cloneDeck(baselineDeck));
    setSelectedPath(null);
  }

  // Auto-clear the selection if the path no longer points at a tile
  // (e.g. after a deck swap or upload).
  useEffect(() => {
    if (!selectedPath) return;
    const exists = getTileAtPath(workingDeck.slides?.[0], selectedPath);
    if (!exists) setSelectedPath(null);
  }, [workingDeck, selectedPath]);

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
            Pick a template, click any tile to edit text, color, layout, and more.
            Export as AdaptiveDeck JSON or Adaptive Cards 1.6.
          </p>
          <div className={styles.heroStats}>
            <span>
              <strong>{templateDecks.length}</strong> templates
            </span>
            <span>
              <strong>{categories.length - 1}</strong> categories
            </span>
            <span>
              <strong>AC 1.6</strong> validated
            </span>
            <span>
              <strong>Live</strong> in-browser editor
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
            <div className={styles.libraryControls}>
              <input
                aria-label="Search templates"
                className={styles.searchInput}
                placeholder="Search by title, tag, or category…"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <label className={styles.filterLabel}>
                <span className={styles.filterLabelText}>Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className={styles.categoryPills} role="tablist" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={category === cat}
                className={clsx(styles.pill, category === cat && styles.pillActive)}
                onClick={() => setCategory(cat)}
              >
                {cat}
                {cat !== "All" && (
                  <span className={styles.pillCount}>
                    {templateDecks.filter((t) => t.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className={styles.libraryStatus}>
            <span>
              {filteredTemplates.length} template{filteredTemplates.length === 1 ? "" : "s"}
              {category !== "All" ? ` in ${category}` : ""}
              {searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ""}
            </span>
            {(searchQuery.trim() || category !== "All") && (
              <button
                type="button"
                className={styles.clearChip}
                onClick={() => {
                  setSearchQuery("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {filteredTemplates.length === 0 ? (
            <div className={styles.emptyResults}>
              No templates match those filters.{" "}
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => {
                  setSearchQuery("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
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
          )}
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

          <div className={clsx(styles.panel, styles.workspaceMain)}>
            <div className={styles.previewHeader}>
              <div>
                <p className={styles.eyebrow}>
                  Live workspace · {VIEW_MODES[previewMode].label}
                </p>
                <Heading as="h2" className={styles.sectionTitle}>
                  {workingDeck.metadata?.title ?? baselineTitle}
                  {isDirty && <span className={styles.dirtyTag}>edited</span>}
                </Heading>
                <p className={styles.workspaceHint}>
                  Click any tile in the preview to edit it. Use the Inspector
                  on the right to change text, colors, layout, and more.
                </p>
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
                  onClick={() => downloadJson(previewJson, getViewFileName(workingDeck, previewMode))}
                >
                  Download JSON
                </button>
              </div>
            </div>
            <ViewModeTabs value={previewMode} onChange={setPreviewMode} />

            <div className={styles.workspaceLayout}>
              <div className={styles.workspaceCanvas}>
                <SlideCanvas
                  slide={workingDeck.slides[0]}
                  deck={workingDeck}
                  compact={false}
                  interactive
                  selectedPath={selectedPath}
                  onSelect={setSelectedPath}
                />
                <dl className={styles.deckStats}>
                  <div>
                    <dt>Slides</dt>
                    <dd>{workingDeck.slides.length}</dd>
                  </div>
                  <div>
                    <dt>Tiles in slide 1</dt>
                    <dd>{workingDeck.slides[0]?.body?.length ?? 0}</dd>
                  </div>
                  <div>
                    <dt>Tags</dt>
                    <dd>{workingDeck.metadata?.tags?.join(", ") ?? "None"}</dd>
                  </div>
                </dl>
              </div>
              <div className={styles.workspaceInspector}>
                <Inspector
                  deck={workingDeck}
                  slideIndex={0}
                  selectedPath={selectedPath}
                  onDeckChange={handleDeckChange}
                  onTileChange={handleTileChange}
                  onMoveTile={handleMoveTile}
                  onDeleteTile={handleDeleteTile}
                  onAddTile={handleAddTile}
                  onReset={handleResetWorking}
                  isDirty={isDirty}
                />
              </div>
            </div>

            <pre className={styles.deckPreview}>
              <code>{previewJson}</code>
            </pre>
          </div>
        </section>
      </main>
    </Layout>
  );
}
