import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  ColorField,
  Field,
  FieldGroup,
  NumberField,
  PillRow,
  SelectField,
  TextAreaField,
  TextField,
  ToggleField,
} from "./controls.jsx";
import { CommonTileFields, getTileEditor } from "./tileEditors.jsx";
import { TILE_TEMPLATES } from "./tileTemplates.js";
import { getTileAtPath } from "./pathUtils.js";
import styles from "./editor.module.css";

const SLIDE_LAYOUTS = [
  { value: "stack", label: "Stack" },
  { value: "grid", label: "Grid" },
  { value: "freeform", label: "Freeform" },
];

export function Inspector({
  deck,
  slideIndex = 0,
  selectedPath,
  onDeckChange,
  onTileChange,
  onMoveTile,
  onDeleteTile,
  onAddTile,
  onReset,
  isDirty,
}) {
  const [tab, setTab] = useState("deck");
  const slide = deck.slides?.[slideIndex];
  const selectedTile = selectedPath ? getTileAtPath(slide, selectedPath) : null;

  // Auto-switch to tile tab on selection.
  const effectiveTab = selectedTile ? "tile" : tab;

  const editorEntry = useMemo(() => getTileEditor(selectedTile), [selectedTile]);

  return (
    <aside className={styles.inspector} aria-label="Tile and deck inspector">
      <div className={styles.inspectorHeader}>
        <h3 className={styles.inspectorTitle}>
          Inspector {isDirty && <span className={styles.dirtyDot} title="Unsaved edits" />}
        </h3>
        <button
          type="button"
          className={styles.resetButton}
          onClick={onReset}
          disabled={!isDirty}
          title="Reset deck back to the template's original shape"
        >
          Reset
        </button>
      </div>

      <div className={styles.inspectorTabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={effectiveTab === "deck"}
          className={clsx(styles.inspectorTab, effectiveTab === "deck" && styles.inspectorTabActive)}
          onClick={() => setTab("deck")}
        >
          Deck
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={effectiveTab === "tile"}
          className={clsx(styles.inspectorTab, effectiveTab === "tile" && styles.inspectorTabActive)}
          onClick={() => setTab("tile")}
        >
          Tile {selectedTile ? `· ${editorEntry?.label ?? selectedTile.type}` : ""}
        </button>
      </div>

      <div className={styles.inspectorBody}>
        {effectiveTab === "deck" ? (
          <DeckPanel deck={deck} slide={slide} onDeckChange={onDeckChange} onAddTile={onAddTile} />
        ) : (
          <TilePanel
            tile={selectedTile}
            editorEntry={editorEntry}
            onTileChange={onTileChange}
            onMoveTile={onMoveTile}
            onDeleteTile={onDeleteTile}
          />
        )}
      </div>
    </aside>
  );
}

function DeckPanel({ deck, slide, onDeckChange, onAddTile }) {
  const updateMetadata = (key, value) => {
    const next = { ...deck, metadata: { ...(deck.metadata ?? {}), [key]: value } };
    onDeckChange(next);
  };
  const updateTheme = (key, value) => {
    const theme = { ...(deck.theme ?? {}) };
    if (value === undefined || value === "" || value === null) delete theme[key];
    else theme[key] = value;
    onDeckChange({ ...deck, theme });
  };
  const updateLayout = (key, value) => {
    const slides = deck.slides ?? [];
    const current = slides[0] ?? {};
    const layout = { ...(current.layout ?? {}) };
    if (value === undefined || value === "" || value === null) delete layout[key];
    else layout[key] = value;
    const nextSlide = { ...current, layout };
    const nextSlides = [...slides];
    nextSlides[0] = nextSlide;
    onDeckChange({ ...deck, slides: nextSlides });
  };

  return (
    <>
      <FieldGroup title="Deck">
        <TextField
          label="Title"
          value={deck.metadata?.title}
          onChange={(v) => updateMetadata("title", v)}
        />
        <TextAreaField
          label="Description"
          value={deck.metadata?.description}
          onChange={(v) => updateMetadata("description", v)}
          rows={2}
        />
      </FieldGroup>

      <FieldGroup title="Theme">
        <ColorField label="Primary" value={deck.theme?.primaryColor} onChange={(v) => updateTheme("primaryColor", v)} />
        <ColorField label="Accent" value={deck.theme?.accentColor} onChange={(v) => updateTheme("accentColor", v)} />
        <ColorField label="Background" value={deck.theme?.backgroundColor} onChange={(v) => updateTheme("backgroundColor", v)} />
        <ColorField label="Text" value={deck.theme?.textColor} onChange={(v) => updateTheme("textColor", v)} />
        <ToggleField
          label="Dark mode"
          value={!!deck.theme?.darkMode}
          onChange={(v) => updateTheme("darkMode", v)}
        />
      </FieldGroup>

      <FieldGroup title="Slide layout">
        <SelectField
          label="Mode"
          value={slide?.layout?.mode ?? "stack"}
          onChange={(v) => updateLayout("mode", v)}
          options={SLIDE_LAYOUTS}
        />
        {slide?.layout?.mode === "grid" && (
          <NumberField
            label="Grid columns"
            value={slide.layout.columns}
            onChange={(v) => updateLayout("columns", v)}
            min={1}
            max={12}
          />
        )}
        <NumberField
          label="Gap (px)"
          value={slide?.layout?.gap}
          onChange={(v) => updateLayout("gap", v)}
          min={0}
        />
      </FieldGroup>

      <FieldGroup title="Add tile">
        <AddTilePicker onAdd={onAddTile} />
      </FieldGroup>
    </>
  );
}

function TilePanel({ tile, editorEntry, onTileChange, onMoveTile, onDeleteTile }) {
  if (!tile) {
    return (
      <div className={styles.emptyState}>
        Click any tile in the workspace preview to edit it.
      </div>
    );
  }
  if (!editorEntry) {
    return (
      <div className={styles.emptyState}>
        No inline editor for tile type <strong>{tile.type}</strong>.
      </div>
    );
  }
  const { Editor, label } = editorEntry;
  return (
    <>
      <div className={styles.toolbar}>
        <span className={styles.tileTypeBadge}>{label}</span>
        <div style={{ flex: 1 }} />
        <button type="button" onClick={() => onMoveTile(-1)} title="Move up">▲</button>
        <button type="button" onClick={() => onMoveTile(1)} title="Move down">▼</button>
        <button type="button" className={styles.toolbarDanger} onClick={onDeleteTile} title="Delete tile">Delete</button>
      </div>
      <Editor tile={tile} onChange={onTileChange} />
      <CommonTileFields tile={tile} onChange={onTileChange} />
    </>
  );
}

function AddTilePicker({ onAdd }) {
  return (
    <div className={styles.addPicker}>
      <div className={styles.addPickerGrid}>
        {TILE_TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onAdd(tpl.create())}
            title={`Add ${tpl.label}`}
          >
            + {tpl.label}
          </button>
        ))}
      </div>
    </div>
  );
}
