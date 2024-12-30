type TType = "success" | "error" | "multiline";
type Position = "top" 
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
    position?: Position;
}

function toast(query: string) {
    const wrapper = document.getElementById("toastwrapper") as HTMLDivElement;
    wrapper.classList.remove("hidden");
    //this is a really hacky solution for toast notifications LOL
    const element = document.querySelector(query) as HTMLElement;
    //click the element
    element.click();
}

export { type TType, type Position, type Props, toast };
