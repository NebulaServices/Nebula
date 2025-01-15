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

/**
 * This class creates an event handler for us with optional logging
 *
 * @example
 * const eventHandler = new EventHandler({
 *     events: {
 *         "astro:page-load": () => { console.log("After page load") },
 *         "astro:before-swap": () => {},
 *         "astro:after-swap": () => {},
 *         "DOMContentLoaded": () => {}
 *     }, // Pass any number of these : D (they are all optional)
 *     logging: false // Set this to true to enable logging when things go wrong.
 * });
 *
 * eventHandler.bind(); // Attaches every event you passed.
 */
class EventHandler {
    #eventItems: Events;
    constructor(items: Events) {
        this.#eventItems = items;
    }
    #attachEvent(items: Events, eventType: Event, fn: () => unknown) {
        if (items.logging) return document.addEventListener(eventType, async () => await fn());
        document.addEventListener(eventType, async () => {
            try {
                await fn();
            }
            catch (_) {}
        });
    }
    /**
     * Binds the events you passed when creating the class to the document. If none are passed, an error is thrown.
    */
    bind(): void | Error {
        const events = Object.entries(this.#eventItems.events);
        if (!events || events.length === 0) throw new Error('No events added!');
        events.map((event) => {
            this.#attachEvent(this.#eventItems, event[0] as Event, event[1]);
        });
    }
}

export { EventHandler, type Events }
