import { useState, useEffect } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";

interface WispInputProps {
  placeholder: string;
}

function WispInput(props: WispInputProps) {
  const { t } = useTranslation();
  const value = localStorage.getItem("wispUrl") || (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/wisp/";
  const [inputValue, setInputValue] = useState(value);
  function validateUrl(url: string) {
    let finalUrl = url;
    if (finalUrl.startsWith("http://")) {
        finalUrl = finalUrl.replace("http://", "ws://");
    } else if (finalUrl.startsWith("https://")) {
        finalUrl = finalUrl.replace("https://", "wss://");
    }
  }
  function handleChange() {
    const url = validateUrl((document.getElementById("input") as HTMLInputElement).value);
    localStorage.setItem("wispUrl", url);
  }
  return (
    <div>
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder={props.placeholder}
          value={inputValue}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleChange();
            }
          }}
          id="input"
          className="font-roboto flex h-14 w-56 flex-row rounded-2xl border border-input-border-color bg-input p-4 text-center text-xl text-input-text"
        />
        <div
          className="font-roboto mt-2 flex h-4 w-36 cursor-pointer flex-row items-center justify-center rounded-xl border border-input-border-color bg-input p-5 text-center text-lg text-input-text"
          onClick={handleChange}
        >
          Select
        </div>
      </div>
    </div>
  );
}

export default WispInput;
