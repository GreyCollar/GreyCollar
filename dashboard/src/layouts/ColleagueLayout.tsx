import ColleagueIntegration from "../widgets/ColleagueIntegration/ColleagueIntegration";
import { Iconify } from "@nucleoidai/platform/minimal/components";
import Knowledge from "../widgets/Knowledge/Knowledge";
import PopupChatWidget from "../widgets/PopupChatWidget";
import Profile from "../widgets/Profile/Profile";
import ProfileCard from "../components/ProfileCard/ProfileCard";
import React from "react";
import Responsibility from "../widgets/Responsibility/Responsibility";
import Stack from "@mui/material/Stack";
import Supervising from "../widgets/Supervising/Supervising";
import Tasks from "../widgets/Tasks/Tasks";
import { getBackgroundUrl } from "../utils/background";
import { useState } from "react";

import { Theme, useMediaQuery } from "@mui/material";

const TABS = [
  {
    value: "responsibility",
    label: "Responsibility",
    icon: (
      <Iconify
        icon="healthicons:crisis-response-center-person-outline"
        width={24}
      />
    ),
  },
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
  const [currentTab, setCurrentTab] = useState("responsibility");

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
      {currentTab === "responsibility" && <Responsibility />}
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
