import { useState, useEffect } from "preact/hooks";
import { set } from "../../util/IDB";

interface BareInputProps {
    placeholder: string;
    storageKey: string;
}

function BareInput(props: BareInputProps) { 
    const value = localStorage.getItem(props.storageKey) || "/bare/";
    const [inputValue, setInputValue] = useState(value); 
    function handleChange(event: any) {
        setInputValue(event.target.value);
        set(props.storageKey, event.target.value);
        localStorage.setItem(props.storageKey, event.target.value);
    }

    return (
        <input type="text" placeholder={props.placeholder}
            value={inputValue} onChange={handleChange}
        className="font-roboto flex flex-row p-4 h-14 w-56 border border-input-border-color bg-input text-center text-xl rounded-2xl"/>
    );
}

export default BareInput;
