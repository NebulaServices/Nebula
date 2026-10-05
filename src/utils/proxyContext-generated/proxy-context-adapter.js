var SpaceProxyContext = (function(exports) {
	Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
	//#region src/bridge/protocol.ts
	var PROTOCOL = "proxy-context-v1";
	var CAPABILITIES = Object.freeze(["nested-iframe-navigation", "document-fetch"]);
	var DISCOVERY_TIMEOUT_MS = 1500;
	function isMessage(value) {
		if (!value || typeof value !== "object" || Array.isArray(value)) return false;
		const message = value;
		if (message.protocol !== "proxy-context-v1" || message.version !== 1 || typeof message.requestId !== "string" || !message.requestId) return false;
		const keys = [
			"protocol",
			"version",
			"type",
			"requestId"
		];
		if (message.type !== "discover") {
			if (typeof message.type !== "string" || ![
				"capabilities",
				"check",
				"ready",
				"unavailable"
			].includes(message.type) || typeof message.sessionId !== "string" || !message.sessionId) return false;
			keys.push("sessionId");
			if (message.type === "capabilities") {
				keys.push("capabilities");
				const capabilities = message.capabilities;
				if (!Array.isArray(capabilities) || !capabilities.every((item) => typeof item === "string" && item.length > 0) || !CAPABILITIES.every((capability) => capabilities.includes(capability))) return false;
			}
		}
		return Object.keys(message).length === keys.length && keys.every((key) => Object.hasOwn(message, key));
	}
	function platform(win) {
		const Channel = win.MessageChannel;
		if (typeof Channel !== "function" || typeof win.crypto?.randomUUID !== "function" || typeof win.postMessage !== "function" || typeof win.addEventListener !== "function" || typeof win.setTimeout !== "function" || typeof win.clearTimeout !== "function") return null;
		return {
			Channel,
			id: () => win.crypto.randomUUID()
		};
	}
	//#endregion
	//#region src/bridge/adapter.ts
	var claimedPorts = /* @__PURE__ */ new WeakSet();
	function installProxyContextAdapter(win, isReady) {
		const support = platform(win);
		if (!support) return () => {};
		let installed = true;
		let active = true;
		const sessions = /* @__PURE__ */ new Set();
		const ready = () => {
			try {
				return isReady() === true;
			} catch {
				return false;
			}
		};
		const onMessage = (event) => {
			if (!installed || !active || event.source !== win || !isMessage(event.data) || event.data.type !== "discover" || event.ports.length !== 1) return;
			const port = event.ports[0];
			if (!port || typeof port.postMessage !== "function" || typeof port.start !== "function" || typeof port.close !== "function" || claimedPorts.has(port)) return;
			claimedPorts.add(port);
			if (!ready()) {
				port.close();
				return;
			}
			const requestId = event.data.requestId;
			let sessionId;
			try {
				sessionId = support.id();
			} catch {
				port.close();
				return;
			}
			let closed = false;
			const close = () => {
				if (closed) return;
				closed = true;
				win.clearTimeout(acceptanceTimer);
				try {
					port.postMessage({
						protocol: PROTOCOL,
						version: 1,
						type: "unavailable",
						requestId,
						sessionId
					});
				} catch {}
				port.onmessage = null;
				port.onmessageerror = null;
				port.close();
				sessions.delete(close);
			};
			const acceptanceTimer = win.setTimeout(close, DISCOVERY_TIMEOUT_MS);
			sessions.add(close);
			port.onmessageerror = close;
			port.onmessage = (event) => {
				if (closed || !isMessage(event.data) || event.data.type === "discover" || event.data.sessionId !== sessionId) return;
				if (event.data.type === "unavailable" && event.data.requestId === requestId) {
					close();
					return;
				}
				if (event.data.type !== "check") return;
				win.clearTimeout(acceptanceTimer);
				const available = ready();
				try {
					port.postMessage({
						protocol: PROTOCOL,
						version: 1,
						type: available ? "ready" : "unavailable",
						requestId: event.data.requestId,
						sessionId
					});
				} catch {
					close();
					return;
				}
				if (!available) close();
			};
			try {
				port.start();
				port.postMessage({
					protocol: PROTOCOL,
					version: 1,
					type: "capabilities",
					requestId,
					sessionId,
					capabilities: CAPABILITIES
				});
			} catch {
				close();
			}
		};
		const closeSessions = () => {
			for (const close of sessions) close();
		};
		const onPageHide = () => {
			active = false;
			closeSessions();
		};
		const onPageShow = (event) => {
			if (event.persisted) {
				closeSessions();
				active = true;
			}
		};
		win.addEventListener("message", onMessage);
		win.addEventListener("pagehide", onPageHide);
		win.addEventListener("pageshow", onPageShow);
		return () => {
			if (!installed) return;
			installed = false;
			closeSessions();
			win.removeEventListener("message", onMessage);
			win.removeEventListener("pagehide", onPageHide);
			win.removeEventListener("pageshow", onPageShow);
		};
	}
	//#endregion
	//#region src/bridge/scramjet-adapter.ts
	var STATE = Symbol.for("proxy-context-v1.document");
	var MAX_SVG_BYTES = 256 * 1024;
	var BODY_HEADERS = [
		"content-length",
		"content-encoding",
		"etag",
		"last-modified",
		"content-md5",
		"digest",
		"content-digest",
		"repr-digest"
	];
	var installations = /* @__PURE__ */ new WeakMap();
	function installDocument(token, win = window) {
		const target = win;
		if (target[STATE]?.document === win.document) return;
		const state = {
			token,
			document: win.document,
			ready: false,
			disposed: false,
			dispose: () => {},
			activate: () => {}
		};
		let disposeResponder = installProxyContextAdapter(win, () => state.ready && state.document === win.document);
		const onPageHide = (event) => {
			state.ready = false;
			if (!event.persisted) state.dispose();
		};
		state.dispose = () => {
			if (state.disposed) return;
			state.disposed = true;
			state.ready = false;
			disposeResponder();
			win.removeEventListener("pagehide", onPageHide);
		};
		state.activate = () => {
			if (state.disposed) return;
			disposeResponder();
			disposeResponder = installProxyContextAdapter(win, () => state.ready && state.document === win.document);
			state.ready = true;
		};
		target[STATE] = state;
		win.addEventListener("pagehide", onPageHide);
	}
	function spaceGamesUrl(origin) {
		if (!origin.trim()) throw new Error("Configure an HTTP(S) Space origin to open games.");
		let url;
		try {
			url = new URL(origin);
		} catch {
			throw new Error("Space origin must be an HTTP(S) URL.");
		}
		if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Space origin must be an HTTP(S) URL without credentials.");
		url.searchParams.set("view", "games");
		return url.href;
	}
	/** Only the canonical active SVG host shape; never a general XML converter. */
	function activeSvgEnvelope(svg) {
		if (!/<foreignObject\b/i.test(svg) || !/<iframe\b/i.test(svg)) return null;
		if (/<!DOCTYPE|<!ENTITY/i.test(svg)) throw new Error("Unsupported active SVG document declaration");
		const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
		const root = doc.documentElement;
		if (doc.querySelector("parsererror") || root.localName !== "svg" || root.namespaceURI !== "http://www.w3.org/2000/svg") throw new Error("Malformed active SVG wrapper");
		const frames = Array.from(doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "iframe"));
		if (frames.length !== 1 || !frames[0].closest("foreignObject")) throw new Error("Unsupported active SVG frame shape");
		const allowed = new Set([
			"svg",
			"foreignObject",
			"div",
			"iframe",
			"script",
			"style"
		]);
		const escape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
		const serialize = (node) => {
			if (node.nodeType === 3 || node.nodeType === 4) return escape(node.nodeValue || "");
			if (node.nodeType === 8) return "";
			if (node.nodeType !== 1) throw new Error("Unsupported active SVG node");
			const el = node;
			if (!allowed.has(el.localName) || !["http://www.w3.org/2000/svg", "http://www.w3.org/1999/xhtml"].includes(el.namespaceURI || "")) throw new Error("Unsupported active SVG element");
			let attributes = "";
			for (const attr of Array.from(el.attributes)) {
				if (attr.prefix && attr.prefix !== "xmlns") throw new Error("Unsupported active SVG attribute namespace");
				if (el.localName === "iframe" && attr.name === "src" && !["http:", "https:"].includes(new URL(attr.value, "https://wrapper.invalid/").protocol)) throw new Error("Unsupported active SVG frame URL");
				attributes += ` ${attr.name}="${escape(attr.value)}"`;
			}
			let children;
			if (el.localName === "script" || el.localName === "style") {
				children = el.textContent || "";
				if (new RegExp(`</${el.localName}`, "i").test(children)) throw new Error("Unsupported active SVG raw text");
			} else children = Array.from(el.childNodes).map(serialize).join("");
			return `<${el.localName}${attributes}>${children}</${el.localName}>`;
		};
		return `<!doctype html><html><head></head><body style="margin:0;width:100vw;height:100vh;overflow:hidden">${serialize(root)}</body></html>`;
	}
	async function boundedBody(body) {
		const reader = new Response(body).body?.getReader();
		if (!reader) return new Uint8Array();
		const chunks = [];
		let size = 0;
		let timeout;
		const expired = new Promise((_resolve, reject) => {
			timeout = setTimeout(() => {
				reject(/* @__PURE__ */ new Error("Active SVG document read timed out"));
				reader.cancel();
			}, 5e3);
		});
		try {
			while (true) {
				const { done, value } = await Promise.race([reader.read(), expired]);
				if (done) break;
				size += value.byteLength;
				if (size > MAX_SVG_BYTES) throw new Error("Active SVG document exceeds size limit");
				chunks.push(value);
			}
		} catch (error) {
			reader.cancel();
			throw error;
		} finally {
			clearTimeout(timeout);
		}
		const bytes = new Uint8Array(size);
		let offset = 0;
		for (const chunk of chunks) {
			bytes.set(chunk, offset);
			offset += chunk.byteLength;
		}
		return bytes;
	}
	function installScramjetProxyContext(controller, adapterSource) {
		const host = controller;
		if (!host || typeof host.createFrame !== "function" || !Array.isArray(host.frames)) throw new Error("Proxy context requires Scramjet controller frame APIs");
		const existing = installations.get(host);
		if (existing) return existing;
		const engine = globalThis.$scramjet;
		if (!engine?.Tap?.tap || typeof engine.rewriteHtml !== "function" || !engine.SCRAMJETCLIENT) throw new Error("Proxy context requires the active Scramjet hooks and HTML rewriter");
		if (!adapterSource.trim()) throw new Error("Proxy context adapter bundle is missing");
		const token = crypto.randomUUID();
		const bytes = new TextEncoder().encode(`${adapterSource}\n;globalThis.SpaceProxyContext.installDocument(${JSON.stringify(token)});`);
		let binary = "";
		for (const byte of bytes) binary += String.fromCharCode(byte);
		const source = `data:text/javascript;charset=utf-8;base64,${btoa(binary)}`;
		let active = true;
		const attached = /* @__PURE__ */ new WeakSet();
		const restores = [];
		const documents = /* @__PURE__ */ new Map();
		const ownedStates = /* @__PURE__ */ new Set();
		const wrapFactory = (context) => {
			const iface = context?.interface;
			if (!iface || typeof iface.getInjectScripts !== "function") throw new Error("Scramjet document injection factory is unavailable");
			const original = iface.getInjectScripts;
			if (original.__proxyContextToken === token) return;
			const wrapped = function(meta, handler, html, script) {
				const base = original.call(this, meta, handler, html, script);
				return active ? [script(source), ...base] : base;
			};
			wrapped.__proxyContextToken = token;
			iface.getInjectScripts = wrapped;
			restores.push(() => {
				if (iface.getInjectScripts === wrapped) iface.getInjectScripts = original;
			});
		};
		const attach = (frame) => {
			if (attached.has(frame)) return;
			if (!frame.fetchHandler?.context || !frame.hooks?.fetch?.response || !frame.hooks?.init?.pre || !frame.hooks?.init?.post) throw new Error("Scramjet frame response/init hooks are unavailable");
			attached.add(frame);
			wrapFactory(frame.fetchHandler.context);
			const prepared = /* @__PURE__ */ new WeakSet();
			engine.Tap.tap(frame.hooks.init.pre, ({ window: win, client }) => {
				if (!active) return;
				wrapFactory(client.context);
				prepared.add(client);
				const state = win[STATE];
				if (state?.token === token && state.document === win.document) ownedStates.add(state);
			});
			engine.Tap.tap(frame.hooks.init.post, ({ window: win, client }) => {
				if (!active || !prepared.has(client) || client?.global?.window !== win || win[engine.SCRAMJETCLIENT] !== client) return;
				const state = win[STATE];
				if (!state || state.token !== token || state.document !== win.document) return;
				const previous = documents.get(win);
				if (previous && previous.state === state && previous.client === client) return;
				previous?.removeListeners();
				if (previous && previous.state !== state) {
					previous.state.dispose();
					ownedStates.delete(previous.state);
				}
				ownedStates.add(state);
				const record = {
					state,
					client,
					frame,
					removeListeners: () => {}
				};
				documents.set(win, record);
				state.activate();
				const show = (event) => {
					if (event.persisted && active && documents.get(win) === record && !state.disposed && win[STATE] === state && state.document === win.document && win[engine.SCRAMJETCLIENT] === client) state.ready = true;
				};
				const hide = (event) => {
					if (!event.persisted) record.removeListeners();
				};
				let listening = true;
				record.removeListeners = () => {
					if (!listening) return;
					listening = false;
					win.removeEventListener("pageshow", show);
					win.removeEventListener("pagehide", hide);
				};
				win.addEventListener("pageshow", show);
				win.addEventListener("pagehide", hide);
			});
			engine.Tap.tap(frame.hooks.fetch.response, async ({ parsed }, props) => {
				const response = props.response;
				if (!active || !["document", "iframe"].includes(parsed.destination) || response.status < 200 || response.status >= 300 || !response.body || response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "image/svg+xml") return;
				try {
					const bytes = await boundedBody(response.body);
					if (!active) {
						response.body = bytes.buffer;
						return;
					}
					const envelope = activeSvgEnvelope(new TextDecoder().decode(bytes));
					if (envelope === null) {
						response.body = bytes.buffer;
						return;
					}
					response.headers.set("content-type", "text/html; charset=utf-8");
					for (const header of BODY_HEADERS) response.headers.delete(header);
					response.body = engine.rewriteHtml(envelope, frame.fetchHandler.context, parsed.meta, {
						loadScripts: true,
						inline: true,
						source: parsed.url.href,
						headers: response.headers.toRawHeaders(),
						history: parsed.trackedClient?.history ?? []
					});
				} catch (error) {
					response.status = 502;
					response.statusText = "Proxy context wrapper error";
					response.body = `Unable to load active SVG wrapper: ${error instanceof Error ? error.message : "invalid document"}`;
					response.headers.set("content-type", "text/plain; charset=utf-8");
				}
				for (const header of BODY_HEADERS) response.headers.delete(header);
			});
		};
		const originalCreate = host.createFrame;
		const createFrame = function(...args) {
			const frame = originalCreate.apply(this, args);
			if (active) attach(frame);
			return frame;
		};
		host.createFrame = createFrame;
		const dispose = () => {
			if (!active) return;
			active = false;
			for (const record of documents.values()) record.removeListeners();
			for (const state of ownedStates) state.dispose();
			ownedStates.clear();
			documents.clear();
			for (const restore of restores.reverse()) restore();
			if (host.createFrame === createFrame) host.createFrame = originalCreate;
			installations.delete(host);
		};
		try {
			for (const frame of host.frames) attach(frame);
		} catch (error) {
			dispose();
			throw error;
		}
		installations.set(host, dispose);
		return dispose;
	}
	//#endregion
	exports.activeSvgEnvelope = activeSvgEnvelope;
	exports.installDocument = installDocument;
	exports.installScramjetProxyContext = installScramjetProxyContext;
	exports.spaceGamesUrl = spaceGamesUrl;
	return exports;
})({});
