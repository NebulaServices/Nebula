import TabComponent from "./TabComponent";
import { HeaderRoute } from "../../components/HeaderRoute";
import tabs from "./tabs";
import { Helmet } from "react-helmet"

export function Settings() {
  return (
    <HeaderRoute>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <TabComponent tabs={tabs} />
    </HeaderRoute>
  );
}
