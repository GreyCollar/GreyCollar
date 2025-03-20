import ColleagueIntegration from "../widgets/ColleagueIntegration/ColleagueIntegration";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import Knowledge from "../widgets/Knowledge/Knowledge";
import PopupChatWidget from "../widgets/PopupChatWidget";
import Profile from "../widgets/Profile/Profile";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import React from "react";
import Stack from "@mui/material/Stack";
import Supervising from "../widgets/Supervising/Supervising";
import Tasks from "../widgets/Tasks/Tasks";
import { getBackgroundUrl } from "../utils/background";

import { Skeleton, Theme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  {
    value: "profile",
    label: "Profile",
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: "knowledge-base",
    label: "Knowledge Base",
    icon: <Iconify icon="solar:heart-bold" width={24} />,
  },
  {
    value: "supervising",
    label: "Supervising",
    icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  },
  {
    value: "task",
    label: "Task",
    icon: <Iconify icon="material-symbols:task" width={24} />,
  },
  {
    value: "integration",
    label: "Integration",
    icon: <Iconify icon="carbon:ibm-cloud-pak-integration" width={24} />,
  },
];

function ColleagueLayout({ colleague, loading }) {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab");

  const [currentTab, setCurrentTab] = useState(
    TABS.some((tab) => tab.value === tabFromQuery) ? tabFromQuery : "profile"
  );

  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);

    const newQueryParams = new URLSearchParams(location.search);
    newQueryParams.set("tab", newTab);

    navigate(
      {
        pathname: location.pathname,
        search: newQueryParams.toString(),
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (
      tabFromQuery &&
      TABS.some((tab) => tab.value === tabFromQuery) &&
      tabFromQuery !== currentTab
    ) {
      setCurrentTab(tabFromQuery);
    }
  }, [tabFromQuery, currentTab]);

  return (
    <>
      <Stack margin={2} sx={{ position: "relative", marginTop: -2 }}>
        {loading ? (
          <Skeleton variant="rectangular" height={200} />
        ) : (
          <>
            <ProfileCard
              TABS={TABS}
              currentTab={currentTab}
              setCurrentTab={handleTabChange}
              name={colleague.name}
              avatarUrl={colleague.avatar}
              coverUrl={getBackgroundUrl(colleague.id)}
              role={colleague.role}
              loading={loading}
            />
            <Stack
              sx={{
                position: "absolute",
                bottom: mdDown ? "auto" : 20,
                left: mdDown ? "auto" : 120,
                top: mdDown ? 25 : "auto",
                right: mdDown ? 25 : "auto",
                zIndex: 1000,
              }}
            >
              <PopupChatWidget />
            </Stack>
          </>
        )}
      </Stack>
      {currentTab === "profile" && <Profile colleagueId={colleague.id} />}
      {currentTab === "knowledge-base" && (
        <Knowledge colleagueId={colleague.id} />
      )}
      {currentTab === "supervising" && (
        <Supervising colleagueId={colleague.id} />
      )}
      {currentTab === "task" && <Tasks colleagueId={colleague.id} />}
      {currentTab === "integration" && (
        <ColleagueIntegration colleague={colleague} />
      )}
    </>
  );
}

export default ColleagueLayout;
