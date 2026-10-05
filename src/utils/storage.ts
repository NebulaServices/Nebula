import localforage from "localforage";
import { log } from "./index";

interface StoreBackend {
    getItem(key: string): Promise<unknown>;
    setItem(key: string, value: unknown): Promise<unknown>;
    removeItem(key: string): Promise<void>;
    keys(): Promise<string[]>;
}

const sharedBackend: StoreBackend = localforage.createInstance({
    name: 'nebula-settings',
    storeName: 'kv'
});
/**
    * This class will create a new StoreManager with an appended prefix to it. The generic is there to tell you what that prefix ***is***
    *
    * **Note: there is already a defaultStore available! In most situations, you'll want to use that.**
    *
    * <code>
    * const newStore = new StoreManager("incog");
    *
    * // Appends the prefix to the key passed. (EX: "incog||test")
    * // Will return a string.
    * await newStore.getVal("test")
    *
    * // As stated above the prefix will automatically be appended to the key param (EX: "incog||test")
    * await newStore.setVal("test", "newVal");
    * </code>
*/
class StoreManager<Prefix extends string /* This is here so I know what prefix is appended. It's inferred from the constructor */> {
    #prefix: Prefix;
    #backend: StoreBackend;
    constructor(pref: Prefix, backend: StoreBackend = sharedBackend) {
        this.#prefix = pref;
        this.#backend = backend;
    }
    async getVal(key: string): Promise<string | null> {
        log({ type: 'info', bg: true, prefix: true }, `Getting key: ${key} \nFull key: ${this.#prefix}||${key}`);
        const fullKey = `${this.#prefix}||${key}`;
        const stored = await this.#backend.getItem(fullKey);
        if (stored !== null && stored !== undefined) return stored as string;
        if (typeof localStorage !== 'undefined') {
            const legacy = localStorage.getItem(fullKey);
            if (legacy !== null) {
                await this.#backend.setItem(fullKey, legacy);
                localStorage.removeItem(fullKey);
                return legacy;
            }
        }
        return null;
    }
    async setVal(key: string, val: string): Promise<void> {
        log({ type: 'info', bg: false, prefix: true }, `Setting ${key} with value: ${val}`);
        await this.#backend.setItem(`${this.#prefix}||${key}`, val);
    }
    async removeVal(key: string): Promise<void> {
        log({ type: 'info', bg: true, prefix: true }, `Removing ${this.#prefix}||${key}`);
        await this.#backend.removeItem(`${this.#prefix}||${key}`);
    }
    async clear(): Promise<void> {
        const owned = (await this.#backend.keys()).filter(key => key.startsWith(`${this.#prefix}||`));
        await Promise.all(owned.map(key => this.#backend.removeItem(key)));
    }
}

//this is done so I can see the prefix used.
const defaultStore = new StoreManager("nebula");

export { StoreManager, defaultStore };
