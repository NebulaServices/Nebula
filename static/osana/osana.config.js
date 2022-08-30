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
self.__osana$config = {
    bare: `${location.origin}/bare/`,
    prefix: "/service/~osana/",
    codec: self.__osana$bundle.codecs.none,
    files: {
        config: "/osana/osana.config.js",
        client: "/osana/osana.client.js",
        bundle: "/osana/osana.bundle.js",
        worker: "/osana/osana.worker.js"
    },
    blacklist: [
        /^(www\.)?netflix\.com/,
        /^accounts\.google\.com/,
    ]
};


/******/ })()
;
//# sourceMappingURL=osana.config.js.map
