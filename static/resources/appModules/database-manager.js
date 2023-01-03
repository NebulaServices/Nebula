// NOTE - This file is not used in the current version of the app.
// this is just a snippet of code that I am keeping for future reference.
// NOTE: THIS FILE MUST BE ACCOMPANIED BY THE ULTRAVIOLET BUNDLE BECAUSE IT CONTAINS THE INDEXEDDB LIBRARY


const dbPromise = Ultraviolet.openDB('keyval-store', 1, {
  upgrade (db) {
    db.createObjectStore('keyval')
  }
})

self.storage = {
  async get (key) {
    return (await dbPromise).get('keyval', key)
  },

  async set (key, val) {
    return (await dbPromise).put('keyval', val, key)
  },

  async del (key) {
    return (await dbPromise).delete('keyval', key)
  }
}
