import { useState, useEffect } from "preact/hooks";
import { set } from "../../util/IDB";
import { uninstallServiceWorkers } from "../../util/SWHelper";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";

interface BareInputProps {
  placeholder: string;
  storageKey: string;
}

function ProxyInput(props: BareInputProps) {
  const { t } = useTranslation();
  const bareServer = localStorage.getItem("bare") || "/bare/";
  const HTTPProxy = localStorage.getItem("HTTPProxy") || "";
  const [inputValue, setInputValue] = useState(HTTPProxy);

  function resetProxy() {
    set("HTTPProxy", "");
    localStorage.setItem("HTTPProxy", "");
    uninstallServiceWorkers();
    window.location.reload();
  }

  function validateUrl(url: string) {
    let finalUrl = url;

    if (url === null || url === undefined || url === "") {
      finalUrl = "";
      return finalUrl;
    }

    return finalUrl;
  }
  function handleChange() {
    const proxyUrl = validateUrl(
      (document.getElementById("pinput") as HTMLInputElement).value
    );

    if (!(proxyUrl === "")) {
      const [proxyIP, proxyPort] = proxyUrl.split(":");

      fetch(bareServer)
        .then((response) => response.json())
        .then((jsonResponse) => {
          if (jsonResponse.hasOwnProperty("HTTPProxy")) {
            const headers = new Headers({
              "x-bare-url": "https://www.google.com",
              "X-Bare-Headers": JSON.stringify({
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
              }),
              "x-bare-proxy-ip": proxyIP,
              "x-bare-proxy-port": proxyPort
            });

            return fetch(bareServer + "v3/", {
              method: "GET",
              headers: headers
            })
              .then((response) => {
                if (
                  response.headers.get("x-bare-status") === "200" ||
                  response.headers.get("x-bare-status") === "302"
                ) {
                  // Success!
                  set("HTTPProxy", proxyUrl);
                  localStorage.setItem("HTTPProxy", proxyUrl);
                  uninstallServiceWorkers();
                  window.location.reload();
                  return true;
                } else {
                  (
                    document.getElementById("pinput") as HTMLInputElement
                  ).value = localStorage.getItem("HTTPProxy") || "";
                  toast(t("settings.httpProxy.badProxy"), {
                    type: "error"
                  });
                }
              })
              .catch((error) => {
                (document.getElementById("pinput") as HTMLInputElement).value =
                  localStorage.getItem("HTTPProxy") || "";
                toast(t("settings.httpProxy.badProxy"), {
                  type: "error"
                });
              });
          } else {
            (document.getElementById("pinput") as HTMLInputElement).value =
              localStorage.getItem("HTTPProxy") || "";
            toast(t("settings.httpProxy.badBare"), {
              type: "error"
            });
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      // reset UV config to have no proxy
      set("HTTPProxy", "");
      localStorage.setItem("HTTPProxy", "");
      uninstallServiceWorkers();
      window.location.reload();
    }
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
          id="pinput"
          className="font-roboto flex h-14 w-56 flex-row rounded-2xl border text-input-text border-input-border-color bg-input p-4 text-center text-sm"
        />
        <div class="flex flex-row gap-4">
          <div
            className="font-roboto mt-2 flex h-4 w-36 cursor-pointer flex-row text-input-text items-center justify-center rounded-xl border border-input-border-color bg-input p-5 text-center text-lg"
            onClick={handleChange}
          >
            {t("settings.bare.select")}
          </div>
          <div
            className="font-roboto mt-2 flex h-4 w-36 cursor-pointer flex-row items-center text-input-text justify-center rounded-xl border border-input-border-color bg-input p-5 text-center text-lg"
            onClick={resetProxy}
          >
            {t("settings.httpProxy.reset")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProxyInput;
