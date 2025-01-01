type Event = "astro:page-load" | "astro:before-swap" | "astro:after-swap" | "DOMContentLoaded";
interface Events {
    events: {
        "astro:page-load"?: () => unknown; 
        "astro:before-swap"?: () => unknown;
        "astro:after-swap"?: () => unknown;
        "DOMContentLoaded"?: () => unknown;
    };
    logging: boolean;
}

class EventHandler {
    #eventItems: Events;
    constructor(items: Events) {
        this.#eventItems = items;
    }
    #attachEvent(items: Events, eventType: Event, fn: () => unknown) {
        if (items.logging) return document.addEventListener(eventType, () => fn());
        try { document.addEventListener(eventType, () => fn()) } catch (_) {};
    }
    #throwErrorOnUnspecified(fn: Event) {
        throw new Error(`No function specified for ${fn}`);
    }
    pageLoad() {
        if (!this.#eventItems.events["astro:page-load"]) return this.#throwErrorOnUnspecified("astro:page-load");
        this.#attachEvent(this.#eventItems, "astro:page-load", this.#eventItems.events["astro:page-load"]);
    }
    beforeSwap() {
        if (!this.#eventItems.events["astro:before-swap"]) return this.#throwErrorOnUnspecified("astro:before-swap");
        this.#attachEvent(this.#eventItems, "astro:before-swap", this.#eventItems.events["astro:before-swap"]);
    }
    afterSwap() {
        if (!this.#eventItems.events["astro:after-swap"]) return this.#throwErrorOnUnspecified("astro:after-swap");
        this.#attachEvent(this.#eventItems, "astro:after-swap", this.#eventItems.events["astro:after-swap"]);
    }
    domContent() {
        if (!this.#eventItems.events.DOMContentLoaded) return this.#throwErrorOnUnspecified("DOMContentLoaded"); 
        this.#attachEvent(this.#eventItems, "DOMContentLoaded", this.#eventItems.events.DOMContentLoaded);
    }
}

export { EventHandler, type Events }
