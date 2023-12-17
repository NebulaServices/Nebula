import TabComponent from "./TabComponent";
import { HeaderRoute } from "../../components/HeaderRoute";
import tabs from "./tabs";
import { Helmet } from "react-helmet"

export function Settings() {
  return (
    <HeaderRoute>
      <Helmet>
        <title>Settingsz</title>
      </Helmet>
      <TabComponent tabs={tabs} />
    </HeaderRoute>
  );
}
