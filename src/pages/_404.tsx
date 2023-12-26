import { useTranslation } from "react-i18next";
import { Link } from "preact-router";
import { HeaderRoute } from "../components/HeaderRoute";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <HeaderRoute>
      <section class="h-full">
        <div class="flex h-full flex-col items-center justify-center">
          <img src="/404.png" class="h-72"></img>
          <div class="flex flex-col items-center p-6">
            <p class="font-roboto text-4xl font-bold">{t("404.text")}</p>
            <span class="font-roboto text-3xl">404</span>
          </div>
          <Link href="/">
            <button class="font-roboto h-14 w-44 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl placeholder:text-input-text focus:outline-none">
              {t("404.return")}
            </button>
          </Link>
        </div>
      </section>
    </HeaderRoute>
  );
}
