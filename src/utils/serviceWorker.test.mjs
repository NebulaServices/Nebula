import assert from 'node:assert/strict';
import test from 'node:test';
import { SW } from './serviceWorker.ts';

const base = 'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@fed5cf6/';

class Worker extends EventTarget {
	constructor(scriptURL = `${base}sw.js`, state = 'activated') {
		super();
		this.scriptURL = scriptURL;
		this.state = state;
	}
	transition(state) {
		this.state = state;
		this.dispatchEvent(new Event('statechange'));
	}
}

function registration(worker, scope = base) {
	return Object.assign(new EventTarget(), {
		scope,
		active: worker,
		installing: null,
		waiting: null
	});
}

async function withBrowser(register, run) {
	const previous = Object.getOwnPropertyDescriptors(globalThis);
	const intervals = new Set();
	const realSetInterval = globalThis.setInterval;
	let readyReads = 0;
	const container = {
		register,
		getRegistrations: async () => [],
		get ready() {
			readyReads++;
			return Promise.resolve(
				registration(
					new Worker('https://cdn.jsdelivr.net/sw.js'),
					'https://cdn.jsdelivr.net/'
				)
			);
		}
	};
	Object.defineProperty(globalThis, 'navigator', {
		configurable: true,
		value: { serviceWorker: container }
	});
	Object.defineProperty(globalThis, 'location', {
		configurable: true,
		value: { href: `${base}en_US/games/index.svg` }
	});
	globalThis.setInterval = (...args) => {
		const timer = realSetInterval(...args);
		intervals.add(timer);
		return timer;
	};
	try {
		await run(() => readyReads);
	} finally {
		for (const timer of intervals) clearInterval(timer);
		for (const name of ['navigator', 'location', 'setInterval']) {
			if (previous[name])
				Object.defineProperty(globalThis, name, previous[name]);
			else delete globalThis[name];
		}
	}
}

test('Scramjet receives the exact package registration, never a broader ready worker', async () => {
	const exact = registration(new Worker());
	await withBrowser(
		async (script, options) => {
			assert.equal(script, `${base}sw.js`);
			assert.deepEqual(options, { scope: new URL(base).pathname });
			return exact;
		},
		async readyReads => {
			const sw = new SW({ timeoutMs: 100 });
			const info = await sw.getSWInfo();
			assert.equal(info.serviceWorker, exact);
			assert.equal(readyReads(), 0);
		}
	);
});

test('waits for the exact installing worker to activate', async () => {
	const worker = new Worker(`${base}sw.js`, 'installing');
	const exact = registration(null);
	exact.installing = worker;
	await withBrowser(
		async () => exact,
		async () => {
			const sw = new SW({ timeoutMs: 100 });
			let resolved = false;
			const info = sw.getSWInfo().then(value => {
				resolved = true;
				return value;
			});
			await new Promise(resolve => setTimeout(resolve, 10));
			assert.equal(resolved, false);
			exact.installing = null;
			exact.active = worker;
			worker.transition('activated');
			assert.equal((await info).serviceWorker, exact);
		}
	);
});

test('getSWInfo rejects registration errors instead of returning a broader worker', async () => {
	await withBrowser(
		() => {
			throw new Error('registration denied');
		},
		async () => {
			const sw = new SW({ timeoutMs: 100 });
			await assert.rejects(sw.getSWInfo(), /registration denied/);
		}
	);
});

test('getSWInfo preserves asynchronously rejected registration errors', async () => {
	const failure = new Error('network registration failure');
	await withBrowser(
		async () => {
			throw failure;
		},
		async () => {
			const sw = new SW({ timeoutMs: 100 });
			await assert.rejects(sw.getSWInfo(), error => error === failure);
		}
	);
});

test('a wrong old active worker cannot win over the owned installing worker', async () => {
	const worker = new Worker(`${base}sw.js`, 'installing');
	const exact = registration(
		new Worker('https://cdn.jsdelivr.net/old-sw.js')
	);
	exact.installing = worker;
	await withBrowser(
		async () => exact,
		async () => {
			const sw = new SW({ timeoutMs: 100 });
			const info = sw.getSWInfo();
			await new Promise(resolve => setTimeout(resolve, 10));
			assert.throws(() => sw.getActiveWorker(), /ownership/);
			exact.installing = null;
			exact.active = worker;
			worker.transition('activated');
			assert.equal((await info).serviceWorker, exact);
			assert.equal(sw.getActiveWorker(), worker);
		}
	);
});

test('getSWInfo rejects a worker that becomes redundant', async () => {
	const worker = new Worker(`${base}sw.js`, 'installing');
	const exact = registration(null);
	exact.installing = worker;
	await withBrowser(
		async () => exact,
		async () => {
			const sw = new SW({ timeoutMs: 100 });
			const rejected = assert.rejects(sw.getSWInfo(), /redundant/);
			await new Promise(resolve => setTimeout(resolve, 10));
			worker.transition('redundant');
			await rejected;
		}
	);
});

for (const phase of ['registration', 'activation']) {
	test(`getSWInfo bounds stalled ${phase} with a timeout`, async () => {
		const exact = registration(null);
		exact.waiting = new Worker(`${base}sw.js`, 'installed');
		await withBrowser(
			phase === 'registration'
				? () => new Promise(() => {})
				: async () => exact,
			async () => {
				const sw = new SW({ timeoutMs: 20 });
				await assert.rejects(sw.getSWInfo(), /timed out/);
			}
		);
	});
}

for (const mismatch of ['scope', 'script']) {
	test(`getSWInfo rejects an unrelated registration ${mismatch}`, async () => {
		const exact = registration(
			new Worker(
				mismatch === 'script'
					? 'https://cdn.jsdelivr.net/sw.js'
					: `${base}sw.js`
			),
			mismatch === 'scope' ? 'https://cdn.jsdelivr.net/' : base
		);
		await withBrowser(
			async () => exact,
			async () => {
				const sw = new SW({ timeoutMs: 30 });
				await assert.rejects(sw.getSWInfo(), /ownership/);
			}
		);
	});
}

test('revalidates the active worker immediately before supplying it to Scramjet', async () => {
	const exact = registration(new Worker());
	await withBrowser(
		async () => exact,
		async () => {
			const sw = new SW({ timeoutMs: 100 });
			await sw.getSWInfo();
			assert.equal(sw.getActiveWorker(), exact.active);
			exact.active = new Worker('https://cdn.jsdelivr.net/sw.js');
			assert.throws(() => sw.getActiveWorker(), /ownership/);
		}
	);
});
