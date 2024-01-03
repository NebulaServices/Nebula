function set(key, value) {
    localforage.config({
        driver: localforage.INDEXEDDB,
        name: 'Nebula',
        version: 1.0,
        storeName: 'nebula_config',
        description: 'Nebula Config for things reliant on IndexedDB'
    })
    localforage.setItem(key, value);
}

 
export { set };
