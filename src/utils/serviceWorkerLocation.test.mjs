import assert from 'node:assert/strict';
import test from 'node:test';

const { serviceWorkerLocation } = await import('./serviceWorkerLocation.ts');

test('uses package-relative worker and scope for standalone SVG URLs', () => {
	assert.deepEqual(
		serviceWorkerLocation(
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/index.svg'
		),
		{
			script: 'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/sw.js',
			scope: '/gh/TwiLabs/n4x8p1kd@main/'
		}
	);
});

test('keeps the root worker scope for regular localized pages', () => {
	assert.deepEqual(serviceWorkerLocation('https://nebulaproxy.io/en_US/'), {
		script: 'https://nebulaproxy.io/sw.js',
		scope: '/'
	});
});

test("retains standalone package scope while the app's visible route is non-SVG", () => {
	assert.deepEqual(
		serviceWorkerLocation(
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/loading/',
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/'
		),
		{
			script: 'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/sw.js',
			scope: '/gh/TwiLabs/n4x8p1kd@main/'
		}
	);
});

test('nested jsDelivr SVGs register the worker at the repository root', () => {
	assert.deepEqual(
		serviceWorkerLocation(
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@0b8b6fb/en_US/games/index.svg?x=1#route'
		),
		{
			script: 'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@0b8b6fb/sw.js',
			scope: '/gh/TwiLabs/n4x8p1kd@0b8b6fb/'
		}
	);
});

test('jsDelivr HTML routes recover the package root without an injected base', () => {
	assert.deepEqual(
		serviceWorkerLocation(
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@0b8b6fb/loading/'
		),
		{
			script: 'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@0b8b6fb/sw.js',
			scope: '/gh/TwiLabs/n4x8p1kd@0b8b6fb/'
		}
	);
});
