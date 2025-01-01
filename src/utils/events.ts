interface Events {
    functions: {
        load?: () => unknown;
        bSwap?: () => unknown;
        aSwap?: () => unknown;
        dom?: () => unknown;
    }
    event: "astro:page-load" | "astro:before-swap" | "astro:after-swap" | "DOMContentLoaded";
    logging?: boolean 
}

class EventHandler {
    #eventItems: Events;
    constructor(items: Events) {
        this.#eventItems = items;
    }
    #attachEvent(items: Events, fn: () => unknown) {
        if (items.logging) return document.addEventListener(items.event, () => fn());
        try { document.addEventListener(items.event, () => fn()) } catch (_) {};
    }
    #throwErrorOnUnspecified(fn: "load" | "bSwap" | "aSwap" | "dom") {
        throw new Error(`No ${fn} specified`);
    }
    pageLoad() {
        if (!this.#eventItems.functions.load) return this.#throwErrorOnUnspecified("load");
        this.#attachEvent(this.#eventItems, this.#eventItems.functions.load);
    }
    beforeSwap() {
        if (!this.#eventItems.functions.bSwap) return this.#throwErrorOnUnspecified("bSwap");
        this.#attachEvent(this.#eventItems, this.#eventItems.functions.bSwap);
    }
    afterSwap() {
        if (!this.#eventItems.functions.aSwap) return this.#throwErrorOnUnspecified("aSwap");
        this.#attachEvent(this.#eventItems, this.#eventItems.functions.aSwap);
    }
    domContent() {
        if (!this.#eventItems.functions.dom) return this.#throwErrorOnUnspecified("dom"); 
        this.#attachEvent(this.#eventItems, this.#eventItems.functions.dom);
    }
}

export { EventHandler, type Events }
