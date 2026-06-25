import type {
  Deck, Slide, Tile, Theme, LayoutConfig, Background,
  TextTile, ImageTile, CodeTile, ChartTile, MediaTile, ContainerTile,
  InputTextTile, InputNumberTile, InputChoiceSetTile,
  GridPosition, FreeformPosition,
} from "./types/index.js";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function md(text: string): string {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n- /g, "\n• ")
    .replace(/\n/g, "<br>");
}

// --- Spacing / layout helpers ---

const SPACING_MAP: Record<string, string> = {
  none: "0", small: "4px", default: "8px", medium: "12px",
  large: "16px", extraLarge: "24px", padding: "16px",
};

const GAP_MAP: Record<string, string> = {
  none: "0", small: "4px", default: "8px", large: "16px",
};

const PADDING_MAP: Record<string, string> = {
  none: "0", small: "8px", default: "16px", large: "32px",
};

function gridStyle(pos: GridPosition): string {
  const parts: string[] = [];
  if (pos.column) parts.push(`grid-column: ${pos.column} / span ${pos.columnSpan ?? 1}`);
  if (pos.row) parts.push(`grid-row: ${pos.row} / span ${pos.rowSpan ?? 1}`);
  return parts.join("; ");
}

function freeformStyle(pos: FreeformPosition): string {
  return [
    "position: absolute",
    `left: ${pos.x}%`,
    `top: ${pos.y}%`,
    `width: ${pos.width}%`,
    `height: ${pos.height}%`,
    pos.rotation ? `transform: rotate(${pos.rotation}deg)` : "",
    pos.zIndex ? `z-index: ${pos.zIndex}` : "",
  ].filter(Boolean).join("; ");
}

// --- Semantic color map ---

function colorValue(color: string | undefined, theme?: Theme): string {
  const map: Record<string, string> = {
    default: theme?.darkMode ? "#e0e0e0" : "#333333",
    dark: "#1a1a1a",
    light: "#ffffff",
    accent: theme?.accentColor ?? "#0078d4",
    good: "#107c10",
    warning: "#ff8c00",
    attention: "#d13438",
  };
  return map[color ?? "default"] ?? map.default;
}

const SIZE_MAP: Record<string, string> = {
  small: "0.85rem", default: "1rem", medium: "1.25rem", large: "1.75rem", extraLarge: "2.5rem",
};

const WEIGHT_MAP: Record<string, string> = {
  lighter: "300", default: "400", bolder: "700",
};

// --- Tile renderers ---

function renderTextTile(tile: TextTile, theme?: Theme): string {
  const fontSize = SIZE_MAP[tile.size ?? "default"];
  const fontWeight = tile.style === "heading" ? "700"
    : tile.style === "subheading" ? "600"
    : WEIGHT_MAP[tile.weight ?? "default"];
  const textSize = tile.style === "heading" ? SIZE_MAP[tile.size ?? "large"]
    : tile.style === "subheading" ? SIZE_MAP[tile.size ?? "medium"]
    : tile.style === "caption" ? SIZE_MAP.small
    : fontSize;
  const color = colorValue(tile.color, theme);
  const align = tile.horizontalAlignment ?? "left";
  const font = tile.fontType === "monospace" ? "monospace" : "inherit";
  const maxLines = tile.maxLines
    ? `overflow:hidden; display:-webkit-box; -webkit-line-clamp:${tile.maxLines}; -webkit-box-orient:vertical;`
    : "";
  const quoteStyle = tile.style === "quote"
    ? "border-left:4px solid rgba(128,128,128,0.4); padding-left:12px; font-style:italic;"
    : "";

  return `<div class="tile tile-text" style="font-size:${textSize}; font-weight:${fontWeight}; color:${color}; text-align:${align}; font-family:${font}; ${maxLines} ${quoteStyle}">${md(tile.text)}</div>`;
}

function renderImageTile(tile: ImageTile, _theme?: Theme): string {
  const align = tile.horizontalAlignment ?? "center";
  const sizeMap: Record<string, string> = {
    auto: "max-width:100%", stretch: "width:100%", small: "max-width:120px",
    medium: "max-width:300px", large: "max-width:500px",
  };
  const imageStyle = tile.style ?? (tile.type === "Tile.Photo" ? "photo" : "default");
  const sizeStyle = tile.size ? sizeMap[tile.size] : tile.type === "Tile.Photo" ? "width:100%" : sizeMap.auto;
  const fit = tile.fit ?? (imageStyle === "photo" ? "cover" : "contain");
  const radius = tile.borderRadius
    ?? (imageStyle === "avatar" ? "999px" : imageStyle === "logo" ? "0" : imageStyle === "photo" ? "10px" : "4px");
  const bgStyle = tile.backgroundColor ? `background:${tile.backgroundColor};` : "";
  const aspect = tile.aspectRatio ? `aspect-ratio:${tile.aspectRatio.replace(":", "/")};` : "";
  const height = tile.height ? `height:${tile.height};` : "";
  const hasFrame = Boolean(aspect || height || tile.captionPosition === "overlay");
  const frameStyle = hasFrame ? `${sizeStyle}; ${aspect} ${height} overflow:hidden; position:relative; border-radius:${radius};` : "";
  const imgSizing = hasFrame ? "width:100%; height:100%;" : `${sizeStyle}; height:auto;`;
  const img = `<img src="${esc(tile.url)}" alt="${esc(tile.altText ?? "")}" style="${imgSizing}; object-fit:${fit}; border-radius:${radius}; display:block;" />`;
  const overlayCaption = tile.caption && tile.captionPosition === "overlay"
    ? `<figcaption style="position:absolute; left:0; right:0; bottom:0; padding:8px 10px; color:white; background:linear-gradient(transparent, rgba(0,0,0,0.72)); font-size:0.85rem; text-align:left;">${esc(tile.caption)}</figcaption>`
    : "";
  const bottomCaption = tile.caption && tile.captionPosition !== "overlay"
    ? `<figcaption style="text-align:center; font-size:0.85rem; color:#666; margin-top:4px;">${esc(tile.caption)}</figcaption>`
    : "";
  const imageHtml = hasFrame ? `<div style="${frameStyle}">${img}${overlayCaption}</div>` : img;

  return `<figure class="tile tile-image" style="text-align:${align}; margin:0; ${bgStyle}">
    ${imageHtml}
    ${bottomCaption}
  </figure>`;
}

function renderCodeTile(tile: CodeTile, theme?: Theme): string {
  const isDark = tile.theme === "dark" || (tile.theme !== "light" && theme?.darkMode);
  const bg = isDark ? "#1e1e1e" : "#f5f5f5";
  const fg = isDark ? "#d4d4d4" : "#333";
  const headerHtml = tile.title
    ? `<div style="padding:6px 12px; background:${isDark ? "#2d2d2d" : "#e8e8e8"}; font-size:0.8rem; color:${isDark ? "#aaa" : "#666"}; border-radius:6px 6px 0 0;">${esc(tile.title)}${tile.language ? ` <span style="opacity:0.6">· ${esc(tile.language)}</span>` : ""}</div>`
    : "";
  const lines = tile.code.split("\n");
  const startLine = tile.startLineNumber ?? 1;
  const highlightSet = new Set(tile.highlightLines ?? []);

  const codeLines = lines.map((line, i) => {
    const lineNum = startLine + i;
    const hl = highlightSet.has(lineNum) ? `background:${isDark ? "rgba(255,255,0,0.1)" : "rgba(255,255,0,0.2)"};` : "";
    const numHtml = (tile.showLineNumbers !== false)
      ? `<span style="color:${isDark ? "#666" : "#999"}; user-select:none; width:3em; display:inline-block; text-align:right; margin-right:12px;">${lineNum}</span>`
      : "";
    return `<div style="${hl} padding:0 12px;">${numHtml}${esc(line) || " "}</div>`;
  }).join("");

  const maxHeightStyle = tile.maxHeight ? `max-height:${tile.maxHeight}; overflow:auto;` : "";

  return `<div class="tile tile-code">
    ${headerHtml}
    <pre style="margin:0; padding:8px 0; background:${bg}; color:${fg}; font-family:'Fira Code',Consolas,monospace; font-size:0.85rem; border-radius:${tile.title ? "0 0 6px 6px" : "6px"}; overflow-x:auto; ${maxHeightStyle}">${codeLines}</pre>
  </div>`;
}

type NormalizedChartType = "bar" | "line" | "pie" | "donut" | "area" | "scatter";

const DEFAULT_CHART_COLORS = ["#0078d4", "#50e6ff", "#ff8c00", "#107c10", "#d13438", "#5c2d91"];

const CHART_TYPE_ALIASES: Record<string, NormalizedChartType> = {
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
};

function normalizeChartType(tile: ChartTile): NormalizedChartType {
  if (tile.type === "Tile.BarGraph") return "bar";
  if (tile.type === "Tile.PieChart") return tile.chartType === "donut" || tile.chartType === "donutchart" ? "donut" : "pie";
  if (tile.type === "Tile.DonutChart") return "donut";
  if (tile.type === "Tile.LineGraph") return "line";
  if (tile.type === "Tile.AreaChart") return "area";
  if (tile.type === "Tile.ScatterPlot") return "scatter";
  return tile.chartType ? CHART_TYPE_ALIASES[tile.chartType] ?? "bar" : "bar";
}

function chartTitle(tile: ChartTile): string {
  return tile.title ? `<div style="font-weight:600; margin-bottom:8px;">${esc(tile.title)}</div>` : "";
}

function chartAspectRatio(tile: ChartTile): string {
  return (tile.aspectRatio ?? "16:9").replace(":", "/");
}

function renderVerticalBarChart(tile: ChartTile, colors: string[]): string {
  const maxVal = Math.max(...tile.data.datasets.flatMap((d) => d.values.map((v) => Math.max(v, 0))), 1);
  const barGroups = tile.data.labels.map((label, i) => {
    const bars = tile.data.datasets.map((ds, di) => {
      const val = ds.values[i] ?? 0;
      const pct = Math.max((val / maxVal) * 100, 0);
      const color = ds.color ?? colors[di % colors.length];
      return `<div style="height:${pct}%; background:${color}; flex:1; border-radius:3px 3px 0 0; min-width:16px;" title="${esc(ds.label ?? "")}: ${val}"></div>`;
    }).join("");
    return `<div style="display:flex; flex-direction:column; align-items:stretch; gap:2px; flex:1;">
      <div style="display:flex; gap:2px; align-items:flex-end; height:120px;">${bars}</div>
      <div style="text-align:center; font-size:0.75rem; color:#888; margin-top:4px;">${esc(label)}</div>
    </div>`;
  }).join("");

  return `<div style="display:flex; gap:8px; align-items:flex-end;">${barGroups}</div>`;
}

function renderHorizontalBarChart(tile: ChartTile, colors: string[]): string {
  const maxVal = Math.max(...tile.data.datasets.flatMap((d) => d.values.map((v) => Math.max(v, 0))), 1);
  const rows = tile.data.labels.map((label, i) => {
    const bars = tile.data.datasets.map((ds, di) => {
      const val = ds.values[i] ?? 0;
      const pct = Math.max((val / maxVal) * 100, 0);
      const color = ds.color ?? colors[di % colors.length];
      const series = tile.data.datasets.length > 1 && ds.label ? ` ${esc(ds.label)}` : "";
      return `<div style="display:grid; grid-template-columns:minmax(72px, auto) 1fr minmax(36px, auto); gap:8px; align-items:center;">
        <span style="font-size:0.75rem; color:#666; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(label)}${series}</span>
        <span style="height:10px; background:rgba(128,128,128,0.18); border-radius:999px; overflow:hidden;">
          <span style="display:block; width:${pct}%; height:100%; background:${color}; border-radius:999px;"></span>
        </span>
        <span style="font-size:0.75rem; color:#666; text-align:right;">${val}</span>
      </div>`;
    }).join("");
    return `<div style="display:grid; gap:4px;">${bars}</div>`;
  }).join("");
  return `<div style="display:grid; gap:8px;">${rows}</div>`;
}

function renderCartesianChart(tile: ChartTile, chartType: "line" | "area" | "scatter", colors: string[]): string {
  const width = 360;
  const height = 180;
  const pad = 24;
  const values = tile.data.datasets.flatMap((d) => d.values);
  const minVal = Math.min(0, ...values);
  const maxVal = Math.max(1, ...values);
  const range = maxVal - minVal || 1;
  const labels = tile.data.labels;
  const xFor = (i: number) => labels.length <= 1
    ? width / 2
    : pad + (i / (labels.length - 1)) * (width - pad * 2);
  const yFor = (value: number) => height - pad - ((value - minVal) / range) * (height - pad * 2);
  const baseline = yFor(0);
  const grid = tile.showGrid === false ? "" : [0, 0.25, 0.5, 0.75, 1].map((step) => {
    const y = pad + step * (height - pad * 2);
    return `<line x1="${pad}" y1="${y}" x2="${width - pad}" y2="${y}" stroke="rgba(128,128,128,0.22)" stroke-width="1" />`;
  }).join("");
  const xLabels = labels.map((label, i) => {
    if (labels.length > 6 && i !== 0 && i !== labels.length - 1) return "";
    return `<text x="${xFor(i)}" y="${height - 5}" text-anchor="middle" font-size="10" fill="#777">${esc(label)}</text>`;
  }).join("");
  const series = tile.data.datasets.map((ds, di) => {
    const color = ds.color ?? colors[di % colors.length];
    const points = labels.map((_, i) => `${xFor(i)},${yFor(ds.values[i] ?? 0)}`).join(" ");
    if (chartType === "scatter") {
      return labels.map((_, i) => `<circle cx="${xFor(i)}" cy="${yFor(ds.values[i] ?? 0)}" r="4" fill="${color}" />`).join("");
    }
    const area = chartType === "area"
      ? `<polygon points="${xFor(0)},${baseline} ${points} ${xFor(labels.length - 1)},${baseline}" fill="${color}" opacity="0.22" />`
      : "";
    return `${area}<polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`;
  }).join("");

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(tile.title ?? `${chartType} chart`)}" style="width:100%; aspect-ratio:${chartAspectRatio(tile)}; max-height:220px;">
    ${grid}
    <line x1="${pad}" y1="${baseline}" x2="${width - pad}" y2="${baseline}" stroke="rgba(128,128,128,0.35)" stroke-width="1" />
    ${series}
    ${xLabels}
  </svg>`;
}

function renderPieChart(tile: ChartTile, chartType: "pie" | "donut", colors: string[], theme?: Theme): string {
  const dataset = tile.data.datasets[0];
  const values = dataset?.values.map((v) => Math.max(v, 0)) ?? [];
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let cumAngle = 0;
  const slices = values.map((val, i) => {
    const pct = val / total;
    const startAngle = cumAngle * 360;
    cumAngle += pct;
    const endAngle = cumAngle * 360;
    const color = colors[i % colors.length];
    return `${color} ${startAngle}deg ${endAngle}deg`;
  });
  const holeSize = Math.max(0, Math.min(tile.holeSize ?? 45, 80));
  const surface = theme?.darkMode ? "#1a1a1a" : "#ffffff";
  const chartBackground = chartType === "donut"
    ? `radial-gradient(circle, ${surface} 0 ${holeSize}%, transparent ${holeSize + 1}%), conic-gradient(${slices.join(", ")})`
    : `conic-gradient(${slices.join(", ")})`;
  const legendHtml = tile.showLegend !== false ? renderPieLegend(tile.data.labels, colors) : "";

  return `<div style="display:grid; justify-items:center; gap:8px;">
    <div style="width:150px; height:150px; border-radius:50%; background:${chartBackground};"></div>
    ${legendHtml}
  </div>`;
}

function renderChartTile(tile: ChartTile, theme?: Theme): string {
  const colors = tile.colors ?? DEFAULT_CHART_COLORS;
  const chartType = normalizeChartType(tile);
  const titleHtml = chartTitle(tile);
  let chartHtml: string;

  if (chartType === "bar") {
    chartHtml = tile.orientation === "horizontal" || tile.chartType === "horizontalBar"
      ? renderHorizontalBarChart(tile, colors)
      : renderVerticalBarChart(tile, colors);
  } else if (chartType === "pie" || chartType === "donut") {
    chartHtml = renderPieChart(tile, chartType, colors, theme);
  } else {
    chartHtml = renderCartesianChart(tile, chartType, colors);
  }

  const legendHtml = chartType !== "pie" && chartType !== "donut" && tile.showLegend !== false
    ? renderLegend(tile.data.datasets, colors)
    : "";
  return `<div class="tile tile-chart">${titleHtml}${chartHtml}${legendHtml}</div>`;
}

function renderLegend(datasets: { label?: string; color?: string }[], colors: string[]): string {
  const items = datasets.map((ds, i) =>
    `<span style="display:inline-flex; align-items:center; gap:4px; margin-right:12px;">
      <span style="width:10px; height:10px; background:${ds.color ?? colors[i % colors.length]}; border-radius:2px;"></span>
      <span style="font-size:0.75rem;">${esc(ds.label ?? "")}</span>
    </span>`
  ).join("");
  return `<div style="margin-top:8px;">${items}</div>`;
}

function renderPieLegend(labels: string[], colors: string[]): string {
  const items = labels.map((label, i) =>
    `<span style="display:inline-flex; align-items:center; gap:4px; margin-right:12px;">
      <span style="width:10px; height:10px; background:${colors[i % colors.length]}; border-radius:2px;"></span>
      <span style="font-size:0.75rem;">${esc(label)}</span>
    </span>`
  ).join("");
  return `<div style="margin-top:8px; text-align:center;">${items}</div>`;
}

function renderMediaTile(tile: MediaTile): string {
  const src = tile.sources[0];
  if (!src) return `<div class="tile tile-media" style="color:#999;">No media source</div>`;

  const isAudio = src.mimeType?.startsWith("audio/") ?? false;
  const attrs = [
    tile.autoplay ? "autoplay" : "",
    tile.loop ? "loop" : "",
    tile.muted ? "muted" : "",
    "controls",
  ].filter(Boolean).join(" ");

  if (isAudio) {
    return `<div class="tile tile-media"><audio ${attrs}>${tile.sources.map((s) => `<source src="${esc(s.url)}"${s.mimeType ? ` type="${esc(s.mimeType)}"` : ""} />`).join("")}</audio></div>`;
  }

  const poster = tile.poster ? `poster="${esc(tile.poster)}"` : "";
  return `<div class="tile tile-media" style="aspect-ratio:${tile.aspectRatio ?? "16/9"};">
    <video ${attrs} ${poster} style="width:100%; height:100%; object-fit:contain; border-radius:4px;">
      ${tile.sources.map((s) => `<source src="${esc(s.url)}"${s.mimeType ? ` type="${esc(s.mimeType)}"` : ""} />`).join("")}
    </video>
  </div>`;
}

function renderContainerTile(tile: ContainerTile, theme?: Theme): string {
  const styleMap: Record<string, string> = {
    default: "", emphasis: "background:rgba(128,128,128,0.08);",
    good: "background:rgba(16,124,16,0.08); border-left:3px solid #107c10;",
    attention: "background:rgba(209,52,56,0.08); border-left:3px solid #d13438;",
    warning: "background:rgba(255,140,0,0.08); border-left:3px solid #ff8c00;",
    accent: `background:rgba(0,120,212,0.08); border-left:3px solid ${theme?.accentColor ?? "#0078d4"};`,
  };
  const containerStyle = styleMap[tile.style ?? "default"];
  const layoutStyle = tile.layout === "row"
    ? "display:flex; gap:16px;"
    : tile.layout === "wrap"
    ? "display:flex; flex-wrap:wrap; gap:16px;"
    : "display:flex; flex-direction:column; gap:8px;";
  const valign = tile.verticalContentAlignment ?? "top";
  const alignMap: Record<string, string> = { top: "flex-start", center: "center", bottom: "flex-end" };
  const bgImg = tile.backgroundImage
    ? `background-image:url('${esc(tile.backgroundImage.url)}'); background-size:${tile.backgroundImage.fillMode ?? "cover"}; background-position:center;`
    : "";
  const minH = tile.minHeight ? `min-height:${tile.minHeight};` : "";

  const childrenHtml = tile.items.map((t) => renderTile(t, theme)).join("");

  return `<div class="tile tile-container" style="padding:12px; border-radius:6px; ${containerStyle} ${layoutStyle} align-items:${alignMap[valign]}; ${bgImg} ${minH}">
    ${childrenHtml}
  </div>`;
}

// --- Main render functions ---

function renderInputLabel(label?: string, isRequired?: boolean): string {
  if (!label) return "";
  const star = isRequired ? `<span style="color:#d13438; margin-left:4px;" aria-hidden="true">*</span>` : "";
  return `<label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:4px;">${esc(label)}${star}</label>`;
}

function renderInputTextTile(tile: InputTextTile): string {
  const id = esc(tile.id);
  const label = renderInputLabel(tile.label, tile.isRequired);
  const placeholder = tile.placeholder ? `placeholder="${esc(tile.placeholder)}"` : "";
  const required = tile.isRequired ? "required" : "";
  const maxlen = typeof tile.maxLength === "number" ? `maxlength="${tile.maxLength}"` : "";
  const value = tile.value != null ? esc(String(tile.value)) : "";
  const baseStyle = "width:100%; padding:8px 10px; border:1px solid rgba(128,128,128,0.4); border-radius:4px; font-family:inherit; font-size:0.9rem; box-sizing:border-box;";
  const inner = tile.isMultiline
    ? `<textarea name="${id}" id="${id}" ${placeholder} ${required} ${maxlen} rows="3" style="${baseStyle} resize:vertical; min-height:72px;">${value}</textarea>`
    : `<input type="${esc(tile.style ?? "text")}" name="${id}" id="${id}" value="${value}" ${placeholder} ${required} ${maxlen} style="${baseStyle}" />`;
  return `<div class="tile tile-input-text">${label}${inner}</div>`;
}

function renderInputNumberTile(tile: InputNumberTile): string {
  const id = esc(tile.id);
  const label = renderInputLabel(tile.label, tile.isRequired);
  const placeholder = tile.placeholder ? `placeholder="${esc(tile.placeholder)}"` : "";
  const required = tile.isRequired ? "required" : "";
  const min = typeof tile.min === "number" ? `min="${tile.min}"` : "";
  const max = typeof tile.max === "number" ? `max="${tile.max}"` : "";
  const value = typeof tile.value === "number" ? `value="${tile.value}"` : "";
  const baseStyle = "width:100%; padding:8px 10px; border:1px solid rgba(128,128,128,0.4); border-radius:4px; font-family:inherit; font-size:0.9rem; box-sizing:border-box;";
  return `<div class="tile tile-input-number">${label}<input type="number" name="${id}" id="${id}" ${value} ${placeholder} ${required} ${min} ${max} style="${baseStyle}" /></div>`;
}

function renderInputChoiceSetTile(tile: InputChoiceSetTile): string {
  const id = esc(tile.id);
  const label = renderInputLabel(tile.label, tile.isRequired);
  const required = tile.isRequired ? "required" : "";
  const style = tile.style ?? "compact";
  const choices = tile.choices ?? [];
  const initial = tile.value != null ? String(tile.value).split(",").map((v) => v.trim()) : [];

  if (style === "expanded") {
    const inputType = tile.isMultiSelect ? "checkbox" : "radio";
    const items = choices.map((c, i) => {
      const checked = initial.includes(c.value) ? "checked" : "";
      const itemId = `${id}_${i}`;
      return `<label for="${itemId}" style="display:flex; gap:8px; align-items:center; padding:6px 0; cursor:pointer; font-size:0.9rem;">
        <input type="${inputType}" name="${id}" id="${itemId}" value="${esc(c.value)}" ${checked} ${required} />
        <span>${esc(c.title)}</span>
      </label>`;
    }).join("");
    return `<fieldset class="tile tile-input-choiceset" style="border:none; padding:0; margin:0;">${label}<div role="group">${items}</div></fieldset>`;
  }

  const placeholder = tile.placeholder ? `<option value="">${esc(tile.placeholder)}</option>` : "";
  const opts = choices.map((c) => {
    const sel = initial.includes(c.value) ? "selected" : "";
    return `<option value="${esc(c.value)}" ${sel}>${esc(c.title)}</option>`;
  }).join("");
  const multiple = tile.isMultiSelect ? "multiple" : "";
  const baseStyle = "width:100%; padding:8px 10px; border:1px solid rgba(128,128,128,0.4); border-radius:4px; font-family:inherit; font-size:0.9rem; background:transparent; box-sizing:border-box;";
  return `<div class="tile tile-input-choiceset">${label}<select name="${id}" id="${id}" ${required} ${multiple} style="${baseStyle}">${placeholder}${opts}</select></div>`;
}

export function renderTile(tile: Tile, theme?: Theme): string {
  if (tile.isVisible === false) return "";

  const spacingStyle = tile.spacing ? `margin-top:${SPACING_MAP[tile.spacing] ?? "8px"};` : "";
  const separator = tile.separator ? `<hr style="border:none; border-top:1px solid rgba(128,128,128,0.2); margin:8px 0;" />` : "";
  const posStyle = tile.gridPosition
    ? gridStyle(tile.gridPosition)
    : tile.freeformPosition
    ? freeformStyle(tile.freeformPosition)
    : "";
  const wrapStyle = [spacingStyle, posStyle].filter(Boolean).join(" ");

  let inner: string;
  switch (tile.type) {
    case "Tile.Text":             inner = renderTextTile(tile, theme); break;
    case "Tile.Image":
    case "Tile.Photo":            inner = renderImageTile(tile, theme); break;
    case "Tile.Code":             inner = renderCodeTile(tile, theme); break;
    case "Tile.Chart":
    case "Tile.BarGraph":
    case "Tile.PieChart":
    case "Tile.DonutChart":
    case "Tile.LineGraph":
    case "Tile.AreaChart":
    case "Tile.ScatterPlot":      inner = renderChartTile(tile, theme); break;
    case "Tile.Media":            inner = renderMediaTile(tile); break;
    case "Tile.Container":        inner = renderContainerTile(tile, theme); break;
    case "Tile.Input.Text":       inner = renderInputTextTile(tile); break;
    case "Tile.Input.Number":     inner = renderInputNumberTile(tile); break;
    case "Tile.Input.ChoiceSet":  inner = renderInputChoiceSetTile(tile); break;
    default:                      inner = `<div class="tile tile-unknown" style="color:#999;">Unknown tile type: ${esc((tile as Tile).type)}</div>`;
  }

  return `${separator}<div style="${wrapStyle}">${inner}</div>`;
}

export function renderBackground(bg?: Background): string {
  if (!bg) return "";
  if (bg.gradient) {
    const { type, colors, angle } = bg.gradient;
    return type === "radial"
      ? `background: radial-gradient(${colors.join(", ")});`
      : `background: linear-gradient(${angle ?? 180}deg, ${colors.join(", ")});`;
  }
  if (bg.image) {
    return `background: url('${esc(bg.image.url)}') center/${bg.image.fillMode ?? "cover"} no-repeat; ${bg.image.opacity != null ? `opacity:${bg.image.opacity};` : ""}`;
  }
  if (bg.color) return `background: ${bg.color};`;
  return "";
}

export function renderSlide(slide: Slide, theme?: Theme, defaults?: Deck["defaults"]): string {
  const layout = slide.layout ?? { mode: defaults?.layout ?? "stack" };
  const padding = PADDING_MAP[defaults?.padding ?? "default"];
  const bgStyle = renderBackground(slide.background);

  let layoutStyle: string;
  switch (layout.mode) {
    case "grid":
      layoutStyle = `display:grid; grid-template-columns:repeat(${layout.columns ?? 2}, 1fr); gap:${GAP_MAP[layout.gap ?? "default"]};`;
      break;
    case "freeform":
      layoutStyle = "position:relative; width:100%; height:100%;";
      break;
    default:
      layoutStyle = `display:flex; flex-direction:column; gap:${GAP_MAP[layout.gap ?? "default"]};`;
  }

  const halign = layout.horizontalAlignment ?? "stretch";
  const valign = layout.verticalAlignment ?? "top";
  const hMap: Record<string, string> = { left: "flex-start", center: "center", right: "flex-end", stretch: "stretch" };
  const vMap: Record<string, string> = { top: "flex-start", center: "center", bottom: "flex-end" };
  const alignStyle = layout.mode === "stack"
    ? `align-items:${hMap[halign]}; justify-content:${vMap[valign]};`
    : "";

  const tilesHtml = slide.body.map((t) => renderTile(t, theme)).join("\n");

  return `<div class="slide" style="${bgStyle} padding:${padding}; ${layoutStyle} ${alignStyle} min-height:100%; box-sizing:border-box;">
    ${tilesHtml}
  </div>`;
}

export function renderDeck(deck: Deck): string {
  return deck.slides.map((slide) => renderSlide(slide, deck.theme, deck.defaults)).join("\n");
}
