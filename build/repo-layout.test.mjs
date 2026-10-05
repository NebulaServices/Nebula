import assert from 'node:assert/strict';
import test from 'node:test';
import { readdir, readFile } from 'node:fs/promises';
import { join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function sourceFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		if (entry.name === 'node_modules') continue;
		const path = join(dir, entry.name);
		if (entry.isDirectory()) files.push(...(await sourceFiles(path)));
		else if (
			/\.[cm]?[jt]s$/.test(entry.name) &&
			!/[.-]test\.[cm]?[jt]s$/.test(entry.name)
		)
			files.push(path);
	}
	return files;
}

test('no source import escapes the Nebula package root', async () => {
	const offenders = [];
	for (const dir of ['src', 'build', 'server']) {
		for (const file of await sourceFiles(join(ROOT, dir))) {
			const text = await readFile(file, 'utf8');
			for (const match of text.matchAll(
				/(?:import|export)[^'"]*['"]([^'"]+)['"]/g
			)) {
				const spec = match[1];
				if (!spec.startsWith('.')) continue;
				const resolved = normalize(
					join(file.slice(0, file.lastIndexOf('/')), spec)
				);
				if (!resolved.startsWith(ROOT + '/'))
					offenders.push(`${file}: ${spec}`);
			}
		}
	}
	for (const file of ['astro.config.ts']) {
		const text = await readFile(join(ROOT, file), 'utf8');
		for (const match of text.matchAll(
			/(?:import|export)[^'"]*['"]([^'"]+)['"]/g
		)) {
			const spec = match[1];
			if (!spec.startsWith('.')) continue;
			const resolved = normalize(join(ROOT, spec));
			if (!resolved.startsWith(ROOT + '/'))
				offenders.push(`${file}: ${spec}`);
		}
	}
	assert.deepEqual(offenders, []);
});
