# Changelog

All notable changes to Adaptive Slide are documented in this file.

## [0.2.1] - 2026-07-31

### Maintenance

- Upgraded all direct dependencies to their absolute latest versions.
- Cleaned up and removed the entire `package.json` overrides block to keep the package tree clean and natural, without artificial locks.
- Analyzed transitive dependency vulnerabilities (e.g. `@hono/node-server` inside `@modelcontextprotocol/sdk`, and `brace-expansion`/`serialize-javascript` inside `@docusaurus/core`). These are either development-only (Docusaurus) or completely unreachable/unused in the Express-based runtime (Hono inside MCP SDK).
- Verified with a full build (`npm run build`), test suite (`npm test`, 59/59 passing), type-check (`npm run lint`), and schema validation (`npm run validate`, 207/207 checks passing).

## [0.2.0] - 2026-07-30

### Added

- Native Adaptive Cards bridge: `Tile.AdaptiveElement` and `Tile.AdaptiveCard` for embedding raw Adaptive Cards 1.6 elements/cards that don't yet have a curated tile type.
- New native input tiles: `Tile.Input.Date`, `Tile.Input.Time`, `Tile.Input.Toggle`.
- Vendored Adaptive Cards upstream schemas (`schemas/adaptivecards/`, versions 1.1.0-1.6.0) for reference and validation.
- New example decks: `examples/layered-hero.deck.json` (freeform/z-index layering) and `examples/native-adaptive-card.deck.json` (native bridge tiles).
- Web deck editor and expanded template gallery (industry + strategy-review templates) in `website/`.
- Dependabot configuration (`.github/dependabot.yml`) grouping Docusaurus, React, `@types/*`, and dev-tooling updates.

### Changed

- Hardened native Adaptive Cards action rendering (URL sanitization, unsupported action handling).
- Upgraded all packages and remediated prior `npm audit` findings.

### Security

- Overrode `minimatch` to `^10.2.5` to remediate a ReDoS advisory.

---

For versions prior to 0.2.0, see the [git history](https://github.com/DarbotLM/adaptive-slide/commits/main).
