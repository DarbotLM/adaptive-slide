import { isStatContainer } from "../preview/helpers.js";
import {
  ColorField,
  Field,
  FieldGroup,
  NumberField,
  PillRow,
  PreviewOnlyBadge,
  SelectField,
  TextAreaField,
  TextField,
  ToggleField,
} from "./controls.jsx";

const TEXT_STYLES = [
  { value: "heading", label: "Heading" },
  { value: "subheading", label: "Subheading" },
  { value: "body", label: "Body" },
  { value: "caption", label: "Caption" },
  { value: "quote", label: "Quote" },
];
const TEXT_SIZES = [
  { value: "small", label: "S" },
  { value: "medium", label: "M" },
  { value: "default", label: "Default" },
  { value: "large", label: "L" },
  { value: "extraLarge", label: "XL" },
];
const TEXT_WEIGHTS = [
  { value: "lighter", label: "Lighter" },
  { value: "default", label: "Default" },
  { value: "bolder", label: "Bolder" },
];
const TEXT_COLORS = [
  { value: "default", label: "Default" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "accent", label: "Accent" },
  { value: "good", label: "Good" },
  { value: "warning", label: "Warning" },
  { value: "attention", label: "Attention" },
];
const TEXT_ALIGN = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

const CONTAINER_STYLES = [
  { value: "default", label: "Default" },
  { value: "emphasis", label: "Emphasis" },
  { value: "good", label: "Good" },
  { value: "attention", label: "Attention" },
  { value: "warning", label: "Warning" },
  { value: "accent", label: "Accent" },
];
const CONTAINER_LAYOUTS = [
  { value: "stack", label: "Stack" },
  { value: "row", label: "Row" },
  { value: "wrap", label: "Wrap" },
];

const IMAGE_STYLES = [
  { value: "default", label: "Default" },
  { value: "person", label: "Person" },
  { value: "photo", label: "Photo" },
  { value: "avatar", label: "Avatar" },
  { value: "logo", label: "Logo" },
];
const IMAGE_FITS = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "fill", label: "Fill" },
];

const CHART_TYPES = [
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
  { value: "scatter", label: "Scatter" },
  { value: "pie", label: "Pie" },
  { value: "donut", label: "Donut" },
];

const INPUT_CHOICE_STYLES = [
  { value: "compact", label: "Compact (dropdown)" },
  { value: "expanded", label: "Expanded (radio/checkbox)" },
  { value: "filtered", label: "Filtered" },
];

function setProp(tile, key, value) {
  const next = { ...tile };
  if (value === undefined || value === "" || value === null) delete next[key];
  else next[key] = value;
  return next;
}

function setNested(tile, group, key, value) {
  const groupObj = { ...(tile[group] ?? {}) };
  if (value === undefined || value === "" || value === null) delete groupObj[key];
  else groupObj[key] = value;
  const next = { ...tile };
  if (Object.keys(groupObj).length === 0) delete next[group];
  else next[group] = groupObj;
  return next;
}

/* ===== Common controls (grid position, visibility, spacing) ===== */

export function CommonTileFields({ tile, onChange }) {
  return (
    <FieldGroup title="Layout & visibility">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
        <NumberField
          label="Grid column"
          value={tile.gridPosition?.column}
          onChange={(v) => onChange(setNested(tile, "gridPosition", "column", v))}
          min={1}
        />
        <NumberField
          label="Grid row"
          value={tile.gridPosition?.row}
          onChange={(v) => onChange(setNested(tile, "gridPosition", "row", v))}
          min={1}
        />
        <NumberField
          label="Column span"
          value={tile.gridPosition?.columnSpan}
          onChange={(v) => onChange(setNested(tile, "gridPosition", "columnSpan", v))}
          min={1}
        />
        <NumberField
          label="Row span"
          value={tile.gridPosition?.rowSpan}
          onChange={(v) => onChange(setNested(tile, "gridPosition", "rowSpan", v))}
          min={1}
          badge={<PreviewOnlyBadge />}
        />
      </div>
      <SelectField
        label="Spacing"
        value={tile.spacing}
        allowEmpty
        onChange={(v) => onChange(setProp(tile, "spacing", v))}
        options={[
          { value: "none", label: "None" },
          { value: "small", label: "Small" },
          { value: "default", label: "Default" },
          { value: "medium", label: "Medium" },
          { value: "large", label: "Large" },
          { value: "extraLarge", label: "Extra Large" },
        ]}
      />
      <ToggleField
        label="Separator above tile"
        value={!!tile.separator}
        onChange={(v) => onChange(setProp(tile, "separator", v))}
      />
      <ToggleField
        label="Visible"
        value={tile.isVisible !== false}
        onChange={(v) => onChange(setProp(tile, "isVisible", v ? undefined : false))}
      />
    </FieldGroup>
  );
}

/* ===== Text ===== */

export function TextTileEditor({ tile, onChange }) {
  return (
    <>
      <FieldGroup title="Content">
        <TextAreaField
          label="Text"
          value={tile.text}
          onChange={(v) => onChange(setProp(tile, "text", v))}
          rows={3}
        />
      </FieldGroup>
      <FieldGroup title="Style">
        <SelectField
          label="Style"
          value={tile.style ?? "body"}
          onChange={(v) => onChange(setProp(tile, "style", v))}
          options={TEXT_STYLES}
        />
        <PillRow label="Size" value={tile.size} onChange={(v) => onChange(setProp(tile, "size", v))} options={TEXT_SIZES} />
        <PillRow label="Weight" value={tile.weight} onChange={(v) => onChange(setProp(tile, "weight", v))} options={TEXT_WEIGHTS} />
        <SelectField
          label="Color"
          value={tile.color}
          allowEmpty
          onChange={(v) => onChange(setProp(tile, "color", v))}
          options={TEXT_COLORS}
        />
        <PillRow label="Alignment" value={tile.alignment} onChange={(v) => onChange(setProp(tile, "alignment", v))} options={TEXT_ALIGN} />
        <ToggleField
          label="Wrap (allow line breaks)"
          value={tile.wrap !== false}
          onChange={(v) => onChange(setProp(tile, "wrap", v ? undefined : false))}
        />
      </FieldGroup>
    </>
  );
}

/* ===== Stat block (Container with heading + caption) ===== */

export function StatBlockEditor({ tile, onChange }) {
  const headingTile = tile.items?.[0] ?? { type: "Tile.Text", text: "" };
  const captionTile = tile.items?.[1] ?? { type: "Tile.Text", text: "" };
  const update = (heading, caption) => {
    const next = { ...tile, items: [{ ...headingTile, text: heading }, { ...captionTile, text: caption }] };
    onChange(next);
  };
  return (
    <>
      <FieldGroup title="Stat content">
        <TextField
          label="Value (large number / KPI)"
          value={headingTile.text}
          onChange={(v) => update(v, captionTile.text)}
        />
        <TextField
          label="Label"
          value={captionTile.text}
          onChange={(v) => update(headingTile.text, v)}
        />
      </FieldGroup>
      <FieldGroup title="Style">
        <PillRow
          label="Container style"
          value={tile.style ?? "default"}
          allowClear={false}
          onChange={(v) => onChange(setProp(tile, "style", v))}
          options={CONTAINER_STYLES}
        />
      </FieldGroup>
    </>
  );
}

/* ===== Container ===== */

export function ContainerEditor({ tile, onChange }) {
  return (
    <>
      <FieldGroup title="Container">
        <PillRow
          label="Style"
          value={tile.style ?? "default"}
          allowClear={false}
          onChange={(v) => onChange(setProp(tile, "style", v))}
          options={CONTAINER_STYLES}
        />
        <PillRow
          label="Layout"
          value={tile.layout ?? "stack"}
          allowClear={false}
          onChange={(v) => onChange(setProp(tile, "layout", v))}
          options={CONTAINER_LAYOUTS}
          badge={tile.layout === "wrap" ? <PreviewOnlyBadge /> : null}
        />
        <ToggleField
          label="Bleed (extend to edges)"
          value={!!tile.bleed}
          onChange={(v) => onChange(setProp(tile, "bleed", v))}
        />
        <NumberField
          label="Min height (px)"
          value={tile.minHeight}
          onChange={(v) => onChange(setProp(tile, "minHeight", v))}
          min={0}
        />
      </FieldGroup>
    </>
  );
}

/* ===== Image ===== */

export function ImageEditor({ tile, onChange }) {
  return (
    <>
      <FieldGroup title="Image">
        <TextField label="URL" value={tile.url} onChange={(v) => onChange(setProp(tile, "url", v))} placeholder="https://..." />
        <TextField label="Alt text" value={tile.altText} onChange={(v) => onChange(setProp(tile, "altText", v))} />
      </FieldGroup>
      <FieldGroup title="Style">
        <PillRow
          label="Style"
          value={tile.style ?? "default"}
          allowClear={false}
          onChange={(v) => onChange(setProp(tile, "style", v))}
          options={IMAGE_STYLES}
        />
        <PillRow
          label="Fit"
          value={tile.fit}
          onChange={(v) => onChange(setProp(tile, "fit", v))}
          options={IMAGE_FITS}
          badge={<PreviewOnlyBadge />}
        />
        <NumberField
          label="Border radius (px)"
          value={tile.borderRadius}
          onChange={(v) => onChange(setProp(tile, "borderRadius", v))}
          min={0}
          badge={<PreviewOnlyBadge />}
        />
        <TextField
          label="Aspect ratio (e.g. 16/9)"
          value={tile.aspectRatio}
          onChange={(v) => onChange(setProp(tile, "aspectRatio", v))}
          badge={<PreviewOnlyBadge />}
        />
      </FieldGroup>
      <FieldGroup title="Caption">
        <TextField label="Caption text" value={tile.caption} onChange={(v) => onChange(setProp(tile, "caption", v))} />
        <PillRow
          label="Caption position"
          value={tile.captionPosition}
          onChange={(v) => onChange(setProp(tile, "captionPosition", v))}
          options={[
            { value: "below", label: "Below" },
            { value: "overlay", label: "Overlay" },
          ]}
          badge={<PreviewOnlyBadge />}
        />
      </FieldGroup>
    </>
  );
}

/* ===== Code ===== */

export function CodeEditor({ tile, onChange }) {
  return (
    <FieldGroup title="Code block">
      <TextField
        label="Title"
        value={tile.title}
        onChange={(v) => onChange(setProp(tile, "title", v))}
        badge={<PreviewOnlyBadge />}
        help="Title only renders in the gallery preview — Adaptive Cards CodeBlock has no title field."
      />
      <SelectField
        label="Language"
        value={tile.language ?? "plaintext"}
        onChange={(v) => onChange(setProp(tile, "language", v))}
        options={[
          { value: "plaintext", label: "Plain text" },
          { value: "javascript", label: "JavaScript" },
          { value: "typescript", label: "TypeScript" },
          { value: "json", label: "JSON" },
          { value: "html", label: "HTML" },
          { value: "css", label: "CSS" },
          { value: "python", label: "Python" },
          { value: "csharp", label: "C#" },
          { value: "java", label: "Java" },
          { value: "go", label: "Go" },
          { value: "rust", label: "Rust" },
          { value: "bash", label: "Bash" },
          { value: "yaml", label: "YAML" },
          { value: "markdown", label: "Markdown" },
        ]}
      />
      <TextAreaField
        label="Code"
        value={tile.code}
        onChange={(v) => onChange(setProp(tile, "code", v))}
        rows={6}
      />
    </FieldGroup>
  );
}

/* ===== Chart ===== */

function setChartLabels(tile, labelsCsv) {
  const labels = labelsCsv.split(",").map((s) => s.trim()).filter(Boolean);
  const data = { ...(tile.data ?? {}) };
  if (labels.length) data.labels = labels;
  else delete data.labels;
  if (!data.datasets) data.datasets = [{ label: tile.title ?? "Series", values: [] }];
  return { ...tile, data };
}

function setChartValues(tile, valuesCsv) {
  const values = valuesCsv
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
  const data = { ...(tile.data ?? {}) };
  const datasets = [...(data.datasets ?? [])];
  if (datasets.length === 0) datasets.push({ label: tile.title ?? "Series", values });
  else datasets[0] = { ...datasets[0], values };
  data.datasets = datasets;
  return { ...tile, data };
}

function setChartFirstColor(tile, color) {
  const data = { ...(tile.data ?? {}) };
  const datasets = [...(data.datasets ?? [])];
  if (datasets.length === 0) datasets.push({ label: tile.title ?? "Series", values: [], color });
  else datasets[0] = { ...datasets[0], color };
  data.datasets = datasets;
  return { ...tile, data };
}

export function ChartEditor({ tile, onChange }) {
  const labels = tile.data?.labels ?? [];
  const values = tile.data?.datasets?.[0]?.values ?? [];
  const seriesColor = tile.data?.datasets?.[0]?.color ?? "";
  const paletteCsv = (tile.colors ?? []).join(", ");
  return (
    <>
      <FieldGroup title="Chart">
        <TextField label="Title" value={tile.title} onChange={(v) => onChange(setProp(tile, "title", v))} />
        <PillRow
          label="Chart type"
          value={tile.chartType ?? "bar"}
          allowClear={false}
          onChange={(v) => onChange(setProp(tile, "chartType", v))}
          options={CHART_TYPES}
          badge={<PreviewOnlyBadge />}
          help="Adaptive Cards 1.6 has no native chart — exports as TextBlock + FactSet. Type only changes the preview."
        />
      </FieldGroup>
      <FieldGroup title="Data">
        <TextAreaField
          label="Labels (comma-separated)"
          value={labels.join(", ")}
          rows={2}
          onChange={(v) => onChange(setChartLabels(tile, v))}
        />
        <TextAreaField
          label="Values (comma-separated numbers)"
          value={values.join(", ")}
          rows={2}
          onChange={(v) => onChange(setChartValues(tile, v))}
        />
        <ColorField
          label="Series color"
          value={seriesColor}
          onChange={(v) => onChange(setChartFirstColor(tile, v))}
          badge={<PreviewOnlyBadge />}
        />
        <TextAreaField
          label="Palette (comma-separated hex — used for pie/donut slices)"
          value={paletteCsv}
          rows={2}
          onChange={(v) => {
            const colors = v.split(",").map((s) => s.trim()).filter(Boolean);
            onChange(setProp(tile, "colors", colors.length ? colors : undefined));
          }}
          badge={<PreviewOnlyBadge />}
        />
      </FieldGroup>
      <FieldGroup title="Display options">
        <ToggleField label="Show grid" value={tile.showGrid !== false} onChange={(v) => onChange(setProp(tile, "showGrid", v))} badge={<PreviewOnlyBadge />} />
        <NumberField
          label="Donut hole size (0–80)"
          value={tile.holeSize}
          onChange={(v) => onChange(setProp(tile, "holeSize", v))}
          min={0}
          max={80}
          step={1}
          badge={<PreviewOnlyBadge />}
        />
      </FieldGroup>
    </>
  );
}

/* ===== Media ===== */

export function MediaEditor({ tile, onChange }) {
  const firstSource = tile.sources?.[0] ?? { url: "" };
  const updateSource = (next) => {
    const sources = [...(tile.sources ?? [])];
    if (sources.length === 0) sources.push(next);
    else sources[0] = next;
    onChange({ ...tile, sources });
  };
  return (
    <FieldGroup title="Media">
      <TextField
        label="Source URL"
        value={firstSource.url}
        onChange={(v) => updateSource({ ...firstSource, url: v })}
        placeholder="https://..."
      />
      <TextField
        label="MIME type"
        value={firstSource.mimeType}
        onChange={(v) => updateSource({ ...firstSource, mimeType: v })}
        placeholder="video/mp4"
      />
      <TextField
        label="Poster URL"
        value={tile.poster}
        onChange={(v) => onChange(setProp(tile, "poster", v))}
      />
      <TextField
        label="Aspect ratio (e.g. 16/9)"
        value={tile.aspectRatio}
        onChange={(v) => onChange(setProp(tile, "aspectRatio", v))}
        badge={<PreviewOnlyBadge />}
      />
      <TextField label="Alt text" value={tile.altText} onChange={(v) => onChange(setProp(tile, "altText", v))} />
    </FieldGroup>
  );
}

/* ===== Inputs ===== */

export function InputTextEditor({ tile, onChange }) {
  return (
    <FieldGroup title="Text input">
      <TextField label="Field id" value={tile.id} onChange={(v) => onChange(setProp(tile, "id", v))} help="Used as the form field name on submit." />
      <TextField label="Label" value={tile.label} onChange={(v) => onChange(setProp(tile, "label", v))} />
      <TextField label="Placeholder" value={tile.placeholder} onChange={(v) => onChange(setProp(tile, "placeholder", v))} />
      <TextField label="Default value" value={tile.value} onChange={(v) => onChange(setProp(tile, "value", v))} />
      <ToggleField label="Required" value={!!tile.isRequired} onChange={(v) => onChange(setProp(tile, "isRequired", v))} />
      <ToggleField label="Multiline" value={!!tile.isMultiline} onChange={(v) => onChange(setProp(tile, "isMultiline", v))} />
      <NumberField label="Max length" value={tile.maxLength} onChange={(v) => onChange(setProp(tile, "maxLength", v))} min={1} />
      <SelectField
        label="Style"
        value={tile.style}
        allowEmpty
        onChange={(v) => onChange(setProp(tile, "style", v))}
        options={[
          { value: "text", label: "Text" },
          { value: "tel", label: "Telephone" },
          { value: "url", label: "URL" },
          { value: "email", label: "Email" },
          { value: "password", label: "Password" },
        ]}
      />
      <TextField label="Error message" value={tile.errorMessage} onChange={(v) => onChange(setProp(tile, "errorMessage", v))} />
    </FieldGroup>
  );
}

export function InputNumberEditor({ tile, onChange }) {
  return (
    <FieldGroup title="Number input">
      <TextField label="Field id" value={tile.id} onChange={(v) => onChange(setProp(tile, "id", v))} />
      <TextField label="Label" value={tile.label} onChange={(v) => onChange(setProp(tile, "label", v))} />
      <TextField label="Placeholder" value={tile.placeholder} onChange={(v) => onChange(setProp(tile, "placeholder", v))} />
      <NumberField label="Default value" value={tile.value} onChange={(v) => onChange(setProp(tile, "value", v))} />
      <NumberField label="Min" value={tile.min} onChange={(v) => onChange(setProp(tile, "min", v))} />
      <NumberField label="Max" value={tile.max} onChange={(v) => onChange(setProp(tile, "max", v))} />
      <ToggleField label="Required" value={!!tile.isRequired} onChange={(v) => onChange(setProp(tile, "isRequired", v))} />
    </FieldGroup>
  );
}

export function InputChoiceSetEditor({ tile, onChange }) {
  const choices = tile.choices ?? [];
  const updateChoice = (idx, key, value) => {
    const next = choices.map((c, i) => (i === idx ? { ...c, [key]: value } : c));
    onChange(setProp(tile, "choices", next));
  };
  const addChoice = () => {
    const next = [...choices, { title: `Option ${choices.length + 1}`, value: `opt-${choices.length + 1}` }];
    onChange(setProp(tile, "choices", next));
  };
  const removeChoice = (idx) => {
    const next = choices.filter((_, i) => i !== idx);
    onChange(setProp(tile, "choices", next.length ? next : undefined));
  };
  return (
    <>
      <FieldGroup title="Choice set">
        <TextField label="Field id" value={tile.id} onChange={(v) => onChange(setProp(tile, "id", v))} />
        <TextField label="Label" value={tile.label} onChange={(v) => onChange(setProp(tile, "label", v))} />
        <SelectField
          label="Style"
          value={tile.style ?? "compact"}
          onChange={(v) => onChange(setProp(tile, "style", v))}
          options={INPUT_CHOICE_STYLES}
        />
        <ToggleField label="Multi-select" value={!!tile.isMultiSelect} onChange={(v) => onChange(setProp(tile, "isMultiSelect", v))} />
        <ToggleField label="Required" value={!!tile.isRequired} onChange={(v) => onChange(setProp(tile, "isRequired", v))} />
      </FieldGroup>
      <FieldGroup title={`Choices (${choices.length})`}>
        {choices.length === 0 && <Field help="Add at least one choice." />}
        {choices.map((c, idx) => (
          <ChoiceRow
            key={idx}
            choice={c}
            onChange={(key, value) => updateChoice(idx, key, value)}
            onRemove={() => removeChoice(idx)}
          />
        ))}
        <button type="button" onClick={addChoice} style={{ background: "rgba(80,230,255,0.13)", border: "1px solid rgba(80,230,255,0.4)", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700, padding: "0.4rem" }}>
          + Add choice
        </button>
      </FieldGroup>
    </>
  );
}

function ChoiceRow({ choice, onChange, onRemove }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.3rem", alignItems: "end" }}>
      <TextField label="Title" value={choice.title} onChange={(v) => onChange("title", v)} />
      <TextField label="Value" value={choice.value} onChange={(v) => onChange("value", v)} />
      <button
        type="button"
        onClick={onRemove}
        title="Remove choice"
        style={{ background: "transparent", border: "1px solid rgba(253,164,175,0.4)", borderRadius: 4, color: "#fda4af", cursor: "pointer", fontSize: "0.7rem", padding: "0.4rem 0.5rem" }}
      >
        ✕
      </button>
    </div>
  );
}

/* ===== Dispatcher ===== */

export function getTileEditor(tile) {
  if (!tile) return null;
  if (tile.type === "Tile.Container" && isStatContainer(tile)) {
    return { Editor: StatBlockEditor, label: "Stat block" };
  }
  switch (tile.type) {
    case "Tile.Text":
      return { Editor: TextTileEditor, label: "Text" };
    case "Tile.Container":
      return { Editor: ContainerEditor, label: "Container" };
    case "Tile.Image":
    case "Tile.Photo":
      return { Editor: ImageEditor, label: "Image" };
    case "Tile.Code":
      return { Editor: CodeEditor, label: "Code" };
    case "Tile.Chart":
    case "Tile.BarGraph":
    case "Tile.PieChart":
    case "Tile.DonutChart":
    case "Tile.LineGraph":
    case "Tile.AreaChart":
    case "Tile.ScatterPlot":
      return { Editor: ChartEditor, label: "Chart" };
    case "Tile.Media":
      return { Editor: MediaEditor, label: "Media" };
    case "Tile.Input.Text":
      return { Editor: InputTextEditor, label: "Text input" };
    case "Tile.Input.Number":
      return { Editor: InputNumberEditor, label: "Number input" };
    case "Tile.Input.ChoiceSet":
      return { Editor: InputChoiceSetEditor, label: "Choice set" };
    default:
      return null;
  }
}
