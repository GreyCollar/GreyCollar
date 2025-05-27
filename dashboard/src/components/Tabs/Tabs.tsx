import Tab from "@mui/material/Tab";
import { useCallback } from "react";

import Tabs, { tabsClasses } from "@mui/material/Tabs";

function TabBar({ TABS, currentTab, setCurrentTab }) {
  const handleTabChange = useCallback(
    (event, newValue) => {
      setCurrentTab(newValue);
    },
    [setCurrentTab]
  );
  return (
    <Tabs
      value={currentTab}
      onChange={handleTabChange}
      scrollButtons="auto"
      variant="scrollable"
      allowScrollButtonsMobile
      sx={{
        width: 1,
        bottom: 0,
        zIndex: 9,
        position: "absolute",
        bgcolor: "background.paper",
        [`& .${tabsClasses.flexContainer}`]: {
          pr: { md: 3 },
          justifyContent: { md: "flex-end" },
        },
        [`& .MuiTabs-scrollButtons`]: {
          zIndex: 10,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tab
          data-cy={`tab-${tab.value}`}
          key={tab.value}
          value={tab.value}
          icon={tab.icon}
          label={tab.label}
        />
      ))}
    </Tabs>
  );
}

export default TabBar;
