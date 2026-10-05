import assert from 'node:assert/strict';
import test from 'node:test';

const { installMarketplaceBridge } =
	await import('./marketplaceBridge.ts').catch(() => ({}));

test("bridge retrieves marketplace assets over the page's libcurl client", async () => {
	assert.equal(typeof installMarketplaceBridge, 'function');
	let handler;
	let requested;
	const serviceWorker = {
		addEventListener(type, fn) {
			if (type === 'message') handler = fn;
		}
	};
	const client = {
		async fetch(url) {
			requested = url;
			return new Response('body {color:red}', {
				headers: { 'content-type': 'text/css' }
			});
		}
	};
	installMarketplaceBridge(serviceWorker, client, 'https://nebulaproxy.io');
	let result;
	await handler({
		data: {
			type: 'nebula:marketplace-fetch',
			path: '/packages/com.nebula.gruvbox/theme.css',
			method: 'GET'
		},
		ports: [
			{
				postMessage(data) {
					result = data;
				}
			}
		]
	});
	assert.equal(
		requested,
		'https://nebulaproxy.io/packages/com.nebula.gruvbox/theme.css'
	);
	assert.equal(result.status, 200);
	assert.equal(new TextDecoder().decode(result.body), 'body {color:red}');
	assert.deepEqual(result.headers, [['content-type', 'text/css']]);
});

test('bridge refuses cross-origin and unrelated paths', async () => {
	assert.equal(typeof installMarketplaceBridge, 'function');
	let handler;
	const serviceWorker = {
		addEventListener(_type, fn) {
			handler = fn;
		}
	};
	const client = {
		async fetch() {
			throw new Error('must not fetch');
		}
	};
	installMarketplaceBridge(serviceWorker, client, 'https://nebulaproxy.io');
	for (const path of [
		'https://attacker.example/api/packages/x',
		'//attacker.example/api/x',
		'/en_US/',
		'/api/../evil'
	]) {
		let result;
		await handler({
			data: { type: 'nebula:marketplace-fetch', path, method: 'GET' },
			ports: [
				{
					postMessage(data) {
						result = data;
					}
				}
			]
		});
		assert.ok(result.error, path);
	}
});
