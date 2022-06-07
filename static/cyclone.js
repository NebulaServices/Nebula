class Cyclone {
    constructor() {
      this.tmp = location.pathname.split('/service')[1]
  
      this.tmp = this.tmp.substring(1, this.tmp.length);
      let re = /(http(s|):)/g
  
      //if (this.tmp.match(re)) {
      this.tmp = this.tmp.replace("http://", '')
      this.tmp = this.tmp.replace("https://", '')
      this.tmp = this.tmp.replace("http:/", '')
      this.tmp = this.tmp.replace("https:/", '')
      this.tmp = location.protocol + "//" + this.tmp
  
      document._location = new URL(this.tmp);
  
      this.url = new URL(document._location.href);
  
      this.bareEndpoint = location.host + "/service";
  
      if (this.url.pathname == "/") {
        this.paths = ['/']
      } else {
        this.paths = this.url.pathname.split('/')
      }
      this.host = 'https://' + this.url.host
  
      this.targetAttrs = ['href', 'src', 'action', 'srcdoc', 'srcset'];
  
      console.log("Cyclone Injected with paths of:", this.paths, this.url.pathname)
  
      /*const LocationHandler = {
        get(target, prop, reciver) {
          return loc[prop]
        },
        set(target, prop, val) {
          return 'hi'
        }
      }
      document._location = new Proxy(LocationHandler, loc)*/
    }
  
    rewriteUrl(link) {
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
        return rewritten;
      } else {
        return link;
      }
    }
  
    rewriteSrcset(sample) {
      return sample.split(',').map(e => {
        return (e.split(' ').map(a => {
          if (a.startsWith('http') || (a.startsWith('/') && !a.startsWith(this.prefix))) {
            var url = this.rewriteUrl(a)
          }
          return a.replace(a, (url || a))
        }).join(' '))
      }).join(',')
    }
  }
  
  function rewriteJavascript(js) {
    var javascript = js.replace('window.location', 'document._dlocation')
    javascript = javascript.replace('document.location', 'document._dlocation')
    javascript = javascript.replace('location.', 'document._location.')
    return javascript
  }
  
  class HTMLRewriter extends Cyclone {
    rewriteElement(element) {
      var targetAttrs = this.targetAttrs;
      const attrs = [...element.attributes].reduce((attrs, attribute) => {
        attrs[attribute.name] = attribute.value;
        return attrs;
      }, {});
  
      var elementAttributes = [];
  
      for (var i = 0; i < targetAttrs.length; i++) {
        var attr = targetAttrs[i]
        var attrName = Object.keys(attrs)[i];
        var data = {
          name: attr,
          value: element.getAttribute('data-origin-' + attr) || element.getAttribute(attr)
        }
        if (data.value) {
          elementAttributes.push(data);
        }
  
        if (element.nonce) {
          element.setAttribute('nononce', element.nonce)
          element.removeAttribute('nonce')
        }
        if (element.integrity) {
          element.setAttribute('nointegrity', element.integrity)
          element.removeAttribute('integrity')
        }
  
        if (element.tagName == "script") {
          element.innerHTML = rewriteJavascript(element.innerHTML);
        }
      }
  
      for (var i = 0; i < elementAttributes.length; i++) {
        var attr = elementAttributes[i]
        var attrName = attr.name;
        var value = attr.value;
  
        var bareValue = this.rewriteUrl(value);
        if (attrName == "srcset") {
          this.rewriteSrcset(value);
        }
  
        element.setAttribute(attrName, bareValue);
        element.setAttribute("data-origin-" + attrName, value);
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
  }
  
  
  const cyclone = new Cyclone();
  
  const htmlRewriter = new HTMLRewriter();
  
  const FetchIntercept = window.fetch;
  window.fetch = async (...args) => {
    let [resource, config] = args;
    resource = cyclone.rewriteUrl(resource);
  
    const response = await FetchIntercept(resource, config);
    return response;
  }
  
  const MessageIntercept = window.postMessage;
  
  window.postMessage = (...args) => {
    let [message, target, config] = args;
    target = cyclone.rewriteUrl(target);
  
    const response = MessageIntercept(message, target, config);
    return response;
  }
  
  var CWOriginal = Object.getOwnPropertyDescriptor(window.HTMLIFrameElement.prototype, 'contentWindow')
  
  Object.defineProperty(window.HTMLIFrameElement.prototype, 'contentWindow', {
    get() {
      var iWindow = CWOriginal.get.call(this)
      cyclone.rewriteiFrame(iWindow)
  
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
  
  function CycloneStates(obj, title, path) {
    if (path.startsWith('/service/')) {
      return;
    } else {
      var url = cyclone.rewriteUrl(path)
  
      oPush.apply(this, [obj, title, url])
    }
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
  
  const nwtb = window.open
  function openNewTab(url, target, features) {
    url = cyclone.rewriteUrl(url)
    nwtb(url, target, features)
  }
  window.open = openNewTab
 /* 
  setInterval(function() {
    htmlRewriter.rewriteDocument();
  }, 10000)
  */
  htmlRewriter.rewriteDocument();

 let mutationE = new MutationObserver((mutationList,observer) => {
     for (const mutation of mutationList) {
        mutation.addedNodes.forEach(node => htmlRewriter.rewriteElement(node));
        htmlRewriter.rewriteElement(mutation.target);
     }
 }).observe(document,{
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