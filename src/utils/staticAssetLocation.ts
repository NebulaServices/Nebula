/** Shared package root for worker registration, proxy prefixes and runtime assets. */
export function staticAssetBase(pageUrl: string, standaloneBase?: string): URL {
	const page = new URL(pageUrl);
	const injectedBase =
		standaloneBase ??
		(globalThis as typeof globalThis & { __ddxBase?: string }).__ddxBase;
	if (injectedBase) return new URL('./', new URL(injectedBase, page));

	// The repository root is independent of the current localized route. A
	// nested SVG's parent directory is not the package's static asset root.
	if (
		page.hostname === 'cdn.jsdelivr.net' ||
		page.hostname.endsWith('.jsdelivr.net')
	) {
		const repositoryRoot = page.pathname.match(
			/^\/gh\/[^/]+\/[^/]+\//
		)?.[0];
		if (repositoryRoot) return new URL(repositoryRoot, page.origin);
	}
	return page.pathname.toLowerCase().endsWith('.svg')
		? new URL('./', page)
		: new URL('/', page.origin);
}

export function staticAssetLocation(
	path: string,
	pageUrl: string,
	standaloneBase?: string
): string {
	return new URL(
		path.replace(/^\//, ''),
		staticAssetBase(pageUrl, standaloneBase)
	).href;
}
