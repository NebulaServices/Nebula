const config = {

}

const encryptWithAES = (text) => {
    const passphrase = '123';
    return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (ciphertext) => {
    const passphrase = '123';
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

class Cyclone {
    constructor() {
        this.tmp = (location.pathname.split('/service/')[1]);

        this.tmp = this.tmp.substring(0, this.tmp.length);
        this.tmp = this.tmp.replace("http://", '')
        this.tmp = this.tmp.replace("https://", '')
        this.tmp = this.tmp.replace("http:/", '')
        this.tmp = this.tmp.replace("https:/", '')
        this.tmp = location.protocol + "//" + this.tmp

        document._location = new URL(this.tmp);
        var l = new URL(this.tmp);

        this.url = new URL(document._location.href);

        this.prefix = (location.pathname).split('/')[1];
        this.bareEndpoint = location.host + "/" + this.prefix;

        if (this.url.pathname == "/") {
            this.paths = ['/']
        } else {
            this.paths = this.url.pathname.split('/')
        }
        this.host = 'https://' + this.url.host

        this.targetAttrs = ['href', 'src', 'action', 'srcdoc', 'srcset'];

        if (!document.cycloneInjected) {
            console.log("Cyclone Injected with paths of:", this.paths, this.url.pathname)
            document.cycloneInjected = true
        }

        const LocationHandler = {
            get(target, prop, reciver) {
                return document._location[prop]
            },
            set(target, prop, val) {
                return false
            }
        }

        //const locProxy = new Proxy(document.location, LocationHandler)
        Object.defineProperty(document, '_location', {
            writable: true,
            configurable: true,
            enumerable: true,
            value: l
        });
        Object.defineProperty(window.document, '_location', {
            writable: true,
            configurable: true,
            enumerable: true,
            value: l
        });
        Object.defineProperty(window, '_location', {
            writable: true,
            configurable: true,
            enumerable: true,
            value: l
        });
    }

    rewriteUrl(link) {
        if (!link) {
            link = "";
        }

        var rewritten;

        if (link.startsWith('https://') || link.startsWith('http://') || link.startsWith('//')) {
            if (link.startsWith('//')) {
                rewritten = 'https:' + link;
            } else {
                rewritten = link;
            };
        } else {
            if (link.startsWith('.')) {
                let offset = 1;
                if (link.startsWith('..')) {
                    offset = 2;
                }
                let file = link.substr(link.indexOf('.') + 1 + offset, link.length)

                rewritten = this.url.hostname + file
            } else {
                if (link.startsWith('/')) {
                    rewritten = this.host + link
                } else {
                    rewritten = this.host + '/' + link;
                }
            }
        }

        var exceptions = ['about:', 'mailto:', 'javascript:', 'data:']
        let needstowrite = true;
        for (let i = 0; i < exceptions.length; i++) {
            if (link.startsWith(exceptions[i])) {
                needstowrite = false
            }
        }


        if (needstowrite) {
            rewritten = location.protocol + '//' + this.bareEndpoint + '/' + rewritten
            return (rewritten);
        } else {
            return link;
        }
    }

    rewriteSrcset(sample) {
        return sample.split(',').map(e => {
            return (e.split(' ').map(a => {
                if (a.startsWith('http') || (a.startsWith('/') && !a.startsWith(this.prefix))) {
                    var url = this.rewriteUrl(url);
                }
                return a.replace(a, (url || a))
            }).join(' '))
        }).join(',')
    }
}

// Rewriting of data types

// CSS
class CSSRewriter extends Cyclone {
    rewriteCSS(tag) {
        var styles = window.getComputedStyle(tag)
        var _values = styles['_values']

        var prop = styles.getPropertyValue('background-image')
        var name = "background-image"

        if (prop == "") {
            if (!styles.getPropertyValue('background') == "") {
                prop = styles.getPropertyValue('background')
                name = "background"
            } else {
                name = "";
                prop = "";
            }
        }

        if (prop.includes("url(")) {
            var start = prop.indexOf('url(') + 4
            var end = prop.indexOf(')') - 4

            var url = prop.substring(start, end).toString('ascii');

            if (url.startsWith(location.origin)) {
                url = url.split(location.origin)
            } else {
                url = url.slice(url.indexOf(location.origin));
            }

            url = this.rewriteUrl(url)
            tag.style[name] = url
        }
    }
}

// JS

class JavaScriptRewriter extends Cyclone {
    constructor(proxy) {
        super();
        //Proxied methods
        this.setAttrCy = HTMLElement.prototype.setAttribute;
        this.getAttrCy = HTMLElement.prototype.getAttribute;
        this.proxy = proxy
    }

    rewriteJavascript(js) {
        var javascript = js.replace(/window\.location/g, 'document._location')
        javascript = javascript.replace(/document\.location/g, 'document._location')
        return javascript
    }

    setAttribute(attr, value, mode) {
        const setAttrCy = HTMLElement.prototype.setAttribute;

        if (mode) {
            this.setAttrCy.call(this, attr, value);
        } else {
            var url = attr
            if (cyclone.targetAttrs.includes(attr)) {
                url = cyclone.rewriteUrl(url);
            }

            setAttrCy.call(this, attr, value);
        }
    }

    getAttribute(attrN, mode) {
        const getAttrCy = HTMLElement.prototype.getAttribute;

        if (mode) {
            return getAttrCy.call(this, attrN);
        } else {
            var val = getAttrCy.call(this, attrN);
            if (cyclone.targetAttrs.includes(attrN)) {
                val = getAttrCy.call(this, 'data-origin-' + attrN);
            }

            return val;
        }
    }
}

// HTML
class HTMLRewriter extends Cyclone {
    rewriteElement(element) {
        var targetAttrs = this.targetAttrs;
        var attrs;
        try {
            attrs = [...element.attributes || {}].reduce((attrs, attribute) => {
                attrs[attribute.name] = attribute.value;
                return attrs;
            }, {});
        } catch {
            attrs = {};
        }

        if (element.__proto__.getAttribute) {
            var jsWrite = new JavaScriptRewriter();
            var elementAttributes = [];

            for (var i = 0; i < targetAttrs.length; i++) {
                var attr = targetAttrs[i]
                var attrName = Object.keys(attrs)[i];
                var data = {
                    name: attr,
                    value: element.getAttribute('data-origin-' + attr, 'cyclone') || element.getAttribute(attr, 'cyclone')
                }

                if (data.value) {
                    elementAttributes.push(data);
                }

                if (element.nonce) {
                    element.setAttribute('nononce', element.nonce, '')
                    element.removeAttribute('nonce')
                }
                if (element.integrity) {
                    element.setAttribute('nointegrity', element.integrity, '')
                    element.removeAttribute('integrity')
                }

                if (element.tagName == "script") {
                    if (!element.getAttribute('src')) {
                        var jsRewrite = new JavaScriptRewriter();
                        element.innerHTML = jsRewrite.rewriteJavascript(element.innerHTML)
                    }
                }

                // Css
                var cssRewrite = new CSSRewriter();
                cssRewrite.rewriteCSS(element)
            }

            for (var i = 0; i < elementAttributes.length; i++) {
                var attr = elementAttributes[i];
                var attrName = attr.name;
                var value = attr.value;

                var bareValue = this.rewriteUrl(value);
                if (attrName == "srcset" || attrName == 'srcset') {
                    bareValue = this.rewriteSrcset(value);
                }

                element.setAttribute(attrName, bareValue);
                element.setAttribute("data-origin-" + attrName, value);
            }
        }
    }

    rewriteDocument() {
        var docElements = document.querySelectorAll('*');
        for (var i = 0; i < docElements.length; i++) {
            var element = docElements[i];

            this.rewriteElement(element)
        }
    }

    rewriteiFrame(iframe) {
        var frameDoc = (iframe.contentWindow || iframe.contentDocument || iframe.document);

        let tags = frameDoc.querySelectorAll('*')

        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i]
            this.rewriteElement(tag)
        }
    }

    rewriteDocObject(docObj) {
        var docElements = docObj.querySelectorAll('*');
        for (var i = 0; i < docElements.length; i++) {
            var element = docElements[i];

            this.rewriteElement(element)
        }
    }
}

const cyclone = new Cyclone();

const htmlRewriter = new HTMLRewriter();

const FetchIntercept = window.fetch;
window.fetch = async(...args) => {
    let [resource, config] = args;
    resource = cyclone.rewriteUrl(resource);

    const response = await FetchIntercept(resource, config);
    return response;
}

const MessageIntercept = window.postMessage;
const messageInterceptionFunc = (...args) => {
    let [message, target, config] = args;
    target = cyclone.rewriteUrl(target);

    const response = MessageIntercept(message, target, config);
    console.log(response);
    return response;
}

Object.defineProperty(window, 'postMessage', {
    writable: false,
    value: messageInterceptionFunc
})

var CWOriginal = Object.getOwnPropertyDescriptor(window.HTMLIFrameElement.prototype, 'contentWindow')

Object.defineProperty(window.HTMLIFrameElement.prototype, 'contentWindow', {
    get() {
        var iWindow = CWOriginal.get.call(this);
        htmlRewriter.rewriteiFrame(iWindow);

        return iWindow
    },
    set() {
        return false;
    }
})


const open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    url = cyclone.rewriteUrl(url)

    return open.call(this, method, url, ...rest);
};

var oPush = window.history.pushState;
var oPlace = window.history.replaceState;

function CycloneStates(dat, unused, url) {
    var cyUrl = cyclone.rewriteUrl(url);

    oPush.call(this, dat, unused, cyUrl);
}

window.history.pushState = CycloneStates
window.history.replaceState = CycloneStates
history.pushState = CycloneStates
history.replaceState = CycloneStates

const OriginalWebsocket = window.WebSocket
const ProxiedWebSocket = function() {
    const ws = new OriginalWebsocket(...arguments)

    const originalAddEventListener = ws.addEventListener
    const proxiedAddEventListener = function() {
        if (arguments[0] === "message") {
            const cb = arguments[1]
            arguments[1] = function() {
                var origin = arguments[0].origin
                arguments[0].origin = cyclone.rewriteUrl(origin);

                return cb.apply(this, arguments)
            }
        }
        return originalAddEventListener.apply(this, arguments)
    }
    ws.addEventListener = proxiedAddEventListener

    Object.defineProperty(ws, "onmessage", {
        set(func) {
            return proxiedAddEventListener.apply(this, [
                "message",
                func,
                false
            ]);
        }
    });
    return ws;
};

window.WebSocket = ProxiedWebSocket;

// Request
var requestProxyHandler = {
    get(target, prop, receiver) {
        console.log(target);
        if (prop == "url") {
            return 'the j';
        }

        return Reflect.get(...arguments);
    }
}

Request.prototype = new Proxy(Request.prototype, requestProxyHandler);
Request.__proto__ = new Proxy(Request.__proto__, requestProxyHandler);

const nwtb = window.open

function openNewTab(url, target, features) {
    url = cyclone.rewriteUrl(url)
    nwtb(url, target, features)
}

window.open = openNewTab;

window.onload = function() {
    for (var i = 0; i < 50; i++) {
        setTimeout(() => {
            htmlRewriter.rewriteDocument();
        }, 500)
    }
}

let mutationE = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
        mutation.addedNodes.forEach(node => {
            htmlRewriter.rewriteElement(node);
        });
    }
}).observe(document, {
    childList: true,
    subtree: true
})

//For intercepting all requests
if (!document.serviceWorkerRegistered) {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register(location.origin + '/cySw.js').then(function(registration) {
                console.log('Service worker registered with scope: ', registration.scope);
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
    document.serviceWorkerRegistered = true
}