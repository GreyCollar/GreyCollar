import IncomingDrawer from "../../components/IncomingDrawer/IncomingDrawer";
import IntegrationTabs from "../../components/IntegrationTabs/IntegrationTabs";
import Integrations from "../../components/Integrations/Integrations";
import React from "react";
import SkillDialog from "../../components/Skills/SkillDialog";
import { getProviderLogo } from "../../utils/icon";
import useAcquiredIntegrations from "../../hooks/useAcquiredIntegrations";
import useColleagues from "../../hooks/useColleagueV2";

import { Box, Container, Grid } from "@mui/material";

const ColleagueIntegration = ({ colleague }) => {
  const {
    getIntegrations,
    getColleagueAcquiredIntegrations,
    updateIntegration,
  } = useAcquiredIntegrations();

  const { integrations } = getIntegrations();

  const { acquiredIntegrations } = getColleagueAcquiredIntegrations(
    colleague.id
  );

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

  const { getColleagues } = useColleagues();
  const { colleagues } = getColleagues();

  const [selectedTab, setSelectedTab] = React.useState(0);
  const [skillDialogOpen, setSkillDialogOpen] = React.useState(false);
  const [selectedSkill, setSelectedSkill] = React.useState<{
    id: string;
    name: string;
    logo: string;
    title: string;
    description: string;
    oauth: {
      scope: string;
      tokenUrl: string;
      clientId: string;
      redirectUri: string;
    };
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
              ?.filter((skill) => skill.direction === "INCOMING")
              ?.map((skill) => (
                <Integrations
                  key={skill.id}
                  title={skill.provider}
                  description={skill.description}
                  logo={getProviderLogo(skill.provider)}
                  onSkillClick={handleSkillClick}
                  id={skill.id}
                  oauth={skill.oauth}
                />
              ))}
          </Grid>
        )}

        {selectedTab === 1 && (
          <Grid container spacing={2}>
            {integrations
              ?.filter((skill) => skill.direction === "OUTGOING")
              ?.map((skill) => (
                <Integrations
                  key={skill.id}
                  title={skill.provider}
                  description={skill.description}
                  logo={getProviderLogo(skill.provider)}
                  onSkillClick={handleSkillClick}
                  id={skill.id}
                  oauth={skill.oauth}
                />
              ))}
          </Grid>
        )}

        <SkillDialog
          open={skillDialogOpen}
          handleClose={handleSkillDialogClose}
          skill={selectedSkill}
          colleagues={colleagues}
          acquiredIntegrations={acquiredIntegrations}
          updateIntegration={updateIntegration}
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
