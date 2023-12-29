import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { HeaderRoute } from "../components/HeaderRoute";
import { enc } from "../aes";
import CloakedHead from "../util/CloakedHead";

export function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
      <div class="flex h-full flex-col items-center justify-center">
        <div class="font-inter absolute bottom-0 left-0 p-4 text-sm italic text-input-text">
          Nebula &copy; Nebula Services {new Date().getUTCFullYear()}
        </div>
        <a href="https://github.com/NebulaServices/Nebula">
          <div class="font-inter absolute bottom-0 right-0 p-4 text-sm text-input-text">
            GitHub
          </div>
        </a>
        <form
          onSubmit={handleSubmit}
          class="flex h-full w-full flex-col items-center justify-center"
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
            className={`font-roboto h-14 rounded-t-2xl border border-input-border-color bg-input p-2 text-center text-xl placeholder:text-input-text focus:outline-none ${
              isFocused ? "w-10/12 md:w-3/12" : "w-80 rounded-2xl"
            } transition-all duration-300`}
            placeholder={isFocused ? "" : t("home.placeholder")}
          />
          <div class="relative flex w-10/12 flex-col items-center md:w-3/12">
            <div class="absolute text-center">
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
                      class={`font-roboto w-110 h-14 flex-none shrink-0 justify-center border border-input-border-color p-2 text-2xl text-ellipsis hover:bg-dropdown-option-hover-color ${
                        index === suggestion.slice(-1) ? "rounded-b-2xl" : ""
                      }`}
                      key={index}
                    >
                      {suggestion}
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </form>
      </div>
    </HeaderRoute>
  );
}
