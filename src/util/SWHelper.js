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

export { updateServiceWorkers, uninstallServiceWorkers };
