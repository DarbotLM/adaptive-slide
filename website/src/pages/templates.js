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

function downloadDeck(deck, fileName) {
  const blob = new Blob([JSON.stringify(deck, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function deckFileName(title) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.deck.json`;
}

export default function TemplatesPage() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(templateDecks.map((template) => template.category)))],
    [],
  );
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(templateDecks[0].id);
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
            Browse ready-to-edit AdaptiveDeck JSON templates, upload your own deck,
            or generate a starter deck from natural language with a configurable backend.
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
              <button
                className={clsx(styles.templateCard, selectedId === template.id && styles.selectedCard)}
                key={template.id}
                type="button"
                onClick={() => {
                  setSelectedId(template.id);
                  setUploadedDeck(null);
                  setGeneratedDeck(null);
                  setGeneratorStatus("");
                }}
              >
                <span className={styles.cardMeta}>{template.category}</span>
                <strong>{template.title}</strong>
                <p>{template.summary}</p>
                <span>{template.useCase}</span>
              </button>
            ))}
          </div>
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
              <button
                className="button button--secondary"
                type="button"
                onClick={() => downloadDeck(activeDeck, deckFileName(activeDeck.metadata?.title ?? activeTitle))}
              >
                Download JSON
              </button>
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
              <code>{JSON.stringify(activeDeck, null, 2)}</code>
            </pre>
          </div>
        </section>
      </main>
    </Layout>
  );
}
