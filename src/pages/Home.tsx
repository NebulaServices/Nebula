import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { HeaderRoute } from "../components/HeaderRoute";
import CloakedHead from "../util/CloakedHead";
export function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = "/go/" + encodeURIComponent(inputValue);
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
          class="flex h-full w-full items-center justify-center"
        >
          <input
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            type="text"
            value={inputValue}
            onChange={(e) =>
              setInputValue((e.target as HTMLInputElement).value)
            }
            className={`font-roboto h-14 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl placeholder:text-input-text focus:outline-none ${
              isFocused ? "w-10/12 md:w-3/12" : "w-80"
            } transition-all duration-300`}
            placeholder={isFocused ? "" : t("home.placeholder")}
          />
        </form>
      </div>
    </HeaderRoute>
  );
}
