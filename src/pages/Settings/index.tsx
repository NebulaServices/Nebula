import TabComponent from "./TabComponent";
import { HeaderRoute } from "../../components/HeaderRoute";
import tabs from "./tabs";
import { useTranslation } from "react-i18next";
import CloakedHead from "../../util/CloakedHead";

export function Settings() {
  const { t } = useTranslation();

  return (
    <HeaderRoute>
      <CloakedHead
        originalTitle={t("titles.settings")}
        originalFavicon="/logo.png"
      />
      <TabComponent tabs={tabs} />
    </HeaderRoute>
  );
}
