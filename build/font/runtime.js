function fontObfuscationRuntime() {
  "use strict";

  if (window.fontObfuscation?.__runtimeInstalled) {
    window.fontObfuscation.rehook();
    return;
  }

  let mappings = {};
  let reverseMappings = {};
  let initialized = false;
  let mappingsLoaded = false;
  let bootPromise = null;
  let currentObserver = null;
  let globalObfuscationEnabled = true;
  let defaultFontType = "roboto";
  if (typeof window !== "undefined" && window.FONT_OBFUSCATION_CONFIG) {
    const config = window.FONT_OBFUSCATION_CONFIG;
    globalObfuscationEnabled = config.enabled !== false;
    defaultFontType = "roboto";
  }

  const obfuscationConfig = {
    excludeSelectors: [
      "script",
      "style",
      "meta",
      "title",
      "link",
      "[data-no-obfuscate]",
      ".no-obfuscate",
      "code",
      "pre",
      "[data-lucide]",
      ".lucide",
      ".lucide-icon",
      "svg[data-lucide]",
      "select",
      "option",
      "select *",
      "option *",
    ],
    forceObfuscateSelectors: [
      ".obfuscated",
      ".ob-p",
      "[data-obfuscate]",
      ".tab-title",
      ".menu-text",
      ".ui-text",
    ],
    inputElements: ["input", "textarea"],
  };

  async function initMappings() {
    if (mappingsLoaded) return true;
    try {
      var _base = self.__ddxBase || new URL("./", document.baseURI).href;
      const [robotoResponse, robotoRevResponse] = await Promise.all([
        fetch(_base + "roboto-obf-mappings.json"),
        fetch(_base + "roboto-obf-reverse-mappings.json"),
      ]);
      if (robotoResponse.ok === false || robotoRevResponse.ok === false) {
        return false;
      }

      const [robotoMap, robotoRev] = await Promise.all([
        robotoResponse.json(),
        robotoRevResponse.json(),
      ]);
      if (
        !robotoMap ||
        typeof robotoMap !== "object" ||
        Array.isArray(robotoMap) ||
        Object.keys(robotoMap).length === 0 ||
        !robotoRev ||
        typeof robotoRev !== "object" ||
        Array.isArray(robotoRev) ||
        Object.keys(robotoRev).length === 0
      ) {
        return false;
      }

      mappings = { roboto: robotoMap };
      reverseMappings = { roboto: robotoRev };
      mappingsLoaded = true;
      setupClipboardInterceptor();
      return true;
    } catch (e) {
      mappingsLoaded = false;
      return false;
    }
  }

  // Turn obfuscation ON. Must run only AFTER the obf font has loaded — until
  // then `initialized` stays false so the hooks leave text as-is (real,
  // readable) instead of encoding it to CJK that would render in a fallback
  // font (the "Chinese on first load" flash). Once enabled, processExistingDOM
  // encodes the current DOM and adds `font-obfuscation-ready`.
  function enableObfuscation() {
    if (initialized) return;
    initialized = true;
    processExistingDOM();
  }

  function encode(text, fontType = defaultFontType) {
    if (!initialized) return text;
    const mapping = reverseMappings[fontType];
    if (!mapping) return text;
    return text
      .split("")
      .map((char) => mapping[char] || char)
      .join("");
  }

  function decode(text, fontType = defaultFontType) {
    if (!initialized) return text;
    const mapping = mappings[fontType];
    if (!mapping) return text;
    return text
      .split("")
      .map((char) => mapping[char] || char)
      .join("");
  }

  function detectFontType(element) {
    return "roboto";
  }

  function shouldObfuscate(element) {
    if (!element || !initialized) return false;

    for (const selector of obfuscationConfig.forceObfuscateSelectors) {
      try {
        if (element.matches && element.matches(selector)) return true;
      } catch (e) {}
    }

    if (!globalObfuscationEnabled) return false;

    for (const selector of obfuscationConfig.excludeSelectors) {
      try {
        if (element.matches && element.matches(selector)) return false;
        if (element.closest && element.closest(selector)) return false;
      } catch (e) {}
    }

    for (const selector of obfuscationConfig.inputElements) {
      try {
        if (element.matches && element.matches(selector)) {
          return true;
        }
      } catch (e) {}
    }

    if (element.hasAttribute && element.hasAttribute("data-lucide")) {
      return false;
    }

    if (
      element.closest &&
      element.closest(".no-obfuscate, [data-no-obfuscate]")
    ) {
      return false;
    }

    return true;
  }

  function processText(element, text) {
    if (!shouldObfuscate(element)) return text;
    const fontType = detectFontType(element);
    return encode(text, fontType);
  }

  function applyObfuscatedFont(element) {
    if (!element || !shouldObfuscate(element)) return;

    const isInputElement = obfuscationConfig.inputElements.some((selector) => {
      try {
        return element.matches && element.matches(selector);
      } catch (e) {
        return false;
      }
    });

    if (isInputElement) {
      return;
    }

    const fontType = detectFontType(element);

    if (
      !element.classList.contains("ob-p") &&
      !element.classList.contains("obfuscated")
    ) {
      element.classList.add("ob-p");
    }

    element.style.fontFamily = "'roboto-obf', sans-serif";
    element.style.fontVariantLigatures = "none";
  }

  const originalTextContent = Object.getOwnPropertyDescriptor(
    Node.prototype,
    "textContent",
  );
  const originalInnerText = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "innerText",
  );
  const originalInnerHTML = Object.getOwnPropertyDescriptor(
    Element.prototype,
    "innerHTML",
  );
  const originalCreateTextNode = Document.prototype.createTextNode;
  const originalAppendChild = Node.prototype.appendChild;
  const originalInsertBefore = Node.prototype.insertBefore;
  const originalReplaceChild = Node.prototype.replaceChild;
  const originalSetAttribute = Element.prototype.setAttribute;

  if (originalTextContent && originalTextContent.set) {
    Object.defineProperty(Node.prototype, "textContent", {
      get: originalTextContent.get,
      set: function (value) {
        if (typeof value === "string" && this.nodeType === 1) {
          const processed = processText(this, value);
          applyObfuscatedFont(this);
          originalTextContent.set.call(this, processed);
        } else {
          originalTextContent.set.call(this, value);
        }
      },
      configurable: true,
      enumerable: true,
    });
  }

  if (originalInnerText && originalInnerText.set) {
    Object.defineProperty(HTMLElement.prototype, "innerText", {
      get: originalInnerText.get,
      set: function (value) {
        if (typeof value === "string") {
          const processed = processText(this, value);
          applyObfuscatedFont(this);
          originalInnerText.set.call(this, processed);
        } else {
          originalInnerText.set.call(this, value);
        }
      },
      configurable: true,
      enumerable: true,
    });
  }

  if (originalInnerHTML && originalInnerHTML.set) {
    Object.defineProperty(Element.prototype, "innerHTML", {
      get: originalInnerHTML.get,
      set: function (value) {
        originalInnerHTML.set.call(this, value);
        setTimeout(() => processElementTree(this), 0);
      },
      configurable: true,
      enumerable: true,
    });
  }

  const originalCreateElement = Document.prototype.createElement;
  Document.prototype.createElement = function (tagName, options) {
    const element = originalCreateElement.call(this, tagName, options);
    setTimeout(() => {
      if (element.textContent || element.innerText) {
        processElementTree(element);
      }
    }, 0);
    return element;
  };

  Node.prototype.appendChild = function (child) {
    const result = originalAppendChild.call(this, child);

    if (child && child.nodeType === 1) {
      processElementTree(child);
      setTimeout(() => processElementTree(child), 0);
    } else if (
      child &&
      child.nodeType === 3 &&
      typeof child.textContent === "string"
    ) {
      if (shouldObfuscate(this)) {
        child.textContent = encode(child.textContent, detectFontType(this));
        applyObfuscatedFont(this);
      }
    }

    return result;
  };

  Node.prototype.insertBefore = function (newNode, referenceNode) {
    const result = originalInsertBefore.call(this, newNode, referenceNode);

    if (newNode && newNode.nodeType === 1) {
      processElementTree(newNode);
      setTimeout(() => processElementTree(newNode), 0);
    } else if (
      newNode &&
      newNode.nodeType === 3 &&
      typeof newNode.textContent === "string"
    ) {
      if (shouldObfuscate(this)) {
        newNode.textContent = encode(newNode.textContent, detectFontType(this));
        applyObfuscatedFont(this);
      }
    }

    return result;
  };

  function shouldObfuscateAttribute(element, attributeName) {
    if (attributeName === "placeholder") {
      return window.FONT_OBFUSCATION_CONFIG?.obfuscatePlaceholders !== false;
    }

    return shouldObfuscate(element);
  }

  Element.prototype.setAttribute = function (name, value) {
    if (
      typeof value === "string" &&
      (name === "title" || name === "placeholder" || name === "alt")
    ) {
      if (shouldObfuscateAttribute(this, name)) {
        value = processText(this, value);
      }
    }
    return originalSetAttribute.call(this, name, value);
  };

  function processElementTree(element) {
    if (!element || element.nodeType !== 1) return;

    if (shouldObfuscate(element)) {
      applyObfuscatedFont(element);

      if (
        element.children.length === 0 &&
        element.textContent &&
        element.textContent.trim()
      ) {
        const currentText = element.textContent;
        const encodedText = encode(currentText, detectFontType(element));
        if (encodedText !== currentText) {
          element.textContent = encodedText;
        }
      }

      ["title", "placeholder", "alt"].forEach((attr) => {
        const value = element.getAttribute(attr);
        if (value && value.trim()) {
          if (shouldObfuscateAttribute(element, attr)) {
            const encodedValue = encode(value, detectFontType(element));
            if (encodedValue !== value) {
              originalSetAttribute.call(element, attr, encodedValue);
            }
          }
        }
      });
    }

    for (let child of element.children) {
      processElementTree(child);
    }
  }

  function prepareBody(body) {
    if (!initialized || !body) return;
    processElementTree(body);
    body.classList.add("font-obfuscation-ready");
  }

  function processExistingDOM() {
    if (!initialized) return;
    prepareBody(document.body || document.documentElement);
    setupMutationObserver();
  }

  async function rehook() {
    if (initialized) {
      processExistingDOM();
      return true;
    }
    return boot();
  }

  function setupMutationObserver() {
    if (typeof MutationObserver === "undefined") return;

    // Disconnect any observer bound to a previous (now-detached) body — after
    // an Astro view-transition swap the old body is replaced.
    if (currentObserver) {
      try { currentObserver.disconnect(); } catch (e) {}
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (shouldObfuscate(node)) {
              processElementTree(node);
            }
          }
        });

        if (
          mutation.type === "characterData" &&
          mutation.target.parentElement
        ) {
          const parent = mutation.target.parentElement;
          if (shouldObfuscate(parent)) {
            applyObfuscatedFont(parent);
          }
        }
      });
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    currentObserver = observer;
  }

  function setupClipboardInterceptor() {
    document.addEventListener("copy", (e) => {
      if (!initialized) return;

      try {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const selectedText = selection.toString();

        const hasCJK = /[\u3400-\u4DBF\u4E00-\u9FFF]/.test(selectedText);

        if (hasCJK) {
          const deobfuscated = decode(selectedText, defaultFontType);

          e.preventDefault();

          if (e.clipboardData) {
            e.clipboardData.setData("text/plain", deobfuscated);
          }
        }
      } catch (error) {}
    });

    const originalWriteText = navigator.clipboard?.writeText;
    if (originalWriteText) {
      navigator.clipboard.writeText = async function (text) {
        if (!initialized) {
          return originalWriteText.call(this, text);
        }

        const hasCJK = /[\u3400-\u4DBF\u4E00-\u9FFF]/.test(text);

        if (hasCJK) {
          const deobfuscated = decode(text, defaultFontType);
          return originalWriteText.call(this, deobfuscated);
        }

        return originalWriteText.call(this, text);
      };
    }
  }

  window.fontObfuscation = {
    __runtimeInstalled: true,
    encode,
    decode,
    processElement: processElementTree,
    processExistingDOM,
    rehook,
    isInitialized: () => initialized,
    setGlobalObfuscation: (enabled) => {
      globalObfuscationEnabled = enabled;
      if (enabled) processExistingDOM();
    },
    setDefaultFont: (fontType) => {
      defaultFontType = fontType;
    },
    config: obfuscationConfig,
    setupClipboardInterceptor,
  };

  async function waitForFontsToLoad() {
    if (!("fonts" in document)) return false;
    try {
      const fontFaces = await document.fonts.load("16px 'roboto-obf'");
      const loaded = Array.from(fontFaces).some(
        (fontFace) => fontFace?.status === "loaded",
      );
      return loaded && document.fonts.check("16px 'roboto-obf'");
    } catch (e) {
      return false;
    }
  }

  // Boot: load mappings + wait for the obf font, THEN enable obfuscation.
  // Text renders real (readable) until the font is ready, then flips to
  // obfuscated — no fallback-CJK flash on first load.
  async function boot() {
    if (bootPromise) return bootPromise;
    const currentBoot = (async () => {
      if (!(await initMappings())) return false;
      if (await waitForFontsToLoad()) enableObfuscation();
      return initialized;
    })();
    bootPromise = currentBoot;
    try {
      return await currentBoot;
    } finally {
      if (bootPromise === currentBoot) bootPromise = null;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (initialized) processExistingDOM();
      else rehook();
    }, 300);
  });

  // Astro ClientRouter (view transitions) swaps the <body> on client-side
  // navigation without a full reload, which drops the `font-obfuscation-ready`
  // class and leaves the MutationObserver bound to the detached old body — so
  // the new page's text renders unobfuscated (or, mid-swap, as fallback CJK).
  // Re-apply on every swap. The font is already loaded by now, so this is
  // instant and paints obfuscated on the first frame of the new page.
  //
  // - before-swap: tag the INCOMING body so the ready class is present the
  //   moment it's inserted (no fallback flash during the swap).
  // - after-swap / page-load: re-encode the DOM and re-attach the observer.
  document.addEventListener("astro:before-swap", (event) => {
    if (initialized && event.newDocument?.body)
      prepareBody(event.newDocument.body);
  });
  document.addEventListener("astro:after-swap", () => {
    if (initialized) setupMutationObserver();
  });
  document.addEventListener("astro:page-load", () => {
    if (initialized) processExistingDOM();
    else rehook();
  });
}

export function runtime() {
  return `(${fontObfuscationRuntime.toString()})();`;
}
