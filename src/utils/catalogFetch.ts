import { CATALOG_ORIGIN, STATIC_MARKETPLACE } from 'astro:env/client';
import { Marketplace } from './marketplace';

// Marketplace fetching that works in BOTH deploy modes:
//   - Server/SSR deploy: CATALOG_ORIGIN is empty → fetch same-origin `/api/*`.
//   - Static deploy: CATALOG_ORIGIN points at a live Nebula origin → route the
//     request through the libcurl proxy (`window.client`) so it isn't blocked
//     by CORS.
//
// `path` is an absolute marketplace path, e.g. "/api/catalog-assets?page=1"
// or "/api/packages/com.nebula.oled".

function base(): string {
	return (CATALOG_ORIGIN || '').replace(/\/$/, '');
}

// Absolute URL for a marketplace path against the configured origin (or
// same-origin when unset). Suitable for <img>/<link>/<video> src attributes
// (cross-origin static assets load without CORS).
export function catalogUrl(path: string): string {
	const origin = base();
	return origin ? origin + path : path;
}

// Fetch JSON/text from the marketplace API. Uses the libcurl proxy for a
// cross-origin (static) catalog, else a normal same-origin fetch.
export async function catalogFetch(path: string): Promise<Response> {
	// The page's libcurl message bridge must be installed before the worker
	// receives an API request (notably on cold Astro page-load).
	if (STATIC_MARKETPLACE) {
		await Marketplace.ready();
		return fetch(path);
	}
	const origin = base();
	if (!origin) return fetch(path);
	const url = origin + path;
	const client = (
		window as unknown as {
			client?: { fetch?: (u: string) => Promise<Response> };
		}
	).client;
	if (client && typeof client.fetch === 'function') return client.fetch(url);
	// Fallback: a direct cross-origin fetch (may hit CORS, but better than
	// silently failing if the proxy client isn't up yet).
	return fetch(url);
}

// Resolve a catalog media asset (image/video) to a URL that is safe to put in
// an <img>/<video> src or CSS background. On a cross-origin (static) catalog we
// fetch the bytes through the proxy client (libcurl transport) and hand back a
// same-origin `blob:` URL — a direct cross-origin request is blocked by the
// page's COEP `require-corp` isolation. Same-origin catalogs return the path
// unchanged. Falls back to the direct URL if the proxy client isn't ready.
export async function catalogImage(path: string): Promise<string> {
	if (STATIC_MARKETPLACE) {
		await Marketplace.ready();
		return path;
	}
	const origin = base();
	if (!origin) return path;
	const url = origin + path;
	const client = (
		window as unknown as {
			client?: { fetch?: (u: string) => Promise<Response> };
		}
	).client;
	if (client && typeof client.fetch === 'function') {
		try {
			const res = await client.fetch(url);
			const blob = await res.blob();
			return URL.createObjectURL(blob);
		} catch (e) {
			console.warn('[catalog] image proxy failed; using direct URL', e);
		}
	}
	return url;
}

// Swap every `[data-catalog-src]` / `[data-catalog-bg]` under `root` for a
// proxied blob: URL via catalogImage(). Cards/detail render with these data
// attributes (no direct cross-origin src) so nothing is COEP-blocked; call this
// after inserting the markup.
export async function applyCatalogMedia(
	root: ParentNode = document
): Promise<void> {
	const srcEls = Array.from(
		root.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
			'[data-catalog-src]'
		)
	);
	const bgEls = Array.from(
		root.querySelectorAll<HTMLElement>('[data-catalog-bg]')
	);
	await Promise.all([
		...srcEls.map(async el => {
			const p = el.getAttribute('data-catalog-src');
			if (!p) return;
			el.src = await catalogImage(p);
		}),
		...bgEls.map(async el => {
			const p = el.getAttribute('data-catalog-bg');
			if (!p) return;
			el.style.backgroundImage = `url(${await catalogImage(p)})`;
		})
	]);
}

export { CATALOG_ORIGIN };
