import clsx from "clsx";
import {
  alignClass,
  containerStyleClass,
  encodePath,
  gridStyleFor,
  isChartTile,
  isStatContainer,
  normalizeChartType,
  renderTextContent,
  textColorClass,
  textSizeClass,
  textStyleClass,
} from "./helpers.js";
import styles from "./preview.module.css";

// =====================================================================
// Selection ring wrapper
// =====================================================================
//
// `tilePath` lets the workspace canvas use a delegated click handler.
// It also marks the selected tile with a visual ring.

function withSelection({ children, path, isSelected, isInteractive }) {
  if (!isInteractive) return children;
  const cls = clsx(styles.selectableSlot, isSelected && styles.selectedSlot);
  return (
    <div className={cls} data-tile-path={encodePath(path)}>
      {children}
    </div>
  );
}

// =====================================================================
// Stat block (heading + caption Container) — selectable as a unit
// =====================================================================

function StatBlock({ tile }) {
  return (
    <div
      className={clsx(styles.statBlock, containerStyleClass(tile.style))}
      style={gridStyleFor(tile)}
    >
      <span className={styles.statValue}>{tile.items[0]?.text}</span>
      <span className={styles.statLabel}>{tile.items[1]?.text}</span>
    </div>
  );
}

// =====================================================================
// Chart blocks
// =====================================================================

function BarPreview({ labels, datasets, colors }) {
  const max = Math.max(...datasets.flatMap((ds) => ds.values), 1);
  return (
    <div className={styles.chartRows}>
      {labels.map((label, idx) => {
        const value = datasets[0]?.values[idx] ?? 0;
        const color = datasets[0]?.color || colors[0];
        const widthPct = Math.max((value / max) * 100, 3);
        return (
          <div className={styles.chartRow} key={`bar-${idx}`}>
            <span className={styles.chartLabel}>{label}</span>
            <div className={styles.chartTrack}>
              <div className={styles.chartFill} style={{ width: `${widthPct}%`, background: color }} />
            </div>
            <span className={styles.chartValue}>{value}</span>
          </div>
        );
      })}
    </div>
  );
}

function PiePreview({ tile, chartType, colors, labels, values }) {
  const total = values.reduce((sum, value) => sum + Math.max(value, 0), 0) || 1;
  let cumulative = 0;
  const slices = values.map((value, idx) => {
    const start = cumulative * 360;
    cumulative += Math.max(value, 0) / total;
    const end = cumulative * 360;
    return `${colors[idx % colors.length]} ${start}deg ${end}deg`;
  });
  const hole = Math.max(0, Math.min(tile.holeSize ?? 45, 80));
  const background = chartType === "donut"
    ? `radial-gradient(circle, #071a2f 0 ${hole}%, transparent ${hole + 1}%), conic-gradient(${slices.join(", ")})`
    : `conic-gradient(${slices.join(", ")})`;
  return (
    <div className={styles.piePreviewWrap}>
      <div className={styles.piePreview} style={{ background }} />
      <div className={styles.chartLegend}>
        {labels.map((label, idx) => (
          <span key={`pie-leg-${idx}`}>
            <span style={{ background: colors[idx % colors.length] }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CartesianPreview({ tile, chartType, colors, labels, datasets }) {
  const width = 320;
  const height = 150;
  const pad = 18;
  const values = datasets.flatMap((ds) => ds.values);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const range = max - min || 1;
  const xFor = (idx) => labels.length <= 1 ? width / 2 : pad + (idx / (labels.length - 1)) * (width - pad * 2);
  const yFor = (value) => height - pad - ((value - min) / range) * (height - pad * 2);
  const baseline = yFor(0);
  return (
    <svg className={styles.cartesianPreview} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={tile.title ?? `${chartType} chart`}>
      {tile.showGrid === false ? null : [0, 0.25, 0.5, 0.75, 1].map((step) => {
        const y = pad + step * (height - pad * 2);
        return <line key={`grid-${step}`} x1={pad} y1={y} x2={width - pad} y2={y} />;
      })}
      <line className={styles.axisLine} x1={pad} y1={baseline} x2={width - pad} y2={baseline} />
      {datasets.map((ds, dsIdx) => {
        const color = ds.color || colors[dsIdx % colors.length];
        const points = labels.map((_, idx) => `${xFor(idx)},${yFor(ds.values[idx] ?? 0)}`).join(" ");
        if (chartType === "scatter") {
          return labels.map((_, idx) => (
            <circle key={`pt-${dsIdx}-${idx}`} cx={xFor(idx)} cy={yFor(ds.values[idx] ?? 0)} r="3.5" fill={color} />
          ));
        }
        return (
          <g key={`line-${dsIdx}`}>
            {chartType === "area" ? (
              <polygon points={`${xFor(0)},${baseline} ${points} ${xFor(labels.length - 1)},${baseline}`} fill={color} opacity="0.22" />
            ) : null}
            <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}

function ChartBlock({ tile }) {
  const datasets = tile.data?.datasets ?? [];
  const dataset = datasets[0];
  const labels = tile.data?.labels ?? [];
  if (!dataset) return null;
  const chartType = normalizeChartType(tile);
  const colors = tile.colors ?? ["#50e6ff", "#a78bfa", "#f59e0b", "#6ee7b7", "#fda4af"];
  return (
    <div className={clsx(styles.chartBlock, styles.containerEmphasis)} style={gridStyleFor(tile)}>
      {tile.title ? <span className={styles.blockTitle}>{tile.title}</span> : null}
      {chartType === "pie" || chartType === "donut" ? (
        <PiePreview tile={tile} chartType={chartType} colors={colors} labels={labels} values={dataset.values} />
      ) : chartType === "line" || chartType === "area" || chartType === "scatter" ? (
        <CartesianPreview tile={tile} chartType={chartType} colors={colors} labels={labels} datasets={datasets} />
      ) : (
        <BarPreview labels={labels} datasets={datasets} colors={colors} />
      )}
    </div>
  );
}

// =====================================================================
// Text / Container / Code / Image / Media tiles
// =====================================================================

function TextTile({ tile }) {
  const className = clsx(
    styles.textTile,
    textStyleClass(tile.style),
    textSizeClass(tile.size),
    textColorClass(tile.color),
    alignClass(tile.horizontalAlignment),
    tile.weight === "bolder" && styles.weightBolder,
  );
  return (
    <div className={className} style={gridStyleFor(tile)}>
      {renderTextContent(tile.text)}
    </div>
  );
}

function ContainerTile({ tile, depth, ctx, path }) {
  const items = Array.isArray(tile.items) ? tile.items : [];
  const isRow = tile.layout === "row";
  const isWrap = tile.layout === "wrap";
  const className = clsx(
    styles.containerBlock,
    containerStyleClass(tile.style),
    depth > 0 && styles.containerNested,
    isRow && styles.containerRow,
    isWrap && styles.containerWrap,
  );
  return (
    <div className={className} style={gridStyleFor(tile)}>
      {items.map((child, idx) => (
        <AdaptiveTile key={`ct-${idx}`} tile={child} depth={depth + 1} ctx={ctx} path={[...path, idx]} />
      ))}
    </div>
  );
}

function CodeTile({ tile }) {
  return (
    <pre className={clsx(styles.codeTile, styles.containerEmphasis)} style={gridStyleFor(tile)}>
      {tile.title ? <span className={styles.blockTitle}>{tile.title}</span> : null}
      <code>{tile.code}</code>
    </pre>
  );
}

function ImageTile({ tile }) {
  const imageStyle = tile.style ?? (tile.type === "Tile.Photo" ? "photo" : "default");
  const fit = tile.fit ?? (imageStyle === "photo" ? "cover" : "contain");
  const radius = tile.borderRadius
    ?? (imageStyle === "avatar" ? "999px" : imageStyle === "logo" ? "0" : imageStyle === "photo" ? "12px" : "10px");
  const aspectRatio = tile.aspectRatio ? tile.aspectRatio.replace(":", "/") : undefined;
  const constrained = Boolean(aspectRatio || tile.height || tile.captionPosition === "overlay");
  const frameStyle = {
    aspectRatio,
    height: tile.height,
    borderRadius: radius,
  };
  const imgStyle = {
    borderRadius: radius,
    objectFit: fit,
    height: constrained ? "100%" : "auto",
  };
  return (
    <figure className={styles.imageTile} style={gridStyleFor(tile)}>
      <div className={styles.imageFrame} style={frameStyle}>
        {tile.url ? (
          <img src={tile.url} alt={tile.altText ?? ""} style={imgStyle} />
        ) : (
          <div className={styles.imagePlaceholder}>No image URL</div>
        )}
        {tile.caption && tile.captionPosition === "overlay" ? (
          <figcaption className={styles.imageCaptionOverlay}>{tile.caption}</figcaption>
        ) : null}
      </div>
      {tile.caption && tile.captionPosition !== "overlay" ? <figcaption>{tile.caption}</figcaption> : null}
    </figure>
  );
}

function MediaTile({ tile }) {
  const source = Array.isArray(tile.sources) ? tile.sources[0] : null;
  const aspect = (tile.aspectRatio || "16:9").replace(":", "/");
  return (
    <div
      className={styles.mediaTile}
      style={{ ...gridStyleFor(tile), aspectRatio: aspect }}
    >
      {tile.poster ? (
        <img className={styles.mediaPoster} src={tile.poster} alt={tile.altText ?? ""} />
      ) : null}
      <span className={styles.mediaPlayBadge} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      </span>
      {source?.url ? (
        <span className={styles.mediaSourceLabel}>{source.mimeType ?? "media"}</span>
      ) : (
        <span className={styles.mediaSourceLabel}>no source</span>
      )}
    </div>
  );
}

// =====================================================================
// Input tile mocks
// =====================================================================

function InputLabelMock({ label, isRequired }) {
  if (!label) return null;
  return (
    <label className={styles.inputLabelMock}>
      {label}
      {isRequired ? (
        <span className={styles.inputRequiredStar} aria-hidden="true">*</span>
      ) : null}
    </label>
  );
}

function InputTextMock({ tile }) {
  return (
    <div className={styles.inputMock} style={gridStyleFor(tile)}>
      <InputLabelMock label={tile.label} isRequired={tile.isRequired} />
      {tile.isMultiline ? (
        <textarea
          className={styles.inputControl}
          placeholder={tile.placeholder ?? ""}
          defaultValue={tile.value ?? ""}
          rows={3}
          maxLength={tile.maxLength ?? undefined}
          disabled
          readOnly
        />
      ) : (
        <input
          className={styles.inputControl}
          type={tile.style ?? "text"}
          placeholder={tile.placeholder ?? ""}
          defaultValue={tile.value ?? ""}
          maxLength={tile.maxLength ?? undefined}
          disabled
          readOnly
        />
      )}
    </div>
  );
}

function InputNumberMock({ tile }) {
  return (
    <div className={styles.inputMock} style={gridStyleFor(tile)}>
      <InputLabelMock label={tile.label} isRequired={tile.isRequired} />
      <input
        className={styles.inputControl}
        type="number"
        placeholder={tile.placeholder ?? ""}
        defaultValue={tile.value ?? ""}
        min={tile.min ?? undefined}
        max={tile.max ?? undefined}
        disabled
        readOnly
      />
    </div>
  );
}

function InputChoiceSetMock({ tile }) {
  const style = tile.style ?? "compact";
  const choices = Array.isArray(tile.choices) ? tile.choices : [];
  const initialValues = tile.value != null
    ? String(tile.value).split(",").map((v) => v.trim())
    : [];

  if (style === "expanded") {
    const inputType = tile.isMultiSelect ? "checkbox" : "radio";
    return (
      <fieldset className={clsx(styles.inputMock, styles.inputChoiceFieldset)} style={gridStyleFor(tile)}>
        <InputLabelMock label={tile.label} isRequired={tile.isRequired} />
        <div className={styles.choiceList} role="group">
          {choices.map((choice, idx) => (
            <label key={`choice-${idx}`} className={styles.choiceRow}>
              <input
                type={inputType}
                name={tile.id}
                value={choice.value}
                defaultChecked={initialValues.includes(choice.value)}
                disabled
                readOnly
              />
              <span>{choice.title}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <div className={styles.inputMock} style={gridStyleFor(tile)}>
      <InputLabelMock label={tile.label} isRequired={tile.isRequired} />
      <select
        className={styles.inputControl}
        defaultValue={initialValues[0] ?? ""}
        multiple={Boolean(tile.isMultiSelect)}
        disabled
      >
        {tile.placeholder ? <option value="">{tile.placeholder}</option> : null}
        {choices.map((choice, idx) => (
          <option key={`opt-${idx}`} value={choice.value}>
            {choice.title}
          </option>
        ))}
      </select>
    </div>
  );
}

// =====================================================================
// AdaptiveTile dispatcher (with optional selection wrapper)
// =====================================================================

export function AdaptiveTile({ tile, depth = 0, ctx, path = [] }) {
  if (!tile || tile.isVisible === false) return null;
  let element = null;
  if (tile.type === "Tile.Text") {
    element = <TextTile tile={tile} />;
  } else if (isChartTile(tile)) {
    element = <ChartBlock tile={tile} />;
  } else if (tile.type === "Tile.Code") {
    element = <CodeTile tile={tile} />;
  } else if (tile.type === "Tile.Image" || tile.type === "Tile.Photo") {
    element = <ImageTile tile={tile} />;
  } else if (tile.type === "Tile.Media") {
    element = <MediaTile tile={tile} />;
  } else if (tile.type === "Tile.Container") {
    if (isStatContainer(tile)) {
      element = <StatBlock tile={tile} />;
    } else {
      element = <ContainerTile tile={tile} depth={depth} ctx={ctx} path={path} />;
    }
  } else if (tile.type === "Tile.Input.Text") {
    element = <InputTextMock tile={tile} />;
  } else if (tile.type === "Tile.Input.Number") {
    element = <InputNumberMock tile={tile} />;
  } else if (tile.type === "Tile.Input.ChoiceSet") {
    element = <InputChoiceSetMock tile={tile} />;
  } else {
    return null;
  }

  if (!ctx?.interactive) return element;
  const isSelected =
    ctx.selectedPath &&
    path.length === ctx.selectedPath.length &&
    path.every((v, i) => v === ctx.selectedPath[i]);
  return withSelection({
    children: element,
    path,
    isSelected,
    isInteractive: true,
  });
}
