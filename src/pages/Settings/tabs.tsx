import Proxy from "./Proxy";
import TabSettings from "./TabSettings";
import Misc from "./Misc";
import Customization from "./Customization";

import { GoBrowser } from "react-icons/go";
import { AiOutlineLaptop } from "react-icons/ai";
import { FaPalette } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoMdPerson } from "react-icons/io";
import { Credits } from "./Credits";

const tabs = [
  {
    title: "settings.tabs.proxy",
    id: "proxy",
    icon: <AiOutlineLaptop />,
    color: "#5d5dff",
    content: Proxy
  },
  {
    title: "settings.tabs.tab",
    id: "tab",
    icon: <GoBrowser />,
    color: "#67bb67",
    content: TabSettings
  },
  {
    title: "settings.tabs.custom",
    id: "custom",
    icon: <FaPalette />,
    color: "#63a7c7",
    content: Customization
  },
  {
    title: "settings.tabs.misc",
    id: "misc",
    icon: <FaGear />,
    color: "#f56868",
    content: Misc
  },
  {
    title: "settings.tabs.credits",
    id: "credits",
    icon: <IoMdPerson />,
    color: "#fefefe",
    content: Credits
  }
];

export default tabs;
