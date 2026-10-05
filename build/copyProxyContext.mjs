import { cp, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = process.env.SPACE_BRIDGE_SOURCE || resolve(root, '../Space-v2/public');
if (!process.env.SPACE_BRIDGE_SOURCE) {
  const result = spawnSync(process.execPath, ['scripts/build-bridge.mjs'], { cwd: resolve(root, '../Space-v2'), stdio: 'inherit' });
  if (result.status !== 0) throw new Error('Space proxy-context bundle build failed');
}
const destination = resolve(root, 'src/utils/proxyContext-generated');
await mkdir(destination, { recursive: true });
for (const name of ['proxy-context-adapter.js', 'proxy-context-host.js', 'proxy-context-host.d.ts'])
  await cp(resolve(source, name), resolve(destination, name));
