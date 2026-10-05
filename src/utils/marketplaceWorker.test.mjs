import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const workerSource = await readFile(
	new URL('../../public/sw.js', import.meta.url),
	'utf8'
);

test('static worker imports its bundled scripts relative to the package directory', () => {
	assert.deepEqual(createWorker().imports, [
		'./scram-controller/controller.sw.js',
		'./marketplace-config.js'
	]);
});

function createWorker(
	origin = 'https://nebulaproxy.io',
	answer = async () => ({
		status: 200,
		headers: [['content-type', 'text/css']],
		body: new TextEncoder().encode('body{}').buffer
	})
) {
	const handlers = {};
	const paths = [];
	const imports = [];
	class Channel {
		port1 = { onmessage: null, close() {} };
		port2 = {};
	}
	const client = {
		postMessage(message, ports) {
			paths.push(message.path);
			Promise.resolve(answer(message)).then(
				data => channel.port1.onmessage({ data }),
				e => channel.port1.onmessage({ data: { error: String(e) } })
			);
		}
	};
	let channel;
	class MessageChannel extends Channel {
		constructor() {
			super();
			channel = this;
		}
	}
	const self = {
		location: { origin: 'http://localhost:8080' },
		clients: { get: async () => client, claim: async () => {} },
		skipWaiting: async () => {},
		addEventListener(type, handler) {
			handlers[type] = handler;
		}
	};
	vm.runInNewContext(workerSource, {
		self,
		importScripts: (...scripts) => {
			imports.push(...scripts);
			self.__catalogOrigin = origin;
		},
		$scramjetController: { shouldRoute: () => false },
		Headers,
		MessageChannel,
		Request,
		Response,
		URL,
		setTimeout,
		clearTimeout
	});
	async function request(path, init = {}) {
		let response;
		const event = {
			request: new Request(`http://localhost:8080${path}`, init),
			clientId: 'tab1',
			respondWith(promise) {
				response = Promise.resolve(promise);
			}
		};
		handlers.fetch(event);
		return response;
	}
	return { request, paths, handlers, imports };
}

test('static worker routes package CSS via requesting client and preserves MIME/body', async () => {
	const worker = createWorker();
	const res = await worker.request(
		'/packages/com.nebula.gruvbox/theme.css?x=1'
	);
	assert.equal(res.status, 200);
	assert.equal(res.headers.get('content-type'), 'text/css');
	assert.equal(await res.text(), 'body{}');
	assert.deepEqual(worker.paths, [
		'/packages/com.nebula.gruvbox/theme.css?x=1'
	]);
});

test('worker preserves remote errors and does not intercept non-marketplace paths', async () => {
	const worker = createWorker('https://nebulaproxy.io', async () => ({
		status: 404,
		headers: [['content-type', 'application/json']],
		body: new TextEncoder().encode('{"error":"missing"}').buffer
	}));
	const res = await worker.request('/api/packages/com.nebula.oled');
	assert.equal(res.status, 404);
	assert.equal(await res.text(), '{"error":"missing"}');
	assert.equal(await worker.request('/en_US/'), undefined);
	assert.equal(worker.paths.length, 1);
});

test('server worker leaves marketplace requests to the server', async () => {
	assert.equal(
		await createWorker('').request('/api/packages/com.nebula.oled'),
		undefined
	);
});

test('package HTML is rehosted with HTML MIME without intercepting proxy or ranged traffic', async () => {
	const handlers = {};
	const scope = 'https://cdn.jsdelivr.net/gh/TwiLabs/nebula@candidate/';
	const fetched = [];
	const self = {
		location: new URL(scope + 'sw.js'),
		registration: { scope },
		addEventListener(type, handler) {
			handlers[type] = handler;
		}
	};
	vm.runInNewContext(workerSource, {
		self,
		importScripts() {},
		Headers,
		Request,
		Response,
		URL,
		$scramjetController: { shouldRoute: () => false },
		fetch: async request => {
			fetched.push(request.url);
			return new Response('<html><body>Loading</body></html>', {
				headers: { 'content-type': 'text/plain' }
			});
		}
	});
	async function request(url, init = {}) {
		let result;
		handlers.fetch({
			request: new Request(url, init),
			respondWith(promise) {
				result = Promise.resolve(promise);
			}
		});
		return result;
	}
	const response = await request(scope + 'loading/index.html');
	assert.ok(response, 'worker handles package loading HTML');
	assert.equal(
		response.headers.get('content-type'),
		'text/html; charset=utf-8'
	);
	assert.match(await response.text(), /<body>Loading<\/body>/);
	assert.equal(
		await request(scope + 'study/science/frame/index.html'),
		undefined
	);
	assert.equal(
		await request(scope + 'loading/index.html', {
			headers: { range: 'bytes=0-3' }
		}),
		undefined
	);
	assert.equal(
		await request('https://cdn.jsdelivr.net/loading/index.html'),
		undefined
	);
	assert.equal(fetched.length, 1);
});

test('Scramjet controller keeps its encoded navigation prefix beneath the package root', async () => {
	const loader = await readFile(
		new URL('../components/settings/Loader.astro', import.meta.url),
		'utf8'
	);
	const { staticAssetLocation } = await import('./staticAssetLocation.ts');
	const expression = loader.match(/^\s*prefix:\s*(.+),\s*$/m)?.[1];
	assert.ok(expression, 'controller config supplies a prefix');
	const resolvePrefix = new Function(
		'staticAssetLocation',
		'location',
		`return (${expression});`
	);
	const page =
		'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@0b8b6fb/en_US/games/index.svg';
	assert.equal(
		resolvePrefix(staticAssetLocation, { href: page }),
		'/gh/TwiLabs/n4x8p1kd@0b8b6fb/study/science/'
	);
	assert.equal(
		resolvePrefix(staticAssetLocation, {
			href: 'https://nebula.example/en_US/'
		}),
		'/study/science/'
	);
});
