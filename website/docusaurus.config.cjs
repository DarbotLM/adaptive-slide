// @ts-check

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "Adaptive Slide",
  tagline: "Schema-driven presentations built on Adaptive Cards",
  favicon: "img/favicon.svg",

  url: "https://darbotlm.github.io",
  baseUrl: "/adaptive-slide/",
  organizationName: "DarbotLM",
  projectName: "adaptive-slide",
  deploymentBranch: "gh-pages",
  trailingSlash: false,

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import("@docusaurus/preset-classic").Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.cjs"),
          routeBasePath: "docs",
          editUrl: "https://github.com/DarbotLM/adaptive-slide/edit/main/website/",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    function generatedRouteCompatibilityPlugin() {
      return {
        name: "generated-route-compatibility",
        configureWebpack() {
          return {
            module: {
              rules: [
                {
                  test: /[\\/]\.docusaurus[\\/].+\.js$/,
                  type: "javascript/auto",
                },
              ],
            },
          };
        },
      };
    },
  ],

  themeConfig:
    /** @type {import("@docusaurus/preset-classic").ThemeConfig} */
    ({
      image: "img/social-card.svg",
      metadata: [
        {
          name: "description",
          content:
            "Adaptive Slide is a schema-first presentation format and MCP App viewer built on Adaptive Cards.",
        },
        {
          name: "keywords",
          content:
            "Adaptive Cards, presentations, JSON Schema, MCP, MCP App, Docusaurus",
        },
      ],
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: "Adaptive Slide",
        logo: {
          alt: "Adaptive Slide logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docs",
            position: "left",
            label: "Docs",
          },
          {
            to: "/docs/getting-started",
            position: "left",
            label: "Getting Started",
          },
          {
            to: "/templates",
            position: "left",
            label: "Templates",
          },
          {
            href: "https://github.com/DarbotLM/adaptive-slide",
            position: "right",
            label: "GitHub",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Introduction",
                to: "/docs/intro",
              },
              {
                label: "Schema Reference",
                to: "/docs/schema-reference",
              },
              {
                label: "MCP App Plugin",
                to: "/docs/mcp-app-plugin",
              },
              {
                label: "Templates",
                to: "/templates",
              },
            ],
          },
          {
            title: "Project",
            items: [
              {
                label: "Repository",
                href: "https://github.com/DarbotLM/adaptive-slide",
              },
              {
                label: "Example Deck",
                href: "https://github.com/DarbotLM/adaptive-slide/blob/main/examples/hello-world.deck.json",
              },
              {
                label: "Schemas",
                href: "https://github.com/DarbotLM/adaptive-slide/tree/main/schemas",
              },
            ],
          },
        ],
        copyright:
          "Copyright (c) DarbotLM contributors. Built with Docusaurus.",
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["json", "typescript", "bash"],
      },
    }),
};

module.exports = config;
