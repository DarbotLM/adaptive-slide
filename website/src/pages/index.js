import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

const features = [
  {
    title: "Schema-first decks",
    description:
      "Decks, slides, and tiles are governed by JSON Schema so authors, validators, and renderers share one contract.",
  },
  {
    title: "Adaptive Cards foundation",
    description:
      "Slides are modeled as Adaptive Card buckets, making content portable across hosts that already understand Adaptive Cards patterns.",
  },
  {
    title: "MCP App ready",
    description:
      "The bundled MCP server exposes presentation tools and a sandbox-friendly HTML viewer for compatible MCP hosts.",
  },
];

const workflow = [
  ["Author", "Create a .deck.json file with metadata, theme, slides, and tile content."],
  ["Validate", "Run the JSON Schema validator against the included schemas and examples."],
  ["Render", "Use the TypeScript renderer or MCP App viewer to present the deck."],
];

function Feature({ title, description }) {
  return (
    <article className={styles.card}>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </article>
  );
}

function WorkflowStep({ label, description }) {
  return (
    <article className={styles.workflowStep}>
      <span className={styles.workflowLabel}>{label}</span>
      <p>{description}</p>
    </article>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Adaptive Slide documentation, schema reference, and MCP App viewer guide."
    >
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Adaptive Cards plus presentation semantics</p>
          <Heading as="h1" className={styles.heroTitle}>
            Schema-driven presentations that render in MCP-aware hosts.
          </Heading>
          <p className={styles.heroSubtitle}>
            Adaptive Slide defines a portable deck format, validates it with JSON
            Schema, and renders it through a TypeScript transformer plus an MCP App
            presentation viewer.
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/docs/getting-started">
              Start building
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/schema-reference">
              Browse schemas
            </Link>
            <Link className="button button--outline button--lg" to="/templates">
              Explore templates
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className={clsx("container", styles.featureGrid)}>
            {features.map((feature) => (
              <Feature key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={clsx("container", styles.split)}>
            <div>
              <p className={styles.eyebrow}>Developer workflow</p>
              <Heading as="h2">From JSON deck to hosted presentation</Heading>
              <p>
                The project ships the schemas, example deck, renderer, MCP server,
                and self-contained viewer needed to test the format locally before
                integrating with a host.
              </p>
              <div className={styles.workflow}>
                {workflow.map(([label, description]) => (
                  <WorkflowStep key={label} label={label} description={description} />
                ))}
              </div>
            </div>
            <div className={styles.terminal}>
              <pre>
                <code>{`npm install
npm run validate
npm run build
npm run serve`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={clsx("container", styles.linkGrid)}>
            <Link className={styles.linkCard} to="/docs/architecture">
              <span>Architecture</span>
              <p>Review the deck model, tile system, renderer, and source layout.</p>
            </Link>
            <Link className={styles.linkCard} to="/docs/mcp-app-plugin">
              <span>MCP App Plugin</span>
              <p>Connect the server, use the tools, and understand viewer behavior.</p>
            </Link>
            <Link className={styles.linkCard} to="/templates">
              <span>Template library</span>
              <p>Start from training, industry, and generated adaptive card tileslide decks.</p>
            </Link>
            <a
              className={styles.linkCard}
              href="https://github.com/DarbotLM/adaptive-slide/blob/main/examples/hello-world.deck.json"
            >
              <span>Example deck</span>
              <p>Inspect a working deck that exercises text, images, code, charts, containers, actions, and themes.</p>
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
