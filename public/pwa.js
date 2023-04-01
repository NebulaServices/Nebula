let CACHE_NAME = 'V1';
let urlsToCache = [
    './',
    './options',
    './privacy',
    './login',
    './resources/nebulamain.js',
    './resources/options.js',
    './resources/v.js',
    './style/main.css',
    './style/options.css',
    './manifest.json',
    './images/logo.png',
    ];

self.addEventListener('install', function(event) {
// Perform install steps
// Perform install steps


    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
        return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});


self.addEventListener("activate", event => {
  // delete any unexpected caches
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => key !== CACHE_NAME))
      .then(keys =>
        Promise.all(
          keys.map(key => {
            console.log(`Deleting cache ${key}`);
            return caches.delete(key);
          })
        )
      )
  );
});