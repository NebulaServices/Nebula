import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { HeaderRoute } from "../components/HeaderRoute";

export function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation();

  return (
    <HeaderRoute>
      <div class="flex h-full items-center justify-center">
        <input
          onFocus={(e) => {
            setIsFocused(true);
          }}
          onBlur={(e) => {
            setIsFocused(false);
          }}
          type="text"
          class="font-roboto h-14 w-80 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl placeholder:text-input-text focus:outline-none"
          placeholder={isFocused ? "" : t("home.placeholder")}
        ></input>
      </div>
    </HeaderRoute>
  );
}
