import { convertHtmlToSvg } from "./svg";
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';

export function buildStaticSvg(html: string): string {
	return convertHtmlToSvg(html);
}

// Astro minifies safe attribute values without quotes. Normalize local URLs
// before the quoted-attribute route/resource rewrites below.
function quoteLocalUrlAttributes(html: string): string {
	return html.replace(/<[a-z][\w:-]*(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi, tag =>
		tag.replace(
			/(\s(?:src|href|action|poster|data|xlink:href)\s*=\s*)((?:\/|\.\.?\/)[^\s"'`<>]*)/gi,
			(all, attribute: string, target: string) =>
				target.startsWith('//') ? all : `${attribute}"${target}"`
		)
	);
}

function routeSvgHtml(
	html: string,
	htmlPath: string,
	standaloneRoot = false
): string {
	const locale = htmlPath.split(sep)[0];
	const from = dirname(htmlPath);
	const assetBase = standaloneRoot
		? './'
		: '../'.repeat(from === '.' ? 0 : from.split(sep).length);
	// A coordinator may regenerate SVGs from already-rehosted Astro HTML.
	// Its old localized base must not overwrite the root SVG's package base.
	html = quoteLocalUrlAttributes(html).replace(
		/<script>self\.__ddxBase=new URL\("[./]+",location\.href\)\.href;?<\/script>/g,
		''
	);
	html = html.replace(
		/\bsrc=(['"])\/loading\/?(\?[^'"#]*)?(#[^'"]*)?\1/gi,
		(_all, quote: string, query = '', hash = '') =>
			`src=${quote}/loading/index.html${query}${hash}${quote}`
	);
	const sourceUrl = new URL(
		htmlPath.split(sep).join('/'),
		'https://nebula.invalid/'
	);
	html = html.replace(
		/\b(src|href|action|poster|data|xlink:href)=(['"])([^'"]*)\2/gi,
		(all, attribute: string, quote: string, target: string) => {
			if (
				!target ||
				target.startsWith('#') ||
				target.startsWith('?') ||
				target.startsWith('//') ||
				/^[a-z][\w+.-]*:/i.test(target)
			)
				return all;
			const url = new URL(target, sourceUrl);
			const pathname = url.pathname
				.replace(/\/index\.(?:html|svg)$/, '')
				.replace(/\/$/, '');
			if (
				attribute.toLowerCase() === 'href' &&
				/^\/(?:en_US|jp)(?:\/[^.]*)?$/.test(pathname)
			) {
				const targetIndex = `${pathname.slice(1)}/index.svg`;
				let rel = standaloneRoot
					? `./${targetIndex}`
					: relative(from, targetIndex).split(sep).join('/');
				if (!rel.startsWith('.')) rel = `./${rel}`;
				return `href=${quote}${rel}${url.search}${url.hash}${quote}`;
			}
			if (
				target.startsWith('/') ||
				(standaloneRoot && target.startsWith('../'))
			) {
				return `${attribute}=${quote}${assetBase}${url.pathname.slice(1)}${url.search}${url.hash}${quote}`;
			}
			return all;
		}
	);
	const navigation = `<script>self.__ddxBase=new URL(${JSON.stringify(assetBase)},location.href).href;
(function() {
  var base = new URL(self.__ddxBase);
  function svgTarget(target) {
    var url = new URL(target, location.href);
    if (url.origin !== base.origin) return null;
    var path = url.pathname.indexOf(base.pathname) === 0 ? url.pathname.slice(base.pathname.length) : url.pathname.slice(1);
    path = path.replace(/\\/index\\.(?:html|svg)$/, '').replace(/\\/$/, '');
    if (path && !/^(?:en_US|jp)(?:\\/[^.]*)?$/.test(path)) return null;
    var result = new URL((path ? path + '/' : '') + 'index.svg', base);
    result.search = url.search; result.hash = url.hash;
    return result;
  }
  document.addEventListener('astro:before-preparation', function(event) {
    if (!event.to || event.formData) return;
    var target = svgTarget(event.to.href);
    if (!target) return;
    // Astro's cancellation fallback uses its original URL object, not a
    // replacement event.to. Mutate in place before requesting a full load.
    event.to.href = target.href;
    event.preventDefault();
  });
  document.addEventListener('click', function(event) {
    var anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor || anchor.hasAttribute('download')) return;
    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    var target = svgTarget(href);
    if (target) anchor.setAttribute('href', target.href);
  }, true);
})();</script>`;
	return `${navigation}${html}`;
}

export function buildLocalizedStaticSvg(
	html: string,
	htmlPath: string,
	standaloneRoot = false
): string {
	return buildStaticSvg(routeSvgHtml(html, htmlPath, standaloneRoot));
}

export function emitLocalizedRouteSvgs(distDirectory: string): string[] {
	const emitted: string[] = [];
	const visit = (directory: string) => {
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const absolute = join(directory, entry.name);
			if (entry.isDirectory()) visit(absolute);
			else if (entry.isFile() && entry.name === 'index.html') {
				const relHtml = relative(distDirectory, absolute);
				const locale = relHtml.split(sep)[0];
				if (locale !== 'en_US' && locale !== 'jp') continue;
				const relSvg = relHtml.slice(0, -'html'.length) + 'svg';
				writeFileSync(
					join(distDirectory, relSvg),
					buildLocalizedStaticSvg(
						readFileSync(absolute, 'utf8'),
						relHtml
					),
					'utf8'
				);
				emitted.push(relSvg.split(sep).join('/'));
			}
		}
	};
	visit(distDirectory);
	return emitted;
}

export function rehostStaticHtmlFiles(distDirectory: string): number {
	let updated = 0;
	const visit = (directory: string) => {
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const absolute = join(directory, entry.name);
			if (entry.isDirectory()) {
				visit(absolute);
				continue;
			}
			if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
			const rel = relative(distDirectory, absolute);
			const parent = dirname(rel);
			const prefix =
				parent === '.' ? './' : '../'.repeat(parent.split(sep).length);
			const source = readFileSync(absolute, 'utf8');
			let rebased = quoteLocalUrlAttributes(source)
				.replace(
					/\b(src|href|action|poster|data|xlink:href)=(['"])(\/(?!\/)[^'"#?]*)(\/?(?:[?#][^'"]*)?)\2/gi,
					(
						_all,
						attribute: string,
						quote: string,
						target: string,
						suffix: string
					) => {
						const path = target + suffix;
						const [pathname] = path.split(/[?#]/);
						const explicitEntry = existsSync(
							join(distDirectory, pathname.slice(1), 'index.html')
						);
						const rebasedPath = explicitEntry
							? `${pathname.replace(/\/$/, '')}/index.html${path.slice(pathname.length)}`
							: path;
						return `${attribute}=${quote}${prefix}${rebasedPath.slice(1)}${quote}`;
					}
				)
				.replace(
					/url\((['"]?)(\/(?!\/)[^)'"#?]*)(\/?(?:[?#][^)'" ]*)?)\1\)/gi,
					(_all, quote: string, target: string, suffix: string) =>
						`url(${quote}${prefix}${target.slice(1)}${suffix}${quote})`
				);
			const baseScript = `<script>self.__ddxBase=new URL(${JSON.stringify(prefix)},location.href).href</script>`;
			if (rebased.includes(baseScript)) {
				// Already rehosted: retain the existing package base script.
			} else if (/<head\b[^>]*>/i.test(rebased)) {
				rebased = rebased.replace(
					/<head\b[^>]*>/i,
					head => `${head}${baseScript}`
				);
			} else if (/<html\b[^>]*>/i.test(rebased)) {
				rebased = rebased.replace(
					/<html\b[^>]*>/i,
					htmlTag => `${htmlTag}<head>${baseScript}</head>`
				);
			} else {
				rebased = `${baseScript}${rebased}`;
			}
			if (rebased !== source) {
				writeFileSync(absolute, rebased, 'utf8');
				updated++;
			}
		}
	};
	visit(distDirectory);
	return updated;
}

export function staticSvgSourcePath(distDirectory: string): string {
	const localizedEntry = join(distDirectory, 'en_US', 'index.html');
	return existsSync(localizedEntry)
		? localizedEntry
		: join(distDirectory, 'index.html');
}

export function createSvgHost(): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <foreignObject x="0" y="0" width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:100%;height:100%;margin:0;overflow:hidden;background:#101018;color:white;font:16px sans-serif;">
      <iframe id="app-frame" xmlns="http://www.w3.org/1999/xhtml" title="Nebula" style="display:block;border:0;width:100%;height:100%;" />
      <div id="status" xmlns="http://www.w3.org/1999/xhtml" role="status" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;">Loading Nebula…</div>
    </div>
  </foreignObject>
  <script><![CDATA[
    (function () {
      var frame = document.getElementById('app-frame');
      var status = document.getElementById('status');
      var saved = null;
      try { saved = localStorage.getItem('nebula||selectedLanguage'); } catch (_) { /* storage may be disabled */ }
      var locale = saved === 'jp' || saved === 'en_US'
        ? saved
        : /^ja/i.test(navigator.language || '') ? 'jp' : 'en_US';
      status.textContent = 'Loading Nebula…';
      function showError() {
        status.textContent = 'Unable to load Nebula. Please reload this page.';
        status.style.display = 'flex';
      }
      var loadingTimeout = setTimeout(showError, 15000);
      frame.addEventListener('load', function () {
        clearTimeout(loadingTimeout);
        try {
          var child = frame.contentDocument;
          var stylesheet = child && child.getElementById('stylesheet');
          if (!stylesheet || stylesheet.tagName !== 'LINK' || stylesheet.rel !== 'stylesheet') { showError(); return; }
          status.style.display = 'none';
        } catch (_) { showError(); }
      });
      frame.addEventListener('error', function () {
        clearTimeout(loadingTimeout);
        showError();
      });
      frame.setAttribute('src', locale === 'jp' ? '/jp/' : '/en_US/');
    })();
  ]]></script>
</svg>`;
}
