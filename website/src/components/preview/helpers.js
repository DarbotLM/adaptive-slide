// Shared style/class helpers used by tile renderers.
// All values map to AC 1.6 props or are CSS-only preview affordances.

import styles from "./preview.module.css";

export function isStatContainer(tile) {
  return (
    tile?.type === "Tile.Container" &&
    Array.isArray(tile.items) &&
    tile.items.length === 2 &&
    tile.items[0]?.type === "Tile.Text" &&
    tile.items[0]?.style === "heading" &&
    tile.items[1]?.type === "Tile.Text" &&
    tile.items[1]?.style === "caption"
  );
}

export function containerStyleClass(style) {
  switch (style) {
    case "good": return styles.containerGood;
    case "warning": return styles.containerWarning;
    case "attention": return styles.containerAttention;
    case "accent": return styles.containerAccent;
    case "emphasis": return styles.containerEmphasis;
    default: return styles.containerDefault;
  }
}

export function textStyleClass(style) {
  switch (style) {
    case "heading": return styles.textHeading;
    case "subheading": return styles.textSubheading;
    case "caption": return styles.textCaption;
    case "quote": return styles.textQuote;
    default: return styles.textBody;
  }
}

export function textColorClass(color) {
  switch (color) {
    case "light": return styles.textLight;
    case "accent": return styles.textAccent;
    case "good": return styles.textGood;
    case "warning": return styles.textWarning;
    case "attention": return styles.textAttention;
    default: return undefined;
  }
}

export function textSizeClass(size) {
  switch (size) {
    case "small": return styles.sizeSmall;
    case "medium": return styles.sizeMedium;
    case "large": return styles.sizeLarge;
    case "extraLarge": return styles.sizeExtraLarge;
    default: return undefined;
  }
}

export function alignClass(align) {
  switch (align) {
    case "center": return styles.alignCenter;
    case "right": return styles.alignRight;
    default: return undefined;
  }
}

export function gridStyleFor(tile) {
  if (!tile?.gridPosition) return undefined;
  const { column, row, columnSpan = 1, rowSpan = 1 } = tile.gridPosition;
  const style = {};
  if (column != null) style.gridColumn = `${column} / span ${columnSpan}`;
  if (row != null) style.gridRow = `${row} / span ${rowSpan}`;
  return style;
}

export function normalizeChartType(tile) {
  if (tile.type === "Tile.BarGraph") return "bar";
  if (tile.type === "Tile.PieChart") return tile.chartType === "donut" || tile.chartType === "donutchart" ? "donut" : "pie";
  if (tile.type === "Tile.DonutChart") return "donut";
  if (tile.type === "Tile.LineGraph") return "line";
  if (tile.type === "Tile.AreaChart") return "area";
  if (tile.type === "Tile.ScatterPlot") return "scatter";
  return {
    bar: "bar",
    bargraph: "bar",
    horizontalBar: "bar",
    line: "line",
    linegraph: "line",
    pie: "pie",
    piechart: "pie",
    donut: "donut",
    donutchart: "donut",
    area: "area",
    areachart: "area",
    scatter: "scatter",
    scatterplot: "scatter",
  }[tile.chartType] ?? "bar";
}

export function isChartTile(tile) {
  return (
    tile?.type === "Tile.Chart" ||
    tile?.type === "Tile.BarGraph" ||
    tile?.type === "Tile.PieChart" ||
    tile?.type === "Tile.DonutChart" ||
    tile?.type === "Tile.LineGraph" ||
    tile?.type === "Tile.AreaChart" ||
    tile?.type === "Tile.ScatterPlot"
  );
}

export function renderInlineText(text) {
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

export function renderTextContent(text) {
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

export function slideBackgroundStyle(slide, deck) {
  const bg = slide?.background;
  if (bg?.gradient) {
    const colors = bg.gradient.colors.join(", ");
    const angle = bg.gradient.angle ?? 180;
    const fn = bg.gradient.type === "radial" ? "radial-gradient(circle" : `linear-gradient(${angle}deg`;
    return { background: `${fn}, ${colors})` };
  }
  if (bg?.color) return { background: bg.color };
  if (deck?.theme?.backgroundColor) {
    return {
      background: `linear-gradient(135deg, ${deck.theme.backgroundColor}, ${deck.theme.primaryColor ?? deck.theme.backgroundColor})`,
    };
  }
  return { background: "linear-gradient(135deg, #071a2f, #0d3a66)" };
}

/**
 * Encode a path { itemPath: number[] } into a string for use in data attributes.
 */
export function encodePath(itemPath) {
  return itemPath.join(".");
}

/**
 * Decode a data-tile-path attribute back into an itemPath array.
 */
export function decodePath(attrValue) {
  if (!attrValue) return null;
  return attrValue.split(".").map((n) => parseInt(n, 10));
}
