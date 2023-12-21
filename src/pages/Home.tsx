import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { HeaderRoute } from "../components/HeaderRoute";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>Nebula</title>
      </Helmet>
      <div class="flex h-full items-center justify-center">
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
            onChange={(e) => setInputValue((e.target as HTMLInputElement).value)}
            className={`font-roboto h-14 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl placeholder:text-input-text focus:outline-none ${
              isFocused ? "w-full md:w-3/12" : "w-full md:w-80"
            } transition-all duration-300`}
            placeholder={isFocused ? "" : t("home.placeholder")}
          />
        </form>
      </div>
    </HeaderRoute>
  );
}
