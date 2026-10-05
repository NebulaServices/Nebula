import { installScramjetProxyContext } from './proxyContext-generated/proxy-context-host.js';
import adapterSource from './proxyContext-generated/proxy-context-adapter.js?raw';
export { spaceGamesUrl } from './space-origin.ts';
export { waitForProxyController } from './proxyContext-ready';

export function installProxyContext(controller: unknown): () => void {
	const dispose = installScramjetProxyContext(controller, adapterSource);
	window.dispatchEvent(new Event('proxy-context-host-ready'));
	return dispose;
}
