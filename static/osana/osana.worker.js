/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
__webpack_require__.r(__webpack_exports__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
importScripts(`../osana/osana.bundle.js`);
importScripts(`../osana/osana.config.js`);
self.OsanaServiceWorker = class OsanaServiceWorker {
    constructor() {
        this.config = self.__osana$config;
        this.bundle = self.__osana$bundle;
        this.bareClient = new this.bundle.BareClient(this.config.bare);
    }
    fetch(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.config.codec.decode(new URL(event.request.url).pathname.replace(this.config.prefix, "")) + new URL(event.request.url).search;
            if (!/^https?:\/\//.test(url)) {
                return fetch(event.request.url);
            }
            const requestURL = new URL(url);
            const requestHeaders = this.bundle.rewrite.headers.request(Object.fromEntries(event.request.headers.entries()), requestURL);
            if (this.config.blacklist && this.config.blacklist.some(regex => regex.test(requestURL.host))) {
                return new BlackListedResponse();
            }
            const bareRequestData = {
                method: event.request.method,
                headers: requestHeaders
            };
            if (!["GET", "HEAD"].includes(event.request.method))
                bareRequestData.body = yield event.request.blob();
            const response = yield this.bareClient.fetch(requestURL, bareRequestData);
            let responseStatus = response.rawResponse.status;
            const responseHeaders = this.bundle.rewrite.headers.response(response.rawHeaders, requestURL);
            let responseData = "";
            if (/text\/html/.test(responseHeaders["Content-Type"])) {
                responseData =
                    `<head>` +
                        `<script src="${this.config.files.bundle}?1"></script>` +
                        `<script src="${this.config.files.config}?1"></script>` +
                        `<script src="${this.config.files.client}?1"></script>` +
                        `<link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBkZAAAAAoAAx9k7/gAAAAASUVORK5CYIIA">` +
                        `<link rel="icon" href="${requestURL.origin}/favicon.ico">` +
                        `${(responseStatus === 301 && responseHeaders["location"]) ? `<meta http-equiv="refresh" content="0; url=${this.bundle.rewrite.url(responseHeaders["location"])}">` : ""}` +
                        `</head>`;
                responseData += this.bundle.rewrite.html(yield response.text(), (requestURL.origin + requestURL.pathname));
            }
            else if (/text\/css/.test(responseHeaders["Content-Type"]) || event.request.destination === "style") {
                responseData = this.bundle.rewrite.css(yield response.text(), (requestURL.origin + requestURL.pathname));
            }
            else if (/application\/javascript/.test(responseHeaders["Content-Type"]) || event.request.destination === "script") {
                responseData = this.bundle.rewrite.js(yield response.text());
            }
            else {
                responseData = yield response.arrayBuffer();
            }
            return new Response(responseData, {
                status: response.rawResponse.status,
                statusText: response.rawResponse.statusText,
                headers: responseHeaders
            });
        });
    }
};
class BlackListedResponse extends Response {
    constructor() {
        super("Forbidden", {
            status: 403,
            statusText: "Forbidden",
            headers: {
                "Content-Type": "text/plain"
            }
        });
    }
}


/******/ })()
;
//# sourceMappingURL=osana.worker.js.map