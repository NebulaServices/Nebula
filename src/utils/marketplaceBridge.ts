type MarketplaceClient = { fetch(url: string): Promise<Response> };
type WorkerMessages = Pick<ServiceWorkerContainer, 'addEventListener'>;

// Worker requests stay same-origin in the browser. Only this controlled page
// knows the selected WISP endpoint, so it relays the bytes through libcurl.
export function installMarketplaceBridge(
	serviceWorker: WorkerMessages,
	client: MarketplaceClient,
	origin: string
): void {
	const base = new URL(origin);
	serviceWorker.addEventListener('message', async (event: MessageEvent) => {
		if (event.data?.type !== 'nebula:marketplace-fetch') return;
		const port = event.ports[0];
		if (!port) return;
		try {
			const { path, method } = event.data;
			if (
				typeof path !== 'string' ||
				!path.startsWith('/') ||
				path.startsWith('//') ||
				path.includes('\\') ||
				/%2e|%2f|%5c|\.\./i.test(path) ||
				(method !== 'GET' && method !== 'HEAD')
			) {
				throw new Error('Invalid marketplace request');
			}
			const target = new URL(path, base);
			if (
				target.origin !== base.origin ||
				!(
					target.pathname.startsWith('/api/') ||
					target.pathname.startsWith('/packages/')
				)
			) {
				throw new Error('Invalid marketplace path');
			}
			const response = await client.fetch(target.href);
			const body = await response.arrayBuffer();
			port.postMessage(
				{
					status: response.status,
					headers: [...response.headers.entries()],
					body
				},
				[body]
			);
		} catch (error) {
			port.postMessage({ error: String(error) });
		}
	});
}
