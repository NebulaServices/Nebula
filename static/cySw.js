class Cyclone {
    constructor() {
        tmp = location.pathname.split('/service')[1]

        tmp = tmp.substring(1, tmp.length);
        let re = /(http(s|):)/g

        //if (tmp.match(re)) {
        tmp = tmp.replace("http://", '')
        tmp = tmp.replace("https://", '')
        tmp = tmp.replace("http:/", '')
        tmp = tmp.replace("https:/", '')
        tmp = location.protocol + "//" + tmp

        document._location = new URL(tmp);

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

self.addEventListener('fetch', function(event) {
    var uri = new URL(event.request.url);

    if (!uri.pathname.startsWith('/service') && uri.pathname == "/facicon.ico") {
        var tmp = uri.href;

        event.respondWith(
            fetch("https://Cyclone2.jimmynuetron.repl.co/service/" + tmp)
        )
    }
});