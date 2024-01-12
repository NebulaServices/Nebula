import { useState, useEffect } from "preact/hooks";
import cn from "classnames";
import { motion } from "framer-motion";
import "./styles.css";
import { useTranslation } from "react-i18next";

const tabVariant = {
  active: {
    width: "55%",
    transition: {
      type: "tween",
      duration: 0.4
    }
  },
  inactive: {
    width: "15%",
    transition: {
      type: "tween",
      duration: 0.4
    }
  }
};

const tabTextVariant = {
  active: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.3
    }
  },
  inactive: {
    opacity: 0,
    x: -30,
    transition: {
      type: "tween",
      duration: 0.3,
      delay: 0.1
    },
    transitionEnd: { display: "none" }
  }
};

const TabComponent = ({ tabs, defaultIndex = 0 }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--active-color",
      tabs[activeTabIndex].color
    );
  }, [activeTabIndex, tabs]);

  // Default to a tab based on the URL hash value
  useEffect(() => {
    const tabFromHash = tabs.findIndex(
      (tab) => `#${tab.id}` === window.location.hash
    );
    setActiveTabIndex(tabFromHash !== -1 ? tabFromHash : defaultIndex);
  }, [tabs, defaultIndex]);

  const onTabClick = (index) => {
    setActiveTabIndex(index);
  };

  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="container h-full w-full">
        <div className="tabs-component">
          <ul className="tab-links" role="tablist">
            {tabs.map((tab, index) => (
              <motion.li
                key={tab.id}
                className={
                  "flex h-12 flex-row " +
                  cn("tab", { active: activeTabIndex === index })
                }
                role="presentation"
                variants={tabVariant}
                animate={activeTabIndex === index ? "active" : "inactive"}
              >
                <a href={`#${tab.id}`} onClick={() => onTabClick(index)}>
                  {tab.icon}
                  <motion.span variants={tabTextVariant}>
                    {t(tab.title)}
                  </motion.span>
                </a>
              </motion.li>
            ))}
          </ul>
          {tabs.map((tab, index) => (
            <tab.content
              key={tab.id}
              id={`${tab.id}-content`}
              active={activeTabIndex === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabComponent;
