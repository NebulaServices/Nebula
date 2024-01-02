import { useTranslation } from "react-i18next";
import { Link } from "preact-router";
import { HeaderRoute } from "../components/HeaderRoute";
import CloakedHead from "../util/CloakedHead";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <HeaderRoute>
      <CloakedHead
        originalTitle={t("titles.404")}
        originalFavicon="/logo.png"
      />
      <section className="h-full">
        <div className="flex h-full flex-col items-center justify-center">
          <img src="/404.png" className="h-72"></img>
          <div className="flex flex-col items-center p-6">
            <p className="font-roboto text-4xl font-bold">{t("404.text")}</p>
            <span className="font-roboto text-3xl">404</span>
          </div>
          <Link href="/">
            <button className="font-roboto h-14 w-44 rounded-2xl border border-input-border-color bg-input p-2 text-center text-xl placeholder:text-input-text focus:outline-none">
              {t("404.return")}
            </button>
          </Link>
        </div>
      </section>
    </HeaderRoute>
  );
}
