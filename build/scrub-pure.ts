// Vendored pure scrub helpers (byte replacement, base64-safe JS scrub,
// literal protection). Adapted from srv/vite/scrub.ts: self-contained,
// no daydream imports. Literal list frozen for byte-identical behavior.
const NEBULA_PROTECTED_LITERALS: readonly string[] = [
  "Libcurl.js","Epoxy TLS","Ultraviolet","Scramjet","LibCurl","Libcurl","Pulsar","Epoxy",
];

// Mirrors the (currently empty) case-sensitivity set: all words match
// case-insensitively, exactly like the code this was adapted from.
const CASE_SENSITIVE_WORDS: ReadonlySet<string> = new Set([]);

const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const asciiLower = (byte: number): number =>
  byte >= 0x41 && byte <= 0x5a ? byte + 0x20 : byte;

// Some words (`proxy`) must be matched case-sensitively so the JS built-in
// `Proxy` survives untouched.
const byteMatches = (a: number, b: number, caseSensitive: boolean): boolean =>
  caseSensitive ? a === b : asciiLower(a) === asciiLower(b);

const includesAscii = (
  source: Buffer,
  needle: Buffer,
  caseSensitive = false,
): boolean => {
  for (let offset = 0; offset <= source.length - needle.length; offset++) {
    let matches = true;
    for (let index = 0; index < needle.length; index++) {
      if (!byteMatches(source[offset + index]!, needle[index]!, caseSensitive)) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }
  return false;
};

const replaceAscii = (
  source: Buffer,
  needle: Buffer,
  replacement: Buffer,
  caseSensitive = false,
): number => {
  let replacements = 0;
  for (let offset = 0; offset <= source.length - needle.length; ) {
    let matches = true;
    for (let index = 0; index < needle.length; index++) {
      if (!byteMatches(source[offset + index]!, needle[index]!, caseSensitive)) {
        matches = false;
        break;
      }
    }
    if (!matches) {
      offset++;
      continue;
    }
    replacement.copy(source, offset);
    offset += replacement.length;
    replacements++;
  }
  return replacements;
};

// ---------------------------------------------------------------------------
// Public: scrubBuffer — in-place byte replacement, length-preserving
// ---------------------------------------------------------------------------

export const scrubBuffer = (
  source: Buffer,
  vocabulary: Record<string, string>,
): number => {
  let replacements = 0;
  for (const [word, token] of Object.entries(vocabulary)) {
    const needle = Buffer.from(word, 'ascii');
    const replacement = Buffer.from(token, 'ascii');
    if (needle.length !== replacement.length) {
      throw new Error(`Artifact token length changed for ${word}`);
    }
    replacements += replaceAscii(
      source,
      needle,
      replacement,
      CASE_SENSITIVE_WORDS.has(word),
    );
  }
  return replacements;
};

// ---------------------------------------------------------------------------
// Public: scrubJavaScript — extract long base64 payloads, scrub decoded bytes,
// re-encode with quote splices around any forbidden matches in the re-encoded
// base64 output (so the re-encoded string can't spell a forbidden word), then
// scrub the surrounding source too.
// ---------------------------------------------------------------------------

type EmbeddedBinary = {
  readonly marker: string;
  readonly payload: string;
  readonly quote: string;
};

// Swap every NEBULA_PROTECTED_LITERALS occurrence for a word-free marker, returning
// the guarded text plus a `restore` that puts the verbatim literals back after
// the byte scrub. Markers contain no artifact word so the scrub can't touch
// them. Shared by the JS path and the plain-text (HTML/CSS/JSON/SVG) path.
export function protectLiterals(text: string): {
  guarded: string;
  restore: (scrubbed: string) => string;
} {
  const items: { marker: string; value: string }[] = [];
  let guarded = text;
  for (const literal of NEBULA_PROTECTED_LITERALS) {
    if (!guarded.includes(literal)) continue;
    const marker = `__PROTECTED_LITERAL_${items.length}__`;
    items.push({ marker, value: literal });
    guarded = guarded.split(literal).join(marker);
  }
  return {
    guarded,
    restore: (scrubbed: string) => {
      let out = scrubbed;
      for (const { marker, value } of items) out = out.split(marker).join(value);
      return out;
    },
  };
}

export const scrubJavaScript = (
  source: string,
  vocabulary: Record<string, string>,
): string => {
  const forbiddenWords = Object.keys(vocabulary);
  const embedded: EmbeddedBinary[] = [];
  const protectedSource = source.replace(
    // Match base64 payloads delimited by any JS string quote INCLUDING
    // backticks. Obscura embeds its ~232 KB WASM as a backtick template
    // literal; without the backtick here the payload is left unprotected and
    // the byte scrub corrupts it (e.g. an incidental `bare` in the base64 →
    // `$7A0`, which is not a valid base64 char → runtime `atob` failure).
    /([`"'])((?:data:[^`"']*;base64,)?)([A-Za-z0-9+/]{256,}={0,2})\1/g,
    (full, quote: string, prefix: string, payload: string) => {
      const decoded = Buffer.from(payload, 'base64');
      // Reject non-canonical base64 (whitespace, illegal chars) — leave untouched.
      if (decoded.toString('base64') !== payload) return full;
      scrubBuffer(decoded, vocabulary);
      if (
        decoded.length >= 4 &&
        decoded.subarray(0, 4).equals(Buffer.from([0, 97, 115, 109])) &&
        !WebAssembly.validate(decoded)
      ) {
        throw new Error('Sanitized embedded WASM artifact is invalid');
      }
      // Marker MUST NOT contain any ARTIFACT_WORD (case-insensitive): the byte
      // scrub below runs over the protected source and would rewrite a
      // colliding marker (e.g. the old `__DDX_…` collided with the `__ddx`
      // artifact word → `$PkoH_…`), leaving the base64 payload unrecoverable
      // and emitting `data:…;base64,$PkoH_EMBEDDED_BINARY_0__`.
      const marker = `__EMBEDDED_BINARY_${embedded.length}__`;
      embedded.push({
        marker,
        payload: decoded.toString('base64'),
        quote,
      });
      return `${quote}${prefix}${marker}${quote}`;
    },
  );
  // Protect load-bearing external literals + user-facing display labels (see
  // NEBULA_PROTECTED_LITERALS) so the byte scrub leaves them intact. Swap each for a
  // word-free marker before the scrub and restore verbatim afterwards.
  const { guarded, restore } = protectLiterals(protectedSource);
  const bytes = Buffer.from(guarded);
  scrubBuffer(bytes, vocabulary);
  let output = restore(bytes.toString('utf8'));
  for (const item of embedded) {
    let payload = item.payload;
    for (const word of forbiddenWords) {
      const pattern = new RegExp(escapeRegex(word), 'gi');
      payload = payload.replace(
        pattern,
        match =>
          `${match.slice(0, 2)}${item.quote}+${item.quote}${match.slice(2)}`,
      );
    }
    output = output.replace(item.marker, payload);
  }
  return output;
};

// ---------------------------------------------------------------------------
