// A small schema checker for the suite's YAML files. Each spec parses unknown data into its typed value, or records
// an error that names the file and the key path. Unknown keys are errors, so a misspelt field never goes unseen.

export type Spec<T> = (value: unknown, at: string, errors: string[]) => T | undefined;

const show = (v: unknown) => (typeof v === "string" ? JSON.stringify(v) : String(v));

export const str: Spec<string> = (v, at, errors) => {
  if (typeof v === "string" && v.trim() !== "") return v;
  if (typeof v === "number") return String(v);
  errors.push(`${at}: expected text, got ${show(v)}`);
};

export const num: Spec<number> = (v, at, errors) => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  errors.push(`${at}: expected a number, got ${show(v)}`);
};

export const bool: Spec<boolean> = (v, at, errors) => {
  if (typeof v === "boolean") return v;
  errors.push(`${at}: expected true or false, got ${show(v)}`);
};

export const oneOf =
  <T extends string>(choices: readonly T[]): Spec<T> =>
  (v, at, errors) => {
    if (typeof v === "string" && (choices as readonly string[]).includes(v)) return v as T;
    errors.push(`${at}: expected one of ${choices.join(", ")}, got ${show(v)}`);
  };

export const list =
  <T>(item: Spec<T>, opts: { nonEmpty?: boolean } = {}): Spec<T[]> =>
  (v, at, errors) => {
    if (!Array.isArray(v)) {
      errors.push(`${at}: expected a list, got ${show(v)}`);
      return;
    }
    if (opts.nonEmpty && v.length === 0) errors.push(`${at}: expected at least one item`);
    const out: T[] = [];
    v.forEach((x, i) => {
      const r = item(x, `${at}[${i}]`, errors);
      if (r !== undefined) out.push(r);
    });
    return out;
  };

export const dict =
  <T>(value: Spec<T>): Spec<Record<string, T>> =>
  (v, at, errors) => {
    if (!isPlain(v)) {
      errors.push(`${at}: expected a mapping, got ${show(v)}`);
      return;
    }
    const out: Record<string, T> = {};
    for (const [k, x] of Object.entries(v)) {
      const r = value(x, `${at}.${k}`, errors);
      if (r !== undefined) out[k] = r;
    }
    return out;
  };

type Fields = Record<string, Spec<unknown>>;
type Out<F extends Fields> = { [K in keyof F]: F[K] extends Spec<infer T> ? T : never };
type Req<F extends Fields, O extends Fields> = Out<F> & Partial<Out<O>>;

const isPlain = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** A mapping with required fields `req` and optional fields `opt`. */
export const obj =
  <F extends Fields, O extends Fields = {}>(req: F, opt?: O): Spec<Req<F, O>> =>
  (v, at, errors) => {
    if (!isPlain(v)) {
      errors.push(`${at}: expected a mapping, got ${show(v)}`);
      return;
    }
    const before = errors.length;
    const out: Record<string, unknown> = {};
    for (const [k, spec] of Object.entries(req)) {
      if (v[k] === undefined || v[k] === null) errors.push(`${at}: missing \`${k}\``);
      else out[k] = spec(v[k], `${at}.${k}`, errors);
    }
    for (const [k, spec] of Object.entries(opt ?? {}))
      if (v[k] !== undefined && v[k] !== null) out[k] = spec(v[k], `${at}.${k}`, errors);
    for (const k of Object.keys(v))
      if (!(k in req) && !(k in (opt ?? {})))
        errors.push(`${at}: unknown key \`${k}\` (known: ${[...Object.keys(req), ...Object.keys(opt ?? {})].join(", ")})`);
    // The cast is safe: every required key was parsed by its own spec, or an error was recorded and the caller throws.
    return errors.length === before ? (out as Req<F, O>) : undefined;
  };
