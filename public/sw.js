importScripts('./scram-controller/controller.sw.js');
importScripts('./marketplace-config.js');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event =>
	event.waitUntil(self.clients.claim())
);

function isPackageHtml(request) {
	if (
		request.method !== 'GET' ||
		request.headers.has('range') ||
		!self.registration?.scope
	)
		return false;
	const url = new URL(request.url);
	const scope = new URL(self.registration.scope);
	if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname))
		return false;
	const path = url.pathname.slice(scope.pathname.length);
	return /^(?:index\.html|(?:loading|en_US|jp)\/(?:[\w-]+\/)*index\.html)$/.test(
		path
	);
}

async function packageHtmlResponse(request) {
	const response = await fetch(request);
	if (
		response.status !== 200 ||
		response.type === 'opaque' ||
		(response.url && !isPackageHtml(new Request(response.url)))
	)
		return response;
	const headers = new Headers(response.headers);
	headers.set('content-type', 'text/html; charset=utf-8');
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}

async function marketplaceResponse(event) {
	const client = await self.clients.get(event.clientId);
	if (!client)
		return new Response('Marketplace page unavailable', { status: 503 });

	const path =
		new URL(event.request.url).pathname + new URL(event.request.url).search;
	const channel = new MessageChannel();
	const response = new Promise(resolve => {
		const timeout = setTimeout(() => {
			channel.port1.close();
			resolve(
				new Response('Marketplace transport timed out', { status: 504 })
			);
		}, 12000);
		channel.port1.onmessage = ({ data }) => {
			clearTimeout(timeout);
			channel.port1.close();
			if (!data || data.error) {
				resolve(
					new Response('Marketplace transport failed', {
						status: 502
					})
				);
				return;
			}
			const headers = new Headers(data.headers);
			for (const name of [
				'content-length',
				'content-encoding',
				'transfer-encoding',
				'connection',
				'set-cookie'
			])
				headers.delete(name);
			resolve(
				new Response(
					data.status === 204 || data.status === 304
						? null
						: data.body,
					{
						status: data.status,
						headers
					}
				)
			);
		};
	});
	client.postMessage(
		{
			type: 'nebula:marketplace-fetch',
			path,
			method: event.request.method
		},
		[channel.port2]
	);
	return response;
}

self.addEventListener('fetch', function (event) {
	const url = new URL(event.request.url);
	if (
		self.__catalogOrigin &&
		url.origin === self.location.origin &&
		(url.pathname.startsWith('/api/') ||
			url.pathname.startsWith('/packages/'))
	) {
		event.respondWith(marketplaceResponse(event));
		return;
	}
	if ($scramjetController.shouldRoute(event)) {
		event.respondWith($scramjetController.route(event));
		return;
	}
	if (isPackageHtml(event.request))
		event.respondWith(packageHtmlResponse(event.request));
});
