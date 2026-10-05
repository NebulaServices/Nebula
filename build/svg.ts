import type { Plugin, ResolvedConfig } from 'vite';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { decodeHTML5 } from 'entities';

export function svgWrapperPlugin(subdir = ''): Plugin {
	let config: ResolvedConfig;

	return {
		name: 'ddx-svg-wrapper',
		apply: 'build',
		enforce: 'post',

		configResolved(c) {
			config = c;
		},

		closeBundle() {
			// `subdir` lets the svg be generated next to the app shell (e.g. "app"),
			// so its relative ./assets refs resolve under /app/ and it boots the app
			// directly when opened as /app/index.svg — no redirect needed.
			const outDir = resolve(config.root, config.build.outDir, subdir);
			const indexPath = resolve(outDir, 'index.html');
			// closeBundle still fires when an upstream build error prevented the
			// HTML from being emitted. Silently skip in that case so the real
			// error isn't buried under a misleading ENOENT.
			if (!existsSync(indexPath)) return;
			try {
				const html = readFileSync(indexPath, 'utf-8');
				const svg = convertHtmlToSvg(html);
				writeFileSync(resolve(outDir, 'index.svg'), svg, 'utf-8');
				console.log(
					`\x1b[36m  Generated ${subdir ? subdir + '/' : ''}index.svg from index.html\x1b[0m`
				);
			} catch (err) {
				console.error(
					'\x1b[31m  Failed to generate index.svg:\x1b[0m',
					err
				);
			}
		}
	};
}

/**
 * Build a tiny SVG document that immediately redirects to `target` when opened
 * as a top-level page. Used to emit a root `/index.svg` that forwards to the
 * real bootloader at `/app/index.svg`. The target is relative so it resolves
 * correctly regardless of the mount point (from `/index.svg`, `app/index.svg`
 * resolves to `/app/index.svg`). A `<noscript>`-style anchor fallback is not
 * possible in bare SVG, so we also set a `<a xlink:href>` cover for the
 * scriptless case.
 */
export function buildRedirectSvg(target: string): string {
	const safe = target.replace(/"/g, '&quot;');
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" style="position: fixed; top: 0; left: 0;">
  <script type="text/javascript"><![CDATA[
    window.location.replace("${target}");
  ]]></script>
  <a xlink:href="${safe}">
    <text x="12" y="24" font-family="sans-serif" font-size="14">Redirecting…</text>
  </a>
</svg>`;
}

/**
 * Emit a redirect SVG at `<outDir>/<fileName>` that forwards to `target`.
 * Registered after the app-shell svg so a root `/index.svg` forwards to the
 * co-located `/app/index.svg` bootloader.
 */
export function svgRedirectPlugin(fileName: string, target: string): Plugin {
	let config: ResolvedConfig;
	return {
		name: 'ddx-svg-redirect',
		apply: 'build',
		enforce: 'post',
		configResolved(c) {
			config = c;
		},
		closeBundle() {
			const outDir = resolve(config.root, config.build.outDir);
			try {
				writeFileSync(
					resolve(outDir, fileName),
					buildRedirectSvg(target),
					'utf-8'
				);
				console.log(
					`\x1b[36m  Generated ${fileName} redirect -> ${target}\x1b[0m`
				);
			} catch (err) {
				console.error(
					`\x1b[31m  Failed to generate ${fileName} redirect:\x1b[0m`,
					err
				);
			}
		}
	};
}

interface ScriptEntry {
	type: 'inline' | 'external' | 'inert';
	content?: string;
	src?: string;
	id?: string;
	isModule?: boolean;
	hasDefer?: boolean;
	hasCrossorigin?: boolean;
}

interface ParsedHtml {
	inlineStyles: string[];
	headTags: string[];
	bodyAttrs: string;
	bodyInner: string;
	scripts: ScriptEntry[];
}

function parseHtml(html: string): ParsedHtml {
	let src = html
		.replace(/<!doctype\s+html>/i, '')
		.replace(/<html[^>]*>/i, '')
		.replace(/<\/html\s*>/i, '')
		// Strip the <head>/</head> wrapper (keep its children). Without this the
		// opening <head> is captured by the head-tag scan below (which only matches
		// OPEN tags, never </head>) and emitted as an unclosed element inside the
		// SVG body — a fatal XML mismatch (e.g. Astro emits an explicit <head>).
		.replace(/<\/?head[^>]*>/gi, '')
		.trim();

	const inlineStyles: string[] = [];
	const headTags: string[] = [];
	const scripts: ScriptEntry[] = [];

	const bodyMatch = src.match(/<body(\s[^>]*)?>/i);
	let headPart = src;
	let bodyAttrs = '';
	let bodyInner = '';

	if (bodyMatch && bodyMatch.index !== undefined) {
		headPart = src.slice(0, bodyMatch.index);
		bodyAttrs = (bodyMatch[1] || '').trim();
		const afterBody = src.slice(bodyMatch.index + bodyMatch[0].length);
		bodyInner = afterBody.replace(/<\/body\s*>/i, '').trim();
	}

	headPart = headPart.replace(
		/<style(?:\s[^>]*)?>([^]*?)<\/style>/gi,
		(_, content) => {
			inlineStyles.push(content);
			return '';
		}
	);

	headPart = headPart.replace(
		/<script(\s[^>]*)?>([^]*?)<\/script>/gi,
		(_full, attrs, content) => {
			const script = parseScriptTag(attrs || '', content);
			if (script) scripts.push(script);
			return '';
		}
	);

	bodyInner = bodyInner.replace(
		/<script(\s[^>]*)?>([^]*?)<\/script>/gi,
		(_full, attrs, content) => {
			const script = parseScriptTag(attrs || '', content);
			if (script) scripts.push(script);
			return '';
		}
	);

	const tagRe = /<([\w-]+)(\s[^>]*)?\/?>/g;
	let match: RegExpExecArray | null;
	const seen = new Set<number>();

	while ((match = tagRe.exec(headPart)) !== null) {
		const tag = match[0];
		const tagName = match[1].toLowerCase();
		if (seen.has(match.index)) continue;
		seen.add(match.index);

		if (tagName === 'title') {
			const titleClose = headPart.indexOf('</title>', match.index);
			if (titleClose !== -1) {
				headTags.push(headPart.slice(match.index, titleClose + 8));
			}
		} else {
			headTags.push(tag);
		}
	}

	return { inlineStyles, headTags, bodyAttrs, bodyInner, scripts };
}

function parseScriptTag(attrs: string, content: string): ScriptEntry | null {
	const typeMatch = attrs.match(/\btype=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
	const scriptType = (
		typeMatch?.[1] ||
		typeMatch?.[2] ||
		typeMatch?.[3] ||
		''
	).toLowerCase();
	if (
		scriptType &&
		scriptType !== 'module' &&
		!/^(?:text|application)\/(?:java|ecma)script$/.test(scriptType)
	) {
		// Inert data payloads (used by fallback loaders) are preserved
		// verbatim with id; everything else non-executable is dropped.
		if (scriptType !== 'text/plain') return null;
		const idMatch = attrs.match(/\bid=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
		return {
			type: 'inert',
			id: idMatch?.[1] || idMatch?.[2] || idMatch?.[3] || '',
			content
		};
	}
	const srcMatch = attrs.match(/\bsrc=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
	const isModule =
		/\btype=module\b/i.test(attrs) || /\btype="module"/i.test(attrs);
	const hasDefer = /\bdefer\b/i.test(attrs);
	const hasCrossorigin = /\bcrossorigin\b/i.test(attrs);

	if (srcMatch) {
		const src = srcMatch[1] || srcMatch[2] || srcMatch[3];
		return {
			type: 'external',
			src,
			isModule,
			hasDefer,
			hasCrossorigin
		};
	}

	return { type: 'inline', content: content.trim() };
}

const VOID_ELEMENTS = new Set([
	'area',
	'base',
	'br',
	'col',
	'embed',
	'hr',
	'img',
	'input',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr'
]);

function toXhtml(html: string): string {
	html = html.replace(/&[a-zA-Z][a-zA-Z0-9]+;/g, entity =>
		Array.from(
			decodeHTML5(entity),
			character => `&#${character.codePointAt(0)};`
		).join('')
	);
	return html.replace(
		/<([\w-]+)((?:\s[^>]*?)?)\s*(\/?)\s*>/gi,
		(_full, tagName: string, attrsRaw: string, selfClose: string) => {
			const tag = tagName.toLowerCase();

			let attrs = fixAttributes(attrsRaw || '');
			// HTML parsing switches namespaces at <svg>; XML parsing does not.
			// Icons inside the XHTML foreignObject otherwise become XHTML elements.
			if (tag === 'svg' && !/(?:^|\s)xmlns\s*=/.test(attrs)) {
				attrs += ' xmlns="http://www.w3.org/2000/svg"';
			}

			if (VOID_ELEMENTS.has(tag)) {
				return `<${tagName}${attrs} />`;
			}

			return `<${tagName}${attrs}${selfClose ? ' /' : ''}>`;
		}
	);
}

// Escape an attribute value for XML/XHTML. SVG is XML, so a bare `&` (e.g. the
// `&display=swap` in a Google-Fonts URL) or `<` in an attribute value is a
// fatal parse error. We escape `&` only when it doesn't already begin a valid
// entity/char-ref so pre-escaped values aren't double-encoded.
function escapeXmlAttr(value: string): string {
	return value
		.replace(/&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/"/g, '&quot;');
}

function fixAttributes(raw: string): string {
	if (!raw) return '';

	const result: string[] = [];
	let i = 0;

	while (i < raw.length) {
		if (/\s/.test(raw[i])) {
			result.push(raw[i]);
			i++;
			continue;
		}

		const nameStart = i;
		while (i < raw.length && /[\w:.-]/.test(raw[i])) i++;
		const name = raw.slice(nameStart, i);

		if (!name) {
			result.push(raw[i] || '');
			i++;
			continue;
		}

		if (i < raw.length && raw[i] === '=') {
			i++;

			if (i < raw.length && raw[i] === '"') {
				const end = raw.indexOf('"', i + 1);
				if (end !== -1) {
					result.push(
						`${name}="${escapeXmlAttr(raw.slice(i + 1, end))}"`
					);
					i = end + 1;
				} else {
					result.push(`${name}="${escapeXmlAttr(raw.slice(i + 1))}"`);
					i = raw.length;
				}
			} else if (i < raw.length && raw[i] === "'") {
				const end = raw.indexOf("'", i + 1);
				if (end !== -1) {
					const val = raw.slice(i + 1, end);
					result.push(`${name}="${escapeXmlAttr(val)}"`);
					i = end + 1;
				} else {
					result.push(`${name}="${escapeXmlAttr(raw.slice(i + 1))}"`);
					i = raw.length;
				}
			} else {
				const valStart = i;
				while (i < raw.length && !/[\s>]/.test(raw[i])) i++;
				const val = raw.slice(valStart, i);
				result.push(`${name}="${escapeXmlAttr(val)}"`);
			}
		} else {
			result.push(`${name}=""`);
		}
	}

	return result.join('');
}

function escapeCdata(code: string): string {
	return code.replace(/\]\]>/g, ']]]]><![CDATA[>');
}

function makeRootUrlsRelative(html: string): string {
	return html
		.replace(
			/(\b(?:src|href|action|poster|data|xlink:href)\s*=\s*)(["'])(\/(?!\/)[^"']*)\2/gi,
			(_, prefix: string, quote: string, url: string) =>
				`${prefix}${quote}.${url}${quote}`
		)
		.replace(
			/\burl\(\s*(["']?)(\/(?!\/)[^)"']*)\1\s*\)/gi,
			(_, quote: string, url: string) => `url(${quote}.${url}${quote})`
		);
}

function buildScriptSection(scripts: ScriptEntry[]): string {
	const parts: string[] = [];

	parts.push(
		[
			'(function() {',
			'  var ns = "http://www.w3.org/1999/xhtml";',
			'  var body = document.querySelector("body");',
			'  var head = document.createElementNS(ns, "head");',
			'  body.prepend(head);',
			'  Object.defineProperty(document, "head", { get: function() { return head; }, configurable: true });',
			'  Object.defineProperty(document, "body", { get: function() { return body; }, configurable: true });',
			'  document.createElement = function(tag, opts) {',
			'    var node = document.createElementNS(ns, tag, opts);',
			'    Object.defineProperty(node, "tagName", { get: function() { return node.localName.toUpperCase(); }, configurable: true });',
			'    return node;',
			'  };',
			'  // HTML vendors mount overlays on documentElement, which is SVG here.',
			'  var root = document.documentElement;',
			'  if (root && root.namespaceURI === "http://www.w3.org/2000/svg") {',
			'    var append = root.appendChild.bind(root);',
			'    var routed = new WeakSet();',
			'    var virtualTail = false;',
			'    root.appendChild = function(node) {',
			'      virtualTail = node.namespaceURI === ns;',
			'      if (!virtualTail) return append(node);',
			'      routed.add(node);',
			'      return body.appendChild(node);',
			'    };',
			'    var proto = root, last;',
			'    while (proto && !last) { last = Object.getOwnPropertyDescriptor(proto, "lastElementChild"); proto = Object.getPrototypeOf(proto); }',
			'    if (last && last.get) Object.defineProperty(root, "lastElementChild", { configurable: true, get: function() {',
			'      var tail = body.lastElementChild;',
			'      return virtualTail && tail && routed.has(tail) ? tail : last.get.call(root);',
			'    } });',
			'  }',
			'  // Parse writes as HTML (XML innerHTML rejects HTML entities/void tags).',
			'  document.write = function() {',
			'    var parsed = new DOMParser().parseFromString(Array.prototype.join.call(arguments, ""), "text/html");',
			'    function mount(source, target) {',
			'      Array.from(source.childNodes).forEach(function(node) {',
			'        var copy = document.importNode(node, true);',
			'        // Imported parser scripts are inert; recreate them in this realm.',
			'        var scripts = copy.nodeType === 1 ? (copy.localName === "script" ? [copy] : Array.from(copy.querySelectorAll("script"))) : [];',
			'        scripts.forEach(function(old) {',
			'          var active = document.createElement("script"); active.async = false;',
			'          Array.from(old.attributes).forEach(function(attr) { active.setAttribute(attr.name, attr.value); });',
			'          active.textContent = old.textContent;',
			'          if (old === copy) copy = active; else old.replaceWith(active);',
			'        });',
			'        target.appendChild(copy);',
			'      });',
			'    }',
			'    mount(parsed.head, head); mount(parsed.body, body);',
			'  };',
			'  document.writeln = function() { document.write(Array.prototype.join.call(arguments, "") + "\\n"); };',
			'})();'
		].join('\n')
	);

	for (const s of scripts) {
		if (s.type === 'inline' && s.content) {
			parts.push(s.content);
		}
	}

	const externals = scripts.filter(s => s.type === 'external' && s.src);
	if (externals.length > 0) {
		const nonModule = externals.filter(s => !s.isModule);
		const modules = externals.filter(s => s.isModule);

		const loaderLines: string[] = [];
		loaderLines.push(
			'(function() {',
			'  var ns = "http://www.w3.org/1999/xhtml";',
			'  var d = document;',
			'  var b = d.querySelector("body");',
			'',
			'  function loadModules() {'
		);

		if (modules.length > 0) {
			loaderLines.push(
				'    var mods = ' +
					JSON.stringify(
						modules.map(s => ({
							src: s.src,
							co: s.hasCrossorigin || false
						}))
					) +
					';',
				'    var remaining = mods.length;',
				'    mods.forEach(function(m) {',
				'      var s = d.createElementNS(ns, "script");',
				'      s.setAttribute("type", "module");',
				'      s.setAttribute("src", m.src);',
				'      if (m.co) s.setAttribute("crossorigin", "");',
				'      s.onload = s.onerror = function() { s.onload = s.onerror = null; if (--remaining === 0) d.dispatchEvent(new Event("DOMContentLoaded")); };',
				'      b.appendChild(s);',
				'    });'
			);
		}

		loaderLines.push('  }', '');

		if (nonModule.length > 0) {
			loaderLines.push(
				'  // Load non-module deps first, then modules after all finish',
				'  var srcs = ' +
					JSON.stringify(nonModule.map(s => s.src)) +
					';',
				'  var pending = srcs.length;',
				'  function done() { if (--pending === 0) loadModules(); }',
				'  srcs.forEach(function(u) {',
				'    var s = d.createElementNS(ns, "script");',
				'    s.setAttribute("src", u);',
				'    s.async = false;',
				'    s.onload = done;',
				'    s.onerror = done;',
				'    b.appendChild(s);',
				'  });'
			);
		} else {
			loaderLines.push('  loadModules();');
		}

		loaderLines.push('})();');
		parts.push(loaderLines.join('\n'));
	}

	return escapeCdata(parts.join(';\n\n'));
}

export function convertHtmlToSvg(html: string): string {
	const parsed = parseHtml(makeRootUrlsRelative(html));

	const styleContent = parsed.inlineStyles.join('\n');

	const headXhtml = parsed.headTags.map(t => toXhtml(t)).join('\n      ');
	const bodyXhtml = toXhtml(parsed.bodyInner);
	const bodyAttrsXhtml = parsed.bodyAttrs
		? ' ' +
			toXhtml('<x ' + parsed.bodyAttrs + '>')
				.slice(3, -1)
				.trimEnd()
		: '';

	const scriptContent = buildScriptSection(parsed.scripts);
	const inertBlocks = parsed.scripts
		.filter(s => s.type === 'inert' && s.content)
		.map(
			s =>
				`<script${s.id ? ` id="${s.id}"` : ''} type="text/plain"><![CDATA[${s.content!.replace(
					/\]\]>/g,
					']]]]><![CDATA[>'
				)}]]></script>`
		)
		.join('\n      ');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="position: fixed; top: 0; left: 0;">
  <style>${styleContent}</style>
  <foreignObject x="0" y="0" width="100%" height="100%">
    <body xmlns="http://www.w3.org/1999/xhtml"${bodyAttrsXhtml}>
      ${headXhtml}
      ${inertBlocks ? inertBlocks + '\n      ' : ''}${bodyXhtml}
    </body>
  </foreignObject>
  <script><![CDATA[
${scriptContent}
  ]]></script>
</svg>`;
}
