async function updateServiceWorkers() {
  await navigator.serviceWorker
    .getRegistrations()
    .then(function (registrations) {
      for (let registration of registrations) {
        registration.update();
        console.log("Service Worker Updated");
      }
    });
}

async function uninstallServiceWorkers() {
  await navigator.serviceWorker
    .getRegistrations()
    .then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
        console.log("Service Worker Unregistered");
      }
    });
}

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/~/"
    });
  }
}

export { updateServiceWorkers, uninstallServiceWorkers, registerServiceWorker };
