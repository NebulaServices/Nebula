import TabComponent from "./TabComponent";
import { HeaderRoute } from "../../components/HeaderRoute";
import tabs from "./tabs";

export function Settings() {
  return (
    <HeaderRoute>
      <TabComponent tabs={tabs} />
    </HeaderRoute>
  );
}
