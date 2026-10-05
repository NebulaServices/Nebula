import { fileURLToPath } from 'node:url';
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import playformCompress from '@playform/compress';
import { scramjetPath } from '@mercuryworkshop/scramjet/path';
import icon from 'astro-icon';
import { defineConfig, envField } from 'astro/config';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { version } from './package.json';
import { parsedDoc } from './server/config.js';
import { svgWrapperPlugin, convertHtmlToSvg } from '../srv/vite/svg';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fontObfuscationPlugin } from './build/font/index';
import { nebulaScrub } from './build/scrub';
import {
	buildLocalizedStaticSvg,
	emitLocalizedRouteSvgs,
	rehostStaticHtmlFiles,
	staticSvgSourcePath
} from './build/svgHost';
// Build-time artifact copy only. Client imports resolve solely inside Nebula.
await import('./build/copyProxyContext.mjs');
const STATIC_BUILD = process.env.STATIC_BUILD === '1';

export default defineConfig({
	site: parsedDoc.seo.enabled
		? parsedDoc.seo.domain || process.env.SITE
		: 'http://localhost:4321',
	env: {
		schema: {
			API_URL: envField.string({
				context: 'server',
				access: 'secret',
				optional: true,
				default: `http://localhost:${parsedDoc.server.server.port}`
			}),
			VERSION: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
				default: version
			}),
			SPACE_ORIGIN: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
				default:
					parsedDoc.services?.space_origin ||
					'https://gointospace.app'
			}),
			MARKETPLACE_ENABLED: envField.boolean({
				context: 'client',
				access: 'public',
				optional: true,
				default: parsedDoc.marketplace.enabled
			}),
			STATIC_MARKETPLACE: envField.boolean({
				context: 'client',
				access: 'public',
				optional: true,
				default: STATIC_BUILD && parsedDoc.marketplace.enabled
			}),
			// Origin that serves the marketplace API (/api/*) and /packages/.
			// Empty = same-origin (SSR/server deploy). On a static host set
			// this to a live Nebula origin; the client then fetches the
			// catalog through the libcurl proxy (window.client) to dodge CORS.
			CATALOG_ORIGIN: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
				default: (parsedDoc as any).marketplace?.origin || ''
			}),
			SEO: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
				default: JSON.stringify({
					enabled: parsedDoc.seo.enabled,
					domain: new URL(parsedDoc.seo.domain).host
				})
			})
		}
	},
	integrations: [
		tailwind(),
		//sitemap(),
		icon(),
		svelte(),
		// Static builds host the localized HTML app in a same-origin frame.
		// Server builds retain the existing HTML-to-SVG bootloader.
		{
			name: 'nebula-svg-bootloader',
			hooks: {
				'astro:build:done': async ({ dir }: { dir: URL }) => {
					const distDirectory = fileURLToPath(dir);
					const indexPath = STATIC_BUILD
						? staticSvgSourcePath(distDirectory)
						: fileURLToPath(new URL('index.html', dir));
					if (!existsSync(indexPath)) return;
					const html = readFileSync(indexPath, 'utf-8');
					const svg = STATIC_BUILD
						? buildLocalizedStaticSvg(
								html,
								'en_US/index.html',
								true
							)
						: convertHtmlToSvg(html);
					writeFileSync(
						fileURLToPath(new URL('index.svg', dir)),
						svg,
						'utf-8'
					);
					let routeCount = 0;
					if (STATIC_BUILD) {
						const routes = emitLocalizedRouteSvgs(distDirectory);
						routeCount = routes.length;
						rehostStaticHtmlFiles(distDirectory);
						const origin = parsedDoc.marketplace.enabled
							? parsedDoc.marketplace.origin || ''
							: '';
						writeFileSync(
							fileURLToPath(
								new URL('marketplace-config.js', dir)
							),
							`self.__catalogOrigin = ${JSON.stringify(origin.replace(/\/$/, ''))};\n`,
							'utf-8'
						);
					}
					// eslint-disable-next-line no-console
					console.log(
						STATIC_BUILD
							? `  Generated standalone index.svg and ${routeCount} localized route SVGs`
							: '  Generated index.svg from index.html'
					);
				}
			}
		},
		playformCompress({
			CSS: false,
			HTML: true,
			Image: true,
			JavaScript: true,
			SVG: true
		}),
		// Vocabulary scrub of proxy-stack "tells" — runs LAST, static builds
		// only, over the final dist (content + file/dir names). See build/scrub.ts.
		{
			name: 'nebula-scrub',
			hooks: {
				'astro:build:done': async ({ dir }: { dir: URL }) => {
					if (!STATIC_BUILD) return;
					const res = await nebulaScrub(fileURLToPath(dir));
					// eslint-disable-next-line no-console
					console.log(
						`  [nebula-scrub] rewrote ${res.replacements} occurrence(s) across ${res.files} file(s)`
					);
				}
			}
		}
	],
	vite: {
		plugins: [
			viteStaticCopy({
				targets: [
					{
						src: `${scramjetPath}/**/*`.replace(/\\/g, '/'),
						dest: 'scram',
						overwrite: false
					},
					{
						src: `node_modules/@mercuryworkshop/scramjet-controller/dist/*`,
						dest: 'scram-controller',
						overwrite: false
					}
				]
			}),
			svgWrapperPlugin(),
			fontObfuscationPlugin()
		],
		server: {
			proxy: {
				'/api/catalog-stats': {
					target: 'http://localhost:8080/api/catalog-stats',
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api\/catalog-stats/, '')
				},
				'/api/catalog-assets': {
					target: 'http://localhost:8080/api/catalog-assets',
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api\/catalog-assets/, '')
				},
				'/api/packages': {
					target: 'http://localhost:8080/api/packages',
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api\/packages/, '')
				},
				'/packages': {
					target: 'http://localhost:8080',
					changeOrigin: true
				},
				'/wisp/': {
					target: 'ws://localhost:8080/wisp/',
					changeOrigin: true,
					ws: true,
					rewrite: path => path.replace(/^\/wisp\//, '')
				},
				'/styles': {
					target: 'http://localhost:8080',
					changeOrigin: true
				}
			}
		},
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_debugger: true,
					// Strip noisy consoles but keep warn/error: production
					// error reporting must survive (Daydream parity).
					pure_funcs: [
						'console.log',
						'console.info',
						'console.debug',
						'console.trace',
						'console.dir',
						'console.table',
						'console.group',
						'console.groupEnd',
						'console.groupCollapsed',
						'console.time',
						'console.timeEnd'
					]
				}
			}
		}
	},
	output: STATIC_BUILD ? 'static' : 'server',
	...(STATIC_BUILD
		? {}
		: {
				adapter: node({
					mode: 'middleware'
				})
			})
});
