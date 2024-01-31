import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { HeaderRoute } from "../components/HeaderRoute";

import { set } from "../util/IDB";
import { uninstallServiceWorkers } from "../util/SWHelper";
import prod from "./config.json"; // Set prod to true if you wish to load balance

import { enc } from "../aes";
import CloakedHead from "../util/CloakedHead";
import { useEffect } from "preact/hooks";

export function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const handleLoad = () => {
      const firstLoad = localStorage.getItem("firstLoad") || "true";
      console.log(firstLoad);
      if (firstLoad == "true" && prod) {
        function changeBare(url: string) {
          set("bare", url);
          localStorage.setItem("bare", url);
          uninstallServiceWorkers();
          window.location.reload();
        }

        async function test() {
          const nonProtocolOrigin = window.location.origin.replace(
            /^https?:\/\//,
            ""
          );
          // Do Tokyo-US pinging to find optimal server
          const ping = async (url: string) => {
            let start = Date.now();
            await fetch(url);
            let end = Date.now();
            let total = end - start;
            return total;
          };

          const usUrl = "https://us." + nonProtocolOrigin;
          const jpUrl = "https://jp." + nonProtocolOrigin;

          console.log(usUrl, jpUrl);

          const [usTime, jpTime] = await Promise.all([
            ping(usUrl),
            ping(jpUrl)
          ]);

          if (usTime < jpTime) {
            console.log("US faster");
            changeBare(usUrl);
          } else {
            console.log("Japan faster");
            changeBare(jpUrl);
          }
          localStorage.setItem("firstLoad", "false");
        }

        test();
      }
    };

    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  const { t } = useTranslation();

  const handleInputChange = async (event) => {
    setInputValue((event.target as HTMLInputElement).value);
    const newQuery = event.target.value;
    setInputValue(newQuery);

    const response = await fetch(`/search=${newQuery}`).then((res) =>
      res.json()
    );

    const newSuggestions = response?.map((item) => item.phrase) || [];
    setSuggestions(newSuggestions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href =
      "/go/" +
      encodeURIComponent(
        //@ts-ignore
        enc(
          inputValue,
          window.location.origin.slice(8) + navigator.userAgent
        ).substring(10)
      );
  };

  return (
    <HeaderRoute>
      <CloakedHead
        originalTitle={t("titles.home")}
        originalFavicon="/logo.png"
      />
      <div className="flex h-full flex-col items-center justify-center">
        <div className="font-inter absolute bottom-0 left-0 p-4 text-sm italic text-input-text">
          Nebula &copy; Nebula Services {new Date().getUTCFullYear()}
        </div>
        <a href="https://github.com/NebulaServices/Nebula">
          <div className="font-inter absolute bottom-0 right-0 p-4 text-sm text-input-text">
            GitHub
          </div>
        </a>
        <form
          onSubmit={handleSubmit}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <input
            onFocus={() => {
              setShowSuggestions(true);
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => {
                setShowSuggestions(false); // delay so the user has time to click suggestions
              }, 200);
            }}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className={`font-roboto h-14 rounded-t-2xl border border-input-border-color bg-input p-2 text-center text-xl text-input-text placeholder:text-input-text focus:outline-none ${
              isFocused && inputValue.trim() !== ""
                ? "w-10/12 md:w-3/12"
                : "w-80 rounded-2xl"
            } transition-all duration-300`}
            placeholder={isFocused ? "" : t("home.placeholder")}
          />

          <div className="relative flex w-10/12 flex-col items-center md:w-3/12">
            <div className="absolute w-full text-center">
              {showSuggestions &&
                suggestions.map((suggestion, index) => (
                  <a
                    href={
                      "/go/" +
                      encodeURIComponent(
                        //@ts-ignore
                        enc(
                          suggestion,
                          window.location.origin.slice(8) + navigator.userAgent
                        ).substring(10)
                      )
                    }
                  >
                    <div
                      className={`font-roboto w-110 flex h-10 flex-none shrink-0 items-center text-input-text justify-center border border-input-border-color bg-input p-2 text-xl hover:bg-dropdown-option-hover-color ${
                        index === suggestions.length - 1 ? "rounded-b-2xl" : ""
                      }`}
                      key={index}
                    >
                      {suggestion}
                    </div>
                  </a>
                ))}
              {/* {showSuggestions &&
                Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={index}
                    className="font-roboto w-110 hover:bg-dropdown-option-hover-colo flex h-8 flex-none shrink-0 items-center justify-center border border-input-border-color p-2 text-2xl"
                  >
                    Example suggestion
                  </div>
                ))} 
                
                */}
            </div>
          </div>
        </form>
      </div>
    </HeaderRoute>
  );
}
