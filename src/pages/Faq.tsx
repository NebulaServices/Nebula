import { useTranslation } from "react-i18next";
import { HeaderRoute } from "../components/HeaderRoute";
import CloakedHead from "../util/CloakedHead";
import { useEffect } from "preact/hooks";
import "./Faq.css";

export function Faq() {
  const { t } = useTranslation();

  const faqData = t("faq", { returnObjects: true });

  useEffect(() => {
    const hash = window.location.hash.substring(1);

    if (hash) {
      const highlightedDiv = document.getElementById(hash);

      if (highlightedDiv) {
        highlightedDiv.classList.add("highlighted");
      }
    }
  }, []);

  return (
    <HeaderRoute>
      <CloakedHead
        originalTitle={t("titles.discord")}
        originalFavicon="/logo.png"
      />
      <div class="p-10">
        {Object.values(faqData).map((item, index) => (
          <div key={index} className="py-3">
            <p className="text-4xl" id={(index + 1).toString()}>
              {item.q}
            </p>
            <div class="flex flex-row">
              <p className="text-lg">
                {item.a}{" "}
                {item.h && (
                  <a href={item.hR} class="underline">
                    {item.h}
                  </a>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </HeaderRoute>
  );
}
