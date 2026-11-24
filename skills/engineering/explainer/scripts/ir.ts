// The kit's intermediate representation: one Suite, loaded and checked by frontends/, read by every backend.
import type { DefaultTreeAdapterMap } from "parse5";

export type Node = DefaultTreeAdapterMap["node"];
export type Element = DefaultTreeAdapterMap["element"];
export type Fragment = DefaultTreeAdapterMap["documentFragment"];

export const STATES = ["open", "waiting", "settled"] as const;
export type CallState = (typeof STATES)[number];

/** The grades of the `grading-evidence` skill. */
export const GRADES = ["observed", "supported", "inferred", "speculative", "unknown"] as const;
export type Grade = (typeof GRADES)[number];

export interface CallOption {
  label: string;
  /** One cell: what the option means. A small call uses this. */
  text?: string;
  /** Three cells, for a decision card: what it buys, what changes and for whom, what it costs. */
  buys?: string;
  changes?: string;
  cost?: string;
}

export interface Ruling {
  text: string;
  date: string;
  by: string;
}

/** A call carries what its state needs: a waiting call what it waits on, a settled call its ruling. */
export type Call = CallBase & ({ state: "open" } | { state: "waiting"; waits_on: string } | { state: "settled"; ruling: Ruling });

interface CallBase {
  id: string;
  /** The short name the page uses for the call, such as "1" or "R2". Defaults to the id. */
  label?: string;
  question: string;
  /** Cheap and easy to undo either way, and neither option changes what a reader or a user sees. */
  small: boolean;
  options: CallOption[];
  pick: { label: string; why?: string; measure?: string; reverse?: string };
  supersedes?: string;
}

export interface Fact {
  id: string;
  value: string;
  source: string;
  grade: Grade;
}

export type Drawing =
  | { form: "svg"; svg: string }
  | { form: "wide-narrow"; wide: string; narrow: string; narrowBelow: number }
  | { form: "html"; html: string };

export interface FigureState {
  name: string;
  text: string;
  /** A CSS selector inside the figure; `check` clicks it to reach the state. */
  click?: string;
}

export interface Figure {
  id: string;
  caption: string;
  note?: string;
  alt: string;
  /** Below this width (px) the drawing scrolls instead of shrinking, so its labels keep their size. */
  minWidth?: number;
  marks: string[];
  drawing: Drawing;
  /** True when the drawing holds a script or a control. Such a figure needs `still`. */
  interactive: boolean;
  still?: string;
  states: FigureState[];
  /** Every file of the figure, for the content hash. */
  files: string[];
}

export interface KeyEntry {
  mark: string;
  label: string;
  swatch: string;
}

export interface PageEntry {
  id: string;
  title: string;
  thread?: string;
  question?: string;
  holds?: string;
}

export interface TypePair {
  text: string;
  heading: string;
  mono: string;
}

export interface SuiteConfig {
  title: string;
  reader: string;
  read_at?: string;
  pages: PageEntry[];
  palette: { light: Record<string, string>; dark: Record<string, string> };
  type: TypePair;
  key: KeyEntry[];
  notion: { accent: string };
}

/** A top-level element of a page that holds a script or a control: its still frame must be named. */
export interface Island {
  index: number;
  tag: string;
  still?: string;
}

export interface Page {
  entry: PageEntry;
  /** Position in the reading order; 0 is the hub when the suite has more than one page. */
  index: number;
  file: string;
  source: string;
  context: string;
  tree: Fragment;
  cites: { calls: string[]; facts: string[]; figures: string[] };
  islands: Island[];
}

export interface Suite {
  dir: string;
  config: SuiteConfig;
  calls: Map<string, Call>;
  facts: Map<string, Fact>;
  figures: Map<string, Figure>;
  /** The suite's own drawing styles, `figures/figures.css`, or "". */
  figuresCss: string;
  pages: Page[];
}

/** The marked blocks: elements whose meaning the kit knows. */
export const MARKED = ["x-takeaway", "x-ask", "x-call", "x-fact", "x-figure", "x-detail", "x-caveat", "x-pages"] as const;
export type Marked = (typeof MARKED)[number];
export const isMarked = (tag: string): tag is Marked => (MARKED as readonly string[]).includes(tag);

export const CALL_FORMS = ["card", "row", "pill"] as const;
export type CallForm = (typeof CALL_FORMS)[number];

/** An error in the author's sources. render prints it and exits 2. */
export class SourceError extends Error {}

/** One artifact publish argument holds 128 KiB of JSON-escaped text. */
export const SIZE_LIMIT = 128 * 1024;
export const escapedSize = (text: string) => Buffer.byteLength(JSON.stringify(text));
