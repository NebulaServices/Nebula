import assert from 'node:assert/strict';
import test from 'node:test';

const { chooseWispServer, resolveDefaultWisp } =
	await import('./wispDefault.ts').catch(() => ({}));

test('a first static visit selects a generated WISP instead of the absent local server', () => {
	assert.equal(typeof chooseWispServer, 'function');
	assert.equal(chooseWispServer(null, true), 'generated');
});

test('server deployments and saved WISP choices retain their behavior', () => {
	assert.equal(typeof chooseWispServer, 'function');
	assert.equal(chooseWispServer(null, false), 'default');
	assert.equal(chooseWispServer('custom', true), 'custom');
	assert.equal(chooseWispServer('default', true), 'generated');
	assert.equal(chooseWispServer('generated', false), 'generated');
});

test('a reachable core WISP is used without changing the saved selection', async () => {
	const saved = [];
	const probed = [];
	const url = await resolveDefaultWisp(
		'ws://localhost:8080/wisp/',
		async value => {
			probed.push(value);
			return true;
		},
		async () => {
			throw new Error('should not generate');
		},
		choice => saved.push(choice)
	);
	assert.equal(url, 'ws://localhost:8080/wisp/');
	assert.deepEqual(probed, ['ws://localhost:8080/wisp/']);
	assert.deepEqual(saved, []);
});

test('a failed core WISP selects and persists a validated generated server', async () => {
	const saved = [];
	const url = await resolveDefaultWisp(
		'ws://localhost:8080/wisp/',
		async () => false,
		async () => 'wss://generated.example/wisp/',
		choice => saved.push(choice)
	);
	assert.equal(url, 'wss://generated.example/wisp/');
	assert.deepEqual(saved, ['generated']);
});

test('a failed generation leaves the saved choice unchanged', async () => {
	const saved = [];
	await assert.rejects(
		resolveDefaultWisp(
			'ws://localhost:8080/wisp/',
			async () => false,
			async () => {
				throw new Error('no live generated wisp server found');
			},
			choice => saved.push(choice)
		),
		/no live generated wisp server found/
	);
	assert.deepEqual(saved, []);
});
