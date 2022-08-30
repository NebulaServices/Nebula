/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (() => {

const rewriteURL = self.__osana$bundle.rewrite.url;
const rewriteCSS = self.__osana$bundle.rewrite.css;
const rewriteJS = self.__osana$bundle.rewrite.js;
const rewriteHTML = self.__osana$bundle.rewrite.html;
const rewriteSrcset = self.__osana$bundle.rewrite.srcset;
const attributes = {
    "href": [HTMLAnchorElement, HTMLLinkElement, HTMLAreaElement, HTMLBaseElement],
    "src": [HTMLAudioElement, HTMLEmbedElement, HTMLIFrameElement, HTMLImageElement, HTMLInputElement, HTMLScriptElement, HTMLSourceElement, HTMLTrackElement, HTMLVideoElement],
    "srcset": [HTMLImageElement, HTMLSourceElement],
    "action": [HTMLFormElement]
};
// Element.seAttribute
const setterApply = Object.getOwnPropertyDescriptor(Element.prototype, "setAttribute").value;
Element.prototype.setAttribute = function (name, value) {
    if (attributes[name]) {
        for (let i in attributes[name]) {
            if (this instanceof attributes[name][i]) {
                setterApply.apply(this, [name, rewriteURL(value)]);
                return;
            }
        }
    }
    if (name === undefined || value === undefined)
        throw new TypeError(`Failed to execute 'setAttribute' on 'Element': 2 arguments required, but only ${!name && !value ? 0 : 1} present.`);
    setterApply.apply(this, [name, value]);
};
// Element[attribute]
Object.keys(attributes).forEach((attribute) => {
    attributes[attribute].forEach((element) => {
        try {
            // URL based attributes
            if (["href", "src", "srcset", "action"].includes(attribute)) {
                const { set, get } = Object.getOwnPropertyDescriptor(element.prototype, attribute);
                Object.defineProperty(element.prototype, attribute, {
                    set(value) {
                        return set.call(this, [rewriteURL(value)]);
                    }
                });
            }
        }
        catch (_a) { }
    });
});
// Element.innerHTML
const { set } = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
Object.defineProperty(Element.prototype, "innerHTML", {
    set(value) {
        if (this instanceof HTMLScriptElement) {
            return set.call(this, rewriteJS(value));
        }
        else if (this instanceof HTMLStyleElement) {
            return set.call(this, rewriteCSS(value));
        }
        return set.call(this, rewriteHTML(value));
    }
});


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

function createStorageProxy(scope) {
    return new Proxy({
        getItem(key) {
            return scope.getItem(`${key}@${_location__WEBPACK_IMPORTED_MODULE_0__["default"].host}`);
        },
        setItem(key, value) {
            scope.setItem(`${key}@${_location__WEBPACK_IMPORTED_MODULE_0__["default"].host}`, value);
        },
        removeItem(key) {
            scope.removeItem(`${key}@${_location__WEBPACK_IMPORTED_MODULE_0__["default"].host}`);
        },
        clear() {
            Object.keys(scope).forEach((key) => {
                if (new RegExp(`@${_location__WEBPACK_IMPORTED_MODULE_0__["default"].host}$`).test(key)) {
                    this.removeItem(key.replace(new RegExp(`@${_location__WEBPACK_IMPORTED_MODULE_0__["default"].host}$`), ""));
                }
            });
        }
    }, {
        get(target, prop, receiver) {
            if (prop === "length") {
                return Object.keys(scope).filter((key) => new RegExp(`@${_location__WEBPACK_IMPORTED_MODULE_0__["default"].host}$`).test(key)).length;
            }
            else if (["getItem", "setItem", "removeItem", "clear"].includes(prop)) {
                return target[prop];
            }
            else {
                return target.getItem(prop);
            }
        },
        set(target, prop, value) {
            return target.setItem(prop, value);
        }
    });
}
const idbopen = indexedDB.open;
indexedDB.open = (name, version) => {
    return idbopen.call(indexedDB, `${name}@${_location__WEBPACK_IMPORTED_MODULE_0__["default"].host}`, version);
};
if (window.hasOwnProperty("openDatabase")) {
    const odb = openDatabase;
    openDatabase = (name, version, displayName, maxSize) => {
        return odb(`${name}@${_location__WEBPACK_IMPORTED_MODULE_0__["default"].host}`, version, displayName, maxSize);
    };
}
window.__localStorage = createStorageProxy(localStorage);
window.__sessionStorage = createStorageProxy(sessionStorage);


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocationProxy": () => (/* binding */ LocationProxy),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getLocation": () => (/* binding */ getLocation)
/* harmony export */ });
const config = self.__osana$config;
function getLocation(scope) {
    try {
        let fakeLocation = new URL(config.codec.decode(location.pathname.replace(new RegExp(`^${config.prefix}`), "")));
        if (scope) {
            fakeLocation.href = new URL(config.codec.decode(scope.location.pathname.replace(new RegExp(`^${config.prefix}`), "")));
        }
        fakeLocation.ancestorOrigins = { length: 0 };
        fakeLocation.assign = (url) => location.assign(config.prefix + config.codec.encode(url));
        fakeLocation.reload = () => location.reload();
        fakeLocation.replace = (url) => location.replace(config.prefix + config.codec.encode(url));
        fakeLocation.toString = () => fakeLocation.href;
        return fakeLocation;
    }
    catch (_a) {
        return {};
    }
}
window.Location = class {
};
class LocationProxy {
    constructor(scope) {
        return new Proxy(new Location(), {
            get(target, prop, receiver) {
                let fakeLocation = getLocation(scope);
                return fakeLocation[prop];
            },
            set(target, prop, value) {
                let fakeLocation = getLocation(scope);
                fakeLocation[prop] = value;
                location.pathname = config.prefix + config.codec.encode(fakeLocation.href);
                return fakeLocation[prop];
            }
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new LocationProxy());


/***/ }),
/* 6 */
/***/ (() => {

Object.defineProperty(navigator, "serviceWorker", {});


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MessageProxy)
/* harmony export */ });
/* harmony import */ var _window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);

class MessageProxy {
    constructor(scope) {
        return new Proxy(scope.addEventListener, {
            apply(target, thisArg, args) {
                if (args[0] && args[1]) {
                    if (args[0] === "message") {
                        args[1] = new Proxy(args[1], {
                            apply(target, thisArg, args) {
                                args[0] = new Proxy(args[0], {
                                    get(target, prop, receiver) {
                                        if (prop === "origin")
                                            return __location.origin;
                                        if (prop === "path")
                                            target[prop].map((win) => new _window__WEBPACK_IMPORTED_MODULE_0__.WindowProxy(win));
                                        if (prop === "currentTarget")
                                            return new _window__WEBPACK_IMPORTED_MODULE_0__.WindowProxy(target[prop]);
                                        if (prop === "source")
                                            return new _window__WEBPACK_IMPORTED_MODULE_0__.WindowProxy(target[prop]);
                                        if (prop === "srcElement")
                                            return new _window__WEBPACK_IMPORTED_MODULE_0__.WindowProxy(target[prop]);
                                        if (prop === "target")
                                            return new _window__WEBPACK_IMPORTED_MODULE_0__.WindowProxy(target[prop]);
                                        return target[prop];
                                    }
                                });
                                return Reflect.apply(target, thisArg, args);
                            }
                        });
                    }
                }
                return Reflect.apply(target, thisArg, args);
            }
        });
    }
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WindowProxy": () => (/* binding */ WindowProxy),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

class WindowProxy {
    constructor(scope) {
        return new Proxy(scope, {
            get(target, prop, receiver) {
                if (prop === "location") {
                    return new _location__WEBPACK_IMPORTED_MODULE_0__.LocationProxy(target);
                }
                else if (["parent", "top"].includes(prop)) {
                    if (window === window[prop])
                        return window.__window;
                    else
                        return new WindowProxy(target[prop]);
                }
                else if (["window", "self", "globalThis"].includes(prop)) {
                    return new WindowProxy(target);
                }
                else if (prop === "localStorage") {
                    return window.__localStorage;
                }
                else if (prop === "sessionStorage") {
                    return window.__sessionStorage;
                }
                return target[prop];
            },
            set(target, prop, value) {
                return Reflect.set(scope, prop, value);
            }
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new WindowProxy(window));


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const rewriteURL = self.__osana$bundle.rewrite.url;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Proxy(fetch, {
    apply(target, thisArg, args) {
        if (args[0])
            args[0] = rewriteURL(args[0]);
        return Reflect.apply(target, thisArg, args);
    }
}));


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pushState": () => (/* binding */ pushState),
/* harmony export */   "replaceState": () => (/* binding */ replaceState)
/* harmony export */ });
const rewriteURL = self.__osana$bundle.rewrite.url;
const config = self.__osana$config;
const pushState = new Proxy(window.history.pushState, {
    apply(target, thisArg, args) {
        if (new RegExp(`^${config.prefix}`).test(args[2]))
            return;
        args[2] = rewriteURL(args[2]);
        Reflect.apply(target, thisArg, args);
    }
});
const replaceState = new Proxy(window.history.replaceState, {
    apply(target, thisArg, args) {
        if (new RegExp(`^${config.prefix}`).test(args[2]))
            return;
        args[2] = rewriteURL(args[2]);
        Reflect.apply(target, thisArg, args);
    }
});



/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const rewriteURL = self.__osana$bundle.rewrite.url;
const XMLOpen = window.XMLHttpRequest.prototype.open;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(...args) {
    if (args[1])
        args[1] = rewriteURL(args[1]);
    return XMLOpen.call(this, ...args);
}
;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const rewriteURL = self.__osana$bundle.rewrite.url;
const config = self.__osana$config;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Proxy(Request, {
    construct(target, args) {
        if (args[0])
            args[0] = rewriteURL(args[0]);
        return new Proxy(Reflect.construct(target, args), {
            get(target, prop, receiver) {
                if (prop === "url") {
                    let fakeLocation = new URL(config.codec.decode(location.pathname.replace(new RegExp(`^${config.prefix}`), "")));
                    return fakeLocation.href;
                }
                return target[prop];
            }
        });
    }
}));


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const rewriteURL = self.__osana$bundle.rewrite.url;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Proxy(navigator.sendBeacon, {
    apply(target, thisArg, args) {
        if (args[0])
            args[0] = rewriteURL(args[0]);
        return Reflect.apply(target, thisArg, args);
    }
}));


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

const encodeProtocol = self.__osana$bundle.rewrite.protocol;
const v4 = self.__osana$bundle.uuid;
const config = self.__osana$config;
const websockets = new Map();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Proxy(WebSocket, {
    construct(target, args, newTarget) {
        if (args[0]) {
            const url = new URL(args[0]);
            const id = v4();
            websockets.set(id, url.toString());
            const request = {
                remote: {
                    host: url.hostname,
                    port: url.port || (url.protocol === "wss:" ? "443" : "80"),
                    path: url.pathname + url.search,
                    protocol: url.protocol
                },
                headers: {
                    Host: url.host,
                    Origin: _location__WEBPACK_IMPORTED_MODULE_0__["default"].origin,
                    Pragma: "no-cache",
                    "Cache-Control": "no-cache",
                    Upgrade: "websocket",
                    Connection: "Upgrade"
                },
                forward_headers: ["accept-encoding", "accept-language", "sec-websocket-extensions", "sec-websocket-key", "sec-websocket-version"]
            };
            const bareURL = new URL(config.bare);
            return Reflect.construct(target, [location.protocol.replace("http", "ws") + "//" + (bareURL.host + bareURL.pathname) + `v1/?${id}`, ["bare", encodeProtocol(JSON.stringify(request))]]);
        }
        return Reflect.construct(target, args, newTarget);
    }
}));
const websocketURL = Object.getOwnPropertyDescriptor(WebSocket.prototype, "url");
Object.defineProperty(WebSocket.prototype, "url", {
    get() {
        const url = websocketURL.get.call(this);
        const id = new URL(url).search.substring(1);
        return websockets.get(id);
    }
});


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const rewriteJS = self.__osana$bundle.rewrite.js;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Proxy(eval, {
    apply(target, thisArg, argumentsList) {
        if (argumentsList[0])
            argumentsList[0] = rewriteJS(argumentsList[0]);
        return Reflect.apply(target, thisArg, argumentsList);
    }
}));


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const rewriteURL = self.__osana$bundle.rewrite.url;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Proxy(window.Worker, {
    construct(target, args, newTarget) {
        if (args[0])
            args[0] = rewriteURL(args[0]);
        return Reflect.construct(target, args, newTarget);
    }
}));


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const rewriteURL = self.__osana$bundle.rewrite.url;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Proxy(window.open, {
    apply(target, thisArg, args) {
        if (args[0] && args[0] !== "about:blank")
            args[0] = rewriteURL(args[0]);
        Reflect.apply(target, thisArg, args);
    }
}));


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _navigator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _navigator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_navigator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _fetch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(10);
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5);
/* harmony import */ var _window__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8);
/* harmony import */ var _xmlhttp__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(11);
/* harmony import */ var _request__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(12);
/* harmony import */ var _beacon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(13);
/* harmony import */ var _websocket__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(14);
/* harmony import */ var _eval__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(15);
/* harmony import */ var _worker__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(16);
/* harmony import */ var _open__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(17);















window.fetch = _fetch__WEBPACK_IMPORTED_MODULE_4__["default"];
window.Request = _request__WEBPACK_IMPORTED_MODULE_9__["default"];
window.history.pushState = _history__WEBPACK_IMPORTED_MODULE_5__.pushState;
window.history.replaceState = _history__WEBPACK_IMPORTED_MODULE_5__.replaceState;
window.__parent = _window__WEBPACK_IMPORTED_MODULE_7__["default"].parent;
window.__top = _window__WEBPACK_IMPORTED_MODULE_7__["default"].top;
window.__window = _window__WEBPACK_IMPORTED_MODULE_7__["default"];
window.__location = _location__WEBPACK_IMPORTED_MODULE_6__["default"];
window.__self = _window__WEBPACK_IMPORTED_MODULE_7__["default"];
window.XMLHttpRequest.prototype.open = _xmlhttp__WEBPACK_IMPORTED_MODULE_8__["default"];
navigator.sendBeacon = _beacon__WEBPACK_IMPORTED_MODULE_10__["default"];
window.WebSocket = _websocket__WEBPACK_IMPORTED_MODULE_11__["default"];
window.eval = _eval__WEBPACK_IMPORTED_MODULE_12__["default"];
window.Worker = _worker__WEBPACK_IMPORTED_MODULE_13__["default"];
window.open = _open__WEBPACK_IMPORTED_MODULE_14__["default"];
window.addEventListener = new _message__WEBPACK_IMPORTED_MODULE_3__["default"](window);
window.Worker.prototype.addEventListener = new _message__WEBPACK_IMPORTED_MODULE_3__["default"](window.Worker.prototype);

})();

/******/ })()
;
//# sourceMappingURL=osana.client.js.map