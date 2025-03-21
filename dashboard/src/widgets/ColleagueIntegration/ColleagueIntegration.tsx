import IncomingDrawer from "../../components/IncomingDrawer/IncomingDrawer";
import IntegrationTabs from "../../components/IntegrationTabs/IntegrationTabs";
import Integrations from "../../components/Integrations/Integrations";
import React from "react";
import SkillDialog from "../../components/Skills/SkillDialog";
import { storage } from "@nucleoidjs/webstorage";
import useColleagues from "../../hooks/useColleagueV2";
import useTeams from "../../hooks/useTeamsV2";

import { Box, Container, Grid } from "@mui/material";

const ColleagueIntegration = ({ colleague }) => {
  const integrations = [
    {
      id: "1e87e69f-8dbe-4f56-a8a7-1c87226f9c41",
      title: "Slack",
      description: "Receive messages and notifications from Slack",
      logo: "logos:slack",
      direction: "INCOMING",
      acquired: true,
    },
    {
      id: "2a65d8be-6c17-4d0b-bdc8-5c1f7fdd6e45",
      title: "Slack",
      description: "Send messages and automate workflows in Slack",
      logo: "logos:slack",
      direction: "OUTGOING",
      acquired: true,
    },
    {
      id: "3f4721a3-9d8b-420f-996c-4c8d6d315d24",
      title: "Discord",
      description: "Receive messages from Discord bots and users",
      logo: "logos:discord",
      direction: "INCOMING",
      acquired: true,
    },
    {
      id: "4e91db99-fc99-40b7-bb5d-d5758a67b34b",
      title: "Discord",
      description: "Send bot messages and notifications in Discord",
      logo: "logos:discord",
      direction: "OUTGOING",
      acquired: true,
    },
    {
      id: "7a8e29d1-8f2a-4c1e-88ab-df3a1f64728e",
      title: "Jira",
      description: "Receive issue updates and new tickets",
      logo: "logos:jira",
      direction: "INCOMING",
      acquired: true,
    },
    {
      id: "8a913f60-f76f-40cd-b7c2-e32c92c03e02",
      title: "Jira",
      description: "Create tickets and update issue statuses",
      logo: "logos:jira",
      direction: "OUTGOING",
      acquired: true,
    },
    {
      id: "9b31e5c9-2e41-482e-9d0c-ecb58d8b26f3",
      title: "GitHub",
      description: "Monitor pull requests, issues, and commits",
      logo: "logos:github",
      direction: "INCOMING",
      acquired: true,
    },
    {
      id: "10b1f843-d13a-4d14-9386-271ac8b2f60b",
      title: "GitHub",
      description: "Create issues, merge PRs, and trigger workflows",
      logo: "logos:github",
      direction: "OUTGOING",
      acquired: true,
    },
    {
      id: "11d4a8c2-3f93-4681-874f-14cd52d8c5fa",
      title: "Google Drive",
      description: "Fetch documents and files from Google Drive",
      logo: "logos:google-drive",
      direction: "INCOMING",
      acquired: true,
    },
    {
      id: "12e7d95a-8ef1-4b1e-9d5e-4325f1d5e5d4",
      title: "Google Drive",
      description: "Upload and manage files on Google Drive",
      logo: "logos:google-drive",
      direction: "OUTGOING",
      acquired: true,
    },
    {
      id: "21f5e3a9-0b5c-4d8a-95a1-937e6c3c4c72",
      title: "Notion",
      description: "Sync data and fetch notes from Notion",
      logo: "logos:notion",
      direction: "INCOMING",
      acquired: true,
    },
    {
      id: "22b3c1f4-2f3e-4e8d-9e37-6d72c58c4e41",
      title: "Notion",
      description: "Create and update pages in Notion",
      logo: "logos:notion",
      direction: "OUTGOING",
      acquired: true,
    },
    {
      id: "23a72f9d-91a2-4b31-8c3f-7c4d8e9b5f64",
      title: "Trello",
      description: "Monitor board updates and task changes",
      logo: "logos:trello",
      direction: "INCOMING",
      acquired: true,
    },
    {
      id: "24b8d1e7-4c3a-4029-9e5f-27c4b1d6f739",
      title: "Trello",
      description: "Add tasks and manage workflows in Trello",
      logo: "logos:trello",
      direction: "OUTGOING",
      acquired: true,
    },
    {
      id: "25f9c8b3-1d2e-4a3f-9c8d-4b7a2e5c6d19",
      title: "HubSpot",
      description: "Receive CRM updates and lead notifications",
      logo: "logos:hubspot",
      direction: "INCOMING",
      acquired: true,
    },
    {
      id: "26d7b4e1-5a2c-4f89-8e3b-6d27c9f1b6d3",
      title: "HubSpot",
      description: "Update leads and contacts in HubSpot",
      logo: "logos:hubspot",
      direction: "OUTGOING",
      acquired: true,
    },
  ];

  const instructions = [
    {
      id: "1",
      instruction: "Clone the repository from GitHub.",
    },
    {
      id: "2",
      instruction: "Install the necessary dependencies using `npm install`.",
    },
    {
      id: "3",
      instruction: "Run the project using `npm start`.",
    },
    {
      id: "4",
      instruction: "Follow the documentation for further integration steps.",
    },
  ];

  const tabs = [
    { id: "8a9b0c1d-2e3f-4g5h-6i7j-8k9l0m1n2o3p", title: "Incoming" },
    { id: "7a8b9c0d-1e2f-3g4h-5i6j-7k8l9m0n1o2p", title: "Outgoing" },
  ];

  const teamId = storage.get("projectId");

  const { getTeamById } = useTeams();
  const { team: teamById } = getTeamById(teamId);

  const { getColleagues } = useColleagues();
  const { colleagues } = getColleagues();

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [skillDialogOpen, setSkillDialogOpen] = React.useState(false);
  const [selectedSkill, setSelectedSkill] = React.useState<{
    name: string;
    logo: string;
    title: string;
    description: string;
    acquired: boolean;
  } | null>(null);

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    if (selectedTab === 0) {
      setDrawerOpen(true);
    } else {
      setSkillDialogOpen(true);
    }
  };

  const handleSkillDialogClose = () => {
    setSkillDialogOpen(false);
    setSelectedSkill(null);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedSkill(null);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <IntegrationTabs
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          tabs={tabs}
        />

        {selectedTab === 0 && (
          <Grid container spacing={2}>
            {integrations
              .filter((skill) => skill.direction === "INCOMING")
              .map((skill) => (
                <Integrations
                  key={skill.id}
                  title={skill.title}
                  description={skill.description}
                  logo={skill.logo}
                  acquired={skill.acquired}
                  onSkillClick={handleSkillClick}
                />
              ))}
          </Grid>
        )}

        {selectedTab === 1 && (
          <Grid container spacing={2}>
            {integrations
              .filter((skill) => skill.direction === "OUTGOING")
              .map((skill) => (
                <Integrations
                  key={skill.id}
                  title={skill.title}
                  description={skill.description}
                  logo={skill.logo}
                  acquired={skill.acquired}
                  onSkillClick={handleSkillClick}
                />
              ))}
          </Grid>
        )}

        <SkillDialog
          open={skillDialogOpen}
          handleClose={handleSkillDialogClose}
          skill={selectedSkill}
          team={teamById}
          colleagues={colleagues}
        />

        <IncomingDrawer
          selectedSkill={selectedSkill}
          instructions={instructions}
          drawerOpen={drawerOpen}
          handleDrawerClose={handleDrawerClose}
          colleague={colleague}
        />
      </Box>
    </Container>
  );
};

export default ColleagueIntegration;
