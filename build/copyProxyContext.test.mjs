import assert from 'node:assert/strict';
import test from 'node:test';

const { planBridgeCopy } = await import('./copyProxyContext.mjs');

test('explicit artifact directory wins untouched', () => {
	assert.deepEqual(
		planBridgeCopy({
			hasSpaceDir: false,
			hasGenerated: false,
			envSource: '/artifacts/bridge'
		}),
		{ action: 'copy', source: '/artifacts/bridge' }
	);
});

test('sibling checkout builds then copies', () => {
	assert.deepEqual(
		planBridgeCopy({ hasSpaceDir: true, hasGenerated: false }),
		{ action: 'build-then-copy' }
	);
});

test('standalone reuses checked-in generated files', () => {
	assert.deepEqual(
		planBridgeCopy({ hasSpaceDir: false, hasGenerated: true }),
		{ action: 'reuse-checked-in' }
	);
});

test('bare standalone fetches the published bridge', () => {
	assert.deepEqual(
		planBridgeCopy({ hasSpaceDir: false, hasGenerated: false }),
		{ action: 'fetch-remote' }
	);
});
