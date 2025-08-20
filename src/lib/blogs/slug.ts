export interface SlugOptions {
  maxLength?: number;
  stopWords?: string[];
  preserveWords?: string[];
  allowLeadingNumbers?: boolean;
  dedupeResolver?: (candidate: string) => boolean | Promise<boolean>;
}

const DEFAULT_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "if",
  "then",
  "else",
  "when",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "once",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "of",
]);

/**
 * Basic transliteration for common diacritics; falls back to NFKD strip.
 * (Avoids heavy deps; sufficient for most blog titles.)
 */
function basicTransliterate(input: string): string {
  const stripped = input.normalize("NFKD").replace(/\p{Diacritic}+/gu, "");

  const noEmoji = stripped.replace(
    /[\p{Extended_Pictographic}\p{Emoji}]/gu,
    ""
  );

  return noEmoji;
}

/** Split, drop stop words, and rejoin. */
function filterWords(
  text: string,
  stopWords: Set<string>,
  preserve: Set<string>
): string[] {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

  return words.filter((w) => preserve.has(w) || !stopWords.has(w));
}

/** Core slugify (no uniqueness). */
export function slugify(input: string, opts: SlugOptions = {}): string {
  const {
    maxLength = 60,
    stopWords = [],
    preserveWords = [],
    allowLeadingNumbers = true,
  } = opts;

  const preserve = new Set(preserveWords.map((w) => w.toLowerCase()));
  const stops = new Set(stopWords.map((w) => w.toLowerCase()));

  for (const w of DEFAULT_STOP_WORDS) if (!preserve.has(w)) stops.add(w);

  let s = basicTransliterate(input);

  const leadingNumberMatch = s.match(/^\s*(\d+)/);
  const leadingNumber =
    allowLeadingNumbers && leadingNumberMatch ? leadingNumberMatch[1] : "";

  const words = filterWords(s, stops, preserve);
  if (words.length === 0) {
    const fallback = `post-${Date.now()}`;
    return fallback.slice(0, maxLength);
  }

  let slug = words.join("-");

  if (leadingNumber && !slug.startsWith(leadingNumber + "-")) {
    slug = `${leadingNumber}-${slug}`;
  }

  slug = slug.replace(/-+/g, "-").replace(/^-+|-+$/g, "");

  if (slug.length > maxLength) {
    const cut = slug.slice(0, maxLength);
    const lastDash = cut.lastIndexOf("-");
    slug = lastDash > 20 ? cut.slice(0, lastDash) : cut;
  }

  if (!slug) slug = "post";

  return slug;
}

/**
 * Generate a unique slug by calling slugify and resolving collisions using the provided dedupeResolver.
 * Example: "my-post", then "my-post-2", "my-post-3", ...
 */
export async function generateSeoSlug(
  input: string,
  opts: SlugOptions = {}
): Promise<string> {
  const { dedupeResolver } = opts;
  let base = slugify(input, opts);

  if (!dedupeResolver) return base;

  if (!(await dedupeResolver(base))) return base;

  let i = 2;
  while (true) {
    const candidate = `${base}-${i}`;
    const taken = await dedupeResolver(candidate);
    if (!taken) return candidate;
    i++;
  }
}
