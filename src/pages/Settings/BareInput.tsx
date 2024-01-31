import { useState, useEffect } from "preact/hooks";
import { set } from "../../util/IDB";
import { uninstallServiceWorkers } from "../../util/SWHelper";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import { BareTest } from "./BareTest";

interface BareInputProps {
  placeholder: string;
  storageKey: string;
}

function BareInput(props: BareInputProps) {
  const { t } = useTranslation();
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
  function handleChange() {
    const url = validateUrl(
      (document.getElementById("input") as HTMLInputElement).value
    );
    BareTest(url + "v3/").then((result) => {
      if (result) {
        setInputValue(
          (document.getElementById("input") as HTMLInputElement).value
        );
        set(props.storageKey, url);

        set("HTTPProxy", ""); // Disable http proxy servicesssss (most bare servers won't support these and we don't want to be untruthful to the user.)
        localStorage.setItem("HTTPProxy", "");

        localStorage.setItem(props.storageKey, url);
        uninstallServiceWorkers();
        window.location.reload();
      } else {
        (document.getElementById("input") as HTMLInputElement).value =
          localStorage.getItem("bare") || "/bare/";
        toast(t("bareError"), {
          type: "error"
        });
      }
    });
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
          className="font-roboto mt-2 flex h-4 w-36 cursor-pointer flex-row text-input-text items-center justify-center rounded-xl border border-input-border-color bg-input p-5 text-center text-lg"
          onClick={handleChange}
        >
          {t("settings.bare.select")}
        </div>
      </div>
    </div>
  );
}

export default BareInput;
