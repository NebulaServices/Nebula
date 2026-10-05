import { createHmac } from "node:crypto";
import { readdir, readFile, writeFile, rename, stat } from "node:fs/promises";
import { join } from "node:path";
// Reference daydream's proven, base64-safe content scrubbers. NB: we use the
// PURE functions (no internal dynamic imports) and do file I/O ourselves —
// scrubArtifact() dynamically imports node:fs/promises, which fails at Astro's
// build:done ("Vite module runner has been closed").
import { scrubBuffer, scrubJavaScript, protectLiterals } from "./scrub-pure";

// Proxy-stack "tell" words to rename in the built static output. Ordered
// longest-first so a shorter word that is a substring of a longer one
// (`scram` ⊂ `scramjet`) is never partially replaced.
//
// Deliberately EXCLUDES `wisp` (the generatable transport uses the literal
// external endpoint nightwisp.me/.../wisp/, which a byte-scrub would break) and
// `nebula` (brand kept for now; handled by font obfuscation).
export const NEBULA_SCRUB_WORDS = [
  "ultraviolet",
  "scramjet",
  "libcurl",
  "epoxy",
  "scram",
  "bare",
] as const;

const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const ALNUM = "abcdefghijklmnopqrstuvwxyz0123456789";

function rawToken(seed: string, label: string, len: number): string {
  const bytes: number[] = [];
  for (let block = 0; bytes.length < len; block++) {
    bytes.push(
      ...createHmac("sha256", seed).update(`${label}:${block}`).digest(),
    );
  }
  return bytes
    .slice(0, len)
    .map((b, i) => (i === 0 ? ALPHA[b % ALPHA.length] : ALNUM[b % ALNUM.length]))
    .join("");
}

function containsWord(s: string): boolean {
  const l = s.toLowerCase();
  return NEBULA_SCRUB_WORDS.some((w) => l.includes(w));
}

// Derive a same-length, letter-first, collision-free token per word.
function deriveVocabulary(
  seed: string,
  haystacks: string[],
): Record<string, string> {
  const vocab: Record<string, string> = {};
  const used = new Set<string>();
  const corpus = haystacks.join("\n").toLowerCase();
  for (const word of NEBULA_SCRUB_WORDS) {
    let token = "";
    for (let attempt = 0; attempt < 512; attempt++) {
      const cand = rawToken(seed, `${word}#${attempt}`, word.length);
      const lc = cand.toLowerCase();
      if (containsWord(cand)) continue; // never spell a tell
      if (used.has(lc)) continue; // unique among tokens
      if (corpus.includes(lc)) continue; // not already present in dist
      token = cand;
      break;
    }
    if (!token)
      throw new Error(`[nebula-scrub] could not derive a token for "${word}"`);
    vocab[word] = token;
    used.add(token.toLowerCase());
  }
  return vocab;
}

const TEXT_RE = /\.(?:js|mjs|cjs|ts|css|html|json|svg|txt|map|wasm)$/i;

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.isFile()) out.push(p);
  }
  return out;
}

function renameName(name: string, vocab: Record<string, string>): string {
  let out = name;
  for (const word of NEBULA_SCRUB_WORDS) {
    const re = new RegExp(word, "gi");
    out = out.replace(re, vocab[word]!);
  }
  return out;
}

// Bottom-up rename of files/dirs whose basenames contain a tell word, so
// in-code references (already rewritten to tokens by the content scrub) resolve
// against the on-disk tree.
async function renameEntries(
  dir: string,
  vocab: Record<string, string>,
): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) await renameEntries(join(dir, entry.name), vocab);
  }
  for (const entry of entries) {
    const renamed = renameName(entry.name, vocab);
    if (renamed === entry.name) continue;
    const from = join(dir, entry.name);
    const to = join(dir, renamed);
    try {
      await stat(to);
      // target exists — skip to avoid clobbering
    } catch {
      await rename(from, to);
    }
  }
}

export interface NebulaScrubResult {
  vocabulary: Record<string, string>;
  replacements: number;
  files: number;
}

// Scrub the built static output in place.
export async function nebulaScrub(
  distDir: string,
  seed = process.env.NEBULA_SCRUB_SEED || "nebula-static-v1",
): Promise<NebulaScrubResult> {
  let files = await walk(distDir);
  if (files.length === 0) return { vocabulary: {}, replacements: 0, files: 0 };

  // Collision-free vocabulary derived against the text corpus.
  const textFiles = files.filter((f) => TEXT_RE.test(f));
  const corpus = await Promise.all(
    textFiles.map((f) =>
      readFile(f, "utf8").catch(() => ""),
    ),
  );
  const vocabulary = deriveVocabulary(seed, corpus);

  // Content scrub (base64-safe) using the pure scrubbers + our own file I/O.
  let replacements = 0;
  let errors = 0;
  for (const file of files) {
    if (!TEXT_RE.test(file)) continue;
    try {
      const buf = Buffer.from(await readFile(file));
      if (/\.(?:m?js|cjs)$/i.test(file)) {
        const text = buf.toString("utf8");
        const out = scrubJavaScript(text, vocabulary);
        const counter = Buffer.from(text, "utf8");
        replacements += scrubBuffer(counter, vocabulary);
        await writeFile(file, out);
      } else if (/\.wasm$/i.test(file)) {
        const n = scrubBuffer(buf, vocabulary);
        if (n > 0 && WebAssembly.validate(new Uint8Array(buf))) {
          await writeFile(file, buf);
          replacements += n;
        }
        // if scrubbing would invalidate the wasm, leave it untouched
      } else {
        // Plain text (html/css/json/svg/txt): honor PROTECTED_LITERALS so
        // user-facing vendor labels (credits "Scramjet"/"Libcurl.js"/"Epoxy
        // TLS", transport dropdown) survive the byte scrub instead of showing
        // random tokens.
        const text = buf.toString("utf8");
        const { guarded, restore } = protectLiterals(text);
        const gbuf = Buffer.from(guarded);
        const n = scrubBuffer(gbuf, vocabulary);
        if (n > 0) await writeFile(file, restore(gbuf.toString("utf8")));
        replacements += n;
      }
    } catch (e) {
      errors++;
      if (errors <= 3) {
        // eslint-disable-next-line no-console
        console.warn(`[nebula-scrub] skipped ${file}: ${(e as Error).message}`);
      }
    }
  }
  if (errors) {
    // eslint-disable-next-line no-console
    console.warn(`[nebula-scrub] ${errors} file(s) skipped due to errors`);
  }

  // Path rename (files + dirs).
  await renameEntries(distDir, vocabulary);

  return { vocabulary, replacements, files: files.length };
}
