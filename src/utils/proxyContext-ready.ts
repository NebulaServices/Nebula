const HOST_READY = 'proxy-context-host-ready';

export function waitForProxyController(
	win: Window,
	timeoutMs = 15000
): Promise<any> {
	const current = () => (win as Window & { controller?: unknown }).controller;
	if (current()) return Promise.resolve(current());
	return new Promise((resolve, reject) => {
		const finish = () => {
			if (!current()) return;
			win.clearTimeout(timer);
			win.removeEventListener(HOST_READY, finish);
			resolve(current());
		};
		const timer = win.setTimeout(() => {
			win.removeEventListener(HOST_READY, finish);
			reject(
				new Error(
					'Proxy runtime did not become ready; reload to open Space games.'
				)
			);
		}, timeoutMs);
		win.addEventListener(HOST_READY, finish);
		finish();
	});
}
