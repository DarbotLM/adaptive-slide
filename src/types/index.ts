// Adaptive Slide type definitions — mirrors the JSON schemas

export interface Deck {
  $schema: string;
  type: "AdaptiveDeck";
  version: string;
  metadata?: DeckMetadata;
  theme?: Theme;
  card?: AdaptiveCardOptions;
  defaults?: SlideDefaults;
  slides: Slide[];
}

export interface DeckMetadata {
  title?: string;
  description?: string;
  author?: string;
  created?: string;
  modified?: string;
  tags?: string[];
  language?: string;
  [key: string]: unknown;
}

export interface Theme {
  name?: string;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  darkMode?: boolean;
  [key: string]: unknown;
}

export interface SlideDefaults {
  layout?: LayoutMode;
  transition?: Transition;
  padding?: Padding;
  [key: string]: unknown;
}

export type LayoutMode = "stack" | "grid" | "freeform";
export type Transition = "none" | "fade" | "slide-left" | "slide-right" | "slide-up" | "zoom";
export type Padding = "none" | "small" | "default" | "large";
export type Spacing = "none" | "small" | "default" | "medium" | "large" | "extraLarge" | "padding";

export interface Slide {
  type: "AdaptiveSlide";
  id?: string;
  title?: string;
  notes?: string;
  layout?: LayoutConfig;
  background?: Background;
  card?: AdaptiveCardOptions;
  transition?: Transition;
  body: Tile[];
  actions?: Action[];
}

export interface LayoutConfig {
  mode?: LayoutMode;
  columns?: number;
  gap?: "none" | "small" | "default" | "large";
  horizontalAlignment?: "left" | "center" | "right" | "stretch";
  verticalAlignment?: "top" | "center" | "bottom";
}

export interface Background {
  color?: string;
  image?: {
    url: string;
    fillMode?: "cover" | "contain" | "repeat" | "stretch";
    opacity?: number;
  };
  gradient?: {
    type: "linear" | "radial";
    colors: string[];
    angle?: number;
  };
}

export interface Action {
  type:
    | "Action.OpenUrl"
    | "Action.Submit"
    | "Action.Execute"
    | "Action.ToggleVisibility"
    | "Action.ShowCard"
    | "Action.GoToSlide"
    | "Action.NextSlide"
    | "Action.PrevSlide";
  title: string;
  id?: string;
  url?: string;
  targetSlideId?: string;
  data?: unknown;
  verb?: string;
  targetElements?: Array<string | { elementId: string; isVisible?: boolean }>;
  card?: AdaptiveCardDocumentJson;
  associatedInputs?: "auto" | "none";
  style?: string;
  mode?: string;
  isEnabled?: boolean;
  iconUrl?: string;
  tooltip?: string;
  requires?: Record<string, string>;
  fallback?: unknown;
}

export type NativeAdaptiveCardActionType =
  | "Action.OpenUrl"
  | "Action.Submit"
  | "Action.Execute"
  | "Action.ToggleVisibility"
  | "Action.ShowCard";

export type NativeAdaptiveCardSelectActionType = Exclude<
  NativeAdaptiveCardActionType,
  "Action.ShowCard"
>;

export type NativeAdaptiveCardAction = Action & { type: NativeAdaptiveCardActionType };
export type NativeAdaptiveCardSelectAction = Action & { type: NativeAdaptiveCardSelectActionType };

export type AdaptiveCardJson = Record<string, unknown>;
export type AdaptiveCardElementJson = { type: string } & Record<string, unknown>;
export type AdaptiveCardDocumentJson = { type: "AdaptiveCard" } & Record<string, unknown>;

export interface AdaptiveCardOptions {
  version?: "1.6";
  refresh?: AdaptiveCardJson;
  authentication?: AdaptiveCardJson;
  selectAction?: NativeAdaptiveCardSelectAction;
  fallbackText?: string;
  backgroundImage?: string | AdaptiveCardJson;
  minHeight?: string;
  rtl?: boolean;
  speak?: string;
  lang?: string;
  verticalContentAlignment?: "top" | "center" | "bottom";
  metadata?: AdaptiveCardJson;
}

// Tile union type
export type Tile =
  | TextTile
  | ImageTile
  | CodeTile
  | ChartTile
  | MediaTile
  | ContainerTile
  | InputTextTile
  | InputNumberTile
  | InputChoiceSetTile
  | InputDateTile
  | InputTimeTile
  | InputToggleTile
  | AdaptiveElementTile
  | AdaptiveCardTile;

interface TileBase<THeight extends string = "auto" | "stretch"> {
  id?: string;
  isVisible?: boolean;
  spacing?: Spacing;
  separator?: boolean;
  height?: THeight;
  requires?: Record<string, string>;
  fallback?: "drop" | AdaptiveCardElementJson;
  gridPosition?: GridPosition;
  freeformPosition?: FreeformPosition;
}

export interface GridPosition {
  column?: number;
  row?: number;
  columnSpan?: number;
  rowSpan?: number;
}

export interface FreeformPosition {
  /** X position as a percentage of the slide canvas, 0-100 inclusive. */
  x: number;
  /** Y position as a percentage of the slide canvas, 0-100 inclusive. */
  y: number;
  /** Width as a percentage of the slide canvas, greater than 0 and up to 100. */
  width: number;
  /** Height as a percentage of the slide canvas, greater than 0 and up to 100. */
  height: number;
  rotation?: number;
  /** Layering order within freeform layouts; larger values render above smaller ones. */
  zIndex?: number;
}

export interface TextTile extends TileBase {
  type: "Tile.Text";
  text: string;
  style?: "heading" | "subheading" | "body" | "caption" | "quote";
  size?: "small" | "default" | "medium" | "large" | "extraLarge";
  weight?: "lighter" | "default" | "bolder";
  color?: "default" | "dark" | "light" | "accent" | "good" | "warning" | "attention";
  horizontalAlignment?: "left" | "center" | "right";
  wrap?: boolean;
  maxLines?: number;
  fontType?: "default" | "monospace";
}

export type ImageTileType = "Tile.Image" | "Tile.Photo";
export type ImageStyle = "default" | "photo" | "avatar" | "logo";
export type ImageFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export interface ImageTile extends TileBase<string> {
  type: ImageTileType;
  url: string;
  altText?: string;
  size?: "auto" | "stretch" | "small" | "medium" | "large";
  horizontalAlignment?: "left" | "center" | "right";
  backgroundColor?: string;
  aspectRatio?: string;
  caption?: string;
  style?: ImageStyle;
  fit?: ImageFit;
  height?: string;
  captionPosition?: "bottom" | "overlay";
  borderRadius?: string;
}

export interface CodeTile extends TileBase {
  type: "Tile.Code";
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  startLineNumber?: number;
  highlightLines?: number[];
  maxHeight?: string;
  title?: string;
  theme?: "light" | "dark" | "auto";
}

export type ChartElementType =
  | "Tile.Chart"
  | "Tile.BarGraph"
  | "Tile.PieChart"
  | "Tile.DonutChart"
  | "Tile.LineGraph"
  | "Tile.AreaChart"
  | "Tile.ScatterPlot";

export type ChartType =
  | "bar"
  | "bargraph"
  | "horizontalBar"
  | "line"
  | "linegraph"
  | "pie"
  | "piechart"
  | "donut"
  | "donutchart"
  | "area"
  | "areachart"
  | "scatter"
  | "scatterplot";

export interface ChartTileBase extends TileBase {
  type: ChartElementType;
  title?: string;
  data: ChartData;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  aspectRatio?: string;
  orientation?: "vertical" | "horizontal";
  holeSize?: number;
}

export interface GenericChartTile extends ChartTileBase {
  type: "Tile.Chart";
  chartType: ChartType;
}

export interface BarGraphTile extends ChartTileBase {
  type: "Tile.BarGraph";
  chartType?: "bar" | "bargraph" | "horizontalBar";
}

export interface PieChartTile extends ChartTileBase {
  type: "Tile.PieChart";
  chartType?: "pie" | "piechart" | "donut" | "donutchart";
}

export interface DonutChartTile extends ChartTileBase {
  type: "Tile.DonutChart";
  chartType?: "donut" | "donutchart";
}

export interface LineGraphTile extends ChartTileBase {
  type: "Tile.LineGraph";
  chartType?: "line" | "linegraph";
}

export interface AreaChartTile extends ChartTileBase {
  type: "Tile.AreaChart";
  chartType?: "area" | "areachart";
}

export interface ScatterPlotTile extends ChartTileBase {
  type: "Tile.ScatterPlot";
  chartType?: "scatter" | "scatterplot";
}

export type ChartTile =
  | GenericChartTile
  | BarGraphTile
  | PieChartTile
  | DonutChartTile
  | LineGraphTile
  | AreaChartTile
  | ScatterPlotTile;

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label?: string;
  values: number[];
  color?: string;
}

export interface MediaTile extends TileBase {
  type: "Tile.Media";
  sources: MediaSource[];
  poster?: string;
  altText?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  aspectRatio?: string;
}

export interface MediaSource {
  url: string;
  mimeType?: string;
}

export interface ContainerTile extends TileBase {
  type: "Tile.Container";
  items: Tile[];
  layout?: "stack" | "row" | "wrap";
  style?: "default" | "emphasis" | "good" | "attention" | "warning" | "accent";
  bleed?: boolean;
  minHeight?: string;
  verticalContentAlignment?: "top" | "center" | "bottom";
  backgroundImage?: {
    url: string;
    fillMode?: "cover" | "contain" | "repeat" | "stretch";
  };
}

// ---------------------------------------------------------------------------
// Input tiles — interactive form controls that compile to AC 1.6 Input.*
// ---------------------------------------------------------------------------

interface InputTileBase extends TileBase {
  /** Required for inputs — the key under which the value is submitted. */
  id: string;
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
}

export interface InputTextTile extends InputTileBase {
  type: "Tile.Input.Text";
  placeholder?: string;
  value?: string;
  isMultiline?: boolean;
  maxLength?: number;
  /** Maps to AC 1.6 Input.Text.style */
  style?: "text" | "tel" | "url" | "email" | "password";
  regex?: string;
}

export interface InputNumberTile extends InputTileBase {
  type: "Tile.Input.Number";
  placeholder?: string;
  value?: number;
  min?: number;
  max?: number;
}

export interface InputChoice {
  title: string;
  value: string;
}

export interface InputChoiceSetTile extends InputTileBase {
  type: "Tile.Input.ChoiceSet";
  choices: InputChoice[];
  placeholder?: string;
  value?: string;
  isMultiSelect?: boolean;
  /** AC 1.6: compact (dropdown), expanded (radios/checkboxes), filtered (autocomplete). */
  style?: "compact" | "expanded" | "filtered";
  wrap?: boolean;
}

export interface InputDateTile extends InputTileBase {
  type: "Tile.Input.Date";
  placeholder?: string;
  /** YYYY-MM-DD */
  value?: string;
  min?: string;
  max?: string;
}

export interface InputTimeTile extends InputTileBase {
  type: "Tile.Input.Time";
  placeholder?: string;
  /** HH:mm */
  value?: string;
  min?: string;
  max?: string;
}

export interface InputToggleTile extends InputTileBase {
  type: "Tile.Input.Toggle";
  title: string;
  value?: string;
  valueOn?: string;
  valueOff?: string;
  wrap?: boolean;
}

export interface AdaptiveElementTile extends TileBase {
  type: "Tile.AdaptiveElement";
  element: AdaptiveCardElementJson;
}

export interface AdaptiveCardTile extends TileBase {
  type: "Tile.AdaptiveCard";
  card: AdaptiveCardDocumentJson;
}
