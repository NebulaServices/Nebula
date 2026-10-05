// An empty static host has no same-origin /wisp/ endpoint. Keep existing user
// choices, but use a generated remote endpoint for a first static visit.
export function chooseWispServer(
	saved: string | null | undefined,
	isStatic: boolean
): string {
	if (isStatic && (!saved || saved === 'default')) return 'generated';
	return saved || 'default';
}

export async function resolveDefaultWisp(
	coreUrl: string,
	ping: (url: string) => Promise<boolean>,
	generate: () => Promise<string>,
	saveSelection: (choice: string) => void
): Promise<string> {
	if (await ping(coreUrl)) return coreUrl;
	const generatedUrl = await generate();
	saveSelection('generated');
	return generatedUrl;
}
