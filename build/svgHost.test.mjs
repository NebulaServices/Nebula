import assert from 'node:assert/strict';
import {
	existsSync,
	readFileSync,
	mkdtempSync,
	mkdirSync,
	writeFileSync,
	rmSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { createSvgHost } from './svgHost.ts';
import {
	buildStaticSvg,
	buildLocalizedStaticSvg,
	staticSvgSourcePath,
	emitLocalizedRouteSvgs,
	rehostStaticHtmlFiles
} from './svgHost.ts';

function parseSvg(svg) {
	const result = spawnSync(
		'python3',
		[
			'-c',
			'import sys, xml.etree.ElementTree as ET; root = ET.fromstring(sys.stdin.read()); assert root.tag == "{http://www.w3.org/2000/svg}svg"'
		],
		{ input: svg, encoding: 'utf8' }
	);
	assert.equal(result.status, 0, result.stderr);
}

function launch({
	stored = null,
	language = 'en-US',
	storageThrows = false
} = {}) {
	const svg = createSvgHost();
	const script = svg.match(
		/<script\b[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/script>/
	)?.[1];
	assert.ok(script, 'inline startup script is XML CDATA');
	const listeners = new Map();
	let timeout;
	const frame = {
		style: {},
		contentDocument: {
			title: 'Home',
			getElementById(id) {
				return id === 'nebula-input'
					? { tagName: 'INPUT' }
					: id === 'stylesheet'
						? { tagName: 'LINK', rel: 'stylesheet' }
						: null;
			}
		},
		addEventListener(name, callback) {
			listeners.set(name, callback);
		},
		setAttribute(name, value) {
			if (name === 'src') this.src = value;
		}
	};
	const status = { textContent: '', style: {} };
	const window = {
		location: Object.freeze({ href: 'http://localhost:8080/index.svg' })
	};
	const context = {
		document: {
			getElementById(id) {
				return { 'app-frame': frame, status }[id];
			}
		},
		window,
		navigator: { language },
		localStorage: {
			getItem(key) {
				assert.equal(key, 'nebula||selectedLanguage');
				if (storageThrows) throw new Error('storage blocked');
				return stored;
			}
		},
		setTimeout(callback) {
			timeout = callback;
			return 1;
		},
		clearTimeout() {
			timeout = null;
		}
	};
	vm.runInNewContext(script, context);
	return { frame, status, listeners, window, expire: () => timeout?.() };
}

test('emits XML-well-formed SVG containing an XHTML iframe covering the viewport', () => {
	const svg = createSvgHost();
	parseSvg(svg);
	assert.match(svg, /<svg[^>]*width="100%"[^>]*height="100%"/);
	assert.doesNotMatch(
		svg,
		/<svg[^>]*\bviewBox=/,
		'iframe browsing context must use viewport CSS pixels, not a scaled 100x100 SVG viewBox'
	);
	assert.match(svg, /<foreignObject[^>]*width="100%"[^>]*height="100%"/);
	assert.match(svg, /<iframe[^>]*xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/);
	assert.match(svg, /<iframe[^>]*style="[^"]*width:100%;[^"]*height:100%;/);
	assert.doesNotMatch(svg, /<iframe[^>]*\bsandbox=/);
});

test('converts built app HTML into the SVG foreignObject instead of an iframe host', () => {
	const svg = buildStaticSvg(
		'<html><head><title>Nebula app</title></head><body><main>Nebula app content</main></body></html>'
	);
	assert.match(
		svg,
		/<foreignObject[\s\S]*<body[^>]*>[\s\S]*Nebula app content[\s\S]*<\/foreignObject>/
	);
	assert.doesNotMatch(svg, /id="app-frame"/);
});

test('selects the localized app entry instead of the root language redirect for static SVG', () => {
	const dir = mkdtempSync(join(tmpdir(), 'nebula-svg-entry-'));
	try {
		mkdirSync(join(dir, 'en_US'));
		writeFileSync(
			join(dir, 'index.html'),
			'<html><body>Language redirect</body></html>'
		);
		writeFileSync(
			join(dir, 'en_US', 'index.html'),
			'<html><body>Nebula home application</body></html>'
		);
		assert.equal(
			staticSvgSourcePath(dir),
			join(dir, 'en_US', 'index.html')
		);
		assert.match(
			buildStaticSvg(readFileSync(staticSvgSourcePath(dir), 'utf8')),
			/Nebula home application/
		);
		assert.doesNotMatch(
			buildStaticSvg(readFileSync(staticSvgSourcePath(dir), 'utf8')),
			/Language redirect/
		);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('emits localized route SVGs and rewrites their route links to SVG counterparts', () => {
	const dir = mkdtempSync(join(tmpdir(), 'nebula-routes-'));
	try {
		for (const route of [
			'en_US',
			'en_US/games',
			'en_US/settings/appearance',
			'jp',
			'jp/games'
		]) {
			mkdirSync(join(dir, route), { recursive: true });
			writeFileSync(
				join(dir, route, 'index.html'),
				`<html><head><script src="/_astro/app.js"></script></head><body><a href="/${route}/games/">Games</a><main>${route}</main></body></html>`
			);
		}
		const emitted = emitLocalizedRouteSvgs(dir);
		assert.deepEqual(
			emitted.sort(),
			[
				'en_US/games/index.svg',
				'en_US/index.svg',
				'en_US/settings/appearance/index.svg',
				'jp/games/index.svg',
				'jp/index.svg'
			].sort()
		);
		for (const path of emitted) {
			const svg = readFileSync(join(dir, path), 'utf8');
			parseSvg(svg);
			assert.match(svg, /index\.svg/);
			const assetBase = '../'.repeat(path.split('/').length - 1);
			assert.ok(
				svg.includes(`new URL("${assetBase}",location.href)`),
				path
			);
			if (path === 'en_US/games/index.svg')
				assert.match(svg, /"\.\.\/\.\.\/_astro\/app\.js"/);
		}
		const home = readFileSync(join(dir, 'en_US/index.svg'), 'utf8');
		assert.match(home, /href="\.\/games\/index\.svg"/);
		assert.doesNotMatch(home, /href="\/en_US\/games\//);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('root standalone SVG prefixes localized navigation links with the selected locale', () => {
	const svg = buildLocalizedStaticSvg(
		'<html><body><a href="./games/index.svg">Games</a><a href="./index.svg">Home</a><link href="./app.css"></body></html>',
		'en_US/index.html',
		true
	);
	assert.match(svg, /href="\.\/en_US\/games\/index\.svg"/);
	assert.match(svg, /href="\.\/en_US\/index\.svg"/);
	assert.match(svg, /href="\.\/app\.css"/);
});

test('root SVG rewrites minified cross-locale and previously rehosted routes without directory navigation', () => {
	const html =
		'<html><head><link href=../_astro/app.css rel=stylesheet></head><body><a href=/jp/?page=2#top>Japanese</a><a href="../en_US/catalog/?page=1#grid">Catalog</a><a href=/en_US/games/index.html?view=all#games>Games</a><script type=module src=../_astro/app.js></script></body></html>';
	const svg = buildLocalizedStaticSvg(html, 'en_US/index.html', true);
	parseSvg(svg);
	assert.match(svg, /href="\.\/jp\/index\.svg\?page=2#top"/);
	assert.match(svg, /href="\.\/en_US\/catalog\/index\.svg\?page=1#grid"/);
	assert.match(svg, /href="\.\/en_US\/games\/index\.svg\?view=all#games"/);
	assert.match(svg, /href="\.\/_astro\/app\.css"/);
	assert.match(svg, /"src":"\.\/_astro\/app\.js"/);
});

test('root SVG redirects runtime Astro navigation to explicit SVG files within its package', () => {
	const url =
		'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@bfaf153/index.svg';
	const svg = buildLocalizedStaticSvg(
		'<html><body><a href=/en_US/games/>Games</a></body></html>',
		'en_US/index.html',
		true
	);
	const dom = new JSDOM(svg, {
		contentType: 'image/svg+xml',
		url,
		runScripts: 'outside-only'
	});
	try {
		const controller = (dom.window.controller = { createFrame() {} });
		const client = (dom.window.client = { fetch() {} });
		dom.window.eval(svg.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)[1]);
		assert.equal(dom.window.controller, controller);
		assert.equal(dom.window.client, client);
		const anchor = dom.window.document.querySelector('a');
		anchor.setAttribute('href', '/jp/catalog/?page=3#packages');
		anchor.addEventListener('click', event => event.preventDefault());
		anchor.dispatchEvent(
			new dom.window.MouseEvent('click', {
				bubbles: true,
				cancelable: true
			})
		);
		assert.equal(
			anchor.href,
			new URL('jp/catalog/index.svg?page=3#packages', url).href
		);
		for (const [target, expected] of [
			[
				'/en_US/games/?view=all#games',
				'en_US/games/index.svg?view=all#games'
			],
			['/jp/settings/misc', 'jp/settings/misc/index.svg'],
			['/en_US/index.html?lang=en#top', 'en_US/index.svg?lang=en#top']
		]) {
			const event = new dom.window.Event('astro:before-preparation', {
				cancelable: true
			});
			event.to = new dom.window.URL(target, url);
			dom.window.document.dispatchEvent(event);
			assert.equal(event.defaultPrevented, true);
			assert.equal(event.to.href, new URL(expected, url).href);
		}
		const external = new dom.window.Event('astro:before-preparation', {
			cancelable: true
		});
		external.to = new dom.window.URL('https://external.example/en_US/');
		dom.window.document.dispatchEvent(external);
		assert.equal(external.defaultPrevented, false);
	} finally {
		dom.window.close();
	}
});

test(
	'root SVG rebuilt from real generated Astro HTML keeps package-local icons and explicit navigation',
	{ skip: !existsSync(new URL('../dist/en_US/index.html', import.meta.url)) },
	() => {
		const html = readFileSync(
			new URL('../dist/en_US/index.html', import.meta.url),
			'utf8'
		);
		const svg = buildLocalizedStaticSvg(html, 'en_US/index.html', true);
		parseSvg(svg);
		assert.match(svg, /href="\.\/en_US\/games\/index\.svg"/);
		assert.match(svg, /href="\.\/favicon\.svg"/);
		assert.match(svg, /href="\.\/nebula\.css"/);
		assert.doesNotMatch(svg, /href="(?:\.\.\/)?en_US\/(?:games\/)?"/);
		const url =
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@bfaf153/index.svg';
		const dom = new JSDOM(svg, {
			contentType: 'image/svg+xml',
			url,
			runScripts: 'outside-only'
		});
		try {
			dom.window.eval(svg.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)[1]);
			assert.equal(
				dom.window.__ddxBase,
				'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@bfaf153/'
			);
		} finally {
			dom.window.close();
		}
	}
);

test('rebases generated HTML resource references within its package directory', () => {
	const dir = mkdtempSync(join(tmpdir(), 'nebula-html-rehost-'));
	try {
		mkdirSync(join(dir, 'en_US', 'games'), { recursive: true });
		mkdirSync(join(dir, 'loading'), { recursive: true });
		writeFileSync(
			join(dir, 'loading', 'index.html'),
			'<html><head><script src="/_astro/loading.js"></script></head><body><a href="/en_US/">Home</a></body></html>'
		);
		writeFileSync(
			join(dir, 'en_US', 'games', 'index.html'),
			'<html><body><script src="/_astro/games.js"></script><img src="/logo.png"></body></html>'
		);
		const updated = rehostStaticHtmlFiles(dir);
		assert.equal(updated, 2);
		assert.match(
			readFileSync(join(dir, 'loading', 'index.html'), 'utf8'),
			/src="\.\.\/_astro\/loading\.js"/
		);
		assert.match(
			readFileSync(join(dir, 'loading', 'index.html'), 'utf8'),
			/href="\.\.\/en_US\//
		);
		assert.match(
			readFileSync(join(dir, 'en_US', 'games', 'index.html'), 'utf8'),
			/src="\.\.\/\.\.\/_astro\/games\.js"/
		);
		assert.match(
			readFileSync(join(dir, 'en_US', 'games', 'index.html'), 'utf8'),
			/src="\.\.\/\.\.\/logo\.png"/
		);
		assert.match(
			readFileSync(join(dir, 'loading', 'index.html'), 'utf8'),
			/new URL\("\.\.\/",location\.href\)/
		);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('rehosted HTML loads explicit loading and localized HTML entries on directory-less CDNs', () => {
	const dir = mkdtempSync(join(tmpdir(), 'nebula-html-routes-'));
	try {
		mkdirSync(join(dir, 'en_US'), { recursive: true });
		mkdirSync(join(dir, 'loading'), { recursive: true });
		writeFileSync(
			join(dir, 'loading/index.html'),
			'<html><body>Loading</body></html>'
		);
		writeFileSync(
			join(dir, 'en_US/index.html'),
			'<html><body><iframe src="/loading/?boot=1#ready"></iframe><a href="/en_US/">Home</a></body></html>'
		);
		rehostStaticHtmlFiles(dir);
		const html = readFileSync(join(dir, 'en_US/index.html'), 'utf8');
		assert.match(html, /src="\.\.\/loading\/index\.html\?boot=1#ready"/);
		assert.match(html, /href="\.\.\/en_US\/index\.html"/);
		const svg = buildLocalizedStaticSvg(
			'<html><body><iframe src="/loading/"></iframe></body></html>',
			'en_US/index.html',
			true
		);
		assert.match(svg, /src="\.\/loading\/index\.html"/);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

test('minified Astro and slashless quoted loading routes become explicit HTML entries in SVG', () => {
	const html =
		'<!DOCTYPE html><html><head><link rel=stylesheet href=/_astro/app.css><script type=module src=/_astro/app.js></script></head><body><iframe id=chango src=/loading></iframe><iframe src="/loading?boot=1#ready"></iframe><iframe src=\'/loading\'></iframe><a href=/en_US/games>Games</a></body></html>';
	for (const [standalone, loadingPath, assetPath, gamesPath] of [
		[
			true,
			'./loading/index.html',
			'./_astro/app.css',
			'./en_US/games/index.svg'
		],
		[
			false,
			'../../loading/index.html',
			'../../_astro/app.css',
			'./index.svg'
		]
	]) {
		const svg = buildLocalizedStaticSvg(
			html,
			'en_US/games/index.html',
			standalone
		);
		parseSvg(svg);
		assert.ok(svg.includes(`src="${loadingPath}"`), svg);
		assert.ok(svg.includes(`src="${loadingPath}?boot=1#ready"`), svg);
		assert.ok(svg.includes(`href="${assetPath}"`), svg);
		assert.ok(svg.includes(`href="${gamesPath}"`), svg);
	}
});

test('rehosts minified local resource and directory URLs without duplicating the base script', () => {
	const dir = mkdtempSync(join(tmpdir(), 'nebula-minified-html-'));
	try {
		for (const route of ['loading', 'en_US/games'])
			mkdirSync(join(dir, route), { recursive: true });
		writeFileSync(
			join(dir, 'loading/index.html'),
			'<html><body>Loading</body></html>'
		);
		writeFileSync(
			join(dir, 'en_US/games/index.html'),
			'<!DOCTYPE html><html><head><link rel=stylesheet href=/_astro/app.css><style>body{background:url(/logo.png)}</style></head><body><script type=module src=/_astro/app.js></script><iframe src=/loading></iframe><iframe src="/loading/?boot=1#ready"></iframe><a href=/en_US/games>Games</a><a href=/en_US/games/>Games</a><img src=/logo.png><img src=//images.example/logo.png><a href=https://external.example/>External</a></body></html>'
		);
		assert.equal(rehostStaticHtmlFiles(dir), 2);
		const path = join(dir, 'en_US/games/index.html');
		const html = readFileSync(path, 'utf8');
		assert.match(html, /href="\.\.\/\.\.\/_astro\/app\.css"/);
		assert.match(html, /src="\.\.\/\.\.\/_astro\/app\.js"/);
		assert.match(html, /src="\.\.\/\.\.\/loading\/index\.html"/);
		assert.match(
			html,
			/src="\.\.\/\.\.\/loading\/index\.html\?boot=1#ready"/
		);
		assert.equal(
			(html.match(/href="\.\.\/\.\.\/en_US\/games\/index\.html"/g) || [])
				.length,
			2
		);
		assert.match(html, /src="\.\.\/\.\.\/logo\.png"/);
		assert.match(html, /url\(\.\.\/\.\.\/logo\.png\)/);
		assert.match(html, /src=\/\/images\.example\/logo\.png/);
		assert.match(html, /href=https:\/\/external\.example\//);
		assert.equal(rehostStaticHtmlFiles(dir), 0);
		assert.equal(readFileSync(path, 'utf8'), html);
		assert.equal((html.match(/self\.__ddxBase=/g) || []).length, 1);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});

for (const [stored, language, expected] of [
	['jp', 'en-US', '/jp/'],
	['en_US', 'ja-JP', '/en_US/'],
	[null, 'ja-JP', '/jp/'],
	[null, 'ja_JP', '/jp/'],
	[null, 'en-US', '/en_US/'],
	['de_DE', 'ja-JP', '/jp/'],
	['https://evil.example/', 'en-US', '/en_US/']
]) {
	test(`selects ${expected} for stored ${JSON.stringify(stored)} and browser ${language}`, () => {
		const { frame, window } = launch({ stored, language });
		assert.equal(frame.src, expected);
		assert.equal(window.location.href, 'http://localhost:8080/index.svg');
	});
}

test('falls back when localStorage is inaccessible', () => {
	assert.equal(
		launch({ storageThrows: true, language: 'ja' }).frame.src,
		'/jp/'
	);
});

test('keeps loading indication until the child loads and displays a frame failure', () => {
	const loaded = launch();
	assert.match(loaded.status.textContent, /loading/i);
	loaded.listeners.get('load')();
	assert.equal(loaded.status.style.display, 'none');
	const failed = launch();
	failed.listeners.get('error')();
	assert.match(failed.status.textContent, /error|fail|unable/i);
	assert.notEqual(failed.status.style.display, 'none');
});

test('accepts subsequent full-document loads of localized settings and catalog pages without a home input', () => {
	const page = launch();
	page.listeners.get('load')();
	assert.equal(page.status.style.display, 'none', 'initial home is valid');
	for (const title of ['Settings', 'Catalog']) {
		page.status.style.display = 'flex';
		page.frame.contentDocument = {
			title,
			getElementById(id) {
				return id === 'stylesheet'
					? { tagName: 'LINK', rel: 'stylesheet' }
					: null;
			}
		};
		page.listeners.get('load')();
		assert.equal(
			page.status.style.display,
			'none',
			`${title} is a valid app page after a frame reload`
		);
	}
});

test('shows an error when a child navigation hangs instead of loading indefinitely', () => {
	const page = launch();
	page.expire();
	assert.match(page.status.textContent, /error|fail|unable/i);
	assert.notEqual(page.status.style.display, 'none');
});

test('shows an error if iframe load completes without an accessible app document', () => {
	const page = launch();
	page.frame.contentDocument = null;
	page.listeners.get('load')();
	assert.match(page.status.textContent, /error|fail|unable/i);
});

test('shows an error when an accessible same-origin error page loads instead of localized home', () => {
	const page = launch();
	page.frame.contentDocument = {
		title: 'Site temporarily unavailable',
		getElementById() {
			return null;
		}
	};
	page.listeners.get('load')();
	assert.match(page.status.textContent, /error|fail|unable/i);
	assert.notEqual(page.status.style.display, 'none');
});

test(
	'static SVG embeds the localized app instead of executing the root language redirect',
	{ skip: !existsSync(new URL('../dist/index.svg', import.meta.url)) },
	() => {
		const svg = readFileSync(
			new URL('../dist/index.svg', import.meta.url),
			'utf8'
		);
		parseSvg(svg);
		assert.match(svg, /id="nebula-input"/);
		assert.match(svg, /src="\.\/loading\/(?:index\.html)?"/);
		assert.match(svg, /href="\.\/en_US\/settings\/appearance\/index\.svg"/);
		assert.doesNotMatch(svg, /Loading	s*Nebula/);
		assert.doesNotMatch(svg, /(?:location\.replace|navigate\()/);
		assert.doesNotMatch(svg, /id="app-frame"/);
	}
);
