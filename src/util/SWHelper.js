import { setTransport } from "./transports.ts";

function updateServiceWorkers() {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.update();
      console.log("Service Worker Updated");
    }
  });
}

function uninstallServiceWorkers() {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log("Service Worker Unregistered");
    }
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/~/"
      })
      .then(() => {
        console.log("Service worker registered successfully");
        setTransport();
      });
  }
}

export { updateServiceWorkers, uninstallServiceWorkers, registerServiceWorker };
