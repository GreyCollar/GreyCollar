import ColleagueIntegration from "../widgets/ColleagueIntegration/ColleagueIntegration";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import Knowledge from "../widgets/Knowledge/Knowledge";
import PopupChatWidget from "../widgets/PopupChatWidget";
import Profile from "../widgets/Profile/Profile";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import React from "react";
import ResponsibilitiesWidget from "../widgets/ResponsibilitiesWidget/ResponsibilitiesWidget";
import Stack from "@mui/material/Stack";
import Supervising from "../widgets/Supervising/Supervising";
import TasksWidget from "../widgets/TasksWidget/TasksWidget";
import { getBackgroundUrl } from "../utils/background";
import { useState } from "react";

import { Theme, useMediaQuery } from "@mui/material";

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
    value: "responsibilities",
    label: "Responsibilities",
    icon: (
      <Iconify
        icon="healthicons:crisis-response-center-person-outline"
        width={24}
      />
    ),
  },
  {
    value: "supervisings",
    label: "Supervisings",
    icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  },
  {
    value: "tasks",
    label: "Tasks",
    icon: <Iconify icon="material-symbols:task" width={24} />,
  },
  {
    value: "integrations",
    label: "Integrations",
    icon: <Iconify icon="carbon:ibm-cloud-pak-integration" width={24} />,
  },
];

function ColleagueLayout({ colleague, loading }) {
  const [currentTab, setCurrentTab] = useState("profile");

  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <>
      <Stack margin={2} sx={{ position: "relative", marginTop: -2 }}>
        <ProfileCard
          TABS={TABS}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
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
      </Stack>
      {currentTab === "profile" && <Profile colleagueId={colleague.id} />}
      {currentTab === "knowledge-base" && (
        <Knowledge colleagueId={colleague.id} />
      )}
      {currentTab === "responsibilities" && <ResponsibilitiesWidget />}
      {currentTab === "supervisings" && (
        <Supervising colleagueId={colleague.id} />
      )}
      {currentTab === "tasks" && <TasksWidget colleagueId={colleague.id} />}
      {currentTab === "integrations" && (
        <ColleagueIntegration colleague={colleague} />
      )}
    </>
  );
}

export default ColleagueLayout;
