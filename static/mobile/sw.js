// Copyright Nebula Services 2021 - Present
// All Rights Reserved

importScripts('./uv/uv.sw.js');

const sw = new UVServiceWorker();

self.addEventListener('fetch', event => event.respondWith(sw.fetch(event)));