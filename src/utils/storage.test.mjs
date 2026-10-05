import assert from 'node:assert/strict';
import test from 'node:test';

const { StoreManager } = await import('./storage.ts');

const memBackend = () => {
	const data = new Map();
	return {
		data,
		getItem: async key => (data.has(key) ? data.get(key) : null),
		setItem: async (key, value) => void data.set(key, value),
		removeItem: async key => void data.delete(key),
		clear: async () => void data.clear(),
		keys: async () => [...data.keys()]
	};
};

test('round-trips string values through set/get', async () => {
	const store = new StoreManager('nebula', memBackend());
	await store.setVal('lang', 'jp');
	assert.equal(await store.getVal('lang'), 'jp');
});

test('isolates keys by store prefix', async () => {
	const backend = memBackend();
	const a = new StoreManager('a', backend);
	const b = new StoreManager('b', backend);
	await a.setVal('key', 'from-a');
	assert.equal(await b.getVal('key'), null);
	assert.deepEqual([...backend.data.keys()], ['a||key']);
});

test('missing key resolves null', async () => {
	const store = new StoreManager('nebula', memBackend());
	assert.equal(await store.getVal('absent'), null);
});

test('removeVal deletes the key', async () => {
	const store = new StoreManager('nebula', memBackend());
	await store.setVal('temp', 'x');
	await store.removeVal('temp');
	assert.equal(await store.getVal('temp'), null);
});

test('clear empties only that store keys', async () => {
	const backend = memBackend();
	const store = new StoreManager('nebula', backend);
	await backend.setItem('unrelated', 'keep');
	await store.setVal('lang', 'jp');
	await store.clear();
	assert.equal(await store.getVal('lang'), null);
	assert.equal(await backend.getItem('unrelated'), 'keep');
});

test('first read migrates a legacy localStorage value', async () => {
	const legacy = new Map([['nebula||lang', 'jp']]);
	globalThis.localStorage = {
		getItem: key => (legacy.has(key) ? legacy.get(key) : null),
		setItem: (key, value) => void legacy.set(key, value),
		removeItem: key => void legacy.delete(key)
	};
	try {
		const backend = memBackend();
		const store = new StoreManager('nebula', backend);
		assert.equal(await store.getVal('lang'), 'jp');
		assert.equal(await backend.getItem('nebula||lang'), 'jp');
		assert.equal(legacy.has('nebula||lang'), false);
	} finally {
		Reflect.deleteProperty(globalThis, 'localStorage');
	}
});
