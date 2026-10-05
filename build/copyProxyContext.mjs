import { cp, mkdir, access, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const BRIDGE_FILES = [
	'proxy-context-adapter.js',
	'proxy-context-host.js',
	'proxy-context-host.d.ts'
];

// Published bridge for bare standalone checkouts (no sibling repo, no
// checked-in generated files). Same bytes the sibling build emits.
const REMOTE_BRIDGE_BASE =
	'https://gitlab.com/nightnetwork/Space/-/raw/v2/public';

export function planBridgeCopy({ hasSpaceDir, hasGenerated, envSource }) {
	if (envSource) return { action: 'copy', source: envSource };
	if (hasSpaceDir) return { action: 'build-then-copy' };
	if (hasGenerated) return { action: 'reuse-checked-in' };
	return { action: 'fetch-remote' };
}

async function exists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

export async function runCopyProxyContext(root) {
	// An artifact directory can be supplied for independent host packaging. The
	// sibling checkout is a build-time default only, never a runtime dependency.
	const destination = resolve(root, 'src/utils/proxyContext-generated');
	const generatedPresent = (
		await Promise.all(
			BRIDGE_FILES.map(name => exists(resolve(destination, name)))
		)
	).every(Boolean);
	const plan = planBridgeCopy({
		hasSpaceDir: await exists(resolve(root, '../Space-v2')),
		hasGenerated: generatedPresent,
		envSource: process.env.SPACE_BRIDGE_SOURCE
	});
	if (plan.action === 'reuse-checked-in') {
		console.warn(
			'[proxy-context] no Space-v2 checkout; reusing checked-in generated bridge files'
		);
		return;
	}
	if (plan.action === 'fetch-remote') {
		console.warn(
			'[proxy-context] fetching published bridge files for standalone build'
		);
		await mkdir(destination, { recursive: true });
		for (const name of BRIDGE_FILES) {
			const response = await fetch(`${REMOTE_BRIDGE_BASE}/${name}`);
			if (!response.ok)
				throw new Error(
					`Space proxy-context bridge unavailable (HTTP ${response.status} for ${name}): ` +
						'set SPACE_BRIDGE_SOURCE to a directory containing proxy-context-adapter.js, ' +
						'proxy-context-host.js and proxy-context-host.d.ts, or clone the Space-v2 repo alongside.'
				);
			await writeFile(resolve(destination, name), await response.text());
		}
		return;
	}
	const source =
		plan.action === 'copy' ? plan.source : resolve(root, '../Space-v2/public');
	if (plan.action === 'build-then-copy') {
		const result = spawnSync(process.execPath, ['scripts/build-bridge.mjs'], {
			cwd: resolve(root, '../Space-v2'),
			stdio: 'inherit'
		});
		if (result.status !== 0)
			throw new Error('Space proxy-context bundle build failed');
	}
	await mkdir(destination, { recursive: true });
	for (const name of BRIDGE_FILES)
		await cp(resolve(source, name), resolve(destination, name));
}
