// @ts-nocheck
importScripts('/ultra/ultra.bundle.js');
importScripts('/ultra/ultra.config.js');
importScripts(__uv$config.sw || '/ultra/ultra.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => event.respondWith(sw.fetch(event)));
