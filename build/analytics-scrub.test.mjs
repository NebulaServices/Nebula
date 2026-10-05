import assert from 'node:assert/strict';
import test from 'node:test';

const { NEBULA_SCRUB_WORDS } = await import('./scrub.ts');

test('analytics tag ID and gtag literals survive scrubbing', () => {
	const literals = [
		'G-5CFVV589W6',
		'googletagmanager',
		'dataLayer',
		'gtag'
	];
	for (const literal of literals) {
		assert.equal(
			NEBULA_SCRUB_WORDS.some(word => literal.toLowerCase().includes(word)),
			false,
			`${literal} collides with a scrub word`
		);
	}
});
