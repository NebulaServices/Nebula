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

type LogTypes = "normal" | "info" | "error" | "warn";
/**
    * Custom built log function with styles applied.
    *
    * @example
    * import { log } from "@utils/index";
    * log("info", opts: { bg: true, prefix: false }, message: "This is an example"); // BG can be true or false when BG is false, most of the time it reverts back to normal styling (except for the "normal" mode). When prefix is true, this adds a prefix of the type of message used.
*/
const log = (type: LogTypes, opts: { bg: boolean, prefix: boolean }, message: string) => {
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
    switch(type) {
        case "info": 
            console.info(`%c${opts.prefix ? `Info: ${message}` : message}`, `${opts.bg ? `color: ${styles.info.bg.color}; background-color: ${styles.info.bg.bg}; padding: 2px 10px; font-weight: bold;` : `color: ${styles.info.normal}; font-weight: bold;`}`);
            break;
        case "error": 
            console.error(`%c${opts.prefix ? `Error: ${message}` : message }`, `${opts.bg ? `color: ${styles.error.bg.color}; background-color: ${styles.error.bg.bg}; padding: 2px 10px;` : `color: ${styles.error.normal};`}`);
            break;
        case "warn": 
            console.warn(`%c${opts.prefix ? `Warning: ${message}` : message}`, `${opts.bg ? `color: ${styles.warn.bg.color}; background-color: ${styles.warn.bg.bg}; padding: 2px 10px;` : `color: ${styles.warn.normal};`}`);
            break;
        case "normal": 
            console.log(`%c${message}`, `${opts.bg ? `color: ${styles.normal.bg.color}; background-color: ${styles.normal.bg.bg}; padding: 2px 10px; font-weight: bold;` : `color: ${styles.normal.normal}; font-weight: bold;`}`);
            break;
    }
};


export { 
    type TType, 
    type ToastPosition, 
    type Props, 
    toast,
    search,
    log
};
