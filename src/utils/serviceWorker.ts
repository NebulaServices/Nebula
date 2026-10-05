import { log } from './index';
import { serviceWorkerLocation } from './serviceWorkerLocation';
import { staticAssetLocation } from './staticAssetLocation';

/**
 * Creates a script element and returns it for usage or more modification.
 *
 * @example
 * const script = createScript("/scram/scramjet.controller.js", true);
 * document.body.appendChild(script);
 */
const createScript = (src: string, defer?: boolean): HTMLScriptElement => {
	const script = document.createElement('script') as HTMLScriptElement;
	script.src = src;
	if (defer) script.defer = defer;
	return script;
};

/**
 * A generator function to create and load our proxy scripts. Allows us to pause and continue when needed.
 *
 * @example
 * const proxyScripts = createProxyScripts();
 * if (proxyScripts.next().value) document.body.appendChild(proxyScripts.next().value)
 * // We can now check to see if that script is there or not and then continue after.
 */
function* createProxyScripts() {
	const standaloneBase = (
		globalThis as typeof globalThis & { __ddxBase?: string }
	).__ddxBase;
	const sj = createScript(
		staticAssetLocation(
			'/scram/scramjet.js',
			location.href,
			standaloneBase
		),
		false
	);
	yield sj;
	const sjController = createScript(
		staticAssetLocation(
			'/scram-controller/controller.api.js',
			location.href,
			standaloneBase
		),
		false
	);
	yield sjController;
}

/**
 * Function that resolves ONLY when uv and Scramjet are not undefined. This prevents us from using these values before they are added and executed.
 *
 * @example
 * await checkProxyScripts() ;
 * @example
 * checkProxyScripts().then(() => { // Do something });
 */
const checkProxyScripts = (): Promise<void> => {
	return new Promise(resolve => {
		const checkScript = setInterval(() => {
			if (
				typeof $scramjet !== 'undefined' &&
				typeof $scramjetController !== 'undefined'
			) {
				clearInterval(checkScript);
				resolve();
			}
		}, 100);
	});
};

type SWInit = {
	serviceWorker: ServiceWorkerRegistration;
};

/**
 * This class automatically sets up and registers our service worker.
 *
 * @example
 * const sw = new SW();
 * sw.getSWInfo() // Returns an object with the service worker, scramjet controller instance and the baremux connection all in one method
 * sw.setSWInfo() // Allows one to override the info returned from getSWInfo() should be used sparingly or never.
 */
class SW {
	#init: Promise<SWInit>;
	#registration?: ServiceWorkerRegistration;
	#worker: { script: string; scope: string };
	static #instances = new Set();
	constructor({ timeoutMs = 15000 }: { timeoutMs?: number } = {}) {
		SW.#instances.add(this);
		this.#worker = serviceWorkerLocation(location.href);
		this.#init = new Promise((resolve, reject) => {
			let settled = false;
			let registration: ServiceWorkerRegistration | undefined;
			const watched = new Set<ServiceWorker>();
			const finish = (error?: unknown) => {
				if (settled) return;
				settled = true;
				clearTimeout(timeout);
				registration?.removeEventListener('updatefound', check);
				for (const worker of watched)
					worker.removeEventListener('statechange', check);
				if (error) reject(error);
				else {
					this.#registration = registration!;
					log(
						{ type: 'info', prefix: true, bg: false },
						'ServiceWorker ready and active!'
					);
					resolve({ serviceWorker: registration! });
				}
			};
			const check = () => {
				if (settled || !registration) return;
				const workers = [
					registration.active,
					registration.waiting,
					registration.installing
				].filter((worker): worker is ServiceWorker => worker !== null);
				for (const worker of workers) {
					if (!watched.has(worker)) {
						watched.add(worker);
						worker.addEventListener('statechange', check);
					}
				}
				if (
					registration.scope !==
					new URL(this.#worker.scope, this.#worker.script).href
				) {
					finish(
						new Error('Service worker scope ownership mismatch')
					);
					return;
				}
				const owned = workers.filter(
					worker => worker.scriptURL === this.#worker.script
				);
				if (
					registration.active?.state === 'activated' &&
					registration.active.scriptURL === this.#worker.script
				) {
					finish();
				} else if (
					owned.length &&
					owned.every(worker => worker.state === 'redundant')
				) {
					finish(
						new Error(
							'Service worker became redundant before activation'
						)
					);
				} else if (workers.length && !owned.length) {
					finish(
						new Error('Service worker script ownership mismatch')
					);
				}
			};
			const timeout = setTimeout(
				() =>
					finish(
						new Error(
							'Service worker registration or activation timed out'
						)
					),
				timeoutMs
			);
			Promise.resolve()
				.then(() => {
					if (!('serviceWorker' in navigator))
						throw new Error(
							'Your browser is not supported! This website uses Service Workers heavily.'
						);
					return navigator.serviceWorker.register(
						this.#worker.script,
						{ scope: this.#worker.scope }
					);
				})
				.then(reg => {
					if (settled) return;
					registration = reg;
					registration.addEventListener('updatefound', check);
					check();
				})
				.catch(error =>
					finish(
						error ?? new Error('Service worker registration failed')
					)
				);
		});
		// Initialization starts in the constructor; retain its failure for
		// getSWInfo without an unhandled rejection if its caller arrives later.
		void this.#init.catch(() => {});
	}

	/**
	 * Static method to get an already existing SW class
	 *
	 *
	 * @example
	 * SW.getInstances.next().value // Get the first instance.
	 *
	 * @example
	 * // Loop through every instance
	 * for (const sw of SW.getInstances()) {
	 * console.log(sw) // DO some real work
	 * }
	 */
	static *getInstances() {
		for (const value of SW.#instances.keys()) {
			yield value as SW;
		}
	}

	/**
	 * Returns a promise that resolves to the serviceWorker, scramjet controller and bareMux Connection ONLY when these values are ready.
	 *
	 * @example
	 * const sw = new SW(conn); // "conn" must be a baremux connection that you created.
	 * const swInfo = await sw.getSWInfo();
	 *
	 * @example
	 * const sw = new SW(conn); // "conn" must be a baremux connection that you created
	 * sw.getInfo().then((info) => { // Do something with said info }
	 */
	getSWInfo(): Promise<SWInit> {
		return this.#init;
	}

	/** Recheck ownership after async setup, immediately before controller use. */
	getActiveWorker(): ServiceWorker {
		const registration = this.#registration;
		const worker = registration?.active;
		if (
			!registration ||
			!worker ||
			worker.state !== 'activated' ||
			worker.scriptURL !== this.#worker.script ||
			registration.scope !==
				new URL(this.#worker.scope, this.#worker.script).href
		) {
			throw new Error('Active service worker ownership mismatch');
		}
		return worker;
	}
}

export { createScript, createProxyScripts, checkProxyScripts, SW };
