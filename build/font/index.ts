import opentype from "opentype.js";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const _ttf2woff2 = require("ttf2woff2");
const ttf2woff2 = _ttf2woff2.default || _ttf2woff2;

import { cssContent } from "./css";
import { runtime } from "./runtime";

export function fontObfuscationPlugin() {
  return {
    name: "vite-plugin-font-obfuscation",
    configureServer(server: any) {
      server.middlewares.use("/ob-fonts.css", (_req: any, res: any) => {
        res.setHeader("Content-Type", "text/css");
        res.end("/* Obfuscated fonts loading... */");
      });
      server.middlewares.use("/ob-fonts.js", (_req: any, res: any) => {
        res.setHeader("Content-Type", "application/javascript");
        res.end(
          "window.fontObfuscation = { encode: t => t, decode: t => t, processElement: () => {}, processExistingDOM: () => {}, isInitialized: () => false };",
        );
      });
    },
    async generateBundle(options: any, bundle: any) {
      const availableFonts = [
        {
          path: "./public/ttf/Roboto-Regular.ttf",
          name: "roboto-obf",
        },
      ];

      // Deterministic PRNG (mulberry32). The obfuscation mapping ships in
      // `*-mappings.json` regardless, so per-build randomization bought no
      // secrecy — it only broke caching: the font filename is stable
      // (`roboto-obf.woff2`) but a Math.random() shuffle changed the glyph↔
      // codepoint assignment every build, so any browser/CDN holding a cached
      // font rendered the new build's codepoints as raw CJK ("Chinese").
      // A fixed seed makes every build byte-identical → caches stay valid.
      function makeRng(seed: number) {
        let a = seed >>> 0;
        return () => {
          a = (a + 0x6d2b79f5) | 0;
          let t = Math.imul(a ^ (a >>> 15), 1 | a);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }

      function shuffle(arr: any[], rng: () => number = Math.random) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      function getChineseChars(count = 52) {
        const chars: string[] = [];
        const ranges = [
          { start: 0x4e00, end: 0x9fff, priority: 1 },
          { start: 0x3400, end: 0x4dbf, priority: 2 },
        ];

        for (const range of ranges) {
          for (let i = range.start; i <= range.end; i++) {
            try {
              const ch = String.fromCodePoint(i);
              if (ch.length === 1 && ch.trim() !== "") {
                chars.push(ch);
              }
            } catch (e) {}

            if (chars.length >= count * 15) break;
          }
          if (chars.length >= count * 15) break;
        }

        const unique = [...new Set(chars)];
        shuffle(unique, makeRng(0x9e3779b1));

        console.log(`Got ${unique.length} CJK characters for obfuscation`);

        if (unique.length < count) {
          console.log(
            `Warning: Only found ${unique.length} characters, needed ${count}`,
          );
          return unique;
        }

        return unique.slice(0, count);
      }

      for (const fontConfig of availableFonts) {
        if (!fs.existsSync(fontConfig.path)) {
          console.log(`Font not found: ${fontConfig.path}, skipping...`);
          continue;
        }

        console.log(`Generating obfuscated font: ${fontConfig.name}`);

        const visibleChars = shuffle(
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!?;:'\"1234567890-_()[]{}/@#$%&*+=<>|\\~`".split(
            "",
          ),
          makeRng(0x85ebca6b),
        );
        const inputChars = getChineseChars(visibleChars.length);

        if (inputChars.length < visibleChars.length) {
          console.log(`Trimming to ${inputChars.length} chars`);
          visibleChars.length = inputChars.length;
        }

        // opentype.js >=1.3.x removed the callback-style `load()` and replaced
        // it with a deprecation no-op (logs but never resolves), which would
        // hang rolldown's renderChunk phase indefinitely until the worker is
        // killed with `oneshot canceled`. Use the synchronous parse() instead.
        // See: https://github.com/opentypejs/opentype.js/issues/675
        const fontBuffer = fs.readFileSync(fontConfig.path);
        const fontArrayBuffer = fontBuffer.buffer.slice(
          fontBuffer.byteOffset,
          fontBuffer.byteOffset + fontBuffer.byteLength,
        );
        const baseFont: any = (opentype as any).parse(fontArrayBuffer);

        const notdefGlyph = new opentype.Glyph({
          name: ".notdef",
          unicode: 0,
          advanceWidth: 500,
          path: new opentype.Path(),
        });

        const p = new opentype.Path();
        p.moveTo(50, 0);
        p.lineTo(450, 0);
        p.lineTo(450, 700);
        p.lineTo(50, 700);
        p.closePath();
        p.moveTo(100, 50);
        p.lineTo(100, 650);
        p.lineTo(400, 650);
        p.lineTo(400, 50);
        p.closePath();
        (notdefGlyph as any).path = p;

        const glyphs = [notdefGlyph];

        for (let i = 0; i < inputChars.length; i++) {
          const inputChar = inputChars[i];
          const outputChar = visibleChars[i];
          const sourceGlyph = baseFont.charToGlyph(outputChar);

          if (!sourceGlyph || !sourceGlyph.path) {
            console.log(`Missing glyph for ${outputChar}`);
            continue;
          }

          const g = new opentype.Glyph({
            name: `glyph_${inputChar.codePointAt(0)}`,
            unicode: inputChar.codePointAt(0),
            advanceWidth: sourceGlyph.advanceWidth,
            path: sourceGlyph.path,
          });

          glyphs.push(g);
        }

        const font = new opentype.Font({
          familyName: fontConfig.name,
          styleName: "Regular",
          unitsPerEm: baseFont.unitsPerEm || 1000,
          ascender: baseFont.ascender || 800,
          descender: baseFont.descender || -200,
          glyphs: glyphs,
          // Pin the head-table timestamp so the emitted font is byte-identical
          // across builds (opentype.js defaults to Date.now()). Combined with
          // the seeded shuffle this makes the whole obf asset set deterministic
          // → stable filenames stay cache-valid across rebuilds.
          createdTimestamp: 0,
        } as any);
        try {
          if (font.tables && font.tables.head) {
            (font.tables.head as any).created = 0;
            (font.tables.head as any).modified = 0;
          }
        } catch {}

        const ttfBuffer = Buffer.from(font.toArrayBuffer());
        const woff2Buffer = ttf2woff2(ttfBuffer);

        this.emitFile({
          type: "asset",
          fileName: `${fontConfig.name}.ttf`,
          source: ttfBuffer,
        });

        this.emitFile({
          type: "asset",
          fileName: `${fontConfig.name}.woff2`,
          source: woff2Buffer,
        });

        const mapping: Record<string, string> = {};
        const reverseMapping: Record<string, string> = {};

        for (let i = 0; i < inputChars.length; i++) {
          mapping[inputChars[i]] = visibleChars[i];
          reverseMapping[visibleChars[i]] = inputChars[i];
        }

        this.emitFile({
          type: "asset",
          fileName: `${fontConfig.name}-mappings.json`,
          source: JSON.stringify(mapping, null, 2),
        });

        this.emitFile({
          type: "asset",
          fileName: `${fontConfig.name}-reverse-mappings.json`,
          source: JSON.stringify(reverseMapping, null, 2),
        });

        console.log(`✓ Generated obfuscated font: ${fontConfig.name}`);
      }

      this.emitFile({
        type: "asset",
        fileName: "ob-fonts.css",
        source: cssContent,
      });

      this.emitFile({
        type: "asset",
        fileName: "ob-fonts.js",
        source: runtime(),
      });

      console.log("✓ Generated obfuscated fonts CSS and JS runtime");
    },
  };
}
