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

function toast(query: string) {
    const wrapper = document.getElementById("toastwrapper") as HTMLDivElement;
    wrapper.classList.remove("hidden");
    //this is a really hacky solution for toast notifications LOL
    const element = document.querySelector(query) as HTMLElement;
    //click the element
    element.click();
}

function search(input: string, template: string) {
    try { return new URL(input).toString() } catch (_) {};

    try {
        const url = new URL(`http://${input}`);
        if (url.hostname.includes(".")) return url.toString();
    } catch (_) {};

    return template.replace("%s", encodeURIComponent(input));
}

export { 
    type TType, 
    type ToastPosition, 
    type Props, 
    toast,
    search
};
