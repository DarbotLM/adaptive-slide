# Changelog

All notable changes to Adaptive Slide are documented in this file.

## [0.2.1] - 2026-07-31

### Maintenance

- Upgraded all npm dependencies to their latest versions satisfying `package.json` ranges (`npm install` + `npm-check-updates` audit — no ranges needed bumping, all were already current).
- Added an override for `brace-expansion` (`^5.0.8`) to remediate a high-severity denial-of-service advisory ([GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg)) pulled in transitively via `minimatch`.
- `npm audit` now reports 0 vulnerabilities.
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
