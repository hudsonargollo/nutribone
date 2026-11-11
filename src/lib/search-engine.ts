import type { CategoryView, ProductView } from "./types";

// Storefront search: typo-tolerant, plural-aware, understands everyday Spanish
// words ("caldo", "cubitos", "tallow"), price phrases ("hasta 50") and
// offer words ("oferta"). Pure — runs on the product list in memory, which is
// fine for a small artisanal catalog.

export type SearchCategory = CategoryView & { count: number };

export type SearchResult = {
  products: ProductView[];
  /** Category the query asked for (e.g. "cubitos", "polvo" → IceCubes / Origen). */
  category: SearchCategory | null;
  /** Typos we read past: "caldoo" → "caldo". */
  corrections: { from: string; to: string }[];
  minPrice: number | null;
  maxPrice: number | null;
  onSale: boolean;
  /** Not every word matched — these are the closest products instead. */
  partial: boolean;
};

const STOP = new Set(
  "a an and the for of with in on to my me i want need show find looking some any all producto productos item items buy Bs BOB price la el los las un una unos unas de del al y o para por con en que cual como cuanto quiero necesito busco buscar muestrame hay tienen tienes es son mi mis ki ka ke ky chahiye chahye dikhao wala wali waly".split(" ")
);

/** Everyday / colloquial words → the word the catalog uses. */
const ALIASES: Record<string, string> = {
  hielo: "cubito", cubo: "cubito", icecube: "cubito",
  instantaneo: "polvo",
  cosmetica: "skincare",
  chupito: "shot",
};

/** Words that point at a category even when the product name doesn't use them.
 *  Values are the first word of the category name (see sample-data / seed). */
const CATEGORY_HINTS: Record<string, string> = {
  caldo: "caldo",
  hueso: "caldo",
  cubito: "icecube",
  icecube: "icecube",
  hielo: "icecube",
  origen: "origen",
  polvo: "origen",
  nutriglow: "nutriglow",
  skincare: "nutriglow",
  shot: "shot",
  extra: "shot",
};

const SALE_WORDS = new Set([
  "sale", "sales", "discount", "discounted", "offer", "offers", "deal", "deals", "off",
  "oferta", "ofertas", "descuento", "descuentos", "promo", "promos", "rebaja", "rebajas",
]);

function fold(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** caldos → caldo, cubitos → cubito, shots → shot. */
function singular(w: string): string {
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

function words(s: string): string[] {
  return fold(s)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(singular);
}

/** Damerau–Levenshtein distance, stops early once it exceeds `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}

/** How well one query word matches one catalog word: 1 exact, 0.85 prefix, 0.65 typo, 0 none. */
function similarity(q: string, t: string): number {
  if (q === t) return 1;
  if (q.length >= 3 && t.startsWith(q)) return 0.85;
  if (q.length < 3 || (q.length === 3 && t.length < 4)) return 0;
  const allowed = q.length >= 7 ? 2 : 1;
  return distance(q, t, allowed) <= allowed ? 0.65 : 0;
}

type Field = { words: string[]; weight: number };

function fieldsOf(p: ProductView): Field[] {
  return [
    { words: words(p.name), weight: 5 },
    { words: words(p.category.name), weight: 6 },
    { words: words(p.material ?? ""), weight: 3 },
    { words: words(`${p.description ?? ""} ${p.specs ?? ""}`), weight: 1 },
  ];
}

function parsePrice(text: string): { min: number | null; max: number | null; rest: string } {
  let min: number | null = null;
  let max: number | null = null;
  const num = (s: string) => {
    const n = Number(s.replace(/,/g, "").replace(/k$/i, ""));
    return /k$/i.test(s) ? n * 1000 : n;
  };
  const N = String.raw`(?:Bs\.?\s*)?(\d[\d,]*k?)`;
  let rest = text
    .replace(new RegExp(String.raw`\b${N}\s*(?:-|a|to)\s*${N}\b`, "gi"), (_, a, b) => {
      min = num(a);
      max = num(b);
      return " ";
    })
    .replace(new RegExp(String.raw`\b(?:menos de|hasta|bajo|max|máximo|maximo|upto|up to|within|under|below|less than|tak)\s*${N}`, "gi"), (_, a) => {
      max = num(a);
      return " ";
    })
    .replace(new RegExp(String.raw`\b(?:desde|más de|mas de|mínimo|minimo|over|above|more than|from|min)\s*${N}`, "gi"), (_, a) => {
      min = num(a);
      return " ";
    });
  // "50 para arriba" / "50 o menos"
  rest = rest.replace(new RegExp(String.raw`${N}\s*(?:o menos|para arriba)\b`, "gi"), (_, a) => {
    max = num(a);
    return " ";
  });
  return { min, max, rest };
}

export function searchCatalog(
  query: string,
  products: ProductView[],
  categories: SearchCategory[]
): SearchResult {
  const { min, max, rest } = parsePrice(fold(query));
  const raw = words(rest).filter((w) => !STOP.has(w) && !/^\d+$/.test(w));
  const onSale = raw.some((w) => SALE_WORDS.has(w));
  const terms = raw.filter((w) => !SALE_WORDS.has(w)).map((w) => ALIASES[w] ?? w);

  // Words the catalog knows; typos are corrected towards names / categories / materials only.
  const vocab = new Set<string>();
  const known = new Set<string>();
  for (const p of products) {
    fieldsOf(p).forEach((f, i) => f.words.forEach((w) => (i < 3 ? vocab : known).add(w)));
  }
  for (const c of categories) words(c.name).forEach((w) => vocab.add(w));
  vocab.forEach((w) => known.add(w));

  const corrections: { from: string; to: string }[] = [];
  const fixed = terms.map((t) => {
    if (known.has(t) || (t.length >= 3 && [...known].some((v) => v.startsWith(t)))) return t;
    let best = "";
    let bestScore = 0;
    for (const v of vocab) {
      const s = similarity(t, v);
      if (s > bestScore) [best, bestScore] = [v, s];
    }
    if (best) {
      corrections.push({ from: t, to: best });
      return best;
    }
    return t;
  });

  // A word that names a category ("caldo", "cubito", "polvo").
  let category: SearchCategory | null = null;
  for (const t of fixed) {
    const target = CATEGORY_HINTS[t] ?? t;
    const hit = categories.find((c) => words(c.name).includes(target));
    if (hit) {
      category = hit;
      break;
    }
  }

  const inRange = (p: ProductView) =>
    (min == null || p.price >= min) &&
    (max == null || p.price <= max) &&
    (!onSale || (p.compareAtPrice != null && p.compareAtPrice > p.price));

  const categoryWord = category ? words(category.name)[0] : null;
  const scored = products.filter(inRange).map((p) => {
    const fields = fieldsOf(p);
    let score = 0;
    let matched = 0;
    for (const t of fixed) {
      const isCategoryWord = (CATEGORY_HINTS[t] ?? t) === categoryWord;
      // "caldo" shouldn't pull in another category's product whose description mentions caldo.
      const usable = isCategoryWord && p.category.slug !== category!.slug ? fields.slice(0, 3) : fields;
      let best = 0;
      for (const f of usable) for (const w of f.words) best = Math.max(best, similarity(t, w) * f.weight);
      if (isCategoryWord && p.category.slug === category!.slug) {
        // In the category; products whose name says it too come first.
        const named = fields[0].words.some((w) => similarity(t, w) > 0);
        best = Math.max(best, 6) + (named ? 2 : 0);
      }
      if (best > 0) matched++;
      score += best;
    }
    // Small nudges so ties look sensible: in stock first, then featured.
    score += (p.stock > 0 ? 0.3 : 0) + (p.featured ? 0.1 : 0);
    return { p, score, matched };
  });

  if (fixed.length === 0) {
    // Only a price range and/or "oferta" — list everything that fits.
    const list = scored.sort((a, b) => b.score - a.score).map((x) => x.p);
    return { products: list, category: null, corrections, minPrice: min, maxPrice: max, onSale, partial: false };
  }

  const all = scored.filter((x) => x.matched === fixed.length);
  const some = scored.filter((x) => x.matched > 0);
  const partial = all.length === 0 && some.length > 0;
  const list = (partial ? some : all).sort((a, b) => b.matched - a.matched || b.score - a.score).map((x) => x.p);

  return { products: list, category, corrections, minPrice: min, maxPrice: max, onSale, partial };
}
