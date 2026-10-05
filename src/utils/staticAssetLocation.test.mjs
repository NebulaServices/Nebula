import assert from 'node:assert/strict';
import test from 'node:test';
import { staticAssetLocation } from './staticAssetLocation.ts';
import { serviceWorkerLocation } from './serviceWorkerLocation.ts';

test('resolves runtime assets beside standalone SVG packages', () => {
	assert.equal(
		staticAssetLocation(
			'/scram/scramjet.js',
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/index.svg'
		),
		'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/scram/scramjet.js'
	);
});

test('resolves regular deployment assets from origin root', () => {
	assert.equal(
		staticAssetLocation(
			'/scram/scramjet.js',
			'https://nebulaproxy.io/en_US/'
		),
		'https://nebulaproxy.io/scram/scramjet.js'
	);
});

test('keeps app runtime assets inside the SVG package after navigating to an HTML route', () => {
	assert.equal(
		staticAssetLocation(
			'/scram/scramjet.js',
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/loading/',
			'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/'
		),
		'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/scram/scramjet.js'
	);
});

test('nested standalone pages use package-root runtime assets and proxy prefixes', () => {
	const page =
		'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@0b8b6fb/en_US/games/index.svg';
	assert.equal(
		staticAssetLocation('/scram/scramjet.wasm', page),
		'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@0b8b6fb/scram/scramjet.wasm'
	);
	assert.equal(
		staticAssetLocation('/scram-controller/controller.inject.js', page),
		'https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@0b8b6fb/scram-controller/controller.inject.js'
	);
	const prefix = new URL(staticAssetLocation('/study/science/', page))
		.pathname;
	assert.equal(prefix, '/gh/TwiLabs/n4x8p1kd@0b8b6fb/study/science/');
	assert.ok(prefix.startsWith(serviceWorkerLocation(page).scope));
});

test('runtime assets honor the injected package base on non-CDN nested pages', () => {
	globalThis.__ddxBase = 'https://static.example/nebula/';
	try {
		const page = 'https://static.example/nebula/en_US/games/index.svg';
		assert.equal(
			staticAssetLocation('/scram/scramjet.wasm', page),
			'https://static.example/nebula/scram/scramjet.wasm'
		);
		assert.deepEqual(serviceWorkerLocation(page), {
			script: 'https://static.example/nebula/sw.js',
			scope: '/nebula/'
		});
	} finally {
		delete globalThis.__ddxBase;
	}
});

test('relative explicit bases are resolved against the page', () => {
	assert.equal(
		staticAssetLocation(
			'/scram/scramjet.js',
			'https://static.example/nebula/en_US/games/index.svg',
			'../../'
		),
		'https://static.example/nebula/scram/scramjet.js'
	);
});
