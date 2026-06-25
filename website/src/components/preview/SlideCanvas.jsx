import clsx from "clsx";
import { useCallback } from "react";
import { AdaptiveTile } from "./tiles.jsx";
import { decodePath, slideBackgroundStyle } from "./helpers.js";
import styles from "./preview.module.css";

/**
 * SlideCanvas renders a slide. When `interactive` is true, a delegated click
 * handler converts clicks on tiles (which carry data-tile-path) into selection
 * events via `onSelect(itemPath)`.
 */
export function SlideCanvas({
  slide,
  deck,
  compact = false,
  interactive = false,
  selectedPath = null,
  onSelect,
}) {
  const grid = slide?.layout?.mode === "grid";
  const columns = slide?.layout?.columns ?? 4;
  const innerStyle = grid
    ? {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: compact ? "0.45rem" : "0.7rem",
      }
    : { display: "grid", gap: compact ? "0.5rem" : "0.85rem" };

  const cssVars = {};
  if (deck?.theme?.accentColor) cssVars["--slideAccent"] = deck.theme.accentColor;
  if (deck?.theme?.primaryColor) cssVars["--slidePrimary"] = deck.theme.primaryColor;

  const handleClick = useCallback(
    (event) => {
      if (!interactive || !onSelect) return;
      const target = event.target.closest("[data-tile-path]");
      if (!target) {
        onSelect(null);
        return;
      }
      const path = decodePath(target.getAttribute("data-tile-path"));
      if (path) {
        event.stopPropagation();
        onSelect(path);
      }
    },
    [interactive, onSelect],
  );

  const ctx = interactive ? { interactive: true, selectedPath } : null;

  return (
    <section
      className={clsx(
        styles.slideCanvas,
        compact && styles.slideCanvasCompact,
        interactive && styles.slideCanvasInteractive,
      )}
      style={{ ...slideBackgroundStyle(slide, deck), ...cssVars }}
      aria-label={`${slide?.title ?? deck?.metadata?.title ?? "Adaptive deck"} preview`}
      onClickCapture={handleClick}
    >
      <div className={styles.slideInner} style={innerStyle}>
        {(slide?.body ?? []).map((tile, idx) => (
          <AdaptiveTile key={`tile-${idx}`} tile={tile} ctx={ctx} path={[idx]} />
        ))}
      </div>
    </section>
  );
}
