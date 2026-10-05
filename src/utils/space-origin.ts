import { spaceGamesUrl as configuredSpaceGamesUrl } from './proxyContext-generated/proxy-context-host.js';

export function spaceGamesUrl(origin = ''): string {
	return configuredSpaceGamesUrl(
		origin.trim() ? origin : 'https://gointospace.app'
	);
}
