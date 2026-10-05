import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

import { runtime as generateRuntime } from "./runtime.js";

const layoutPath = new URL("../../src/layouts/Layout.astro", import.meta.url);
const pluginPath = new URL("./index.ts", import.meta.url);
const runtimePath = new URL("./runtime.js", import.meta.url);

function createRuntimeEnvironment({ fetch, fonts, baseURI = "https://nebulaproxy.io/" }) {
  class FakeEventTarget {
    listeners = new Map();

    addEventListener(type, listener) {
      const listeners = this.listeners.get(type) || [];
      listeners.push(listener);
      this.listeners.set(type, listeners);
    }

    async dispatch(type, event = {}) {
      await Promise.all(
        (this.listeners.get(type) || []).map((listener) => listener(event)),
      );
    }

    listenerCount() {
      return [...this.listeners.values()].reduce(
        (count, listeners) => count + listeners.length,
        0,
      );
    }
  }

  class FakeNode {
    constructor(nodeType = 1) {
      this.nodeType = nodeType;
      this._textContent = "";
    }

    get textContent() {
      return this._textContent;
    }

    set textContent(value) {
      this._textContent = value;
    }

    appendChild(child) {
      return child;
    }

    insertBefore(node) {
      return node;
    }

    replaceChild(node) {
      return node;
    }
  }

  class FakeElement extends FakeNode {
    constructor() {
      super(1);
      this.attributes = new Map();
      this.children = [];
      this.classNames = new Set();
      this.classList = {
        add: (name) => this.classNames.add(name),
        contains: (name) => this.classNames.has(name),
      };
      this.style = {};
    }

    get innerHTML() {
      return "";
    }

    set innerHTML(value) {
      this._textContent = value;
    }

    matches() {
      return false;
    }

    closest() {
      return null;
    }

    hasAttribute(name) {
      return this.attributes.has(name);
    }

    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    }

    setAttribute(name, value) {
      this.attributes.set(name, value);
    }
  }

  class FakeHTMLElement extends FakeElement {
    get innerText() {
      return this._textContent;
    }

    set innerText(value) {
      this._textContent = value;
    }
  }

  class FakeDocument extends FakeEventTarget {
    constructor() {
      super();
      this.readyState = "loading";
      this.baseURI = baseURI;
      this.fonts = fonts;
      this.body = new FakeHTMLElement();
      this.documentElement = this.body;
    }

    createTextNode(text) {
      const node = new FakeNode(3);
      node.textContent = text;
      return node;
    }

    createElement() {
      return new FakeHTMLElement();
    }
  }

  class FakeMutationObserver {
    disconnect() {}
    observe() {}
  }

  const document = new FakeDocument();
  const window = new FakeEventTarget();
  window.getSelection = () => null;

  const context = vm.createContext({
    Document: FakeDocument,
    Element: FakeElement,
    HTMLElement: FakeHTMLElement,
    MutationObserver: FakeMutationObserver,
    Node: FakeNode,
    document,
    URL,
    fetch,
    navigator: { clipboard: {} },
    self: window,
    setTimeout,
    window,
  });

  return { context, document, window, FakeNode };
}

function successfulResponse(mapping) {
  return { ok: true, json: async () => mapping };
}

function executeRuntime(environment) {
  vm.runInContext(generateRuntime(), environment.context);
}

test("font assets survive Astro head swaps", async () => {
  const layout = await readFile(layoutPath, "utf8");
  const plugin = await readFile(pluginPath, "utf8");
  const stylesheetTag = layout.match(
    /<link\b(?=[^>]*\bhref\s*=\s*["']\/ob-fonts\.css["'])[^>]*>/,
  )?.[0];
  const runtimeTag = layout.match(
    /<script\b(?=[^>]*\bsrc\s*=\s*["']\/ob-fonts\.js["'])[^>]*>/,
  )?.[0];

  assert.ok(stylesheetTag, "missing /ob-fonts.css link tag");
  assert.match(stylesheetTag, /\btransition:persist\b/);
  assert.ok(runtimeTag, "missing /ob-fonts.js script tag");
  assert.match(runtimeTag, /\bis:inline\b/);
  assert.doesNotMatch(layout, /createElement\("link"\)/);
  assert.doesNotMatch(layout, /createElement\("script"\)/);
  assert.doesNotMatch(plugin, /\btransformIndexHtml\s*:/);
  assert.doesNotMatch(
    plugin,
    /document\.createElement\(\s*["'](?:link|script)["']\s*\)/,
  );
});

test("font runtime prepares and rehooks each Astro body", async () => {
  const runtime = await readFile(runtimePath, "utf8");
  assert.match(
    runtime,
    /function fontObfuscationRuntime\(\)\s*\{\s*"use strict";\s*if \(window\.fontObfuscation\?\.__runtimeInstalled\)\s*\{[^{}]*window\.fontObfuscation\.rehook\(\);[^{}]*return;[^{}]*\}/,
  );
  assert.match(runtime, /__runtimeInstalled:\s*true/);
  assert.match(runtime, /async function rehook\(\)/);
  assert.match(runtime, /\brehook,/);
  assert.match(
    runtime,
    /if \(await waitForFontsToLoad\(\)\) enableObfuscation\(\);/,
  );
  assert.match(
    runtime,
    /document\.addEventListener\(\s*"astro:before-swap"\s*,\s*(?:\(\s*event\s*\)|event)\s*=>\s*\{[^{}]*prepareBody\(event\.newDocument\.body\)[^{}]*\}\s*\);/,
  );
  assert.match(
    runtime,
    /document\.addEventListener\(\s*"astro:after-swap"\s*,\s*\(\s*\)\s*=>\s*\{[^{}]*setupMutationObserver\(\)[^{}]*\}\s*\);/,
  );
  assert.match(
    runtime,
    /document\.addEventListener\(\s*"astro:page-load"\s*,\s*\(\s*\)\s*=>\s*\{[^{}]*processExistingDOM\(\)[^{}]*\}\s*\);/,
  );
});

test("font check cannot initialize without a loaded font face", async () => {
  const environment = createRuntimeEnvironment({
    fetch: async (url) =>
      successfulResponse(url.includes("reverse") ? { a: "b" } : { b: "a" }),
    fonts: {
      load: async () => [],
      check: () => true,
    },
  });

  executeRuntime(environment);
  await environment.document.dispatch("DOMContentLoaded");

  assert.equal(environment.window.fontObfuscation.isInitialized(), false);
});

test("font mappings load beside the standalone SVG package", async () => {
  const requested = [];
  const environment = createRuntimeEnvironment({
    baseURI: "https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/index.svg",
    fetch: async (url) => { requested.push(url); return { ok: false }; },
    fonts: { load: async () => [], check: () => false },
  });
  executeRuntime(environment);
  await environment.document.dispatch("DOMContentLoaded");
  assert.deepEqual(requested, [
    "https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/roboto-obf-mappings.json",
    "https://cdn.jsdelivr.net/gh/TwiLabs/n4x8p1kd@main/roboto-obf-reverse-mappings.json",
  ]);
});

test("rehook retries invalid mappings and shares an in-flight boot", async () => {
  let mappingsAvailable = false;
  let fetchCount = 0;
  const environment = createRuntimeEnvironment({
    fetch: async (url) => {
      fetchCount += 1;
      if (!mappingsAvailable) {
        return { ok: false, json: async () => ({}) };
      }
      return successfulResponse(
        url.includes("reverse") ? { a: "b" } : { b: "a" },
      );
    },
    fonts: {
      load: async () => [{ status: "loaded" }],
      check: () => true,
    },
  });

  executeRuntime(environment);
  await environment.document.dispatch("DOMContentLoaded");
  assert.equal(environment.window.fontObfuscation.isInitialized(), false);

  mappingsAvailable = true;
  await Promise.all([
    environment.window.fontObfuscation.rehook(),
    environment.window.fontObfuscation.rehook(),
  ]);

  assert.equal(environment.window.fontObfuscation.isInitialized(), true);
  assert.equal(fetchCount, 4);
  assert.equal(environment.document.listeners.get("copy")?.length, 1);
});

test("rehook retries a transient font failure", async () => {
  let fontsAvailable = false;
  let loadCount = 0;
  const environment = createRuntimeEnvironment({
    fetch: async (url) =>
      successfulResponse(url.includes("reverse") ? { a: "b" } : { b: "a" }),
    fonts: {
      load: async () => {
        loadCount += 1;
        return fontsAvailable ? [{ status: "loaded" }] : [];
      },
      check: () => fontsAvailable,
    },
  });

  executeRuntime(environment);
  await environment.document.dispatch("DOMContentLoaded");
  assert.equal(environment.window.fontObfuscation.isInitialized(), false);

  fontsAvailable = true;
  await environment.window.fontObfuscation.rehook();

  assert.equal(environment.window.fontObfuscation.isInitialized(), true);
  assert.equal(loadCount, 2);
});

test("repeat execution rehooks without reinstalling hooks or listeners", () => {
  const environment = createRuntimeEnvironment({
    fetch: async (url) =>
      successfulResponse(url.includes("reverse") ? { a: "b" } : { b: "a" }),
    fonts: {
      load: async () => [{ status: "loaded" }],
      check: () => true,
    },
  });

  executeRuntime(environment);
  const api = environment.window.fontObfuscation;
  const textContentSetter = Object.getOwnPropertyDescriptor(
    environment.FakeNode.prototype,
    "textContent",
  ).set;
  const documentListenerCount = environment.document.listenerCount();
  const windowListenerCount = environment.window.listenerCount();
  let rehookCount = 0;
  const originalRehook = api.rehook;
  api.rehook = (...args) => {
    rehookCount += 1;
    return originalRehook(...args);
  };

  executeRuntime(environment);

  assert.equal(rehookCount, 1);
  assert.equal(environment.window.fontObfuscation, api);
  assert.equal(
    Object.getOwnPropertyDescriptor(
      environment.FakeNode.prototype,
      "textContent",
    ).set,
    textContentSetter,
  );
  assert.equal(environment.document.listenerCount(), documentListenerCount);
  assert.equal(environment.window.listenerCount(), windowListenerCount);
});
