type TType = "success" | "error" | "multiline";
type ToastPosition = "top" 
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";

interface Props {
    TType: TType;
    text: string;
    class: string;
    id?: string;
    duration?: number;
    emoji?: any;
    position?: ToastPosition;
}

/**
    * This allows us to call our toast notifs.
    *
    * @example
    * import { toast } from "@utils/index";
    * toast(".toastMessage");
*/
function toast(query: string) {
    const wrapper = document.getElementById("toastwrapper") as HTMLDivElement;
    wrapper.classList.remove("hidden");
    //this is a really hacky solution for toast notifications LOL
    const element = document.querySelector(query) as HTMLElement;
    //click the element
    element.click();
}

type Items = {
    type: "id" | "class" | "generic",
    val: string 
}

type ElementDatasets = {
    name: string,
    val: string | undefined 
}

class Elements {
    /** 
        * An async generator function to get your objects quickly and easily.
        *
        * @example
        * const items = selectElements(items: [{ type: "id", val: "iframe" }]);
        * for await (const item of items) {
            * console.log(item) // Perform some action on this item (OR pause and continue when needed!)
        * }
    */
    static async *select(items: Items[]) {
        for (const item in items) {
            switch (items[item].type) {
                case "id": 
                    yield document.getElementById(items[item].val) as HTMLElement;
                    break;
                case "class":
                    yield document.getElementsByClassName(items[item].val);
                    break;
                case "generic":
                    yield document.getElementsByName(items[item].val);
                    break;
            }
        }
    };

    static exists<RetType>(elem: any): RetType {
        if (elem.value) return elem.value as RetType;
        throw new Error(`Something is WRONG. The element doesn't exist!`);
    }
    
    static attachEvent<Element extends HTMLElement, EType extends keyof HTMLElementEventMap>(item: Element, event: EType, fn: (event?: Event) => unknown) {
        item.addEventListener(event, fn);
    }

    static createCustomElement(name: string, fn: (datasets?: ElementDatasets[]) => unknown, datasets?: Omit<ElementDatasets, "val">[]) {
        class CustomEl extends HTMLElement {
            dat: ElementDatasets[] = [];
            constructor() {
                super();
                if (datasets) {
                    datasets.forEach((data) => {
                        this.dat.push({ name: data.name, val: this.dataset[data.name] });
                    });
                }
                (async () => await fn(this.dat))();
            }
        }

        if (customElements.get(name)) return log({ type: "error", bg: true, prefix: false, throw: false }, `An element with the name ${name} already exists! This WILL not work! And`);

        log({ type: 'info', bg: false, prefix: true }, `Creating custom element with the name ${name}`);
        customElements.define(name, CustomEl);
    }
}

/**
    * Allows use to turn a basic phrase into a full URL. Mainly used when ther user enters something in for use in UV/SJ
    *
    * @example
    * import { search } from "@utils/index";
    * search("YES", "https://www.google.com/search?q=%s");
*/
function search(input: string, template: string) {
    try { return new URL(input).toString() } catch (_) {};

    try {
        const url = new URL(`http://${input}`);
        if (url.hostname.includes(".")) return url.toString();
    } catch (_) {};

    return template.replace("%s", encodeURIComponent(input));
}

type LogOpts = { type: "normal" | "warn" | "info", bg: boolean, prefix: boolean } | { type: "error", bg: boolean, prefix: boolean, throw: boolean }
/**
    * Custom built log function with styles applied.
    *
    * @example
    * import { log } from "@utils/index";
    * log("info", opts: { bg: true, prefix: false }, message: "This is an example"); // BG can be true or false when BG is false, most of the time it reverts back to normal styling (except for the "normal" mode). When prefix is true, this adds a prefix of the type of message used.
*/
const log = (type: LogOpts, message: string): void => {
    const styles = {
        warn: {
            bg: {
                color: "#ffffff",
                bg: "#cc3300"
            },
            normal: "#ffffff"
        },
        error: {
            bg: {
                color: "#ffffff",
                bg: "#cc0000"
            },
            normal: "#ffffff"
        },
        info: {
            bg: {
                color: "#ffffff",
                bg: "#088F8F"
            },
            normal: "#088F8F"
        },
        normal: {
            bg: {
                color: "#ffffff",
                bg: "#7967dd"
            },
            normal: "#7967dd"
        }
    }
    switch(type.type) {
        case "info": 
            console.info(`%c${type.prefix ? `Info: ${message}` : message}`, `${type.bg ? `color: ${styles.info.bg.color}; background-color: ${styles.info.bg.bg}; padding: 2px 10px; font-weight: bold;` : `color: ${styles.info.normal}; font-weight: bold;`}`);
            break;
        case "error":
            if (type.throw) throw new Error(message);
            console.error(`%c${type.prefix ? `Error: ${message}` : message }`, `${type.bg ? `color: ${styles.error.bg.color}; background-color: ${styles.error.bg.bg}; padding: 2px 10px;` : `color: ${styles.error.normal};`}`);
            break;
        case "warn": 
            console.warn(`%c${type.prefix ? `Warning: ${message}` : message}`, `${type.bg ? `color: ${styles.warn.bg.color}; background-color: ${styles.warn.bg.bg}; padding: 2px 10px;` : `color: ${styles.warn.normal};`}`);
            break;
        case "normal": 
            console.log(`%c${message}`, `${type.bg ? `color: ${styles.normal.bg.color}; background-color: ${styles.normal.bg.bg}; padding: 2px 10px; font-weight: bold;` : `color: ${styles.normal.normal}; font-weight: bold;`}`);
            break;
    }
};


export { 
    type TType, 
    type ToastPosition, 
    type Props, 
    toast,
    search,
    log,
    Elements
};
