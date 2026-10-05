import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
const publicModule = readFileSync(
	new URL('./proxyContext.ts', import.meta.url),
	'utf8'
);
const originModule = publicModule.match(
	/export \{ spaceGamesUrl \} from '([^']+)'/
)[1];
const { spaceGamesUrl } = await import(new URL(originModule, import.meta.url));

test('defaults absent Space origins but preserves explicitly configured mounts and query strings', () => {
	for (const origin of [undefined, '', '  ']) {
		assert.equal(
			spaceGamesUrl(origin),
			'https://gointospace.app/?view=games'
		);
	}
	assert.equal(
		spaceGamesUrl('https://space.example/mount/?other=1'),
		'https://space.example/mount/?other=1&view=games'
	);
	assert.throws(() => spaceGamesUrl('javascript:alert(1)'), /HTTP/);
	assert.throws(
		() => spaceGamesUrl('https://user:password@example.com'),
		/credentials/
	);
});
