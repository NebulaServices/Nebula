import TabComponent from "./TabComponent";
import { HeaderRoute } from "../../components/HeaderRoute";
import tabs from "./tabs";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

export function Settings() {
  const { t } = useTranslation();

  return (
    <HeaderRoute>
      <Helmet>
        <title>{t("titles.settings")}</title>
      </Helmet>
      <TabComponent tabs={tabs} />
    </HeaderRoute>
  );
}
