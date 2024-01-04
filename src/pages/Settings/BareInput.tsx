import { useState, useEffect } from "preact/hooks";
import { set } from "../../util/IDB";
import { uninstallServiceWorkers } from "../../util/SWHelper";

interface BareInputProps {
    placeholder: string;
    storageKey: string;
}

function BareInput(props: BareInputProps) { 
    const value = localStorage.getItem(props.storageKey) || "/bare/";
    const [inputValue, setInputValue] = useState(value);
    function validateUrl(url: string) {
        let finalUrl = url;
        if (url === "/bare/" || url === "/bare") {
            finalUrl = "/bare/";
            return finalUrl;
        }
        if (url === null || url === undefined || url === "") {
            finalUrl = "/bare/";
            return finalUrl;
        }
        if (!url.endsWith("/")) {
            finalUrl = url + "/";
        }
        if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
            finalUrl = "https://" + finalUrl;
        }
        return finalUrl;
    }
    function handleChange(event: any) {
        const url = validateUrl(event.target.value);
        setInputValue(event.target.value);
        set(props.storageKey, url);
        localStorage.setItem(props.storageKey, url);
        uninstallServiceWorkers();
        window.location.reload();
    }
    return (
        <input type="text" placeholder={props.placeholder}
            value={inputValue} onBlur={handleChange}
            className="font-roboto flex flex-row p-4 h-14 w-56 border border-input-border-color bg-input text-center text-xl rounded-2xl"/>
    );
}

export default BareInput;
